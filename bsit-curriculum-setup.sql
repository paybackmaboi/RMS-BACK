-- BSIT Curriculum and Schedule Setup for Benedicto College
-- This script creates tables for student registration and BSIT curriculum schedules

-- =====================================================
-- 1. STUDENT REGISTRATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS student_registrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userId INT UNSIGNED NOT NULL,
    studentId VARCHAR(20) NOT NULL,
    
    -- Basic Information
    firstName VARCHAR(50) NOT NULL,
    middleName VARCHAR(50) NULL,
    lastName VARCHAR(50) NOT NULL,
    dateOfBirth DATE NULL,
    placeOfBirth VARCHAR(100) NULL,
    gender VARCHAR(10) NULL,
    maritalStatus VARCHAR(20) NULL,
    nationality VARCHAR(50) DEFAULT 'Filipino',
    religion VARCHAR(50) NULL,
    
    -- Contact Information
    email VARCHAR(100) NULL,
    contactNumber VARCHAR(20) NULL,
    cityAddress TEXT NULL,
    cityTelNumber VARCHAR(20) NULL,
    provincialAddress TEXT NULL,
    provincialTelNumber VARCHAR(20) NULL,
    
    -- Family Background
    fatherName VARCHAR(100) NULL,
    fatherAddress TEXT NULL,
    fatherOccupation VARCHAR(100) NULL,
    fatherCompany VARCHAR(100) NULL,
    fatherContactNumber VARCHAR(20) NULL,
    fatherIncome VARCHAR(50) NULL,
    
    motherName VARCHAR(100) NULL,
    motherAddress TEXT NULL,
    motherOccupation VARCHAR(100) NULL,
    motherCompany VARCHAR(100) NULL,
    motherContactNumber VARCHAR(20) NULL,
    motherIncome VARCHAR(50) NULL,
    
    guardianName VARCHAR(100) NULL,
    guardianAddress TEXT NULL,
    guardianOccupation VARCHAR(100) NULL,
    guardianCompany VARCHAR(100) NULL,
    guardianContactNumber VARCHAR(20) NULL,
    guardianIncome VARCHAR(50) NULL,
    
    -- Academic Information
    yearLevel VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    schoolYear VARCHAR(20) NOT NULL,
    applicationType VARCHAR(20) DEFAULT 'Freshmen',
    studentType VARCHAR(20) DEFAULT 'First',
    
    -- Academic Background
    elementarySchool VARCHAR(100) NULL,
    elementaryAddress TEXT NULL,
    elementaryHonor VARCHAR(100) NULL,
    elementaryYearGraduated INT NULL,
    
    juniorHighSchool VARCHAR(100) NULL,
    juniorHighAddress TEXT NULL,
    juniorHighHonor VARCHAR(100) NULL,
    juniorHighYearGraduated INT NULL,
    
    seniorHighSchool VARCHAR(100) NULL,
    seniorHighAddress TEXT NULL,
    seniorHighStrand VARCHAR(50) NULL,
    seniorHighHonor VARCHAR(100) NULL,
    seniorHighYearGraduated INT NULL,
    
    ncaeGrade VARCHAR(20) NULL,
    specialization VARCHAR(100) NULL,
    
    -- College Background (if applicable)
    lastCollegeAttended VARCHAR(100) NULL,
    lastCollegeYearTaken INT NULL,
    lastCollegeCourse VARCHAR(100) NULL,
    lastCollegeMajor VARCHAR(100) NULL,
    
    -- Course Information
    course VARCHAR(100) DEFAULT 'Bachelor of Science in Information Technology',
    major VARCHAR(100) DEFAULT 'Information Technology',
    
    -- Registration Status
    registrationStatus ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approvedBy VARCHAR(100) NULL,
    approvedAt TIMESTAMP NULL,
    remarks TEXT NULL,
    
    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_registration (userId, schoolYear, semester)
);

-- =====================================================
-- 2. SUBJECTS TABLE (formerly bsit_curriculum)
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    courseDescription TEXT NOT NULL,
    units INT NOT NULL,
    yearLevel VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    courseType ENUM('Lecture', 'Laboratory', 'Both') NOT NULL,
    prerequisites TEXT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_course_year_sem_type (courseCode, yearLevel, semester, courseType)
);

