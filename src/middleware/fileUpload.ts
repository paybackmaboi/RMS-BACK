import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// FIX: Define the upload directory relative to the project's root folder.
// This creates a single, consistent 'uploads' folder that works both in
// development (from src) and after compilation (from dist).
const uploadDir = path.resolve(process.cwd(), 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to the correct 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed extensions
    const allowedTypes = /jpeg|jpg|png|pdf/;
    // Check the file's extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Check the file's mimetype
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        // If the file type is allowed, accept the file
        cb(null, true);
    } else {
        // If the file type is not allowed, reject the file
        // This error will be passed to your error-handling middleware
        const error = new Error('Error: File upload only supports the following filetypes - ' + allowedTypes);
        cb(error);
    }
};

// Create the multer instance with storage and the new fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Optional: Add a limit for file size, e.g., 5MB
});

export default upload;
