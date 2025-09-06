# 🚀 Local Development Setup

This guide will help you set up the RMS Backend for local development on localhost.

## 📋 Prerequisites

1. **Node.js** (version 18 or higher)
2. **MySQL Server** running locally
3. **Git** for version control

## 🗄️ Database Setup

1. **Install MySQL** if you haven't already
2. **Start MySQL Server**
3. **Create a database** named `rms_db` (or update the DB_NAME in your .env file)

## 🔧 Environment Configuration

Create a `.env` file in the root directory of `RMS-BACK` with the following content:

```env
# Local Development Environment Variables
NODE_ENV=development
PORT=5000

# Local MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rms_db
DB_PORT=3306

# Security (for local development)
JWT_SECRET=your-local-jwt-secret-key-change-this-in-development
SESSION_SECRET=your-local-session-secret-key-change-this-in-development

# CORS (for local frontend)
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Note**: Replace `your_mysql_password` with your actual MySQL root password.

## 🚀 Running the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd RMS-BACK
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or start the production build:
   ```bash
   npm start
   ```

5. **The server should start on** `http://localhost:5000`

## 🔑 Sample Login Credentials

After the server starts, sample users will be created automatically:

- **Admin**: A001 / adminpass
- **Accounting**: ACC01 / accpass
- **Student**: 2022-00037 / password

## 🧪 Testing the API

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example health check:
```bash
curl http://localhost:5000/health
```

## 🐛 Troubleshooting

### Database Connection Issues
- Make sure MySQL server is running
- Verify your database credentials in `.env`
- Check if the database `rms_db` exists

### Port Already in Use
- Change the PORT in `.env` to a different value (e.g., 5001)
- Kill any process using port 5000

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check TypeScript compilation: `npm run build`

## 📁 Project Structure

```
RMS-BACK/
├── src/                    # TypeScript source code
├── dist/                   # Compiled JavaScript (generated)
├── uploads/                # File uploads directory
├── .env                    # Environment variables (create this)
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Next Steps

1. Start the backend server as described above
2. Set up the frontend (see RMS-FRONT setup guide)
3. Test the full application locally

Happy coding! 🚀