-- =====================================================
-- 3. SCHEDULES TABLE (formerly schedules)
-- =====================================================
CREATE TABLE IF NOT EXISTS schedules (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    curriculumId INT UNSIGNED NOT NULL,
    schoolYear VARCHAR(20) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    yearLevel VARCHAR(10) NOT NULL,
    
    -- Schedule Details
    day VARCHAR(20) NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(20) NOT NULL,
    instructor VARCHAR(100) NULL,
    maxStudents INT DEFAULT 40,
    currentEnrollment INT DEFAULT 0,
    
    -- Schedule Status
    scheduleStatus ENUM('Open', 'Closed', 'Cancelled') DEFAULT 'Open',
    remarks TEXT NULL,
    
    -- Timestamps
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (curriculumId) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_schedule_lookup (schoolYear, semester, yearLevel, day)
);

-- =====================================================
-- 4. STUDENT ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS student_enrollments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    studentId INT UNSIGNED NOT NULL,
    scheduleId INT UNSIGNED NOT NULL,
    enrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrollmentStatus ENUM('Enrolled', 'Dropped', 'Completed') DEFAULT 'Enrolled',
    grade VARCHAR(5) NULL,
    remarks TEXT NULL,
    
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (scheduleId) REFERENCES schedules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_schedule (studentId, scheduleId)
);

-- =====================================================
-- 5. INSERT COMPLETE BSIT CURRICULUM DATA
-- =====================================================
INSERT INTO bsit_curriculum (courseCode, courseDescription, units, yearLevel, semester, courseType, createdAt, updatedAt) VALUES
-- =====================================================
-- FIRST YEAR
-- =====================================================
-- 1st Year, 1st Semester (23 units)
('IT 110', 'Introduction to Computing - Lec', 2, '1st', '1st', 'Lecture', NOW(), NOW()),
('IT 110', 'Introduction to Computing - Lab', 1, '1st', '1st', 'Laboratory', NOW(), NOW()),
('IT 111', 'Computer Programming 1 - Lec', 2, '1st', '1st', 'Lecture', NOW(), NOW()),
('IT 111', 'Computer Programming 1 - Lab', 1, '1st', '1st', 'Laboratory', NOW(), NOW()),
('IT 112', 'PC Assembly & Troubleshooting - Lec', 2, '1st', '1st', 'Lecture', NOW(), NOW()),
('IT 112', 'PC Assembly & Troubleshooting - Lab', 1, '1st', '1st', 'Laboratory', NOW(), NOW()),
('FIL 1', 'Wikang Filipino', 3, '1st', '1st', 'Lecture', NOW(), NOW()),
('UTS', 'Understanding the Self', 3, '1st', '1st', 'Lecture', NOW(), NOW()),
('PATHFIT 1', 'Movement Competency Training', 2, '1st', '1st', 'Lecture', NOW(), NOW()),
('NSTP 1', 'National Service Training Prog. 1', 3, '1st', '1st', 'Lecture', NOW(), NOW()),
('MATHWORLD', 'Mathematics in the Modern World', 3, '1st', '1st', 'Lecture', NOW(), NOW()),
('MATHPREP', 'Pre-calculus (for non-STEM)', 3, '1st', '1st', 'Lecture', NOW(), NOW()),

