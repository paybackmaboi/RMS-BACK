const mysql = require('mysql2/promise');

async function createPaymentsTable() {
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

        // Create payments table
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                requestId INT NOT NULL,
                studentId VARCHAR(50) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                paymentMethod VARCHAR(50) NOT NULL DEFAULT 'cash',
                paymentStatus ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
                paidAt DATETIME NULL,
                receivedBy VARCHAR(50) NULL,
                receiptNumber VARCHAR(100) NULL,
                remarks TEXT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE,
                INDEX idx_request_id (requestId),
                INDEX idx_student_id (studentId),
                INDEX idx_payment_status (paymentStatus)
            )
        `;

        await connection.execute(createTableSQL);
        console.log('✅ Payments table created successfully');

        // Insert sample payment records for existing requests
        const insertPaymentsSQL = `
            INSERT INTO payments (requestId, studentId, amount, paymentMethod, paymentStatus, receivedBy, receiptNumber, remarks)
            SELECT 
                r.id as requestId,
                r.studentId,
                CASE 
                    WHEN r.documentType = 'Transcript of Records' THEN 150.00
                    WHEN r.documentType = 'Certificate of Enrollment' THEN 30.00
                    WHEN r.documentType = 'Certificate of Good Moral' THEN 50.00
                    WHEN r.documentType = 'Certificate of Grades' THEN 100.00
                    ELSE 50.00
                END as amount,
                'cash' as paymentMethod,
                'pending' as paymentStatus,
                NULL as receivedBy,
                NULL as receiptNumber,
                'Payment required for document processing' as remarks
            FROM requests r
            WHERE r.status = 'payment_required' 
            AND NOT EXISTS (
                SELECT 1 FROM payments p WHERE p.requestId = r.id
            )
        `;

        const [result] = await connection.execute(insertPaymentsSQL);
        console.log(`✅ Inserted ${result.affectedRows} payment records`);

        // Update request statuses to payment_required for existing requests
        const updateRequestsSQL = `
            UPDATE requests 
            SET status = 'payment_required' 
            WHERE status = 'pending' 
            AND id IN (SELECT requestId FROM payments WHERE paymentStatus = 'pending')
        `;

        const [updateResult] = await connection.execute(updateRequestsSQL);
        console.log(`✅ Updated ${updateResult.affectedRows} request statuses to payment_required`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

createPaymentsTable();
