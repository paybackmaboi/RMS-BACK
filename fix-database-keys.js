const mysql = require('mysql2/promise');
require('dotenv').config();

const fixDatabaseKeys = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        console.log('🔧 Fixing database key issues...');

        // Check current key count for departments table
        const [keyCount] = await connection.execute(`
            SELECT COUNT(*) as key_count 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'departments'
        `, [process.env.DB_NAME]);

        console.log(`Current key count for departments table: ${keyCount[0].key_count}`);

        if (keyCount[0].key_count > 60) {
            console.log('⚠️  Too many keys detected, recreating departments table...');
            
            // Drop and recreate departments table with minimal indexes
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

            console.log('✅ Departments table recreated successfully');
        }

        // Check other tables for key count issues
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME, COUNT(*) as key_count 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? 
            GROUP BY TABLE_NAME 
            HAVING key_count > 60
            ORDER BY key_count DESC
        `, [process.env.DB_NAME]);

        if (tables.length > 0) {
            console.log('⚠️  Tables with high key count:');
            tables.forEach(table => {
                console.log(`   ${table.TABLE_NAME}: ${table.key_count} keys`);
            });
        } else {
            console.log('✅ All tables have acceptable key counts');
        }

        console.log('🎉 Database key fix completed successfully!');

    } catch (error) {
        console.error('❌ Error fixing database keys:', error);
        throw error;
    } finally {
        await connection.end();
    }
};

// Run the fix if this script is executed directly
if (require.main === module) {
    fixDatabaseKeys()
        .then(() => {
            console.log('✅ Database fix completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database fix failed:', error);
            process.exit(1);
        });
}

module.exports = { fixDatabaseKeys };