-- 1st Year, 2nd Semester (26 units)
('IT 120', 'Discrete Mathematics', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('IT 121', 'Computer Programming 2 - Lec', 2, '1st', '2nd', 'Lecture', NOW(), NOW()),
('IT 121', 'Computer Programming 2 - Lab', 1, '1st', '2nd', 'Laboratory', NOW(), NOW()),
('PURCOM', 'Purposive Communication', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('FIL 2', 'Panitikan ng Pilipinas', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('HIST', 'Readings in Phil. History', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('PATHFIT 2', 'Exercise-based Fitness Activities', 2, '1st', '2nd', 'Lecture', NOW(), NOW()),
('NSTP 2', 'National Service Training Prog. 2', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('ETHICS', 'Ethics', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),
('STS', 'Science, Technology & Society', 3, '1st', '2nd', 'Lecture', NOW(), NOW()),

-- 1st Year, Summer (9 units)
('IT 130', 'Information Management', 3, '1st', 'Summer', 'Lecture', NOW(), NOW()),
('IT 131', 'Platform Technologies (Tangible) - Lec', 2, '1st', 'Summer', 'Lecture', NOW(), NOW()),
('IT 131', 'Platform Technologies (Tangible) - Lab', 1, '1st', 'Summer', 'Laboratory', NOW(), NOW()),
('IT 132', 'Social Issues & Practices', 3, '1st', 'Summer', 'Lecture', NOW(), NOW()),

-- =====================================================
-- SECOND YEAR
-- =====================================================
-- 2nd Year, 1st Semester (23 units)
('IT 210', 'Data Structures & Algorithms - Lec', 2, '2nd', '1st', 'Lecture', NOW(), NOW()),
('IT 210', 'Data Structures & Algorithms - Lab', 1, '2nd', '1st', 'Laboratory', NOW(), NOW()),
('IT 211', 'Platform Technologies 1 (Intangible) - Lec', 2, '2nd', '1st', 'Lecture', NOW(), NOW()),
('IT 211', 'Platform Technologies 1 (Intangible) - Lab', 1, '2nd', '1st', 'Laboratory', NOW(), NOW()),
('IT 212', 'Web Systems & Technologies 1 - Lec', 2, '2nd', '1st', 'Lecture', NOW(), NOW()),
('IT 212', 'Web Systems & Technologies 1 - Lab', 1, '2nd', '1st', 'Laboratory', NOW(), NOW()),
('IT 213', 'Introduction to Human Computer Interaction - Lec', 2, '2nd', '1st', 'Lecture', NOW(), NOW()),
('IT 213', 'Introduction to Human Computer Interaction - Lab', 1, '2nd', '1st', 'Laboratory', NOW(), NOW()),
('ARTAPP', 'Art Appreciation', 3, '2nd', '1st', 'Lecture', NOW(), NOW()),
('CW', 'The Contemporary World', 3, '2nd', '1st', 'Lecture', NOW(), NOW()),
('PATHFIT 3', 'Sports', 2, '2nd', '1st', 'Lecture', NOW(), NOW()),
('STAT', 'Statistics', 3, '2nd', '1st', 'Lecture', NOW(), NOW()),

-- 2nd Year, 2nd Semester (20 units)
('IT 220', 'Object Oriented Programming - Lec', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('IT 220', 'Object Oriented Programming - Lab', 1, '2nd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 221', 'Networking 1 - Lec', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('IT 221', 'Networking 1 - Lab', 1, '2nd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 222', 'Systems Analysis & Design - Lec', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('IT 222', 'Systems Analysis & Design - Lab', 1, '2nd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 223', 'Human Computer Interaction 2 - Lec', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('IT 223', 'Human Computer Interaction 2 - Lab', 1, '2nd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 224', 'Fundamentals of Database Management - Lec', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('IT 224', 'Fundamentals of Database Management - Lab', 1, '2nd', '2nd', 'Laboratory', NOW(), NOW()),
('PATHFIT 4', 'Dance', 2, '2nd', '2nd', 'Lecture', NOW(), NOW()),
('RIZAL', 'Rizal\'s Life & Works', 3, '2nd', '2nd', 'Lecture', NOW(), NOW()),

-- 2nd Year, Summer (9 units)
('IT 230', 'Quantitative Methods', 3, '2nd', 'Summer', 'Lecture', NOW(), NOW()),
('TECHNO', 'Technopreneurship', 3, '2nd', 'Summer', 'Lecture', NOW(), NOW()),
('FILIT', 'The Philippine Society in the IT Era', 3, '2nd', 'Summer', 'Lecture', NOW(), NOW()),

-- =====================================================
-- THIRD YEAR
-- =====================================================
-- 3rd Year, 1st Semester (15 units)
('IT 310', 'Applications Dev\'t. & Emerging Technologies - Lec', 2, '3rd', '1st', 'Lecture', NOW(), NOW()),
('IT 310', 'Applications Dev\'t. & Emerging Technologies - Lab', 1, '3rd', '1st', 'Laboratory', NOW(), NOW()),
('IT 311', 'Networking 2 - Lec', 2, '3rd', '1st', 'Lecture', NOW(), NOW()),
('IT 311', 'Networking 2 - Lab', 1, '3rd', '1st', 'Laboratory', NOW(), NOW()),
('IT 312', 'Integrative Programming & Technologies 1 - Lec', 2, '3rd', '1st', 'Lecture', NOW(), NOW()),
('IT 312', 'Integrative Programming & Technologies 1 - Lab', 1, '3rd', '1st', 'Laboratory', NOW(), NOW()),
('IT 313', 'Web Systems & Technologies 2 - Lec', 2, '3rd', '1st', 'Lecture', NOW(), NOW()),
('IT 313', 'Web Systems & Technologies 2 - Lab', 1, '3rd', '1st', 'Laboratory', NOW(), NOW()),
('IT 314', 'Advanced Database Systems - Lec', 2, '3rd', '1st', 'Lecture', NOW(), NOW()),
('IT 314', 'Advanced Database Systems - Lab', 1, '3rd', '1st', 'Laboratory', NOW(), NOW()),

-- 3rd Year, 2nd Semester (15 units)
('IT 320', 'Systems Integration & Architecture 1 - Lec', 2, '3rd', '2nd', 'Lecture', NOW(), NOW()),
('IT 320', 'Systems Integration & Architecture 1 - Lab', 1, '3rd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 321', 'Information Assurance & Security 1 - Lec', 2, '3rd', '2nd', 'Lecture', NOW(), NOW()),
('IT 321', 'Information Assurance & Security 1 - Lab', 1, '3rd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 322', 'Integrative Programming & Technologies 2 - Lec', 2, '3rd', '2nd', 'Lecture', NOW(), NOW()),
('IT 322', 'Integrative Programming & Technologies 2 - Lab', 1, '3rd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 323', 'Web Systems & Technologies 3 - Lec', 2, '3rd', '2nd', 'Lecture', NOW(), NOW()),
('IT 323', 'Web Systems & Technologies 3 - Lab', 1, '3rd', '2nd', 'Laboratory', NOW(), NOW()),
('IT 324', 'Event Driven Programming - Lec', 2, '3rd', '2nd', 'Lecture', NOW(), NOW()),
('IT 324', 'Event Driven Programming - Lab', 1, '3rd', '2nd', 'Laboratory', NOW(), NOW()),

-- 3rd Year, Summer (6 units)
('CAP 1', 'Capstone Project 1 - Lec', 2, '3rd', 'Summer', 'Lecture', NOW(), NOW()),
('CAP 1', 'Capstone Project 1 - Lab', 1, '3rd', 'Summer', 'Laboratory', NOW(), NOW()),
('IT 330', 'Information Assurance & Security 2 - Lec', 2, '3rd', 'Summer', 'Lecture', NOW(), NOW()),
('IT 330', 'Information Assurance & Security 2 - Lab', 1, '3rd', 'Summer', 'Laboratory', NOW(), NOW()),

-- =====================================================
-- FOURTH YEAR
-- =====================================================
-- 4th Year, 1st Semester (12 units)
('IT 410', 'Systems Integration & Architecture 2 - Lec', 2, '4th', '1st', 'Lecture', NOW(), NOW()),
('IT 410', 'Systems Integration & Architecture 2 - Lab', 1, '4th', '1st', 'Laboratory', NOW(), NOW()),
('IT 411', 'Systems Administration & Maintenance - Lec', 2, '4th', '1st', 'Lecture', NOW(), NOW()),
('IT 411', 'Systems Administration & Maintenance - Lab', 1, '4th', '1st', 'Laboratory', NOW(), NOW()),
('IT 412', 'Applications Dev\'t & Emerging Tech 2 - Lec', 2, '4th', '1st', 'Lecture', NOW(), NOW()),
('IT 412', 'Applications Dev\'t & Emerging Tech 2 - Lab', 1, '4th', '1st', 'Laboratory', NOW(), NOW()),
('CAP 2', 'Capstone Project 2 - Lec', 2, '4th', '1st', 'Lecture', NOW(), NOW()),
('CAP 2', 'Capstone Project 2 - Lab', 1, '4th', '1st', 'Laboratory', NOW(), NOW()),

-- 4th Year, 2nd Semester (9 units)
('IT 420', 'IT Seminars & Tours', 3, '4th', '2nd', 'Lecture', NOW(), NOW()),
('OJT', 'Practicum (500 Hours of On-the-Job Training)', 6, '4th', '2nd', 'Lecture', NOW(), NOW());

-- =====================================================
-- 6. INSERT COMPLETE BSIT SCHEDULE DATA
-- =====================================================
INSERT INTO schedules (curriculumId, schoolYear, semester, yearLevel, day, startTime, endTime, room, instructor) VALUES
-- =====================================================
-- FIRST YEAR SCHEDULES
-- =====================================================
-- 1st Year, 1st Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'FIL 1' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'TTH', '17:00:00', '18:30:00', '314', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 110' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '1st', 'TTH', '09:30:00', '10:30:00', '314', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 110' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '1st', 'MW', '10:30:00', '12:00:00', 'CL-1', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 111' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '1st', 'TTH', '08:00:00', '09:00:00', '309', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 111' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '1st', 'TTH', '09:00:00', '10:30:00', 'CL-1', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 112' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '1st', 'F', '10:00:00', '12:00:00', '309', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 112' AND yearLevel = '1st' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '1st', 'TTH', '10:30:00', '12:00:00', 'CL-1', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'MATHWORLD' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'TTH', '13:00:00', '14:30:00', '309', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'NSTP 1' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'F', '13:00:00', '16:00:00', '314', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'PATHFIT 1' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'F', '08:00:00', '10:00:00', 'Kinetics', 'Prof. Reyes'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'UTS' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'TTH', '14:30:00', '16:00:00', '309', 'Prof. Torres'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'MATHPREP' AND yearLevel = '1st' AND semester = '1st'), '2025-2026', '1st', '1st', 'MW', '13:00:00', '14:30:00', '307', 'Prof. Fernandez'),

-- 1st Year, 2nd Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 120' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'MW', '08:00:00', '09:30:00', '309', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 121' AND yearLevel = '1st' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '1st', 'TTH', '09:00:00', '10:00:00', '314', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 121' AND yearLevel = '1st' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '1st', 'TTH', '10:00:00', '11:30:00', 'CL-1', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'PURCOM' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'MW', '10:00:00', '11:30:00', '314', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'FIL 2' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'TTH', '11:00:00', '12:30:00', '309', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'HIST' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'MW', '14:00:00', '15:30:00', '307', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'PATHFIT 2' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'F', '08:00:00', '10:00:00', 'Kinetics', 'Prof. Reyes'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'NSTP 2' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'F', '13:00:00', '16:00:00', '314', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ETHICS' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'TTH', '16:00:00', '17:30:00', '308', 'Prof. Torres'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'STS' AND yearLevel = '1st' AND semester = '2nd'), '2025-2026', '2nd', '1st', 'MW', '16:00:00', '17:30:00', '320', 'Prof. Fernandez'),

-- 1st Year, Summer Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 130' AND yearLevel = '1st' AND semester = 'Summer'), '2025-2026', 'Summer', '1st', 'MTWTHF', '08:00:00', '11:00:00', '314', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 131' AND yearLevel = '1st' AND semester = 'Summer' AND courseType = 'Lecture'), '2025-2026', 'Summer', '1st', 'MTWTHF', '13:00:00', '15:00:00', '309', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 131' AND yearLevel = '1st' AND semester = 'Summer' AND courseType = 'Laboratory'), '2025-2026', 'Summer', '1st', 'MTWTHF', '15:00:00', '17:00:00', 'CL-1', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 132' AND yearLevel = '1st' AND semester = 'Summer'), '2025-2026', 'Summer', '1st', 'MTWTHF', '17:00:00', '20:00:00', '308', 'Prof. Martinez'),

-- =====================================================
-- SECOND YEAR SCHEDULES
-- =====================================================
-- 2nd Year, 1st Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 210' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '2nd', 'T', '08:30:00', '10:30:00', '307', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 210' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '2nd', 'MW', '10:30:00', '12:00:00', 'CL-2', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 211' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '2nd', 'T', '13:30:00', '15:30:00', 'CL-1', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 211' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '2nd', 'THF', '18:00:00', '19:30:00', 'CL-1', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 212' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '2nd', 'MW', '08:00:00', '09:00:00', '305', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 212' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '2nd', 'MW', '09:00:00', '10:30:00', 'CL-2', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 213' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '2nd', 'TH', '14:30:00', '16:30:00', 'CL-1', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 213' AND yearLevel = '2nd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '2nd', 'TTH', '10:30:00', '12:00:00', 'CL-2', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ARTAPP' AND yearLevel = '2nd' AND semester = '1st'), '2025-2026', '1st', '2nd', 'TH', '09:00:00', '10:30:00', '307', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'CW' AND yearLevel = '2nd' AND semester = '1st'), '2025-2026', '1st', '2nd', 'T', '18:00:00', '19:30:00', '308', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'PATHFIT 3' AND yearLevel = '2nd' AND semester = '1st'), '2025-2026', '1st', '2nd', 'S', '10:00:00', '12:00:00', 'Kinetics', 'Prof. Reyes'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'STAT' AND yearLevel = '2nd' AND semester = '1st'), '2025-2026', '1st', '2nd', 'TTH', '16:30:00', '18:00:00', '320', 'Prof. Torres'),

