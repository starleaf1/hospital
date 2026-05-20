export interface IBillingService {
  addClinicalActionToEncounter(
    tenantId: string,
    encounterId: string,
    clinicalActionCode: string,
    directPay?: boolean
  ): Promise<any>;
}
