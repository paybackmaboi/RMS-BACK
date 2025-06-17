import { Router } from 'express';
import express from 'express';
import { createRequest, getStudentRequests, getAllRequests, updateRequestStatus, getRequestDocument } from '../controllers/requestController';
// This import will now work correctly
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/fileUpload';

const router = Router();

// Student creates a request.
router.post('/', authMiddleware, upload.single('document'), createRequest);

// Student gets their own requests.
router.get('/my-requests', authMiddleware, getStudentRequests);

// --- Admin-Only Routes ---
// The following routes are now protected by adminMiddleware.

// Admin gets all requests.
router.get('/', authMiddleware, adminMiddleware, getAllRequests);

// Admin updates a request's status. It expects a JSON body.
router.patch('/:id', express.json(), authMiddleware, adminMiddleware, updateRequestStatus);

// Admin gets a specific document for a request.
router.get('/:id/document', authMiddleware, adminMiddleware, getRequestDocument);


export default router;
