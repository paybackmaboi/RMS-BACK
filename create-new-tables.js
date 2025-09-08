const mysql = require('mysql2/promise');

async function createNewTables() {
    let connection;
    
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'test_db'
        });

        console.log('Connected to MySQL database');

        // Check users table structure
        const [usersStructure] = await connection.execute('DESCRIBE users');
        console.log('Users table structure:', usersStructure);

        // Create settings table
        const createSettingsTableSQL = `
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                \`key\` VARCHAR(100) NOT NULL UNIQUE,
                value TEXT NOT NULL,
                description TEXT NULL,
                category VARCHAR(50) NOT NULL DEFAULT 'general',
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_key (\`key\`),
                INDEX idx_category (category)
            )
        `;

        await connection.execute(createSettingsTableSQL);
        console.log('✅ Settings table created successfully');

        // Create activity_logs table
        const createActivityLogsTableSQL = `
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT UNSIGNED NOT NULL,
                action VARCHAR(100) NOT NULL,
                description TEXT NULL,
                ipAddress VARCHAR(45) NULL,
                userAgent TEXT NULL,
                metadata TEXT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (userId),
                INDEX idx_action (action),
                INDEX idx_created_at (createdAt),
                INDEX idx_user_created (userId, createdAt)
            )
        `;

        await connection.execute(createActivityLogsTableSQL);
        console.log('✅ Activity logs table created successfully');

        // Insert default settings
        const defaultSettings = [
            {
                key: 'login_title',
                value: '🔐 Welcome Back',
                description: 'Title displayed on the login form',
                category: 'ui'
            },
            {
                key: 'login_subtitle',
                value: 'Sign in to your account with your ID and password',
                description: 'Subtitle displayed on the login form',
                category: 'ui'
            },
            {
                key: 'system_name',
                value: 'Student Records Management System',
                description: 'Name of the system displayed in various places',
                category: 'general'
            },
            {
                key: 'institution_name',
                value: 'Benedicto College',
                description: 'Name of the institution',
                category: 'general'
            }
        ];

        for (const setting of defaultSettings) {
            const insertSQL = `
                INSERT INTO settings (\`key\`, value, description, category)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                description = VALUES(description),
                category = VALUES(category)
            `;
            
            await connection.execute(insertSQL, [
                setting.key,
                setting.value,
                setting.description,
                setting.category
            ]);
        }

        console.log('✅ Default settings inserted successfully');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

createNewTables();
