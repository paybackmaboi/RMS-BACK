import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sequelize, DocumentModel, StudentModel, UserModel } from '../database';
import path from 'path';
import fs from 'fs';

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

  // Validate requirement type
  const validTypes = ['psa', 'validId', 'form137', 'idPicture'];
  if (!validTypes.includes(requirementType)) {
    console.log('❌ Requirements controller - Invalid requirement type');
    return res.status(400).json({ message: 'Invalid requirement type' });
  }

  try {
    // Check if student exists - first try to find by student number, then by ID
    let student = null;
    
    // First, try to find by student number (if studentId is a string like "2022-00242")
    if (isNaN(parseInt(studentId))) {
      student = await StudentModel.findOne({
        where: { studentNumber: studentId }
      });
    } else {
      // If it's a number, try to find by ID
      student = await StudentModel.findByPk(parseInt(studentId));
    }
    
    // If student not found in StudentModel, check if user exists in UserModel
    if (!student) {
      console.log('🔍 Student not found in StudentModel, checking UserModel for:', studentId);
      
      let user = null;
      if (isNaN(parseInt(studentId))) {
        // Search by idNumber in UserModel
        user = await UserModel.findOne({
          where: { idNumber: studentId }
        });
      } else {
        // Search by ID in UserModel
        user = await UserModel.findByPk(parseInt(studentId));
      }
      
      if (user) {
        console.log('✅ User found in UserModel, creating StudentModel record for:', user.idNumber);
        
        // Create a basic student record
        student = await StudentModel.create({
          userId: user.id,
          studentNumber: user.idNumber,
          fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
          email: user.email || '',
          currentYearLevel: 1,
          currentSemester: 1,
          yearOfEntry: new Date().getFullYear(),
          studentType: 'First',
          semesterEntry: 'First',
          applicationType: 'Freshmen',
          academicStatus: 'Regular',
          totalUnitsEarned: 0,
          cumulativeGPA: 0.0,
          isActive: true,
          courseId: null,
          major: 'Information Technology'
        });
        
        console.log('✅ Student record created successfully');
      } else {
        console.log('❌ Requirements controller - User not found for ID:', studentId);
        return res.status(404).json({ message: 'Student not found' });
      }
    }
    
    console.log('✅ Requirements controller - Student found:', {
      id: student.id,
      studentNumber: student.studentNumber,
      fullName: student.fullName
    });

    // Check if document already exists for this student and requirement type
    const existingDocument = await DocumentModel.findOne({
      where: {
        studentId: student.id, // Use the actual student database ID
        requirementType: requirementType
      }
    });

    if (existingDocument) {
      // Delete the old file if it exists
      if (existingDocument.filePath && fs.existsSync(existingDocument.filePath)) {
        fs.unlinkSync(existingDocument.filePath);
      }
      
      // Update the existing document
      await existingDocument.update({
        fileName: documentFile.filename,
        originalName: documentFile.originalname,
        filePath: documentFile.path,
        fileSize: documentFile.size,
        mimeType: documentFile.mimetype,
        status: 'pending',
        uploadedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null,
        remarks: null
      });

      console.log(`✅ Requirements controller - Document updated for student ${studentId}, type: ${requirementType}`);
    } else {
      // Create new document record
      await DocumentModel.create({
        studentId: student.id, // Use the actual student database ID
        requirementType: requirementType,
        fileName: documentFile.filename,
        originalName: documentFile.originalname,
        filePath: documentFile.path,
        fileSize: documentFile.size,
        mimeType: documentFile.mimetype,
        status: 'pending',
        uploadedAt: new Date()
      });

      console.log(`✅ Requirements controller - Document created for student ${studentId}, type: ${requirementType}`);
    }
    
    console.log('✅ Requirements controller - Sending success response for document upload');
    res.status(200).json({
      message: 'Document uploaded successfully',
      requirementType,
      studentId,
      fileName: documentFile.originalname,
      status: 'pending'
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error uploading document:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Clean up uploaded file if database operation failed
    if (documentFile && documentFile.path && fs.existsSync(documentFile.path)) {
      fs.unlinkSync(documentFile.path);
    }
    
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
    // Check if student exists - first try to find by student number, then by ID
    let student = null;
    
    // First, try to find by student number (if studentId is a string like "2022-00242")
    if (isNaN(parseInt(studentId))) {
      student = await StudentModel.findOne({
        where: { studentNumber: studentId }
      });
    } else {
      // If it's a number, try to find by ID
      student = await StudentModel.findByPk(parseInt(studentId));
    }
    
    // If student not found in StudentModel, check if user exists in UserModel
    if (!student) {
      console.log('🔍 Student not found in StudentModel, checking UserModel for:', studentId);
      
      let user = null;
      if (isNaN(parseInt(studentId))) {
        // Search by idNumber in UserModel
        user = await UserModel.findOne({
          where: { idNumber: studentId }
        });
      } else {
        // Search by ID in UserModel
        user = await UserModel.findByPk(parseInt(studentId));
      }
      
      if (user) {
        console.log('✅ User found in UserModel, creating StudentModel record for:', user.idNumber);
        
        // Create a basic student record
        student = await StudentModel.create({
          userId: user.id,
          studentNumber: user.idNumber,
          fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
          email: user.email || '',
          currentYearLevel: 1,
          currentSemester: 1,
          yearOfEntry: new Date().getFullYear(),
          studentType: 'First',
          semesterEntry: 'First',
          applicationType: 'Freshmen',
          academicStatus: 'Regular',
          totalUnitsEarned: 0,
          cumulativeGPA: 0.0,
          isActive: true,
          courseId: null,
          major: 'Information Technology'
        });
        
        console.log('✅ Student record created successfully');
      } else {
        console.log('❌ Requirements controller - User not found for ID:', studentId);
        return res.status(404).json({ message: 'Student not found' });
      }
    }
    
    console.log('✅ Requirements controller - Student found for status:', {
      id: student.id,
      studentNumber: student.studentNumber,
      fullName: student.fullName
    });

    // Get all documents for this student
    const documents = await DocumentModel.findAll({
      where: {
        studentId: student.id // Use the actual student database ID
      },
      order: [['uploadedAt', 'DESC']]
    });

    // Initialize requirements status
    const requirements = {
      psa: false,
      validId: false,
      form137: false,
      idPicture: false
    };

    const requirementsDetails = {
      psa: null,
      validId: null,
      form137: null,
      idPicture: null
    };

    // Process documents and update status
    documents.forEach(doc => {
      if (doc.status === 'approved') {
        requirements[doc.requirementType as keyof typeof requirements] = true;
      }
      
      // Store document details
      requirementsDetails[doc.requirementType as keyof typeof requirementsDetails] = {
        id: doc.id,
        fileName: doc.fileName,
        originalName: doc.originalName,
        filePath: doc.filePath,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        uploadedAt: doc.uploadedAt,
        reviewedAt: doc.reviewedAt,
        reviewedBy: doc.reviewedBy,
        remarks: doc.remarks
      };
    });

    // Count submitted and pending documents
    const submittedCount = Object.values(requirements).filter(status => status === true).length;
    const pendingCount = 4 - submittedCount;
    
    console.log('✅ Requirements controller - Successfully fetched requirements status for student:', studentId);
    res.status(200).json({
      studentId,
      requirements,
      requirementsDetails,
      submittedCount,
      pendingCount,
      totalCount: 4
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
  
  const { studentId, requirementType, status, remarks, reviewedBy } = req.body;

  if (!studentId || !requirementType || !status) {
    console.log('❌ Requirements controller - Missing required fields for status update');
    return res.status(400).json({ message: 'Student ID, requirement type, and status are required' });
  }

  // Validate status
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    console.log('❌ Requirements controller - Invalid status');
    return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected' });
  }

  try {
    // Check if student exists - first try to find by student number, then by ID
    let student = null;
    
    // First, try to find by student number (if studentId is a string like "2022-00242")
    if (isNaN(parseInt(studentId))) {
      student = await StudentModel.findOne({
        where: { studentNumber: studentId }
      });
    } else {
      // If it's a number, try to find by ID
      student = await StudentModel.findByPk(parseInt(studentId));
    }
    
    // If student not found in StudentModel, check if user exists in UserModel
    if (!student) {
      console.log('🔍 Student not found in StudentModel, checking UserModel for:', studentId);
      
      let user = null;
      if (isNaN(parseInt(studentId))) {
        // Search by idNumber in UserModel
        user = await UserModel.findOne({
          where: { idNumber: studentId }
        });
      } else {
        // Search by ID in UserModel
        user = await UserModel.findByPk(parseInt(studentId));
      }
      
      if (user) {
        console.log('✅ User found in UserModel, creating StudentModel record for:', user.idNumber);
        
        // Create a basic student record
        student = await StudentModel.create({
          userId: user.id,
          studentNumber: user.idNumber,
          fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
          email: user.email || '',
          currentYearLevel: 1,
          currentSemester: 1,
          yearOfEntry: new Date().getFullYear(),
          studentType: 'First',
          semesterEntry: 'First',
          applicationType: 'Freshmen',
          academicStatus: 'Regular',
          totalUnitsEarned: 0,
          cumulativeGPA: 0.0,
          isActive: true,
          courseId: null,
          major: 'Information Technology'
        });
        
        console.log('✅ Student record created successfully');
      } else {
        console.log('❌ Requirements controller - User not found for ID:', studentId);
        return res.status(404).json({ message: 'Student not found' });
      }
    }

    // Find the document
    const document = await DocumentModel.findOne({
      where: {
        studentId: student.id, // Use the actual student database ID
        requirementType: requirementType
      }
    });

    if (!document) {
      console.log('❌ Requirements controller - Document not found');
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update the document status
    await document.update({
      status: status,
      reviewedAt: new Date(),
      reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
      remarks: remarks || null
    });

    console.log(`✅ Requirements controller - Requirement status updated for student ${studentId}, type: ${requirementType}, status: ${status}`);
    
    console.log('✅ Requirements controller - Sending success response for status update');
    res.status(200).json({
      message: 'Requirement status updated successfully',
      studentId,
      requirementType,
      status,
      reviewedAt: document.reviewedAt,
      reviewedBy: document.reviewedBy,
      remarks: document.remarks
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error updating requirement status:', error);
    console.error('❌ Requirements controller - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Failed to update requirement status' });
  }
});

// Get all documents for admin review
export const getAllDocuments = asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Requirements controller - getAllDocuments called');
  
  try {
    const documents = await DocumentModel.findAll({
      include: [
        {
          model: StudentModel,
          as: 'student',
          include: [
            {
              model: (await import('../database')).UserModel,
              as: 'user'
            }
          ]
        },
        {
          model: (await import('../database')).UserModel,
          as: 'reviewer'
        }
      ],
      order: [['uploadedAt', 'DESC']]
    });

    console.log('✅ Requirements controller - Successfully fetched all documents');
    res.status(200).json({
      documents,
      totalCount: documents.length
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error fetching all documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

// Get document by ID for viewing
export const getDocumentById = asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Requirements controller - getDocumentById called');
  console.log('🔍 Requirements controller - Request params:', req.params);
  
  const { documentId } = req.params;

  if (!documentId) {
    console.log('❌ Requirements controller - No document ID provided');
    return res.status(400).json({ message: 'Document ID is required' });
  }

  try {
    const document = await DocumentModel.findByPk(documentId, {
      include: [
        {
          model: StudentModel,
          as: 'student',
          include: [
            {
              model: (await import('../database')).UserModel,
              as: 'user'
            }
          ]
        },
        {
          model: (await import('../database')).UserModel,
          as: 'reviewer'
        }
      ]
    });

    if (!document) {
      console.log('❌ Requirements controller - Document not found');
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log('✅ Requirements controller - Successfully fetched document');
    res.status(200).json({
      document
    });
  } catch (error) {
    console.error('❌ Requirements controller - Error fetching document:', error);
    res.status(500).json({ message: 'Failed to fetch document' });
  }
});
