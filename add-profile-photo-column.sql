-- Add profilePhoto column to users table
-- Run this script in your MySQL database to add the missing column

USE test_db;

-- Add profilePhoto column if it doesn't exist
ALTER TABLE users 
ADD COLUMN profilePhoto VARCHAR(500) NULL COMMENT 'URL to stored profile photo';

-- Verify the column was added
DESCRIBE users;