-- 2nd Year, 2nd Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 220' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '2nd', 'MW', '08:00:00', '09:00:00', '307', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 220' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '2nd', 'MW', '09:00:00', '10:30:00', 'CL-1', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 221' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '2nd', 'TTH', '08:00:00', '09:00:00', '308', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 221' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '2nd', 'TTH', '09:00:00', '10:30:00', 'CL-2', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 222' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '2nd', 'MW', '10:30:00', '11:30:00', '309', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 222' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '2nd', 'MW', '11:30:00', '13:00:00', 'CL-1', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 223' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '2nd', 'TTH', '10:30:00', '11:30:00', '310', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 223' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '2nd', 'TTH', '11:30:00', '13:00:00', 'CL-2', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 224' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Lecture'), '2025-2026', '2nd', '2nd', 'MW', '13:00:00', '14:00:00', '311', 'Prof. Torres'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 224' AND yearLevel = '2nd' AND semester = '2nd' AND courseType = 'Laboratory'), '2025-2026', '2nd', '2nd', 'MW', '14:00:00', '15:30:00', 'CL-1', 'Prof. Torres'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'PATHFIT 4' AND yearLevel = '2nd' AND semester = '2nd'), '2025-2026', '2nd', '2nd', 'F', '08:00:00', '10:00:00', 'Kinetics', 'Prof. Reyes'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'RIZAL' AND yearLevel = '2nd' AND semester = '2nd'), '2025-2026', '2nd', '2nd', 'TTH', '16:00:00', '17:30:00', '312', 'Prof. Santos'),

