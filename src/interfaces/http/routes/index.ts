import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { EncounterController } from '../controllers/EncounterController';
import { AuthController } from '../controllers/AuthController';
import { DashboardController } from '../controllers/DashboardController';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const router = Router();

// Public routes
router.post('/auth/login', AuthController.login);

router.use(tenantMiddleware);

router.post('/patients', PatientController.registerPatient);
router.get('/patients', PatientController.getAllPatients);

router.post('/encounters', EncounterController.initializeEncounter);
router.get('/encounters', EncounterController.getAllEncounters);
router.post('/encounters/:id/sync-satusehat', EncounterController.syncSatusehat);

router.get('/dashboard/stats', DashboardController.getStats);

export default router;
