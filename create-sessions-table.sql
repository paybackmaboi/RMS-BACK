-- Create user_sessions table manually to avoid index conflicts
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    sessionToken VARCHAR(255) NOT NULL UNIQUE,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_token (sessionToken),
    INDEX idx_user_id (userId),
    INDEX idx_expires_at (expiresAt)
);

-- Add foreign key constraint if users table exists
-- ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_user 
-- FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
