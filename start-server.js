const { connectAndInitialize } = require('./src/database');

async function testDatabaseConnection() {
    try {
        console.log('🧪 Testing Database Connection...\n');
        
        // Test database connection and model sync
        await connectAndInitialize();
        
        console.log('\n🎉 Database connection and model sync successful!');
        console.log('✅ All tables created/verified automatically');
        console.log('✅ Sample users created');
        console.log('\n🚀 You can now start your server with: npm run dev');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Please check your .env file and MySQL connection');
        process.exit(1);
    }
}

// Run the test
testDatabaseConnection();
