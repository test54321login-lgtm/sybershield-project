# CyberShield - Setup Guide

## Overview
CyberShield is a cyber awareness and malware information portal with secure user authentication, built with Node.js, MongoDB, and modern web standards.

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Vercel account (for deployment)
- Git for version control

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/test54321login-lgtm/sybershield-project.git
cd sybershield-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/cybershield?retryWrites=true&w=majority

# JWT Secret - Generate a secure random string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Environment
NODE_ENV=development
```

### 4. Generate JWT Secret
Generate a secure JWT secret key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as your `JWT_SECRET` in `.env.local`.

### 5. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (Free M0 cluster)
4. Create a database user:
   - Go to "Database Access"
   - Add user with strong password
   - Remember username and password
5. Get your connection string:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Drivers" / "Node.js"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
6. Set your IP whitelist:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add your current IP
   - For Vercel: Add `0.0.0.0/0` (allow all, or specific Vercel IPs)

### 6. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
sybershield-project/
├── api/
│   ├── auth/
│   │   ├── login.js       # Login endpoint with validation
│   │   └── signup.js      # Signup endpoint with validation
│   └── lib/
│       └── db.js          # MongoDB connection manager
├── css/
│   └── style.css          # Global styles with animations
├── js/
│   ├── auth.js            # Authentication logic with loading states
│   └── utils.js           # Utility functions (fetch, messages)
├── login.html             # Auth page (login & signup forms)
├── index.html             # Home page
├── .env.example           # Environment variables template
├── .env.local             # Local environment config (NOT in git)
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies and scripts
```

## Features

### Authentication
- **Secure Signup**: Email validation, password requirements, duplicate email checking
- **Secure Login**: Rate limiting (5 attempts per 15 minutes), password verification
- **JWT Tokens**: 7-day expiration, stored in localStorage
- **Password Hashing**: bcryptjs with 12 salt rounds

### Frontend Improvements
- **Form Validation**: Real-time feedback with visual indicators
- **Loading States**: Spinner animations during submission
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Fade-in, slide, and transition effects
- **Responsive Design**: Works on mobile, tablet, and desktop

### Backend Security
- **Input Sanitization**: Remove malicious characters
- **Rate Limiting**: Prevent brute force attacks
- **CORS Headers**: Secure cross-origin requests
- **Error Handling**: No sensitive error exposure
- **Environment Validation**: Required variables checked at startup

### API Endpoints

#### POST /api/auth/signup
Register a new user

Request:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "john_doe",
  "email": "john@example.com",
  "message": "Account created successfully"
}
```

#### POST /api/auth/login
Login existing user

Request:
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "john_doe",
  "email": "john@example.com",
  "message": "Login successful"
}
```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Improved auth with MongoDB and modern styling"
git push origin main
```

### 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub repository
4. Configure environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `NODE_ENV`: production
5. Click "Deploy"

### 3. Configure MongoDB IP Whitelist for Vercel
1. Go to MongoDB Atlas Network Access
2. Add Vercel's IP ranges or `0.0.0.0/0` for production

## MongoDB Database Schema

### users Collection
```json
{
  "_id": ObjectId,
  "username": "string",
  "email": "string (unique, indexed)",
  "password": "string (bcrypt hashed)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date | null"
}
```

## Troubleshooting

### "MONGODB_URI not set" Error
- Make sure `.env.local` exists in the root directory
- Check that `MONGODB_URI` is spelled correctly
- Verify the MongoDB connection string format

### "JWT_SECRET not configured" Error
- Add `JWT_SECRET` to `.env.local`
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### MongoDB Connection Timeout
- Check your IP whitelist in MongoDB Atlas
- For Vercel, add `0.0.0.0/0` or specific Vercel IPs
- Verify MongoDB Atlas cluster status (should be green)
- Check network connectivity

### Login/Signup Errors
- Check browser console for detailed error messages
- Verify API responses in Network tab (DevTools)
- Ensure MongoDB is running and connected
- Check rate limiting if too many failed attempts

## Security Best Practices

1. **Never commit `.env.local`**: Already in `.gitignore`
2. **Use strong JWT_SECRET**: Minimum 32 characters, random
3. **Update dependencies**: Run `npm update` regularly
4. **Use HTTPS**: Vercel enforces HTTPS in production
5. **Monitor logs**: Check Vercel function logs for errors
6. **Database backups**: Enable MongoDB Atlas automated backups

## Performance Optimization

- Vercel function caching for API responses
- MongoDB connection pooling (max 10 connections)
- Client-side form validation to reduce API calls
- CSS animations optimized for 60fps
- Minified CSS and JavaScript in production

## Testing

### Manual Testing
1. Signup with new account
2. Login with created account
3. Check localStorage for `cs_token` and `cs_user`
4. Verify JWT token decoding
5. Test form validation on errors
6. Test rate limiting (5 failed attempts)

### API Testing with curl
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Support & Contributing

For issues or contributions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Submit pull request with improvements

## License

MIT License - See LICENSE file for details

---

**Last Updated**: April 2026
**Version**: 2.0.0 - Production Ready with MongoDB Integration
