# Database Key Limit Fix

## Problem
The RMS-BACK service is failing to start with the error:
```
Error: Too many keys specified; max 64 keys allowed
```

This error occurs when MySQL tables have more than 64 indexes/keys, which is the maximum limit for MySQL.

## Root Cause
The issue is caused by Sequelize's `alter: true` option trying to create too many indexes on the `departments` table and other tables. This happens when:
1. Multiple models have foreign key relationships
2. Sequelize tries to create indexes for all relationships
3. The total number of keys exceeds MySQL's 64-key limit

## Solution
We've implemented several fixes:

### 1. Safe Database Sync
- Changed `alter: true` to `alter: false` in database sync
- Added fallback mechanisms for database initialization
- Implemented safe table creation strategies

### 2. Optimized Model Definitions
- Added explicit index definitions to models
- Removed unnecessary unique constraints
- Limited indexes to only essential ones

### 3. Database Fix Scripts
- `fix-database-keys.js` - Main fix script
- `test-db-fix.js` - Test script to verify fixes
- `fix-departments-table.sql` - SQL script for manual fix

## How to Fix

### Option 1: Automatic Fix (Recommended)
```bash
# Run the database key fix script
npm run fix-db-keys

# Test the fix
npm run test-db-fix

# Start the server
npm start
```

### Option 2: Manual Fix
1. Connect to your MySQL database
2. Run the SQL script:
```sql
-- Drop and recreate departments table with minimal indexes
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_code (code)
);

-- Insert basic data
INSERT INTO departments (code, name, description, isActive) VALUES
('IT', 'Information Technology', 'Department of Information Technology', TRUE),
('CS', 'Computer Science', 'Department of Computer Science', TRUE),
('IS', 'Information Systems', 'Department of Information Systems', TRUE);
```

### Option 3: Production Deployment
The production startup script (`start-production.js`) now automatically runs the database fix before starting the server.

## Prevention
To prevent this issue in the future:
1. Always use `alter: false` in production
2. Define explicit indexes in models
3. Avoid creating too many foreign key relationships
4. Monitor key count with: `SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'your_database'`

## Verification
After applying the fix, verify it worked by:
1. Checking the server starts without errors
2. Running `npm run test-db-fix`
3. Checking the logs for "Database key fix completed successfully"

## Files Modified
- `src/database.ts` - Updated sync strategy
- `src/models/Department.ts` - Optimized indexes
- `src/models/Course.ts` - Optimized indexes  
- `src/models/User.ts` - Optimized indexes
- `start-production.js` - Added automatic fix
- `package.json` - Added fix scripts
