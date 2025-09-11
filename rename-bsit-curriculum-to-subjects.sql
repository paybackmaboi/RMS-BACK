-- Migration script to rename bsit_curriculum table to subjects
-- and remove the old subjects table

-- =====================================================
-- 1. RENAME BSIT_CURRICULUM TABLE TO SUBJECTS
-- =====================================================
RENAME TABLE bsit_curriculum TO subjects;

-- =====================================================
-- 2. UPDATE FOREIGN KEY REFERENCES
-- =====================================================
-- Update bsit_schedules table to reference subjects instead of bsit_curriculum
ALTER TABLE bsit_schedules 
DROP FOREIGN KEY bsit_schedules_ibfk_1;

ALTER TABLE bsit_schedules 
ADD CONSTRAINT fk_bsit_schedules_subjects 
FOREIGN KEY (curriculumId) REFERENCES subjects(id) ON DELETE CASCADE;

-- =====================================================
-- 3. REMOVE OLD SUBJECTS TABLE (if it exists)
-- =====================================================
-- First, check if there are any foreign key references to the old subjects table
-- and drop them before dropping the table

-- Drop foreign key constraints that reference the old subjects table
-- (This will be handled by the application code changes)

-- Drop the old subjects table
DROP TABLE IF EXISTS subjects_old;

-- =====================================================
-- 4. VERIFY CHANGES
-- =====================================================
-- Check that the table was renamed successfully
SHOW TABLES LIKE 'subjects';

-- Check the structure of the renamed table
DESCRIBE subjects;

-- Check foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    REFERENCED_TABLE_NAME = 'subjects';
