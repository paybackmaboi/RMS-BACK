"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateRequirementStatus = exports.getRequirementsStatus = exports.sendAnnouncement = exports.uploadDocument = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
// Upload a requirement document
exports.uploadDocument = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔍 Requirements controller - uploadDocument called');
    console.log('🔍 Requirements controller - Request body:', req.body);
    console.log('🔍 Requirements controller - Request file:', req.file);
    const { studentId, requirementType } = req.body;
    const documentFile = req.file;
    if (!documentFile) {
        console.log('❌ Requirements controller - No document file provided');
        return res.status(400).json({ message: 'No document file provided' });
    }
    if (!studentId || !requirementType) {
        console.log('❌ Requirements controller - Missing required fields for document upload');
        return res.status(400).json({ message: 'Student ID and requirement type are required' });
    }
    try {
        // For now, we'll just return success since we don't have a requirements table yet
        // In a real implementation, you'd save the file path and update the requirements status
        console.log(`✅ Requirements controller - Document uploaded for student ${studentId}, type: ${requirementType}`);
        console.log('✅ Requirements controller - Sending success response for document upload');
        res.status(200).json({
            message: 'Document uploaded successfully',
            requirementType,
            studentId,
            fileName: documentFile.originalname
        });
    }
    catch (error) {
        console.error('❌ Requirements controller - Error uploading document:', error);
        console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({ message: 'Failed to upload document' });
    }
}));
// Send announcement to student about requirements
exports.sendAnnouncement = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔍 Requirements controller - sendAnnouncement called');
    console.log('🔍 Requirements controller - Request body:', req.body);
    console.log('🔍 Requirements controller - Request headers:', req.headers);
    const { studentId, message, type } = req.body;
    console.log('🔍 Requirements controller - Raw request data:', {
        studentId,
        message,
        type,
        studentIdType: typeof studentId
    });
    if (!studentId || !message) {
        console.log('❌ Requirements controller - Missing required fields');
        return res.status(400).json({ message: 'Student ID and message are required' });
    }
    try {
        // Import the Notification model
        const { NotificationModel } = yield Promise.resolve().then(() => __importStar(require('../database')));
        // Create a notification for the student
        console.log('🔍 Requirements controller - Creating notification in database...');
        console.log('🔍 Requirements controller - Notification data:', {
            userId: parseInt(studentId),
            message: message,
            type: type || 'requirements_reminder',
            isRead: false
        });
        let notification;
        try {
            notification = yield NotificationModel.create({
                userId: parseInt(studentId),
                message: message,
                type: type || 'requirements_reminder',
                isRead: false,
                // requestId is optional for requirements announcements
            });
            console.log('✅ Requirements controller - Notification created successfully:', notification.toJSON());
        }
        catch (createError) {
            console.error('❌ Requirements controller - Error creating notification:', createError);
            if (createError instanceof Error) {
                console.error('❌ Requirements controller - Error details:', {
                    message: createError.message,
                    code: createError.code,
                    sqlMessage: createError.sqlMessage
                });
            }
            throw createError; // Re-throw to be caught by the outer try-catch
        }
        console.log(`✅ Requirements controller - Announcement sent to student ${studentId}:`, {
            message,
            type: type || 'requirements_reminder',
            timestamp: new Date().toISOString(),
            notificationId: notification.id
        });
        console.log('✅ Requirements controller - Sending success response');
        res.status(200).json({
            message: 'Announcement sent successfully',
            studentId,
            announcementType: type || 'requirements_reminder',
            notificationId: notification.id
        });
    }
    catch (error) {
        console.error('❌ Requirements controller - Error sending announcement:', error);
        console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({ message: 'Failed to send announcement' });
    }
}));
// Get requirements status for a student
exports.getRequirementsStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔍 Requirements controller - getRequirementsStatus called');
    console.log('🔍 Requirements controller - Request params:', req.params);
    const { studentId } = req.params;
    if (!studentId) {
        console.log('❌ Requirements controller - No student ID provided');
        return res.status(400).json({ message: 'Student ID is required' });
    }
    try {
        // For now, return mock data since we don't have a requirements table yet
        // In a real implementation, you'd query the requirements table
        const mockRequirements = {
            psa: false,
            validId: false,
            form137: false,
            idPicture: false
        };
        console.log('✅ Requirements controller - Successfully fetched requirements status for student:', studentId);
        res.status(200).json({
            studentId,
            requirements: mockRequirements,
            submittedCount: 0,
            pendingCount: 4
        });
    }
    catch (error) {
        console.error('❌ Requirements controller - Error fetching requirements status:', error);
        console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({ message: 'Failed to fetch requirements status' });
    }
}));
// Update requirement status
exports.updateRequirementStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔍 Requirements controller - updateRequirementStatus called');
    console.log('🔍 Requirements controller - Request body:', req.body);
    const { studentId, requirementType, status } = req.body;
    if (!studentId || !requirementType || status === undefined) {
        console.log('❌ Requirements controller - Missing required fields for status update');
        return res.status(400).json({ message: 'Student ID, requirement type, and status are required' });
    }
    try {
        // For now, just return success since we don't have a requirements table yet
        // In a real implementation, you'd update the requirements table
        console.log(`✅ Requirements controller - Requirement status updated for student ${studentId}, type: ${requirementType}, status: ${status}`);
        console.log('✅ Requirements controller - Sending success response for status update');
        res.status(200).json({
            message: 'Requirement status updated successfully',
            studentId,
            requirementType,
            status
        });
    }
    catch (error) {
        console.error('❌ Requirements controller - Error updating requirement status:', error);
        console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({ message: 'Failed to update requirement status' });
    }
}));
