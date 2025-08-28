const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabaseSchema() {
    let connection;
    
    try {
        console.log('🔧 Updating database schema for requirements announcements...');
        
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'rms_db'
        });
        
        console.log('✅ Connected to database');
        
        // Check if notifications table exists
        const [tables] = await connection.execute('SHOW TABLES LIKE "notifications"');
        if (tables.length === 0) {
            console.log('❌ Notifications table does not exist. Creating it...');
            
            // Create notifications table with new schema
            await connection.execute(`
                CREATE TABLE notifications (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    userId INT UNSIGNED NOT NULL,
                    message TEXT NOT NULL,
                    isRead BOOLEAN DEFAULT FALSE,
                    requestId INT UNSIGNED NULL,
                    type VARCHAR(50) NULL DEFAULT 'request',
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_userId (userId),
                    INDEX idx_type (type),
                    INDEX idx_user_type (userId, type)
                )
            `);
            
            console.log('✅ Created notifications table with new schema');
        } else {
            console.log('✅ Notifications table exists. Checking current schema...');
            
            // Check if type column exists
            const [columns] = await connection.execute('SHOW COLUMNS FROM notifications LIKE "type"');
            if (columns.length === 0) {
                console.log('➕ Adding type column...');
                await connection.execute('ALTER TABLE notifications ADD COLUMN type VARCHAR(50) NULL DEFAULT "request"');
                console.log('✅ Added type column');
            } else {
                console.log('✅ Type column already exists');
            }
            
            // Check if requestId is nullable
            const [requestIdColumn] = await connection.execute('SHOW COLUMNS FROM notifications LIKE "requestId"');
            if (requestIdColumn.length > 0 && requestIdColumn[0].Null === 'NO') {
                console.log('🔧 Making requestId nullable...');
                await connection.execute('ALTER TABLE notifications MODIFY COLUMN requestId INT UNSIGNED NULL');
                console.log('✅ Made requestId nullable');
            } else {
                console.log('✅ requestId is already nullable');
            }
            
            // Add indexes if they don't exist
            try {
                await connection.execute('CREATE INDEX idx_notifications_type ON notifications(type)');
                console.log('✅ Added type index');
            } catch (error) {
                if (error.message.includes('Duplicate key name')) {
                    console.log('✅ Type index already exists');
                } else {
                    throw error;
                }
            }
            
            try {
                await connection.execute('CREATE INDEX idx_notifications_user_type ON notifications(userId, type)');
                console.log('✅ Added user_type index');
            } catch (error) {
                if (error.message.includes('Duplicate key name')) {
                    console.log('✅ User_type index already exists');
                } else {
                    throw error;
                }
            }
        }
        
        // Update existing notifications to have the default type
        const [result] = await connection.execute('UPDATE notifications SET type = "request" WHERE type IS NULL');
        console.log(`✅ Updated ${result.affectedRows} existing notifications with default type`);
        
        // Show final table structure
        const [finalColumns] = await connection.execute('DESCRIBE notifications');
        console.log('\n📋 Final notifications table structure:');
        finalColumns.forEach(col => {
            console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });
        
        console.log('\n🎉 Database schema updated successfully!');
        console.log('💡 You can now restart the backend server to test the requirements announcements system.');
        
    } catch (error) {
        console.error('❌ Error updating database schema:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.error('💡 Make sure MySQL server is running');
        } else if (error.message.includes('Access denied')) {
            console.error('💡 Check your database credentials in .env file');
        } else if (error.message.includes('Unknown database')) {
            console.error('💡 Make sure the database exists');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the update
updateDatabaseSchema();
