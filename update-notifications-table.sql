-- Update notifications table to support requirements announcements
-- This script makes requestId nullable and adds a type column

-- First, drop the foreign key constraint if it exists
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_NAME = 'notifications' 
    AND COLUMN_NAME = 'requestId' 
    AND TABLE_SCHEMA = DATABASE()
    AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SET @sql = IF(@constraint_name IS NOT NULL, 
    CONCAT('ALTER TABLE notifications DROP FOREIGN KEY ', @constraint_name), 
    'SELECT "No foreign key constraint found" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

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
