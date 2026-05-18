import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { EncounterController } from '../controllers/EncounterController';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const router = Router();

router.use(tenantMiddleware);

router.post('/patients', PatientController.registerPatient);

router.post('/encounters', EncounterController.initializeEncounter);
router.post('/encounters/:id/sync-satusehat', EncounterController.syncSatusehat);

export default router;
