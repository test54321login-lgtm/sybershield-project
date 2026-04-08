# CyberShield - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)

## Step 1: Setup Environment (2 minutes)

### Create `.env.local` in the project root:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/cybershield?retryWrites=true&w=majority
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV=development
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free M0)
3. Create a user with password
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy connection string
6. Replace `<username>`, `<password>`, and database name

## Step 2: Install Dependencies (1 minute)

```bash
npm install
```

## Step 3: Initialize Database (1 minute)

```bash
npm run setup
```

This creates MongoDB collections and indexes automatically.

## Step 4: Run Development Server (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

## That's it! You're ready to test.

### Test the features:
1. Click "Login" in the header
2. Click "Create one" to signup
3. Create account with:
   - Username: your_username (3+ chars)
   - Email: your_email@example.com
   - Password: your_password (6+ chars)
4. Login with your credentials
5. You're authenticated! (Token stored in localStorage)

---

## Common Issues

### "MONGODB_URI not set"
- Make sure `.env.local` file exists in root
- Restart the dev server after creating `.env.local`

### "Connection refused"
- Check MongoDB cluster is running (green checkmark in Atlas)
- Verify IP whitelist includes your IP
- Check internet connection

### "Email already registered"
- Use a different email for signup
- Or delete the user from MongoDB Atlas manually

### Rate limit exceeded (5 failed login attempts)
- Wait 15 minutes before trying again
- Or restart the dev server

---

## Project Structure

```
├── api/auth/          # Login/Signup endpoints
├── css/               # Styling with animations
├── js/                # Client-side logic
├── login.html         # Auth pages
├── index.html         # Home page
├── .env.local         # Your secrets (don't commit!)
└── SETUP.md           # Detailed setup guide
```

---

## Key Features

✅ **Secure Authentication**
- Password hashing (bcryptjs)
- JWT tokens (7-day expiration)
- Rate limiting on login

✅ **Modern UI**
- Smooth animations and transitions
- Form validation with real-time feedback
- Loading states with spinner

✅ **Production Ready**
- Error handling and logging
- MongoDB indexes for performance
- Security headers configured

---

## Next Steps

1. **Customize**: Edit login.html, style.css for your branding
2. **Add Features**: Add user profiles, email verification, password reset
3. **Deploy**: Push to GitHub, deploy with Vercel (auto-deploys)
4. **Monitor**: Check Vercel logs for errors and performance

---

## Useful Commands

```bash
# Development
npm run dev              # Start local server

# Setup & Maintenance
npm run setup           # Initialize MongoDB (one time)

# Deployment
git push origin main    # Auto-deploys to Vercel
```

---

## MongoDB Atlas Setup (Detailed)

If you need help setting up MongoDB:

1. **Create Free Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Click "Create" → "Free Tier"
   - Choose region close to you
   - Click "Create"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `cybershield`
   - Password: Choose strong password
4. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Development: Add your IP or "Allow Access from Anywhere"
5. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Drivers" (Node.js)
   - Copy connection string
   - Replace `<username>` and `<password>`

---

## Vercel Deployment

When ready to go live:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "CyberShield with improved auth"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to vercel.com
   - Import your GitHub repo
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your secret key
   - Click "Deploy"

3. **Configure MongoDB IP**:
   - Add Vercel IPs to MongoDB whitelist
   - Or add `0.0.0.0/0` to allow all (less secure)

---

## Support

- Check SETUP.md for detailed documentation
- Check IMPROVEMENTS.md for all changes made
- Review code comments for implementation details

---

**Happy Coding! 🚀**
