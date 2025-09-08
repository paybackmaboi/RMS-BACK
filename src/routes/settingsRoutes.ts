import express from 'express';
import { 
    getSettings, 
    updateSetting, 
    deleteSetting 
} from '../controllers/settingsController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Get settings (public for login form, but can be filtered)
router.get('/', getSettings);

// Update/create setting (admin only)
router.post('/', adminSessionAuthMiddleware, updateSetting);
router.put('/', adminSessionAuthMiddleware, updateSetting);

// Delete setting (admin only)
router.delete('/:key', adminSessionAuthMiddleware, deleteSetting);

export default router;
