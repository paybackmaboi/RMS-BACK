-- Fix notifications table foreign key constraint issue
-- This script safely modifies the requestId column to be nullable

-- Step 1: Check current foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'notifications' 
AND TABLE_SCHEMA = DATABASE()
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Step 2: Drop the foreign key constraint
ALTER TABLE notifications DROP FOREIGN KEY notifications_ibfk_2;

-- Step 3: Modify the requestId column to be nullable
ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL;

-- Step 4: Add type column for different notification types
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) NULL DEFAULT 'request' COMMENT 'Type of notification: request, requirements_reminder, general, etc.';

-- Step 5: Update existing notifications to have the default type
UPDATE notifications SET type = 'request' WHERE type IS NULL;

-- Step 6: Recreate the foreign key constraint (optional - allows NULL values)
-- ALTER TABLE notifications ADD CONSTRAINT notifications_ibfk_2 
-- FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 7: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(userId, type);

-- Step 8: Show the updated table structure
DESCRIBE notifications;

-- Step 9: Show sample data
SELECT id, userId, requestId, type, message, isRead, createdAt 
FROM notifications 
ORDER BY createdAt DESC 
LIMIT 5;
