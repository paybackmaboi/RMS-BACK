-- Simple enrollment creation for testing the enrolled students view
-- This script will create an enrollment record using existing data

-- First, let's check what we have
SELECT '=== CURRENT STATE ===' as info;

-- Check if student_enrollments table exists
SELECT 'Student Enrollments Table:' as info;
SHOW TABLES LIKE 'student_enrollments';

-- Check existing enrollments
SELECT 'Current Enrollments:' as info;
SELECT COUNT(*) as total FROM student_enrollments;

-- Check what students we have
SELECT 'Available Students:' as info;
SELECT 
    u.id,
    u.idNumber,
    u.firstName,
    u.lastName,
    u.role
FROM users u
WHERE u.role = 'student'
ORDER BY u.id;

-- Check what schedules we have for 4th year
SELECT '4th Year Schedules:' as info;
SELECT 
    s.id as scheduleId,
    c.courseCode,
    c.courseDescription,
    s.day,
    s.startTime,
    s.endTime,
    s.room,
    s.instructor
FROM bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '4th' AND s.semester = '1st'
ORDER BY s.id;

-- Now create an enrollment
-- We'll use the first student and first 4th year schedule
INSERT INTO student_enrollments (
    studentId, 
    scheduleId, 
    enrollmentStatus, 
    enrollmentDate, 
    grade,
    createdAt,
    updatedAt
) 
SELECT 
    u.id as studentId,
    s.id as scheduleId,
    'Enrolled' as enrollmentStatus,
    NOW() as enrollmentDate,
    NULL as grade,
    NOW() as createdAt,
    NOW() as updatedAt
FROM users u
CROSS JOIN bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE u.role = 'student'
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
LIMIT 1;

-- Update the schedule enrollment count
UPDATE bsit_schedules 
SET currentEnrollment = currentEnrollment + 1,
    updatedAt = NOW()
WHERE id = (
    SELECT s.id
    FROM bsit_schedules s
    JOIN bsit_curriculum c ON s.curriculumId = c.id
    WHERE s.yearLevel = '4th' AND s.semester = '1st'
    LIMIT 1
);

-- Verify the enrollment was created
SELECT '=== ENROLLMENT CREATED ===' as info;

SELECT 
    se.id as enrollmentId,
    se.studentId,
    se.scheduleId,
    se.enrollmentStatus,
    se.enrollmentDate,
    u.idNumber,
    u.firstName,
    u.lastName,
    c.courseCode,
    c.courseDescription,
    s.day,
    s.startTime,
    s.endTime,
    s.room
FROM student_enrollments se
JOIN users u ON se.studentId = u.id
JOIN bsit_schedules s ON se.scheduleId = s.id
JOIN bsit_curriculum c ON s.curriculumId = c.id
ORDER BY se.id DESC
LIMIT 1;

-- Check final state
SELECT '=== FINAL STATE ===' as info;
SELECT COUNT(*) as total_enrollments FROM student_enrollments;
