import express from 'express';
import { 
    getAllRequests, 
    getRequestById, 
    updateRequestStatus, 
    createRequest,
    deleteRequest,
    getStudentRequests,
    getRequestDocument
} from '../controllers/requestController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/fileUpload';

const router = express.Router();

// Get all requests (admin/accounting can see all, students see their own)
router.get('/', authMiddleware, getAllRequests);

// Get student's own requests (must come before /:id route)
router.get('/my-requests', authMiddleware, getStudentRequests);

// Create new request (students only) - with file upload support
router.post('/', authMiddleware, upload.array('documents', 5), createRequest);

// Get specific request by ID
router.get('/:id', authMiddleware, getRequestById);

// Get document by request ID and document index (admin/accounting only)
router.get('/:id/document/:docIndex', authMiddleware, adminMiddleware, getRequestDocument);

// Update request status (admin/accounting only)
router.patch('/:id', authMiddleware, adminMiddleware, updateRequestStatus);

// Delete request (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteRequest);

export default router;