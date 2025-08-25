#!/bin/bash

echo "🚀 Setting up Simplified Student Registration System"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your database credentials:"
    echo ""
    echo "DB_HOST=localhost"
    echo "DB_PORT=3306"
    echo "DB_USER=your_username"
    echo "DB_PASSWORD=your_password"
    echo "DB_NAME=your_database_name"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ .env file found"

# Check if MySQL is running
echo "🔍 Checking MySQL connection..."
if ! mysql -u root -p -e "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Cannot connect to MySQL. Please ensure MySQL is running."
    echo "On Ubuntu/Debian: sudo systemctl start mysql"
    echo "On macOS: brew services start mysql"
    echo "On Windows: Start MySQL service from Services"
    exit 1
fi

echo "✅ MySQL is running"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Run database migration
echo "🗄️  Setting up database..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed"
else
    echo "❌ Database setup failed. Please check the error messages above."
    exit 1
fi

# Test the system
echo "🧪 Testing registration system..."
npm run test-registration

if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Project setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start your backend server: npm run dev"
echo "2. Open your frontend in a browser"
echo "3. Test registration at: /register"
echo "4. Test login at: /login"
echo ""
echo "🔑 Sample Login Credentials:"
echo "• Admin: A001 / adminpass"
echo "• Student: 2022-00037 / password"
echo ""
echo "🚀 Your simplified student registration system is ready!"
