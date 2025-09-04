-- Check existing student registrations
SELECT 'Checking existing student registrations...' as status;

SELECT 
    sr.id,
    sr.userId,
    sr.studentId,
    sr.firstName,
    sr.lastName,
    sr.yearLevel,
    sr.semester,
    sr.schoolYear,
    sr.registrationStatus,
    u.idNumber
FROM student_registrations sr
JOIN users u ON sr.userId = u.id
ORDER BY sr.id DESC;

-- Check existing users
SELECT 'Checking existing users...' as status;

SELECT 
    id,
    idNumber,
    firstName,
    lastName,
    role,
    createdAt
FROM users 
WHERE role = 'student'
ORDER BY id DESC;

-- Check existing schedules for 4th year
SELECT 'Checking 4th year schedules...' as status;

SELECT 
    s.id as scheduleId,
    s.curriculumId,
    s.schoolYear,
    s.semester,
    s.yearLevel,
    s.day,
    s.startTime,
    s.endTime,
    s.room,
    s.instructor,
    s.maxStudents,
    s.currentEnrollment,
    c.courseCode,
    c.courseDescription,
    c.units
FROM bsit_schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '4th' AND s.semester = '1st'
ORDER BY s.id;

-- Check if student_enrollments table exists and has data
SELECT 'Checking student_enrollments table...' as status;

SELECT COUNT(*) as total_enrollments FROM student_enrollments;

-- Create a test enrollment for the 4th year student
-- First, let's find a student with 4th year registration
SELECT 'Finding 4th year student for enrollment...' as status;

SELECT 
    sr.id as registrationId,
    sr.userId,
    sr.studentId,
    sr.firstName,
    sr.lastName,
    sr.yearLevel,
    sr.semester,
    u.idNumber
FROM student_registrations sr
JOIN users u ON sr.userId = u.id
WHERE sr.yearLevel = '4th' AND sr.semester = '1st'
LIMIT 1;

-- If no 4th year student exists, let's check what year levels we have
SELECT 'Checking available year levels...' as status;

SELECT DISTINCT 
    yearLevel,
    semester,
    COUNT(*) as student_count
FROM student_registrations
GROUP BY yearLevel, semester
ORDER BY yearLevel, semester;

-- Let's also check what users exist
SELECT 'Available users for enrollment...' as status;

SELECT 
    u.id,
    u.idNumber,
    u.firstName,
    u.lastName,
    u.role,
    sr.yearLevel,
    sr.semester
FROM users u
LEFT JOIN student_registrations sr ON u.id = sr.userId
WHERE u.role = 'student'
ORDER BY u.id;
