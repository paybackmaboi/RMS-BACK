const mysql = require('mysql2/promise');
require('dotenv').config();

const testDatabaseFix = async () => {
    let connection;
    
    try {
        console.log('🔌 Testing database connection...');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306')
        });

        console.log('✅ Database connection successful');

        // Check if departments table exists and has key issues
        try {
            const [tables] = await connection.execute(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'departments'
            `, [process.env.DB_NAME]);

            if (tables.length > 0) {
                console.log('📋 Departments table exists, checking key count...');
                
                const [keyCount] = await connection.execute(`
                    SELECT COUNT(*) as key_count 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'departments'
                `, [process.env.DB_NAME]);

                console.log(`🔑 Current key count: ${keyCount[0].key_count}`);

                if (keyCount[0].key_count > 60) {
                    console.log('⚠️  Too many keys detected! Running fix...');
                    
                    // Drop and recreate with minimal keys
                    await connection.execute('DROP TABLE IF EXISTS departments');
                    
                    await connection.execute(`
                        CREATE TABLE departments (
                            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                            code VARCHAR(10) NOT NULL,
                            name VARCHAR(100) NOT NULL,
                            description TEXT NULL,
                            isActive BOOLEAN NOT NULL DEFAULT TRUE,
                            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            UNIQUE KEY unique_code (code)
                        )
                    `);

                    // Insert basic data
                    await connection.execute(`
                        INSERT INTO departments (code, name, description, isActive) VALUES
                        ('IT', 'Information Technology', 'Department of Information Technology', TRUE),
                        ('CS', 'Computer Science', 'Department of Computer Science', TRUE),
                        ('IS', 'Information Systems', 'Department of Information Systems', TRUE)
                    `);

                    console.log('✅ Departments table fixed successfully');
                } else {
                    console.log('✅ Key count is acceptable');
                }
            } else {
                console.log('📋 Departments table does not exist, will be created by Sequelize');
            }

        } catch (error) {
            console.log('📋 Departments table does not exist, will be created by Sequelize');
        }

        console.log('🎉 Database test completed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the test if this script is executed directly
if (require.main === module) {
    testDatabaseFix()
        .then(() => {
            console.log('✅ Database fix test completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database fix test failed:', error);
            process.exit(1);
        });
}

module.exports = { testDatabaseFix };
