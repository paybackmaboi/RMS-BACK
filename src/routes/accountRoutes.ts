import express from 'express';
import { getAllStudentAccounts, resetStudentPassword } from '../controllers/accountController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Existing route to get all accounts
router.get('/', authMiddleware, adminMiddleware, getAllStudentAccounts);

router.patch('/:id/reset-password', authMiddleware, adminMiddleware, resetStudentPassword);
export default router;