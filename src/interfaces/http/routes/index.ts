import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { EncounterController } from '../controllers/EncounterController';
import { AuthController } from '../controllers/AuthController';
import { DashboardController } from '../controllers/DashboardController';
import { MedicalNoteController } from '../controllers/MedicalNoteController';
import { InvoiceController } from '../controllers/InvoiceController';
import { BillingController } from '../controllers/BillingController';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const router = Router();

// Public routes
router.post('/auth/login', AuthController.login);

router.use(tenantMiddleware);

router.post('/patients', PatientController.registerPatient);
router.get('/patients', PatientController.getAllPatients);

router.post('/encounters', EncounterController.initializeEncounter);
router.get('/encounters', EncounterController.getAllEncounters);
router.put('/encounters/:id', EncounterController.updateEncounter);
router.delete('/encounters/:id', EncounterController.deleteEncounter);
router.post('/encounters/:id/sync-satusehat', EncounterController.syncSatusehat);
router.post('/encounters/:id/actions', BillingController.addClinicalAction);

router.get('/encounters/:encounterId/notes', MedicalNoteController.getNotesByEncounter);
router.post('/encounters/:encounterId/notes', MedicalNoteController.addNote);

router.get('/invoices', InvoiceController.getAllInvoices);
router.post('/invoices', InvoiceController.createInvoice);
router.put('/invoices/:id/status', InvoiceController.updateInvoiceStatus);

router.get('/dashboard/stats', DashboardController.getStats);

export default router;