-- 2nd Year, Summer Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 230' AND yearLevel = '2nd' AND semester = 'Summer'), '2025-2026', 'Summer', '2nd', 'MTWTHF', '08:00:00', '11:00:00', '314', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'TECHNO' AND yearLevel = '2nd' AND semester = 'Summer'), '2025-2026', 'Summer', '2nd', 'MTWTHF', '13:00:00', '16:00:00', '309', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'FILIT' AND yearLevel = '2nd' AND semester = 'Summer'), '2025-2026', 'Summer', '2nd', 'MTWTHF', '16:00:00', '19:00:00', '308', 'Prof. Martinez'),

-- =====================================================
-- THIRD YEAR SCHEDULES
-- =====================================================
-- 3rd Year, 1st Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 310' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'MW', '08:00:00', '09:00:00', '307', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 310' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'MW', '09:00:00', '10:30:00', 'CL-1', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 311' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'MW', '17:00:00', '18:00:00', 'CL-2', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 311' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'MW', '18:00:00', '19:30:00', 'CL-2', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 312' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'TTH', '08:00:00', '09:00:00', '308', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 312' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'TTH', '09:00:00', '10:30:00', 'CL-2', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITELEC1' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'T', '11:00:00', '13:00:00', '312', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITELEC1' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'MW', '12:00:00', '13:30:00', 'CL-2', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITTEL2' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'MW', '14:00:00', '15:00:00', 'CL-2', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITTEL2' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'MW', '15:00:00', '16:30:00', 'CL-2', 'Prof. Lopez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'STAT' AND yearLevel = '3rd' AND semester = '1st'), '2025-2026', '1st', '3rd', 'TTH', '15:00:00', '16:30:00', '324', 'Prof. Cruz'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'TECHNO' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '3rd', 'TH', '18:00:00', '20:00:00', '308', 'Prof. Reyes'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'TECHNO' AND yearLevel = '3rd' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '3rd', 'MW', '19:30:00', '21:00:00', 'CL-2', 'Prof. Reyes');

