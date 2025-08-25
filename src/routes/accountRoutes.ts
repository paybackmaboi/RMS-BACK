import express from 'express';
import { getAllStudentAccounts, resetStudentPassword } from '../controllers/accountController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Test endpoint without authentication
router.get('/test', (req, res) => {
    res.json({ message: 'Account routes are working', timestamp: new Date().toISOString() });
});

// Debug endpoint to check database
router.get('/debug', async (req, res) => {
    try {
        const { UserModel, StudentModel } = require('../database');
        const userCount = await UserModel.count({ where: { role: 'student' } });
        const studentCount = await StudentModel.count();
        res.json({ 
            message: 'Database debug info',
            userCount,
            studentCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Test endpoint to get all students without authentication
router.get('/test-students', async (req, res) => {
    try {
        const { getAllStudentAccounts } = require('../controllers/accountController');
        await getAllStudentAccounts(req, res, () => {});
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Test endpoint with session authentication
router.get('/test-auth', adminSessionAuthMiddleware, (req, res) => {
    res.json({ 
        message: 'Authentication working!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// Existing route to get all accounts
router.get('/', adminSessionAuthMiddleware, getAllStudentAccounts);

router.patch('/:id/reset-password', adminSessionAuthMiddleware, resetStudentPassword);
export default router;