import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;

      const totalPatients = await prisma.patient.count({ where: { tenantId } });
      const activeEncounters = await prisma.encounter.count({
        where: { tenantId, status: 'IN_PROGRESS' }
      });
      const pendingEncounters = await prisma.encounter.count({
        where: { tenantId, status: 'WAITING' }
      });

      const recentPatients = await prisma.patient.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      res.json({
        stats: [
          { label: 'Total Patients', value: totalPatients.toString(), trend: 0 },
          { label: 'Active Encounters', value: activeEncounters.toString(), trend: 0 },
          { label: 'Pending Encounters', value: pendingEncounters.toString(), trend: 0 }
        ],
        recentPatients
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
