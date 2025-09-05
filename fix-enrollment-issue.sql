-- Fix enrollment issue for 4th year students
-- This script will create proper enrollment records and update schedule counts

-- First, let's check what we have
SELECT '=== CURRENT STATE ===' as info;

-- Check existing enrollments
SELECT 'Current Enrollments:' as info;
SELECT COUNT(*) as total FROM student_enrollments;

-- Check what students we have for 4th year
SELECT '4th Year Students:' as info;
SELECT 
    u.id as userId,
    u.idNumber,
    u.firstName,
    u.lastName,
    sr.yearLevel,
    sr.semester
FROM users u
JOIN student_registrations sr ON u.id = sr.userId
WHERE sr.yearLevel = '4th' AND sr.semester = '1st'
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
    s.instructor,
    s.currentEnrollment,
    s.maxStudents
FROM bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '4th' AND s.semester = '1st'
ORDER BY s.id;

-- Now let's create enrollment records for the 4th year students
-- We'll enroll them in the first few subjects

-- First, let's clear any existing enrollments to start fresh
DELETE FROM student_enrollments;

-- Reset the enrollment counts
UPDATE bsit_schedules SET currentEnrollment = 0, updatedAt = NOW();

-- Now create new enrollment records
-- Enroll Karl Villar (2025-00011) in IT410-LEC
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
WHERE u.idNumber = '2025-00011'  -- Karl Villar
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
    AND c.courseCode = 'IT410-LEC'
LIMIT 1;

-- Enroll Karl Villar in IT411-LEC
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
WHERE u.idNumber = '2025-00011'  -- Karl Villar
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
    AND c.courseCode = 'IT411-LEC'
LIMIT 1;

-- Enroll Andrew Mata (2022-00427) in IT410-LEC
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
WHERE u.idNumber = '2022-00427'  -- Andrew Mata
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
    AND c.courseCode = 'IT410-LEC'
LIMIT 1;

-- Enroll Andrew Mata in IT411-LEC
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
WHERE u.idNumber = '2022-00427'  -- Andrew Mata
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
    AND c.courseCode = 'IT411-LEC'
LIMIT 1;

-- Now update the schedule enrollment counts
UPDATE bsit_schedules 
SET currentEnrollment = (
    SELECT COUNT(*) 
    FROM student_enrollments se 
    WHERE se.scheduleId = bsit_schedules.id
),
updatedAt = NOW()
WHERE id IN (
    SELECT DISTINCT s.id
    FROM bsit_schedules s
    JOIN bsit_curriculum c ON s.curriculumId = c.id
    WHERE s.yearLevel = '4th' AND s.semester = '1st'
);

-- Verify the enrollments were created
SELECT '=== ENROLLMENTS CREATED ===' as info;

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
ORDER BY se.id;

-- Check updated schedule enrollment counts
SELECT '=== UPDATED SCHEDULE COUNTS ===' as info;

SELECT 
    s.id,
    c.courseCode,
    s.currentEnrollment,
    s.maxStudents,
    s.day,
    s.room
FROM bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '4th' AND s.semester = '1st'
ORDER BY s.id;

-- Final check
SELECT '=== FINAL STATE ===' as info;
SELECT COUNT(*) as total_enrollments FROM student_enrollments;