-- =====================================================
-- 9. INSERT BSIT SCHEDULE DATA (4th Year, 1st Semester)
-- =====================================================
INSERT INTO schedules (curriculumId, schoolYear, semester, yearLevel, day, startTime, endTime, room, instructor) VALUES
-- 4th Year, 1st Semester Schedules
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 410' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '4th', 'W', '13:30:00', '15:30:00', 'CL-1', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 410' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '4th', 'TTH', '13:00:00', '14:30:00', 'CL-2', 'Prof. Santos'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 411' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '4th', 'F', '08:00:00', '10:00:00', '307', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 411' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '4th', 'F', '13:00:00', '16:00:00', 'CL-2', 'Prof. Garcia'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 412' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '4th', 'F', '10:00:00', '12:00:00', '307', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'IT 412' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '4th', 'F', '16:30:00', '19:30:00', 'CL-2', 'Prof. Rodriguez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITELEC3' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Lecture'), '2025-2026', '1st', '4th', 'W', '16:00:00', '18:00:00', '307', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'ITELEC3' AND yearLevel = '4th' AND semester = '1st' AND courseType = 'Laboratory'), '2025-2026', '1st', '4th', 'T', '16:30:00', '19:30:00', 'CL-1', 'Prof. Martinez'),
((SELECT id FROM bsit_curriculum WHERE courseCode = 'RIZAL' AND yearLevel = '4th' AND semester = '1st'), '2025-2026', '1st', '4th', 'TTH', '14:30:00', '16:00:00', '308', 'Prof. Lopez');

