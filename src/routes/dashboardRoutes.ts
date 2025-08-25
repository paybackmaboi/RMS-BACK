import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Dashboard statistics endpoint
router.get('/stats', adminSessionAuthMiddleware, getDashboardStats);

// Recent activity endpoint
router.get('/recent-activity', adminSessionAuthMiddleware, getRecentActivity);

export default router;
