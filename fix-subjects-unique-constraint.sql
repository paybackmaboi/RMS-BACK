-- Migration script to fix the unique constraint on subjects table
-- to include courseType, allowing separate Lecture and Laboratory entries

-- =====================================================
-- 1. DROP OLD UNIQUE CONSTRAINT
-- =====================================================
ALTER TABLE subjects DROP INDEX unique_course_year_sem;

-- =====================================================
-- 2. ADD NEW UNIQUE CONSTRAINT WITH COURSE TYPE
-- =====================================================
ALTER TABLE subjects ADD CONSTRAINT unique_course_year_sem_type 
UNIQUE KEY (courseCode, yearLevel, semester, courseType);

-- =====================================================
-- 3. VERIFY CHANGES
-- =====================================================
-- Check the new constraint
SHOW INDEX FROM subjects WHERE Key_name = 'unique_course_year_sem_type';

-- Check for any duplicate entries that might exist
SELECT courseCode, yearLevel, semester, courseType, COUNT(*) as count
FROM subjects 
GROUP BY courseCode, yearLevel, semester, courseType
HAVING COUNT(*) > 1;
