# Backend Upload Endpoints Implementation

This document explains the implementation of file upload functionality for the RMS system.

## New Features Implemented

### 1. Requirements Model
- **File**: `src/models/Requirements.ts`
- **Purpose**: Stores information about student document uploads
- **Fields**: studentId, requirementType, fileName, filePath, fileSize, mimeType, status, etc.

### 2. Document Upload Endpoints
- **Route**: `/api/students/:idNo/upload-document`
- **Method**: POST
- **Purpose**: Upload requirement documents (PSA, Valid ID, Form 137, ID Picture)
- **File Types**: PDF, JPG, JPEG, PNG
- **Size Limit**: 5MB

### 3. Requirements Status Endpoints
- **Route**: `/api/students/:idNo/requirements`
- **Method**: GET
- **Purpose**: Get the current status of all requirements for a student

### 4. Photo Upload Endpoints (Already existed)
- **Route**: `/api/photos/upload/:studentId`
- **Method**: POST
- **Purpose**: Upload student profile photos
- **File Types**: JPEG, PNG, GIF
- **Size Limit**: 5MB

## Database Setup

### 1. Create Requirements Table
Run the SQL script to create the requirements table:

```bash
mysql -u your_username -p your_database < create-requirements-table.sql
```

Or manually execute the SQL in the `create-requirements-table.sql` file.

### 2. Verify Table Creation
```sql
DESCRIBE requirements;
```

## File Storage Structure

```
uploads/
├── profile-photos/     # Student profile photos
└── requirements/       # Requirement documents
```

## API Usage Examples

### Upload a Document
```javascript
const formData = new FormData();
formData.append('document', file);
formData.append('requirementType', 'psa');

const response = await fetch('/api/students/2025-00011/upload-document', {
  method: 'POST',
  headers: {
    'X-Session-Token': sessionToken
  },
  body: formData
});
```

### Get Requirements Status
```javascript
const response = await fetch('/api/students/2025-00011/requirements', {
  headers: {
    'X-Session-Token': sessionToken
  }
});

const data = await response.json();
// Returns: { studentId, requirements: { psa: true, validId: false, ... }, submittedCount, pendingCount }
```

### Upload Profile Photo
```javascript
const formData = new FormData();
formData.append('photo', file);

const response = await fetch('/api/photos/upload/123', {
  method: 'POST',
  headers: {
    'X-Session-Token': sessionToken
  },
  body: formData
});
```

## Frontend Integration

### 1. UploadDocuments Component
- **File**: `front/RMS-FRONT/src/components/admin/UploadDocuments.js`
- **Status**: ✅ Fully implemented and connected to backend
- **Features**: File validation, upload progress, status tracking

### 2. StudentDetailView Component
- **File**: `front/RMS-FRONT/src/components/admin/StudentDetailView.js`
- **Status**: ✅ Photo upload fully implemented
- **Features**: Photo upload, preview, delete

## Security Features

### 1. Authentication
- All upload endpoints require valid session token
- Uses `adminSessionAuthMiddleware` for admin-only access

### 2. File Validation
- File type validation (PDF, JPG, PNG)
- File size limits (5MB)
- Unique filename generation using UUID

### 3. File Storage
- Files stored outside web root for security
- Unique filenames prevent conflicts
- Proper file permissions

## Error Handling

### 1. File Upload Errors
- Invalid file type
- File too large
- Missing required fields
- Database errors

### 2. Network Errors
- Connection failures
- Timeout handling
- Proper error messages to user

## Testing

### 1. Test File Uploads
1. Navigate to student detail view
2. Click "Upload Documents"
3. Try uploading different file types
4. Verify files appear in uploads directory
5. Check database records

### 2. Test Photo Uploads
1. Navigate to student detail view
2. Click camera icon on profile photo
3. Upload a new photo
4. Verify photo updates in UI
5. Check file storage

## Troubleshooting

### Common Issues

1. **Upload Directory Not Found**
   - Ensure `uploads/` directory exists in project root
   - Check file permissions

2. **Database Connection Errors**
   - Verify MySQL server is running
   - Check database credentials in `.env`

3. **File Upload Fails**
   - Check file size (must be < 5MB)
   - Verify file type is allowed
   - Check session token validity

4. **Requirements Not Saving**
   - Verify requirements table exists
   - Check database constraints
   - Review server logs for errors

## Future Enhancements

### 1. File Compression
- Automatically compress large images
- Maintain quality while reducing size

### 2. Cloud Storage
- Integrate with AWS S3 or similar
- Better scalability and reliability

### 3. Document Preview
- PDF preview in browser
- Image thumbnail generation

### 4. Batch Upload
- Upload multiple documents at once
- Bulk status updates

## Support

For issues or questions:
1. Check server logs for error details
2. Verify database schema matches requirements
3. Test with different file types and sizes
4. Ensure all dependencies are installed
