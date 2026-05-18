import { Request, Response, NextFunction } from 'express';
import prisma from '../../../infrastructure/database/prisma';

export class PatientController {
  static async registerPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { nik, name, birthDate, gender } = req.body;

      const patient = await prisma.patient.create({
        data: {
          tenantId,
          nik,
          name,
          birthDate: new Date(birthDate),
          gender
        }
      });

      res.status(201).json({ message: 'Patient registered successfully', data: patient });
    } catch (error) {
      next(error);
    }
  }
}
