@echo off
echo 🚀 Setting up Simplified Student Registration System
echo ==================================================

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create a .env file with your database credentials:
    echo.
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo DB_USER=your_username
    echo DB_PASSWORD=your_password
    echo DB_NAME=your_database_name
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ .env file found

REM Check if MySQL is running (basic check)
echo 🔍 Checking MySQL connection...
mysql -u root -p -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot connect to MySQL. Please ensure MySQL is running.
    echo On Windows: Start MySQL service from Services
    echo Or run: net start mysql
    pause
    exit /b 1
)

echo ✅ MySQL is running

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Run database migration
echo 🗄️  Setting up database...
npm run migrate
if errorlevel 1 (
    echo ❌ Database setup failed. Please check the error messages above.
    pause
    exit /b 1
)
echo ✅ Database setup completed

REM Test the system
echo 🧪 Testing registration system...
npm run test-registration
if errorlevel 1 (
    echo ❌ Tests failed. Please check the error messages above.
    pause
    exit /b 1
)
echo ✅ All tests passed

echo.
echo 🎉 Project setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start your backend server: npm run dev
echo 2. Open your frontend in a browser
echo 3. Test registration at: /register
echo 4. Test login at: /login
echo.
echo 🔑 Sample Login Credentials:
echo • Admin: A001 / adminpass
echo • Student: 2022-00037 / password
echo.
echo 🚀 Your simplified student registration system is ready!
pause
