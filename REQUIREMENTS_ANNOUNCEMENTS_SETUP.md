# Requirements Announcements System Setup

This document explains how to set up the requirements announcements system so that registrars can send announcements to students about missing enrollment requirements.

## Current Status

✅ **Frontend**: Updated to fetch real announcements from database  
✅ **Backend API**: Requirements controller and routes created  
✅ **Notification System**: Extended to handle requirements announcements  
❌ **Database Schema**: Needs to be updated to support new notification types  

## Database Setup Required

The notifications table needs to be updated to support requirements announcements. Run the following SQL script:

```sql
-- Run this in your MySQL database
source update-notifications-table.sql
```

Or manually execute these commands:

```sql
-- Make requestId column nullable
ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL;

-- Add type column for different notification types
ALTER TABLE notifications ADD COLUMN type VARCHAR(50) NULL DEFAULT 'request';

-- Update existing notifications
UPDATE notifications SET type = 'request' WHERE type IS NULL;

-- Add indexes for performance
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_user_type ON notifications(userId, type);
```

## How It Works

### 1. Registrar Sends Announcement
- Registrar goes to Student Information page
- Clicks "Send Announcement" button
- Writes message about missing requirements
- System saves announcement to notifications table

### 2. Student Receives Announcement
- Student logs into their homepage
- System fetches notifications from `/api/notifications`
- Requirements announcements appear in Announcements section
- Student sees real-time updates about missing documents

### 3. Notification Types
- `request`: Document request notifications (existing)
- `requirements_reminder`: Requirements announcements (new)
- `general`: General announcements (future use)

## Testing the System

1. **Update Database**: Run the SQL script above
2. **Restart Backend**: Restart the backend server
3. **Send Announcement**: Use the registrar interface to send a test announcement
4. **Check Student Homepage**: Verify the announcement appears for the student

## Files Modified

### Backend
- `src/controllers/requirementsController.ts` - Handles announcement creation
- `src/routes/requirementsRoutes.ts` - API routes for requirements
- `src/models/Notification.ts` - Extended notification model
- `src/app.ts` - Registered new routes

### Frontend
- `src/components/admin/StudentDetailView.js` - Registrar announcement interface
- `src/components/student/StudentHomePage.js` - Student announcements display

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined (reading 'single')"**
   - Fix: Import statement corrected in requirementsRoutes.ts

2. **"requestId cannot be null"**
   - Fix: Run the database update script above

3. **Announcements not showing on student homepage**
   - Check: Browser console for API errors
   - Verify: Database schema is updated
   - Confirm: Backend server is running

### Database Connection Issues

If you get database connection errors:
1. Check MySQL server is running
2. Verify database credentials in `.env` file
3. Ensure database exists and is accessible

## Next Steps

Once the database is updated:

1. **Uncomment Database Code**: Remove the TODO comment in requirementsController.ts
2. **Test Full Flow**: Send announcement from registrar to student
3. **Add More Features**: Email notifications, SMS alerts, etc.
4. **Enhance UI**: Better announcement formatting, priority levels

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify database schema matches expected structure
4. Ensure all routes are properly registered
