-- Create real enrollment using actual student registration data
-- This script will enroll a student in a 4th year subject

-- First, let's check what we have
SELECT 'Current state before enrollment...' as status;

-- Check student registrations
SELECT 
    'Student Registrations:' as info,
    COUNT(*) as total
FROM student_registrations;

-- Check existing enrollments
SELECT 
    'Existing Enrollments:' as info,
    COUNT(*) as total
FROM student_enrollments;

-- Check 4th year schedules
SELECT 
    '4th Year Schedules:' as info,
    COUNT(*) as total
FROM bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '4th' AND s.semester = '1st';

-- Now let's create an enrollment
-- We'll use the first available 4th year student and first available 4th year schedule

-- Step 1: Find a student to enroll
SELECT 'Finding student to enroll...' as status;

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
LIMIT 1;

-- Step 2: Find a schedule to enroll in
SELECT 'Finding schedule to enroll in...' as status;

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
LIMIT 1;

-- Step 3: Create the enrollment (uncomment and run this part)
/*
-- Insert enrollment record
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
JOIN student_registrations sr ON u.id = sr.userId
CROSS JOIN bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE sr.yearLevel = '4th' 
    AND sr.semester = '1st'
    AND s.yearLevel = '4th' 
    AND s.semester = '1st'
LIMIT 1;

-- Update the current enrollment count for the schedule
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

SELECT 'Enrollment created successfully!' as status;
*/

-- Step 4: Verify the enrollment was created
SELECT 'Verifying enrollment...' as status;

SELECT 
    se.id as enrollmentId,
    se.studentId,
    se.scheduleId,
    se.enrollmentStatus,
    se.enrollmentDate,
    se.grade,
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
LIMIT 5;

-- Step 5: Check updated schedule enrollment count
SELECT 'Checking updated schedule enrollment count...' as status;

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
