import express from 'express';
import multer from 'multer';
import { uploadProfilePhoto, deleteProfilePhoto, getProfilePhoto } from '../controllers/photoController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-photos/');
    },
    filename: (req, file, cb) => {
        // Use original filename for now, will be renamed in controller
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Photo upload routes
router.post('/upload/:studentId', adminSessionAuthMiddleware, upload.single('photo'), uploadProfilePhoto);
router.delete('/:studentId', adminSessionAuthMiddleware, deleteProfilePhoto);
router.get('/:studentId', getProfilePhoto);

export default router;
