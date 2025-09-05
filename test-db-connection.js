const { connectAndInitialize } = require('./dist/database');

async function testConnection() {
    try {
        console.log('🔌 Testing database connection...');
        await connectAndInitialize();
        console.log('✅ Database connection test successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection test failed:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
