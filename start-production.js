#!/usr/bin/env node

/**
 * Production Server Startup Script
 * This script is used by Render to start the production server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting RMS Backend in production mode...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${process.env.PORT || 5000}`);
console.log(`🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

// Check if dist folder exists
const fs = require('fs');
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
    console.error('❌ Build folder not found. Please run "npm run build" first.');
    console.log('💡 Running build command...');
    
    const buildProcess = spawn('npm', ['run', 'build'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    buildProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Build completed successfully. Starting server...');
            startServer();
        } else {
            console.error(`❌ Build failed with code ${code}`);
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🎯 Starting production server...');
    
    // Try to fix database key issues first
    console.log('🔧 Checking database key issues...');
    const fixProcess = spawn('npm', ['run', 'fix-db-keys'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    fixProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Database key fix completed successfully');
        } else {
            console.warn('⚠️  Database key fix had issues, but continuing...');
        }
        
        // Start the compiled JavaScript server
        const serverProcess = spawn('node', ['dist/app.js'], { 
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                NODE_ENV: 'production'
            }
        });
        
        serverProcess.on('close', (code) => {
            console.log(`🔄 Server process exited with code ${code}`);
            if (code !== 0) {
                console.error('❌ Server crashed. Exiting...');
                process.exit(1);
            }
        });
        
        serverProcess.on('error', (error) => {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        });
        
        // Handle graceful shutdown
        process.on('SIGTERM', () => {
            console.log('🛑 Received SIGTERM. Shutting down gracefully...');
            serverProcess.kill('SIGTERM');
        });
        
        process.on('SIGINT', () => {
            console.log('🛑 Received SIGINT. Shutting down gracefully...');
            serverProcess.kill('SIGINT');
        });
    });
    
    fixProcess.on('error', (error) => {
        console.warn('⚠️  Database key fix failed, but continuing:', error);
        
        // Start the compiled JavaScript server anyway
        const serverProcess = spawn('node', ['dist/app.js'], { 
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                NODE_ENV: 'production'
            }
        });
        
        serverProcess.on('close', (code) => {
            console.log(`🔄 Server process exited with code ${code}`);
            if (code !== 0) {
                console.error('❌ Server crashed. Exiting...');
                process.exit(1);
            }
        });
        
        serverProcess.on('error', (error) => {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        });
        
        // Handle graceful shutdown
        process.on('SIGTERM', () => {
            console.log('🛑 Received SIGTERM. Shutting down gracefully...');
            serverProcess.kill('SIGTERM');
        });
        
        process.on('SIGINT', () => {
            console.log('🛑 Received SIGINT. Shutting down gracefully...');
            serverProcess.kill('SIGINT');
        });
    });
}
