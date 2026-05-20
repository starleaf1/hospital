import { Request, Response, NextFunction } from 'express';
import { services } from '../../../infrastructure/config/services';

export class BillingController {
  static async addClinicalAction(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const encounterId = req.params.id;
      const { actionCode, directPay } = req.body;

      if (!actionCode) {
        return res.status(400).json({ error: 'actionCode is required' });
      }

      const result = await services.billingService.addClinicalActionToEncounter(
        tenantId,
        encounterId,
        actionCode,
        directPay ?? false
      );

      res.status(201).json({
        message: 'Clinical action added to encounter successfully',
        data: result
      });
    } catch (error: any) {
      if (
        error.message.includes('not found') || 
        error.message.includes('No tariff configured')
      ) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
}
