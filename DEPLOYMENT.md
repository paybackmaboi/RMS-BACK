# 🚀 RMS Backend Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- MySQL database accessible from Render
- Render account

## 🗄️ Database Configuration

The application is configured to use your MySQL online database:
- **Host**: 153.92.15.31
- **User**: u875409848_estorco
- **Database**: u875409848_estorco
- **Port**: 3306

## 🚀 Render Deployment

### 1. Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Select the repository containing this backend code

### 2. Configure the Service

**Basic Settings:**
- **Name**: `rms-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build & Deploy Settings:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Auto-Deploy**: ✅ Enabled

### 3. Environment Variables

Add these environment variables in Render:

```bash
NODE_ENV=production
PORT=10000
DB_HOST=153.92.15.31
DB_USER=u875409848_estorco
DB_PASSWORD=Y9Lq>$f$Q1
DB_NAME=u875409848_estorco
DB_PORT=3306
JWT_SECRET=<generate-a-secure-random-string>
SESSION_SECRET=<generate-a-secure-random-string>
FRONTEND_URL=https://your-frontend-domain.com
```

**Important**: Generate secure random strings for `JWT_SECRET` and `SESSION_SECRET`!

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any errors
4. Once deployed, you'll get a URL like: `https://your-app-name.onrender.com`

## 🔧 Local Testing

### Test Production Build Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start production server
npm start
```

### Test with Production Database

```bash
# Set production environment
set NODE_ENV=production

# Start server
npm start
```

## 📁 File Structure

```
RMS-BACK/
├── src/                    # TypeScript source code
├── dist/                   # Compiled JavaScript (generated)
├── uploads/                # File uploads directory
├── start-production.js     # Production startup script
├── render.yaml            # Render configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔍 Health Check

The application includes a health check endpoint:
- **URL**: `/health`
- **Method**: GET
- **Response**: JSON with status and timestamp

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are in `dependencies` (not `devDependencies`)
   - Check TypeScript compilation errors

2. **Database Connection Fails**
   - Verify database credentials
   - Check if database is accessible from Render's IP range
   - Ensure database exists and user has proper permissions

3. **Port Issues**
   - Render automatically assigns ports
   - Use `process.env.PORT` in your code (already configured)

4. **File Upload Issues**
   - Render has ephemeral storage
   - Consider using external storage (AWS S3, Cloudinary) for production

### Logs

- Check Render logs in the dashboard
- Use `console.log` statements for debugging
- Monitor the `/health` endpoint

## 🔒 Security Notes

- **Never commit** `.env` files or sensitive credentials
- Use strong, unique secrets for JWT and sessions
- Enable HTTPS (automatic on Render)
- Consider rate limiting for production
- Regularly update dependencies

## 📞 Support

If you encounter issues:
1. Check Render logs first
2. Verify database connectivity
3. Test locally with production environment
4. Check the health endpoint: `/health`

## 🎯 Next Steps

After successful deployment:
1. Update your frontend to use the new backend URL
2. Test all functionality
3. Set up monitoring and alerts
4. Configure custom domain if needed
5. Set up CI/CD pipeline for automatic deployments

---

**Happy Deploying! 🚀**
