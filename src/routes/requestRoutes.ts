import express from 'express';
import { 
    getAllRequests, 
    getRequestById, 
    updateRequestStatus, 
    createRequest,
    deleteRequest,
    getStudentRequests,
    getRequestDocument,
    getRequestsByStudentId
} from '../controllers/requestController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import { studentSessionAuthMiddleware, adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';
import upload from '../middleware/fileUpload';

const router = express.Router();

// Get all requests (admin/accounting can see all, students see their own)
router.get('/', adminSessionAuthMiddleware, getAllRequests);

// Get student's own requests (must come before /:id route)
router.get('/my-requests', studentSessionAuthMiddleware, getStudentRequests);
router.get('/student/:studentId', adminSessionAuthMiddleware, getRequestsByStudentId);

// Create new request (students only) - with file upload support
router.post('/', studentSessionAuthMiddleware, upload.array('documents', 5), createRequest);

// Get specific request by ID
router.get('/:id', adminSessionAuthMiddleware, getRequestById);

// Get document by request ID and document index (admin/accounting only)
router.get('/:id/document/:docIndex', adminSessionAuthMiddleware, getRequestDocument);

// Update request status (admin/accounting only)
router.patch('/:id', adminSessionAuthMiddleware, updateRequestStatus);

// Delete request (admin only)
router.delete('/:id', adminSessionAuthMiddleware, deleteRequest);

export default router;