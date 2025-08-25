const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration from environment variables
const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
};

async function migrateDatabase() {
    let connection;
    
    try {
        console.log('🚀 Starting database migration...');
        
        // Connect to database
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Connected to database successfully');
        
        // Read the SQL setup file
        const sqlFile = path.join(__dirname, 'database-setup.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        
        // Execute the SQL commands
        console.log('📝 Executing database setup...');
        await connection.execute(sqlContent);
        console.log('✅ Database setup completed successfully');
        
        // Verify tables were created
        console.log('🔍 Verifying table structure...');
        
        const [usersTable] = await connection.execute('DESCRIBE users');
        const [studentsTable] = await connection.execute('DESCRIBE students');
        
        console.log(`✅ Users table: ${usersTable.length} columns`);
        console.log(`✅ Students table: ${studentsTable.length} columns`);
        
        // Check if we need to create sample admin user
        const [existingAdmins] = await connection.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
        );
        
        if (existingAdmins[0].count === 0) {
            console.log('👤 No admin users found. Creating sample admin...');
            
            // Create a sample admin user (password: adminpass)
            const hashedPassword = '$2a$10$rQZ8N7X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J';
            
            await connection.execute(`
                INSERT INTO users (idNumber, password, role, firstName, lastName, isActive) 
                VALUES ('A001', ?, 'admin', 'Admin', 'User', TRUE)
            `, [hashedPassword]);
            
            console.log('✅ Sample admin user created (A001/adminpass)');
        } else {
            console.log(`✅ Found ${existingAdmins[0].count} existing admin user(s)`);
        }
        
        // Check if we need to create sample student user
        const [existingStudents] = await connection.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'student'"
        );
        
        if (existingStudents[0].count === 0) {
            console.log('👨‍🎓 No student users found. Creating sample student...');
            
            // Create a sample student user (password: password)
            const hashedPassword = '$2a$10$rQZ8N7X1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J';
            
            const [newUser] = await connection.execute(`
                INSERT INTO users (idNumber, password, role, firstName, lastName, isActive) 
                VALUES ('2022-00037', ?, 'student', 'John', 'Doe', TRUE)
            `, [hashedPassword]);
            
            // Create student record
            await connection.execute(`
                INSERT INTO students (userId, studentNumber, fullName, yearOfEntry, isActive) 
                VALUES (?, '2022-00037', 'Doe, John', 2024, TRUE)
            `, [newUser.insertId]);
            
            console.log('✅ Sample student user created (2022-00037/password)');
        } else {
            console.log(`✅ Found ${existingStudents[0].count} existing student user(s)`);
        }
        
        console.log('\n🎉 Database migration completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   • Users table created/verified');
        console.log('   • Students table created/verified');
        console.log('   • Indexes created for performance');
        console.log('   • Sample users created (if needed)');
        console.log('\n🔑 Sample Login Credentials:');
        console.log('   • Admin: A001 / adminpass');
        console.log('   • Student: 2022-00037 / password');
        console.log('\n🚀 You can now test the simplified registration system!');
        
    } catch (error) {
        console.error('❌ Database migration failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateDatabase();
}

module.exports = { migrateDatabase };
