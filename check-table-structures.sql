-- Check the structure of notifications table
DESCRIBE notifications;

-- Check the structure of requests table  
DESCRIBE requests;

-- Check data types and constraints
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_KEY,
    EXTRA
FROM information_schema.COLUMNS 
WHERE TABLE_NAME = 'notifications' 
AND TABLE_SCHEMA = 'test_db'
ORDER BY ORDINAL_POSITION;

SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_KEY,
    EXTRA
FROM information_schema.COLUMNS 
WHERE TABLE_NAME = 'requests' 
AND TABLE_SCHEMA = 'test_db'
ORDER BY ORDINAL_POSITION;

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
