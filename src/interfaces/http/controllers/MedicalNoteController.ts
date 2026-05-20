import { Request, Response, NextFunction } from 'express';
import prisma from '../../../infrastructure/database/prisma';

export class MedicalNoteController {
  static async getNotesByEncounter(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { encounterId } = req.params;

      const notes = await prisma.medicalNote.findMany({
        where: { tenantId, encounterId },
        include: { doctor: { select: { id: true, name: true, roles: true } } },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ data: notes });
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const doctorId = (req as any).user?.id || req.body.doctorId;
      const { encounterId } = req.params;
      const { symptoms, diagnosis, prescription, notes } = req.body;

      // Ensure we have a valid doctor ID
      let actualDoctorId = doctorId;
      if (!actualDoctorId) {
         const firstDoctor = await prisma.user.findFirst({ where: { tenantId, roles: { has: 'DOCTOR' } } });
         actualDoctorId = firstDoctor?.id;
      }
      if (!actualDoctorId) {
        // Fallback to any user just for demo purposes
        const anyUser = await prisma.user.findFirst({ where: { tenantId } });
        actualDoctorId = anyUser?.id;
      }

      if (!actualDoctorId) return res.status(400).json({ error: 'Doctor ID is required and no users found' });

      const note = await prisma.medicalNote.create({
        data: {
          tenantId,
          encounterId,
          doctorId: actualDoctorId,
          symptoms,
          diagnosis,
          prescription,
          notes
        }
      });

      res.status(201).json({ message: 'Note added', data: note });
    } catch (error) {
      next(error);
    }
  }
}
