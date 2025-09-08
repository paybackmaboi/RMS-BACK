import express from 'express';
import { 
    getAllPayments, 
    getPaymentsByStudent, 
    processPayment, 
    getPaymentStatus, 
    getPendingPayments 
} from '../controllers/paymentController';
import { adminSessionAuthMiddleware, accountingSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Get all payments (Accounting view)
router.get('/', accountingSessionAuthMiddleware, getAllPayments);

// Get payments by student ID
router.get('/student/:studentId', accountingSessionAuthMiddleware, getPaymentsByStudent);

// Process payment (Accounting function)
router.post('/process', accountingSessionAuthMiddleware, processPayment);

// Get payment status for a request
router.get('/status/:requestId', accountingSessionAuthMiddleware, getPaymentStatus);

// Get pending payments (for accounting dashboard)
router.get('/pending', accountingSessionAuthMiddleware, getPendingPayments);

export default router;
