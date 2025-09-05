import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sequelize, RequirementsModel, UserModel } from '../database';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Upload a requirement document
export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Requirements controller - uploadDocument called');
  console.log('🔍 Requirements controller - Request body:', req.body);
  console.log('🔍 Requirements controller - Request file:', req.file);
  console.log('🔍 Requirements controller - Request params:', req.params);
  
  const { idNo } = req.params;
  const { requirementType } = req.body;
  const documentFile = req.file;

  if (!documentFile) {
    console.log('❌ Requirements controller - No document file provided');
    return res.status(400).json({ message: 'No document file provided' });
  }

  if (!idNo || !requirementType) {
    console.log('❌ Requirements controller - Missing required fields for document upload');
    return res.status(400).json({ message: 'Student ID and requirement type are required' });
  }

  try {
    // First, find the user by their idNumber
    const user = await UserModel.findOne({
      where: { idNumber: idNo }
    });

    if (!user) {
      console.log(`❌ Requirements controller - User not found with idNumber: ${idNo}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = user.id; // This is the actual database ID
    console.log(`🔍 Requirements controller - Found user with ID: ${studentId} for idNumber: ${idNo}`);

    // Configure upload directory for requirements documents
    const UPLOAD_DIR = path.join(__dirname, '../../uploads/requirements');
    
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(documentFile.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const newFilePath = path.join(UPLOAD_DIR, fileName);

    // Move file to requirements directory
    fs.renameSync(documentFile.path, newFilePath);

    // Generate URL for the document
    const documentUrl = `/api/uploads/requirements/${fileName}`;

    // Check if requirement already exists for this student and type
    let requirement = await RequirementsModel.findOne({
      where: {
        studentId: studentId,
        requirementType: requirementType
      }
    });

    if (requirement) {
      // Update existing requirement
      await requirement.update({
        fileName: documentFile.originalname,
        filePath: documentUrl,
        fileSize: documentFile.size,
        mimeType: documentFile.mimetype,
        isSubmitted: true,
        submittedAt: new Date(),
        status: 'submitted'
      });
    } else {
      // Create new requirement
      requirement = await RequirementsModel.create({
        studentId: studentId,
        requirementType: requirementType,
        fileName: documentFile.originalname,
        filePath: documentUrl,
        fileSize: documentFile.size,
        mimeType: documentFile.mimetype,
        isSubmitted: true,
        submittedAt: new Date(),
        status: 'submitted'
      });
    }
    
    console.log(`✅ Requirements controller - Document uploaded for student ${idNo}, type: ${requirementType}`);
    
    console.log('✅ Requirements controller - Sending success response for document upload');
    res.status(200).json({
      message: 'Document uploaded successfully',
      requirementType,
      studentId: idNo,
      fileName: documentFile.originalname,
      documentUrl: documentUrl
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error uploading document:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

// Send announcement to student about requirements
export const sendAnnouncement = asyncHandler(async (req: Request, res: Response) => {
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
    const { NotificationModel } = await import('../database');
    
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
      notification = await NotificationModel.create({
        userId: parseInt(studentId),
        message: message,
        type: type || 'requirements_reminder',
        isRead: false,
        // requestId is optional for requirements announcements
      });
      
      console.log('✅ Requirements controller - Notification created successfully:', notification.toJSON());
    } catch (createError) {
      console.error('❌ Requirements controller - Error creating notification:', createError);
      if (createError instanceof Error) {
        console.error('❌ Requirements controller - Error details:', {
          message: createError.message,
          code: (createError as any).code,
          sqlMessage: (createError as any).sqlMessage
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
  } catch (error) {
    console.error('❌ Requirements controller - Error sending announcement:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to send announcement' });
  }
});

// Get requirements status for a student
export const getRequirementsStatus = asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Requirements controller - getRequirementsStatus called');
  console.log('🔍 Requirements controller - Request params:', req.params);
  
  const { idNo } = req.params;

  if (!idNo) {
    console.log('❌ Requirements controller - No student ID provided');
    return res.status(400).json({ message: 'Student ID is required' });
  }

  try {
    // First, find the user by their idNumber
    const user = await UserModel.findOne({
      where: { idNumber: idNo }
    });

    if (!user) {
      console.log(`❌ Requirements controller - User not found with idNumber: ${idNo}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = user.id; // This is the actual database ID
    console.log(`🔍 Requirements controller - Found user with ID: ${studentId} for idNumber: ${idNo}`);

    // Query the requirements table for this student
    const requirements = await RequirementsModel.findAll({
      where: {
        studentId: studentId
      }
    });
    
    // Create a map of requirement types and their status
    const requirementsMap = {
      psa: false,
      validId: false,
      form137: false,
      idPicture: false
    };
    
    // Update the map based on what's in the database
    requirements.forEach((req: any) => {
      if (req.requirementType in requirementsMap) {
        requirementsMap[req.requirementType as keyof typeof requirementsMap] = req.isSubmitted;
      }
    });
    
    const submittedCount = Object.values(requirementsMap).filter(Boolean).length;
    const pendingCount = Object.values(requirementsMap).filter(v => !v).length;
    
    // Get detailed information for submitted requirements
    const requirementsDetails: { [key: string]: any } = {};
    requirements.forEach((req: any) => {
      if (req.isSubmitted) {
        // Ensure the documentUrl is in the correct format
        let documentUrl = req.filePath;
        if (documentUrl && !documentUrl.startsWith('/api/')) {
          // Convert old format to new format if needed
          documentUrl = documentUrl.replace('/uploads/', '/api/uploads/');
        }
        
        requirementsDetails[req.requirementType] = {
          fileName: req.fileName,
          documentUrl: documentUrl,
          fileSize: req.fileSize,
          uploadedAt: req.submittedAt,
          status: req.status
        };
      }
    });

    console.log('✅ Requirements controller - Successfully fetched requirements status for student:', idNo);
    res.status(200).json({
      studentId: idNo,
      requirements: requirementsMap,
      submittedCount,
      pendingCount,
      requirementsDetails
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error fetching requirements status:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to fetch requirements status' });
  }
});

// Update requirement status
export const updateRequirementStatus = asyncHandler(async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('❌ Requirements controller - Error updating requirement status:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to update requirement status' });
  }
});

