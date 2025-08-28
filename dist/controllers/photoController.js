"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfilePhoto = exports.deleteProfilePhoto = exports.uploadProfilePhoto = void 0;
const database_1 = require("../database");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
// Configure upload directory
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads/profile-photos');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
// Ensure upload directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const uploadProfilePhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const { studentId } = req.params;
        // Validate file type
        if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
            // Delete uploaded file
            fs_1.default.unlinkSync(req.file.path);
            res.status(400).json({
                message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'
            });
            return;
        }
        // Validate file size
        if (req.file.size > MAX_FILE_SIZE) {
            // Delete uploaded file
            fs_1.default.unlinkSync(req.file.path);
            res.status(400).json({
                message: 'File too large. Maximum size is 5MB.'
            });
            return;
        }
        // Generate unique filename
        const fileExtension = path_1.default.extname(req.file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const newFilePath = path_1.default.join(UPLOAD_DIR, fileName);
        // Rename file to unique name
        fs_1.default.renameSync(req.file.path, newFilePath);
        // Generate URL for the photo
        const photoUrl = `/uploads/profile-photos/${fileName}`;
        // Update user profile with photo URL
        const user = yield database_1.UserModel.findByPk(studentId);
        if (!user) {
            // Delete uploaded file
            fs_1.default.unlinkSync(newFilePath);
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        // Delete old photo if exists
        if (user.profilePhoto) {
            const oldPhotoPath = path_1.default.join(__dirname, '../..', user.profilePhoto);
            if (fs_1.default.existsSync(oldPhotoPath)) {
                fs_1.default.unlinkSync(oldPhotoPath);
            }
        }
        // Update user profile
        yield user.update({ profilePhoto: photoUrl });
        res.json({
            message: 'Profile photo uploaded successfully',
            photoUrl: photoUrl
        });
    }
    catch (error) {
        console.error('Error uploading profile photo:', error);
        next(error);
    }
});
exports.uploadProfilePhoto = uploadProfilePhoto;
const deleteProfilePhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const user = yield database_1.UserModel.findByPk(studentId);
        if (!user) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        // Delete photo file if exists
        if (user.profilePhoto) {
            const photoPath = path_1.default.join(__dirname, '../..', user.profilePhoto);
            if (fs_1.default.existsSync(photoPath)) {
                fs_1.default.unlinkSync(photoPath);
            }
        }
        // Remove photo URL from user profile
        yield user.update({ profilePhoto: undefined });
        res.json({ message: 'Profile photo deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting profile photo:', error);
        next(error);
    }
});
exports.deleteProfilePhoto = deleteProfilePhoto;
const getProfilePhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const user = yield database_1.UserModel.findByPk(studentId);
        if (!user) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        if (!user.profilePhoto) {
            res.status(404).json({ message: 'No profile photo found' });
            return;
        }
        const photoPath = path_1.default.join(__dirname, '../..', user.profilePhoto);
        if (!fs_1.default.existsSync(photoPath)) {
            res.status(404).json({ message: 'Photo file not found' });
            return;
        }
        // Send the photo file
        res.sendFile(photoPath);
    }
    catch (error) {
        console.error('Error getting profile photo:', error);
        next(error);
    }
});
exports.getProfilePhoto = getProfilePhoto;
