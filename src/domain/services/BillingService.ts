import prisma from '../../infrastructure/database/prisma';
import { IBillingService } from '../interfaces/IBillingService';

export class BillingService implements IBillingService {
  async addClinicalActionToEncounter(
    tenantId: string,
    encounterId: string,
    clinicalActionCode: string,
    directPay: boolean = false
  ): Promise<any> {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch the Encounter to determine insurance/class type
      const encounter = await tx.encounter.findFirst({
        where: { id: encounterId, tenantId }
      });

      if (!encounter) {
        throw new Error('Encounter not found');
      }

      // Determine insurance and class type using ?? instead of || where possible
      const hasSep = encounter.bpjsSepNumber !== null && encounter.bpjsSepNumber !== undefined && encounter.bpjsSepNumber !== '';
      const insuranceType = hasSep ? 'BPJS' : 'MANDIRI';
      const classType = hasSep ? 'KELAS_1' : 'NON_KELAS';

      // 2. Query the TariffMaster for the exact match
      const clinicalAction = await tx.clinicalAction.findUnique({
        where: { code: clinicalActionCode }
      });

      if (!clinicalAction) {
        throw new Error(`Clinical Action with code ${clinicalActionCode} not found`);
      }

      const tariff = await tx.tariffMaster.findUnique({
        where: {
          tenantId_clinicalActionId_insuranceType_classType: {
            tenantId,
            clinicalActionId: clinicalAction.id,
            insuranceType,
            classType
          }
        }
      });

      if (!tariff) {
        throw new Error(`No tariff configured for Action: ${clinicalActionCode}, Insurance: ${insuranceType}, Class: ${classType}`);
      }

      // 3. Find or generate an Invoice attached to the Encounter
      let invoice = await tx.invoice.findFirst({
        where: { encounterId, tenantId }
      });

      if (!invoice) {
        invoice = await tx.invoice.create({
          data: {
            tenantId,
            encounterId,
            status: 'DRAFT',
            totalAmount: 0
          }
        });
      }

      // 4. Generate an InvoiceItem snapshotting the exact prices
      const invoiceItem = await tx.invoiceItem.create({
        data: {
          tenantId,
          invoiceId: invoice.id,
          clinicalActionId: clinicalAction.id,
          actionName: clinicalAction.name,
          jasaSaranaSnapshot: tariff.jasaSarana,
          jasaDokterSnapshot: tariff.jasaDokter,
          totalPriceSnapshot: tariff.totalTariff
        }
      });

      // Calculate the new total amount from all items
      const allItems = await tx.invoiceItem.findMany({
        where: { invoiceId: invoice.id }
      });

      const totalAmount = allItems.reduce((sum, item) => sum + item.totalPriceSnapshot, 0);

      // 5. The Solo Practice Bypass: if directPay is true, immediately update Invoice status to PAID
      const invoiceUpdateData: any = {
        totalAmount
      };

      if (directPay) {
        invoiceUpdateData.status = 'PAID';
        invoiceUpdateData.paymentMethod = 'DIRECT_DOCTOR_CASH';
        invoiceUpdateData.paidAt = new Date();
      }

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: invoiceUpdateData,
        include: { items: true }
      });

      return {
        invoice: updatedInvoice,
        addedItem: invoiceItem
      };
    });
  }
}
