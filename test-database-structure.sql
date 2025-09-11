-- Database Structure Test Script
-- Run this to check what tables and data exist in your database

-- 1. Check if tables exist
SELECT 'Checking table existence...' as status;

SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('users', 'students', 'student_registrations', 'student_enrollments', 'subjects', 'schedules')
ORDER BY TABLE_NAME;

-- 2. Check users table for user ID 21
SELECT 'Checking user ID 21...' as status;

SELECT 
    id,
    idNumber,
    firstName,
    lastName,
    middleName,
    role,
    isActive
FROM users 
WHERE id = 21;

-- 3. Check students table for user ID 21
SELECT 'Checking students table...' as status;

SELECT 
    id,
    userId,
    studentNumber,
    fullName,
    currentYearLevel,
    currentSemester,
    yearOfEntry,
    studentType,
    semesterEntry
FROM students 
WHERE userId = 21;

-- 4. Check student_registrations table for user ID 21
SELECT 'Checking student_registrations table...' as status;

SELECT 
    id,
    userId,
    studentId,
    firstName,
    lastName,
    yearLevel,
    semester,
    schoolYear,
    applicationType,
    studentType,
    registrationStatus,
    createdAt
FROM student_registrations 
WHERE userId = 21
ORDER BY createdAt DESC;

-- 5. Check student_enrollments table for user ID 21
SELECT 'Checking student_enrollments table...' as status;

SELECT 
    id,
    studentId,
    scheduleId,
    enrollmentStatus,
    grade,
    enrollmentDate
FROM student_enrollments 
WHERE studentId = 21;

-- 6. Check BSIT curriculum and schedules
SELECT 'Checking BSIT curriculum...' as status;

SELECT COUNT(*) as curriculum_count FROM subjects;
SELECT COUNT(*) as schedules_count FROM schedules;

-- 7. Sample data from each table
SELECT 'Sample data from users:' as status;
SELECT * FROM users LIMIT 3;

SELECT 'Sample data from students:' as status;
SELECT * FROM students LIMIT 3;

SELECT 'Sample data from student_registrations:' as status;
SELECT * FROM student_registrations LIMIT 3;

SELECT 'Sample data from student_enrollments:' as status;
SELECT * FROM student_enrollments LIMIT 3;
