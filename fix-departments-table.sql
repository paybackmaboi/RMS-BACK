-- Fix departments table to avoid "Too many keys" error
-- This script creates a minimal departments table with only essential indexes

-- Drop the departments table if it exists to start fresh
DROP TABLE IF EXISTS departments;

-- Create departments table with minimal indexes
CREATE TABLE departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Only essential unique constraint on code
    UNIQUE KEY unique_code (code)
);

-- Insert basic department data
INSERT INTO departments (code, name, description, isActive) VALUES
('IT', 'Information Technology', 'Department of Information Technology', TRUE),
('CS', 'Computer Science', 'Department of Computer Science', TRUE),
('IS', 'Information Systems', 'Department of Information Systems', TRUE);

-- Verify the table was created correctly
DESCRIBE departments;
SHOW INDEX FROM departments;
