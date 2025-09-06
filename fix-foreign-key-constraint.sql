-- Fix foreign key constraint issue between notifications and requests tables

-- First, check current structure
SELECT 'Current notifications table structure:' as info;
DESCRIBE notifications;

SELECT 'Current requests table structure:' as info;
DESCRIBE requests;

-- Drop the problematic foreign key constraint if it exists
SET @constraint_name = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = 'notifications'
    AND COLUMN_NAME = 'requestId'
    AND TABLE_SCHEMA = 'test_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SELECT CONCAT('Found constraint: ', IFNULL(@constraint_name, 'NONE')) as constraint_info;

-- Drop the foreign key constraint
SET @sql = IF(@constraint_name IS NOT NULL,
    CONCAT('ALTER TABLE notifications DROP FOREIGN KEY ', @constraint_name),
    'SELECT "No foreign key constraint found" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sure both tables have compatible data types
-- Check if requests.id is INT UNSIGNED
ALTER TABLE requests MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT;

-- Make sure notifications.requestId is INT UNSIGNED NULL
ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL;

-- Add the foreign key constraint back with proper types
ALTER TABLE notifications 
ADD CONSTRAINT notifications_ibfk_2 
FOREIGN KEY (requestId) REFERENCES requests(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Verify the fix
SELECT 'Fixed table structures:' as info;
DESCRIBE notifications;
DESCRIBE requests;

-- Check foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'notifications' 
AND TABLE_SCHEMA = 'test_db'
AND REFERENCED_TABLE_NAME IS NOT NULL;
