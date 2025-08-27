-- Update notifications table to support requirements announcements
-- This script makes requestId nullable and adds a type column

-- Make requestId column nullable
ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL;

-- Add type column for different notification types
ALTER TABLE notifications ADD COLUMN type VARCHAR(50) NULL DEFAULT 'request' COMMENT 'Type of notification: request, requirements_reminder, general, etc.';

-- Update existing notifications to have the default type
UPDATE notifications SET type = 'request' WHERE type IS NULL;

-- Add index on type column for better performance
CREATE INDEX idx_notifications_type ON notifications(type);

-- Add index on userId and type for filtering
CREATE INDEX idx_notifications_user_type ON notifications(userId, type);

-- Show the updated table structure
DESCRIBE notifications;