-- =====================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_student_registrations_userId ON student_registrations(userId);
CREATE INDEX IF NOT EXISTS idx_student_registrations_yearLevel ON student_registrations(yearLevel);
CREATE INDEX IF NOT EXISTS idx_student_registrations_semester ON student_registrations(semester);
CREATE INDEX IF NOT EXISTS idx_student_registrations_schoolYear ON student_registrations(schoolYear);

CREATE INDEX IF NOT EXISTS idx_bsit_curriculum_yearLevel ON bsit_curriculum(yearLevel);
CREATE INDEX IF NOT EXISTS idx_bsit_curriculum_semester ON bsit_curriculum(semester);
CREATE INDEX IF NOT EXISTS idx_bsit_curriculum_courseCode ON bsit_curriculum(courseCode);

CREATE INDEX IF NOT EXISTS idx_schedules_yearLevel ON schedules(yearLevel);
CREATE INDEX IF NOT EXISTS idx_schedules_semester ON schedules(semester);
CREATE INDEX IF NOT EXISTS idx_schedules_schoolYear ON schedules(schoolYear);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_studentId ON student_enrollments(studentId);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_scheduleId ON student_enrollments(scheduleId);

-- =====================================================
-- 11. VERIFICATION QUERIES
-- =====================================================
-- Check total courses per year level
SELECT 
    yearLevel, 
    semester, 
    COUNT(*) as totalCourses,
    SUM(units) as totalUnits
FROM bsit_curriculum 
GROUP BY yearLevel, semester 
ORDER BY yearLevel, semester;

-- Check total schedules per year level
SELECT 
    yearLevel, 
    semester, 
    COUNT(*) as totalSchedules
FROM schedules 
WHERE schoolYear = '2025-2026'
GROUP BY yearLevel, semester 
ORDER BY yearLevel, semester;

-- Check sample schedule for 1st Year
SELECT 
    c.courseCode,
    c.courseDescription,
    c.units,
    s.day,
    s.startTime,
    s.endTime,
    s.room,
    s.instructor
FROM schedules s
JOIN bsit_curriculum c ON s.curriculumId = c.id
WHERE s.yearLevel = '1st' 
    AND s.semester = '1st' 
    AND s.schoolYear = '2025-2026'
ORDER BY s.day, s.startTime;
