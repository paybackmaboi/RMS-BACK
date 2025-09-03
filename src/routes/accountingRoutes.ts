import express from 'express';
import { getStudentBalanceById, updateStudentBalance } from '../controllers/accountingController';
import { accountingSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// --- Routes for Accounting Staff ---
// These routes are protected and can only be accessed by users with the 'accounting' or 'admin' role.

// GET a student's balance by their user ID
router.get('/:studentId/balance', accountingSessionAuthMiddleware, getStudentBalanceById);

// PUT (update) a student's balance by their user ID
router.put('/:studentId/balance', accountingSessionAuthMiddleware, updateStudentBalance);

export default router;