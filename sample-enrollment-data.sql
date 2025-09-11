-- Sample Enrollment Data for Testing
-- This script will create sample data so you can see your enrolled subjects and schedules

-- First, let's check if we have the necessary tables and data
SELECT 'Checking existing data...' as status;

-- Check if student with ID 21 exists
SELECT id, idNumber, firstName, lastName, role FROM users WHERE id = 21;

-- Check existing enrollments
SELECT COUNT(*) as total_enrollments FROM student_enrollments;

-- Check existing BSIT curriculum
SELECT COUNT(*) as total_curriculum FROM subjects;

-- Check existing schedules
SELECT COUNT(*) as total_schedules FROM schedules;

-- If you want to create sample data, uncomment and run the following:

/*
-- Insert sample BSIT curriculum subjects (if they don't exist)
INSERT INTO subjects (courseCode, courseDescription, units, yearLevel, semester, courseType, isActive) VALUES
('CS101', 'Introduction to Computer Science', 3, '1st', '1st', 'Lecture', 1),
('CS102', 'Programming Fundamentals', 3, '1st', '1st', 'Laboratory', 1),
('MATH101', 'College Algebra', 3, '1st', '1st', 'Lecture', 1),
('ENG101', 'English Communication', 3, '1st', '1st', 'Lecture', 1),
('CS201', 'Data Structures', 3, '1st', '2nd', 'Lecture', 1),
('CS202', 'Object-Oriented Programming', 3, '1st', '2nd', 'Laboratory', 1)
ON DUPLICATE KEY UPDATE courseCode = courseCode;

-- Insert sample schedules (if they don't exist)
INSERT INTO schedules (curriculumId, schoolYear, semester, yearLevel, day, startTime, endTime, room, instructor, maxStudents, currentEnrollment, scheduleStatus) VALUES
(1, '2025-2026', '1st', '1st', 'Monday', '08:00:00', '09:30:00', 'Room 101', 'Prof. Smith', 30, 0, 'Open'),
(2, '2025-2026', '1st', '1st', 'Tuesday', '10:00:00', '11:30:00', 'Lab 201', 'Prof. Johnson', 25, 0, 'Open'),
(3, '2025-2026', '1st', '1st', 'Wednesday', '13:00:00', '14:30:00', 'Room 102', 'Prof. Davis', 35, 0, 'Open'),
(4, '2025-2026', '1st', '1st', 'Thursday', '15:00:00', '16:30:00', 'Room 103', 'Prof. Wilson', 30, 0, 'Open'),
(5, '2025-2026', '2nd', '1st', 'Monday', '08:00:00', '09:30:00', 'Room 201', 'Prof. Brown', 30, 0, 'Open'),
(6, '2025-2026', '2nd', '1st', 'Tuesday', '10:00:00', '11:30:00', 'Lab 202', 'Prof. Garcia', 25, 0, 'Open')
ON DUPLICATE KEY UPDATE curriculumId = curriculumId;

-- Insert sample enrollments for student ID 21 (if they don't exist)
INSERT INTO student_enrollments (studentId, scheduleId, enrollmentStatus, grade) VALUES
(21, 1, 'Enrolled', NULL),
(21, 2, 'Enrolled', NULL),
(21, 3, 'Enrolled', NULL),
(21, 4, 'Enrolled', NULL)
ON DUPLICATE KEY UPDATE enrollmentStatus = enrollmentStatus;

SELECT 'Sample data inserted successfully!' as status;
*/
