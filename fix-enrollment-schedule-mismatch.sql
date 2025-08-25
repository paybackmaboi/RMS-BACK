-- Fix Enrollment Schedule Mismatch
-- This script fixes the mismatch between student_enrollments and bsit_schedules tables

-- First, let's see what we're working with
SELECT 'Current state:' as info;
SELECT 
    'student_enrollments' as table_name,
    COUNT(*) as total_enrollments,
    MIN(scheduleId) as min_schedule_id,
    MAX(scheduleId) as max_schedule_id
FROM student_enrollments;

SELECT 
    'bsit_schedules' as table_name,
    COUNT(*) as total_schedules,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM bsit_schedules;

-- Check which schedule IDs in student_enrollments don't exist in bsit_schedules
SELECT 'Missing schedule IDs:' as info;
SELECT DISTINCT se.scheduleId
FROM student_enrollments se
LEFT JOIN bsit_schedules bs ON se.scheduleId = bs.id
WHERE bs.id IS NULL
ORDER BY se.scheduleId;

-- Option 1: Create missing schedules (if you want to keep the existing enrollment data)
-- This will create schedules with the IDs that student_enrollments expects
INSERT INTO bsit_schedules (
    id, curriculumId, schoolYear, semester, yearLevel, 
    day, startTime, endTime, room, instructor, 
    maxStudents, currentEnrollment, scheduleStatus, 
    remarks, createdAt, updatedAt
)
SELECT 
    se.scheduleId as id,
    -- We need to determine curriculumId - let's use a default or find from existing data
    COALESCE(
        (SELECT MIN(curriculumId) FROM bsit_schedules WHERE yearLevel = '4th' LIMIT 1),
        1
    ) as curriculumId,
    '2025-2026' as schoolYear,
    '1st' as semester,
    '4th' as yearLevel,
    'TBA' as day,
    '09:00:00' as startTime,
    '10:30:00' as endTime,
    'TBA' as room,
    'TBA' as instructor,
    40 as maxStudents,
    0 as currentEnrollment,
    'Open' as scheduleStatus,
    'Auto-created to fix enrollment mismatch' as remarks,
    NOW() as createdAt,
    NOW() as updatedAt
FROM student_enrollments se
LEFT JOIN bsit_schedules bs ON se.scheduleId = bs.id
WHERE bs.id IS NULL
GROUP BY se.scheduleId;

-- Option 2: Update student_enrollments to use existing schedule IDs (Alternative approach)
-- This would require mapping enrollments to existing schedules
-- UPDATE student_enrollments 
-- SET scheduleId = (SELECT id FROM bsit_schedules WHERE yearLevel = '4th' LIMIT 1)
-- WHERE scheduleId NOT IN (SELECT id FROM bsit_schedules);

-- Verify the fix
SELECT 'After fix - verification:' as info;
SELECT 
    'student_enrollments' as table_name,
    COUNT(*) as total_enrollments
FROM student_enrollments;

SELECT 
    'bsit_schedules' as table_name,
    COUNT(*) as total_schedules
FROM bsit_schedules;

-- Check if all enrollments now have valid schedule references
SELECT 'Enrollment validation:' as info;
SELECT 
    COUNT(*) as total_enrollments,
    SUM(CASE WHEN bs.id IS NOT NULL THEN 1 ELSE 0 END) as valid_enrollments,
    SUM(CASE WHEN bs.id IS NULL THEN 1 ELSE 0 END) as invalid_enrollments
FROM student_enrollments se
LEFT JOIN bsit_schedules bs ON se.scheduleId = bs.id;
