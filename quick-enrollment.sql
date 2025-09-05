-- Quick enrollment creation for testing
-- This will enroll a student in a 4th year subject

-- First, let's see what we have
SELECT 'Current enrollments:' as info;
SELECT COUNT(*) as total FROM student_enrollments;

-- Create enrollment for the first available 4th year student
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
SELECT 'Enrollment created! Here are the details:' as status;

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
