import express from 'express';
import multer from 'multer';
import { uploadDocument, getRequirementsStatus, verifyRequirement } from '../controllers/requirementsController';
import { adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'requirements');
        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
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
    },
    fileFilter: (req, file, cb) => {
        // Allow PDF, JPG, PNG files
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, PNG files are allowed'));
        }
    }
});

// Apply authentication middleware to all routes
router.use(adminSessionAuthMiddleware);

// Upload a document for a specific student
router.post('/:idNo/upload-document', upload.single('document'), uploadDocument);

// Get requirements status for a specific student
router.get('/:idNo/requirements', getRequirementsStatus);

// Verify a requirement document
router.post('/:idNo/verify-requirement', verifyRequirement);

export default router;
