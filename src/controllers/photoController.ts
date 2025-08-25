import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../database';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads/profile-photos');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const { studentId } = req.params;
        
        // Validate file type
        if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
            // Delete uploaded file
            fs.unlinkSync(req.file.path);
            res.status(400).json({ 
                message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' 
            });
            return;
        }

        // Validate file size
        if (req.file.size > MAX_FILE_SIZE) {
            // Delete uploaded file
            fs.unlinkSync(req.file.path);
            res.status(400).json({ 
                message: 'File too large. Maximum size is 5MB.' 
            });
            return;
        }

        // Generate unique filename
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const newFilePath = path.join(UPLOAD_DIR, fileName);

        // Rename file to unique name
        fs.renameSync(req.file.path, newFilePath);

        // Generate URL for the photo
        const photoUrl = `/uploads/profile-photos/${fileName}`;

        // Update user profile with photo URL
        const user = await UserModel.findByPk(studentId);
        if (!user) {
            // Delete uploaded file
            fs.unlinkSync(newFilePath);
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        // Delete old photo if exists
        if (user.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, '../..', user.profilePhoto);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Update user profile
        await user.update({ profilePhoto: photoUrl });

        res.json({ 
            message: 'Profile photo uploaded successfully',
            photoUrl: photoUrl
        });

    } catch (error) {
        console.error('Error uploading profile photo:', error);
        next(error);
    }
};

export const deleteProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;

        const user = await UserModel.findByPk(studentId);
        if (!user) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        // Delete photo file if exists
        if (user.profilePhoto) {
            const photoPath = path.join(__dirname, '../..', user.profilePhoto);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        // Remove photo URL from user profile
        await user.update({ profilePhoto: undefined });

        res.json({ message: 'Profile photo deleted successfully' });

    } catch (error) {
        console.error('Error deleting profile photo:', error);
        next(error);
    }
};

export const getProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;

        const user = await UserModel.findByPk(studentId);
        if (!user) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        if (!user.profilePhoto) {
            res.status(404).json({ message: 'No profile photo found' });
            return;
        }

        const photoPath = path.join(__dirname, '../..', user.profilePhoto);
        
        if (!fs.existsSync(photoPath)) {
            res.status(404).json({ message: 'Photo file not found' });
            return;
        }

        // Send the photo file
        res.sendFile(photoPath);

    } catch (error) {
        console.error('Error getting profile photo:', error);
        next(error);
    }
};
