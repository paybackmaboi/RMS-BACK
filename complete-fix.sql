-- Complete database fix script
-- This will resolve all foreign key constraint issues

-- Step 1: Check current state
SELECT '=== CHECKING CURRENT STATE ===' as step;

SELECT 'Notifications table structure:' as info;
DESCRIBE notifications;

SELECT 'Requests table structure:' as info;
DESCRIBE requests;

-- Step 2: Drop problematic foreign key constraints
SELECT '=== DROPPING PROBLEMATIC CONSTRAINTS ===' as step;

-- Find and drop foreign key constraints on notifications.requestId
SET @constraint_name = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = 'notifications'
    AND COLUMN_NAME = 'requestId'
    AND TABLE_SCHEMA = 'test_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SELECT CONCAT('Dropping constraint: ', IFNULL(@constraint_name, 'NONE')) as action;

SET @sql = IF(@constraint_name IS NOT NULL,
    CONCAT('ALTER TABLE notifications DROP FOREIGN KEY ', @constraint_name),
    'SELECT "No constraint to drop" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Fix column types to be compatible
SELECT '=== FIXING COLUMN TYPES ===' as step;

-- Ensure requests.id is INT UNSIGNED AUTO_INCREMENT
ALTER TABLE requests MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT;

-- Ensure notifications.requestId is INT UNSIGNED NULL
ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL;

-- Step 4: Recreate foreign key constraint with correct types
SELECT '=== RECREATING FOREIGN KEY ===' as step;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_ibfk_2 
FOREIGN KEY (requestId) REFERENCES requests(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 5: Verify the fix
SELECT '=== VERIFICATION ===' as step;

SELECT 'Fixed notifications table:' as info;
DESCRIBE notifications;

SELECT 'Fixed requests table:' as info;
DESCRIBE requests;

-- Check foreign key constraints
SELECT 'Foreign key constraints:' as info;
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

SELECT '=== FIX COMPLETE ===' as step;
