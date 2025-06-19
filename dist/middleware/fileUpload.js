"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// FIX: Define the upload directory relative to the project's root folder.
// This creates a single, consistent 'uploads' folder that works both in
// development (from src) and after compilation (from dist).
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads');
// Ensure the upload directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to the correct 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const allowedTypes = /jpeg|jpg|png|pdf/;
    // Check the file's extension
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    // Check the file's mimetype
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        // If the file type is allowed, accept the file
        cb(null, true);
    }
    else {
        // If the file type is not allowed, reject the file
        // This error will be passed to your error-handling middleware
        const error = new Error('Error: File upload only supports the following filetypes - ' + allowedTypes);
        cb(error);
    }
};
// Create the multer instance with storage and the new fileFilter
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Optional: Add a limit for file size, e.g., 5MB
});
exports.default = upload;