// Verify a requirement document
export const verifyRequirement = asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Requirements controller - verifyRequirement called');
  console.log('🔍 Requirements controller - Request body:', req.body);
  console.log('🔍 Requirements controller - Request params:', req.params);
  
  const { idNo } = req.params;
  const { requirementType, status, notes } = req.body;

  if (!idNo || !requirementType || !status) {
    console.log('❌ Requirements controller - Missing required fields for requirement verification');
    return res.status(400).json({ message: 'Student ID, requirement type, and status are required' });
  }

  try {
    // First, find the user by their idNumber
    const user = await UserModel.findOne({
      where: { idNumber: idNo }
    });

    if (!user) {
      console.log(`❌ Requirements controller - User not found with idNumber: ${idNo}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = user.id; // This is the actual database ID
    console.log(`🔍 Requirements controller - Found user with ID: ${studentId} for idNumber: ${idNo}`);

    // Find and update the requirement
    const requirement = await RequirementsModel.findOne({
      where: {
        studentId: studentId,
        requirementType: requirementType
      }
    });

    if (!requirement) {
      console.log(`❌ Requirements controller - Requirement not found for student ${idNo}, type: ${requirementType}`);
      return res.status(404).json({ message: 'Requirement not found' });
    }

    // Update the requirement status
    await requirement.update({
      status: status,
      verifiedBy: (req as any).user?.id, // Admin user ID from session
      verifiedAt: new Date(),
      notes: notes || null
    });

    console.log(`✅ Requirements controller - Requirement ${requirementType} for student ${idNo} updated to status: ${status}`);
    
    res.status(200).json({
      message: 'Requirement status updated successfully',
      requirementType,
      studentId: idNo,
      status,
      verifiedAt: new Date()
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error updating requirement status:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to update requirement status' });
  }
});
