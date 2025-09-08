import express from 'express';
import { 
    getAllRequests, 
    getRequestById, 
    updateRequestStatus, 
    createRequest,
    deleteRequest,
    getStudentRequests,
    getRequestDocument,
    getRequestsByStudentId,
    requestDocumentFromAccounting,
    approveRequest,
    markAsPrinted,
    getStudentBilling
} from '../controllers/requestController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import { studentSessionAuthMiddleware, adminSessionAuthMiddleware, adminOrAccountingSessionAuthMiddleware, allRolesSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';
import upload from '../middleware/fileUpload';

const router = express.Router();

// Get all requests (admin/accounting can see all, students see their own)
router.get('/', adminOrAccountingSessionAuthMiddleware, getAllRequests);

// Get student's own requests (must come before /:id route)
router.get('/my-requests', studentSessionAuthMiddleware, getStudentRequests);
router.get('/student/:studentId', adminSessionAuthMiddleware, getRequestsByStudentId);

// Create new request (all roles can create) - with file upload support
router.post('/', allRolesSessionAuthMiddleware, upload.array('documents', 5), createRequest);

// Get specific request by ID
router.get('/:id', adminSessionAuthMiddleware, getRequestById);

// Get document by request ID and document index (admin/accounting only)
router.get('/:id/document/:docIndex', adminSessionAuthMiddleware, getRequestDocument);

// Update request status (admin/accounting only)
router.patch('/:id', adminSessionAuthMiddleware, updateRequestStatus);

// Delete request (admin only)
router.delete('/:id', adminSessionAuthMiddleware, deleteRequest);

// New workflow endpoints
// Registrar requests document from accounting
router.post('/:id/request-document', adminSessionAuthMiddleware, requestDocumentFromAccounting);

// Registrar approves request after payment confirmation
router.post('/:id/approve', adminSessionAuthMiddleware, approveRequest);

// Mark request as printed
router.post('/:id/print', adminSessionAuthMiddleware, markAsPrinted);

// Get student billing information
router.get('/student/:studentId/billing', studentSessionAuthMiddleware, getStudentBilling);

export default router;