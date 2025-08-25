# 🗄️ Database Setup for Simplified Student Registration

This guide will help you set up your database for the new simplified student registration system.

## 🚀 Quick Start

### Option 1: Automatic Migration (Recommended)
```bash
# Run the migration script
npm run migrate
```

### Option 2: Manual SQL Execution
```bash
# Connect to your MySQL database and run:
source database-setup.sql
```

## 📋 Prerequisites

1. **MySQL Database** running and accessible
2. **Environment Variables** configured in `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```
3. **Node.js** and **npm** installed

## 🔧 Step-by-Step Setup

### Step 1: Verify Environment Variables
Make sure your `.env` file contains the correct database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=registrar_db
```

### Step 2: Run Database Migration
```bash
cd REGISTRAR-BACK
npm run migrate
```

### Step 3: Verify Setup
The migration script will:
- ✅ Create `users` table (if not exists)
- ✅ Create `students` table (if not exists)
- ✅ Create performance indexes
- ✅ Create sample admin user (A001/adminpass)
- ✅ Create sample student user (2022-00037/password)

## 📊 Database Structure

### Users Table
```sql
users (
    id (Primary Key)
    idNumber (School ID - e.g., "2022-00037")
    password (Hashed)
    role (student/admin/accounting)
    firstName
    lastName
    middleName (optional)
    email (optional)
    phoneNumber (optional)
    isActive
    timestamps
)
```

### Students Table
```sql
students (
    id (Primary Key)
    userId (Foreign Key to users.id)
    courseId (optional - set during enrollment)
    studentNumber (same as School ID)
    fullName (generated from firstName + lastName)
    
    -- All other fields are OPTIONAL and will be filled later:
    gender, maritalStatus, dateOfBirth, placeOfBirth,
    contactNumber, religion, citizenship, country,
    cityAddress, provincialAddress,
    fatherName, motherName, guardianName,
    elementarySchool, juniorHighSchool, seniorHighSchool,
    academicStatus, currentYearLevel, currentSemester,
    totalUnitsEarned, cumulativeGPA
)
```

## 🧪 Testing the System

### 1. Test Registration
- Go to your frontend registration page
- Try registering with School ID: "2022-00037"
- Use First Name: "Test" and Last Name: "Student"
- Set password: "testpass123"

### 2. Test Login
- Go to login page
- Use School ID: "2022-00037"
- Password: "testpass123"
- Should redirect to student dashboard

### 3. Test Admin Login
- Use School ID: "A001"
- Password: "adminpass"
- Should access admin dashboard

## 🔍 Troubleshooting

### Common Issues

#### 1. "Connection refused" Error
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if stopped
sudo systemctl start mysql
```

#### 2. "Access denied" Error
```bash
# Check your database credentials in .env file
# Make sure the user has proper permissions
```

#### 3. "Table already exists" Warning
```bash
# This is normal - the script uses CREATE TABLE IF NOT EXISTS
# Your existing data will be preserved
```

#### 4. Migration Script Fails
```bash
# Check the error message
# Common issues:
# - Database doesn't exist
# - Wrong credentials
# - Insufficient permissions
```

### Manual Database Creation
If the migration script fails, you can manually create the database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS registrar_db;

-- Use the database
USE registrar_db;

-- Run the setup script
source database-setup.sql;
```

## 📝 Sample Data

After successful migration, you'll have:

### Sample Admin User
- **School ID**: A001
- **Password**: adminpass
- **Role**: admin
- **Name**: Admin User

### Sample Student User
- **School ID**: 2022-00037
- **Password**: password
- **Role**: student
- **Name**: John Doe

## 🔐 Security Notes

1. **Change default passwords** after first login
2. **School ID format** is enforced: YYYY-XXXXX (e.g., 2022-00037)
3. **Password hashing** is handled automatically by bcrypt
4. **Foreign key constraints** ensure data integrity

## 📱 Frontend Integration

The simplified registration form will:
1. **Validate School ID format** (YYYY-XXXXX)
2. **Send minimal data** to backend
3. **Create user account** immediately
4. **Allow immediate login** with School ID and password

## 🎯 What Happens During Registration

1. **Student fills form** with School ID, First Name, Last Name, Password
2. **Backend validates** School ID format
3. **Creates user record** in `users` table
4. **Creates student record** in `students` table (minimal data)
5. **Returns success** message
6. **Student can login** immediately

## 🚀 Next Steps

After successful database setup:

1. **Start your backend server**:
   ```bash
   npm run dev
   ```

2. **Test the registration system**:
   - Try registering with a new School ID
   - Verify login works
   - Check database records

3. **Customize as needed**:
   - Modify School ID format if required
   - Add additional validation rules
   - Customize error messages

## 📞 Support

If you encounter issues:

1. **Check the error logs** in the migration script output
2. **Verify database credentials** in your `.env` file
3. **Ensure MySQL is running** and accessible
4. **Check file permissions** for the migration script

---

**🎉 Congratulations!** Your database is now ready for the simplified student registration system. Students can register with just their School ID, First Name, Last Name, and Password, then immediately access the student dashboard!
