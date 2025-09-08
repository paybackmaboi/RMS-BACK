import express from 'express';
import { 
    getUserActivityLogs, 
    getAllActivityLogs, 
    getUserActivitySummary 
} from '../controllers/activityLogController';
import { adminOrAccountingSessionAuthMiddleware, adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Get activity logs for a specific user (admin/accounting can view any user)
router.get('/user/:userId', adminOrAccountingSessionAuthMiddleware, getUserActivityLogs);

// Get activity summary for a user (admin/accounting only)
router.get('/user/:userId/summary', adminOrAccountingSessionAuthMiddleware, getUserActivitySummary);

// Get all activity logs (admin only)
router.get('/', adminSessionAuthMiddleware, getAllActivityLogs);

export default router;
