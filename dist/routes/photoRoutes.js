"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const photoController_1 = require("../controllers/photoController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-photos/');
    },
    filename: (req, file, cb) => {
        // Use original filename for now, will be renamed in controller
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// Photo upload routes
router.post('/upload/:studentId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, upload.single('photo'), photoController_1.uploadProfilePhoto);
router.delete('/:studentId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, photoController_1.deleteProfilePhoto);
router.get('/:studentId', photoController_1.getProfilePhoto);
exports.default = router;
