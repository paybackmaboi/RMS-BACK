import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sequelize } from '../database';

// Upload a requirement document
export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
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
