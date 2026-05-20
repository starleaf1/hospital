import { Request, Response, NextFunction } from 'express';
import prisma from '../../../infrastructure/database/prisma';

export class InvoiceController {
  static async getAllInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { status } = req.query;

      const where: any = { tenantId };
      if (status) where.status = status;

      const invoices = await prisma.invoice.findMany({
        where,
        include: {
          encounter: {
            include: { patient: true }
          },
          items: true
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ data: invoices });
    } catch (error) {
      next(error);
    }
  }

  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { encounterId, status, items } = req.body;

      let totalAmount = 0;
      if (items && Array.isArray(items)) {
        totalAmount = items.reduce((sum, item) => sum + (item.totalPriceSnapshot ?? 0), 0);
      }

      const invoice = await prisma.invoice.create({
        data: {
          tenantId,
          encounterId,
          status: status ?? 'DRAFT',
          totalAmount,
          items: {
            create: items?.map((i: any) => ({
              tenantId,
              clinicalActionId: i.clinicalActionId,
              actionName: i.actionName,
              jasaSaranaSnapshot: i.jasaSaranaSnapshot ?? 0,
              jasaDokterSnapshot: i.jasaDokterSnapshot ?? 0,
              totalPriceSnapshot: i.totalPriceSnapshot ?? 0
            })) ?? []
          }
        },
        include: { items: true }
      });

      res.status(201).json({ message: 'Invoice created', data: invoice });
    } catch (error) {
      next(error);
    }
  }

  static async updateInvoiceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { status } = req.body;

      const invoice = await prisma.invoice.findFirst({ where: { id, tenantId } });
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

      const updated = await prisma.invoice.update({
        where: { id },
        data: { status },
        include: { items: true, encounter: { include: { patient: true } } }
      });

      res.json({ message: 'Invoice status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
