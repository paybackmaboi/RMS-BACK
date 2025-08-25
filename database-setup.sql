-- Database Setup for Simplified Student Registration System
-- This file contains all the necessary SQL commands to set up your database

-- =====================================================
-- 1. CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idNumber VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'accounting') NOT NULL DEFAULT 'student',
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    middleName VARCHAR(50) NULL,
    email VARCHAR(100) NULL,
    phoneNumber VARCHAR(20) NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. CREATE STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userId INT UNSIGNED NOT NULL,
    courseId INT UNSIGNED NULL,
    studentNumber VARCHAR(20) NOT NULL UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    
    -- Personal Data (Optional - will be filled later)
    gender VARCHAR(10) NULL,
    maritalStatus VARCHAR(20) NULL,
    dateOfBirth DATE NULL,
    placeOfBirth VARCHAR(100) NULL,
    contactNumber VARCHAR(20) NULL,
    religion VARCHAR(50) NULL,
    citizenship VARCHAR(50) NULL DEFAULT 'Filipino',
    country VARCHAR(50) NULL DEFAULT 'Philippines',
    acrNumber VARCHAR(50) NULL,
    
    -- Address (Optional - will be filled later)
    cityAddress TEXT NULL,
    cityTelNumber VARCHAR(20) NULL,
    provincialAddress TEXT NULL,
    provincialTelNumber VARCHAR(20) NULL,
    
    -- Family Background (Optional - will be filled later)
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
    
    -- Academic Background
    major VARCHAR(100) NULL,
    studentType ENUM('First', 'Second', 'Summer') NOT NULL DEFAULT 'First',
    semesterEntry ENUM('First', 'Second', 'Summer') NOT NULL DEFAULT 'First',
    yearOfEntry INT NOT NULL,
    estimatedYearOfGraduation INT NULL,
    applicationType ENUM('Freshmen', 'Transferee', 'Cross Enrollee') NOT NULL DEFAULT 'Freshmen',
    
    -- Academic History (Optional - will be filled later)
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
    seniorHighStrand VARCHAR(100) NULL,
    seniorHighHonor VARCHAR(100) NULL,
    seniorHighYearGraduated INT NULL,
    ncaeGrade VARCHAR(20) NULL,
    specialization VARCHAR(100) NULL,
    lastCollegeAttended VARCHAR(100) NULL,
    lastCollegeYearTaken INT NULL,
    lastCollegeCourse VARCHAR(100) NULL,
    lastCollegeMajor VARCHAR(100) NULL,
    
    -- Academic Status
    academicStatus ENUM('Regular', 'Irregular', 'Probationary', 'Graduated', 'Dropped') NOT NULL DEFAULT 'Regular',
    currentYearLevel INT NOT NULL DEFAULT 1,
    currentSemester INT NOT NULL DEFAULT 1,
    totalUnitsEarned INT NOT NULL DEFAULT 0,
    cumulativeGPA DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_idNumber ON users(idNumber);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users(isActive);

CREATE INDEX IF NOT EXISTS idx_students_userId ON students(userId);
CREATE INDEX IF NOT EXISTS idx_students_studentNumber ON students(studentNumber);
CREATE INDEX IF NOT EXISTS idx_students_courseId ON students(courseId);
CREATE INDEX IF NOT EXISTS idx_students_isActive ON students(isActive);

-- =====================================================
-- 4. ADD DATA VALIDATION CONSTRAINTS
-- =====================================================
-- Note: MySQL doesn't support CHECK constraints in older versions
-- These are handled at the application level in our Node.js code

-- =====================================================
-- 5. INSERT SAMPLE ADMIN USER (if needed)
-- =====================================================
-- Uncomment and modify these lines if you need to create admin users
-- INSERT INTO users (idNumber, password, role, firstName, lastName, isActive) VALUES
-- ('A001', '$2a$10$hashedpassword...', 'admin', 'Admin', 'User', TRUE);

-- =====================================================
-- 6. VERIFY TABLE STRUCTURE
-- =====================================================
-- Run these commands to verify your tables were created correctly:
-- DESCRIBE users;
-- DESCRIBE students;
-- SHOW INDEX FROM users;
-- SHOW INDEX FROM students;

-- User Sessions Table for Authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    sessionToken VARCHAR(255) NOT NULL UNIQUE,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (sessionToken),
    INDEX idx_user_id (userId),
    INDEX idx_expires_at (expiresAt)
);

-- Sample session data (optional - for testing)
-- INSERT INTO user_sessions (userId, sessionToken, expiresAt) VALUES 
-- (1, 'test-session-123', DATE_ADD(NOW(), INTERVAL 24 HOUR));
