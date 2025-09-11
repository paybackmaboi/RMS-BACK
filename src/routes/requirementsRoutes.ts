import express from 'express';
import { uploadDocument, sendAnnouncement, getRequirementsStatus, updateRequirementStatus, getAllDocuments, getDocumentById } from '../controllers/requirementsController';
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

// Get all documents for admin review
router.get('/admin/documents', getAllDocuments);

// Get document by ID for viewing
router.get('/admin/documents/:documentId', getDocumentById);

export default router;
