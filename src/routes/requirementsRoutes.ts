import express from 'express';
import { uploadDocument, sendAnnouncement, getRequirementsStatus, updateRequirementStatus } from '../controllers/requirementsController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';
import upload from '../middleware/fileUpload';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(adminSessionAuthMiddleware);

// Upload a requirement document
router.post('/upload', upload.single('document'), uploadDocument);

// Send announcement to student about requirements
router.post('/announcement', sendAnnouncement);

// Get requirements status for a student
router.get('/status/:studentId', getRequirementsStatus);

// Update requirement status
router.put('/status', updateRequirementStatus);

export default router;
