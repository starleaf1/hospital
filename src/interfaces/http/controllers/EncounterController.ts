import { Request, Response, NextFunction } from 'express';
import prisma from '../../../infrastructure/database/prisma';
import { services } from '../../../infrastructure/config/services';

export class EncounterController {
  static async initializeEncounter(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const { patientId, servicePointId, bpjsNumber } = req.body;

      const patient = await prisma.patient.findFirst({
        where: { id: patientId, tenantId }
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      let bpjsSepNumber: string | null = null;

      if (bpjsNumber) {
        const verifyRes = await services.bpjsService.verifyParticipant(bpjsNumber);
        if (verifyRes.response.peserta.statusPeserta.keterangan === 'AKTIF') {
          bpjsSepNumber = await services.bpjsService.generateSEP(patientId);
        } else {
          return res.status(400).json({ error: 'BPJS Participant is not active' });
        }
      }

      const encounter = await prisma.encounter.create({
        data: {
          tenantId,
          patientId,
          servicePointId,
          bpjsSepNumber
        }
      });

      res.status(201).json({ message: 'Encounter initialized', data: encounter });
    } catch (error) {
      next(error);
    }
  }

  static async syncSatusehat(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).tenantId;
      const encounterId = req.params.id;

      const encounter = await prisma.encounter.findFirst({
        where: { id: encounterId, tenantId }
      });

      if (!encounter) {
        return res.status(404).json({ error: 'Encounter not found' });
      }

      const satusehatEncounterId = await services.satusehatService.createEncounter({
        localEncounterId: encounter.id,
        patientId: encounter.patientId
      });

      const updatedEncounter = await prisma.encounter.update({
        where: { id: encounter.id },
        data: { satusehatEncounterId }
      });

      res.status(200).json({ message: 'SATUSEHAT synced successfully', data: updatedEncounter });
    } catch (error) {
      next(error);
    }
  }
}
