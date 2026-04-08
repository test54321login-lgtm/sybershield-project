# CyberShield Deployment Guide

Complete guide to deploying CyberShield to production on Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Fix Build Issues](#step-1-fix-build-issues)
3. [Step 2: Set Up Supabase](#step-2-set-up-supabase)
4. [Step 3: Push to GitHub](#step-3-push-to-github)
5. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
6. [Step 5: Test All Functions](#step-5-test-all-functions)
7. [Production Verification](#production-verification)

---

## Prerequisites

- GitHub account (free tier is fine)
- Supabase project (free tier is fine)
- Vercel account (free tier is fine)
- Git installed locally (or use GitHub web interface)

---

## Step 1: Fix Build Issues

**Status:** ✅ COMPLETED

The following fixes have already been applied:

### 1.1 Framer Motion React 19 Compatibility
- **Issue:** Framer Motion 10.18.0 doesn't support React 19
- **Fix:** Upgraded to Framer Motion 11.0.0
- **File:** `package.json` (line 12)

### 1.2 Component Dependencies
- **Issue:** UI components depended on `@radix-ui` and `class-variance-authority`
- **Fix:** Simplified components to use plain React and Tailwind CSS
- **Files:**
  - `components/ui/button.tsx` - Removed Radix UI Slot and CVA
  - `components/ui/input.tsx` - Updated color classes
  - `components/ui/label.tsx` - Removed Radix UI dependency
  - `components/ui/card.tsx` - Updated color classes

### 1.3 TypeScript Configuration
- **Issue:** tsconfig.json was not optimized for Next.js 15
- **Fix:** Updated to proper Next.js 15 configuration
- **File:** `tsconfig.json`

### 1.4 Lock File
- **Issue:** Old package-lock.json with missing dependencies
- **Fix:** Deleted lock file (will regenerate on npm install)
- **Action:** Run `npm install` after cloning

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** cybershield
   - **Database Password:** (generate secure password)
   - **Region:** Choose closest to your users
6. Click "Create new project"
7. Wait for database to initialize (2-3 minutes)

### 2.2 Get API Credentials

1. In Supabase dashboard, go to **Settings > API**
2. Copy these values and save them:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/Public Key
3. Go to **Settings > Database > Connection Pooling**
4. Copy `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Create `.env.local` File

Create file `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2.4 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy content of `supabase/migrations/001_create_profiles.sql`
4. Paste into SQL editor and click **Run**
5. Wait for success message
6. **Repeat for all 6 migrations in order:**
   - `001_create_profiles.sql`
   - `002_create_checklist_items.sql`
   - `003_create_quiz_results.sql`
   - `004_create_feed_posts.sql`
   - `005_create_encyclopedia.sql`
   - `006_create_profile_trigger.sql`

### 2.5 Enable Row-Level Security

1. Go to **Authentication > Policies**
2. For each table (profiles, checklist_items, quiz_results, feed_posts, encyclopedia):
   - Select the table
   - Verify RLS is "Enabled"
   - All policies should be present

### 2.6 Test Supabase Connection

1. Create `.env.local` with credentials (see 2.3)
2. Run: `npm install`
3. Run: `npm run dev`
4. Go to http://localhost:3000
5. You should see the landing page load without errors

---

## Step 3: Push to GitHub

### 3.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name:** cybershield (or your preferred name)
   - **Description:** Cyber awareness platform built with Next.js and Supabase
   - **Visibility:** Public (recommended for open source) or Private
3. Click **Create repository**
4. Copy the repository URL (e.g., `https://github.com/yourusername/cybershield.git`)

### 3.2 Initialize Git (First Time)

If not already initialized:

```bash
cd /path/to/cybershield
git init
git add .
git commit -m "Initial commit: Production-ready CyberShield platform"
```

### 3.3 Add Remote and Push

```bash
# Add GitHub as remote
git remote add origin https://github.com/yourusername/cybershield.git

# Or if remote already exists, update it
git remote set-url origin https://github.com/yourusername/cybershield.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 3.4 Verify on GitHub

1. Go to your repository on GitHub
2. You should see all files pushed
3. Check that `.env.local` is in `.gitignore` (it should be)

---

## Step 4: Deploy to Vercel

### 4.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** or **Log in** (use GitHub for easier setup)
3. Click **New Project**
4. Click **Import Git Repository**
5. Find your `cybershield` repository and click **Import**

### 4.2 Configure Project

1. **Framework Preset:** Should auto-detect "Next.js" ✓
2. **Root Directory:** `.` (current directory) ✓
3. **Environment Variables:** Click **Add Environment Variable** and add:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
```

4. Click **Deploy**

### 4.3 Wait for Deployment

1. Vercel will build and deploy automatically (2-3 minutes)
2. You'll see a progress indicator
3. When complete, you'll get a deployed URL (e.g., `https://cybershield.vercel.app`)

### 4.4 Verify Deployment

1. Visit the deployed URL
2. You should see the landing page
3. Try signing up to verify database connection works
4. Check Vercel logs if there are any errors

---

## Step 5: Test All Functions

### 5.1 Authentication Testing

#### Sign-Up Flow
```
1. Go to /auth/sign-up
2. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "SecurePass123!"
   - Confirm: "SecurePass123!"
3. Click "Create Account"
4. Should redirect to /auth/sign-up-success
5. Check Supabase: Users table should show new user
```

#### Email Confirmation (Development Only)
```
1. In Supabase dashboard, go to Authentication > Users
2. Find your test user
3. Click the user and click "Confirm" to mark as verified
4. (In production, users get email confirmation link)
```

#### Sign-In Flow
```
1. Go to /auth/login
2. Enter email and password
3. Click "Sign In"
4. Should redirect to /dashboard
5. Session should persist on page refresh
```

### 5.2 Feature Testing

#### Security Checklist
```
1. From dashboard, click "Security Checklist"
2. Click "Add Item"
3. Enter item name and category
4. Click "Add"
5. Item should appear in list
6. Click checkmark to mark complete
7. Refresh page - item should stay marked
8. Click delete button to remove item
```

#### Quiz
```
1. From dashboard, click "Take Quiz"
2. Select difficulty level
3. Answer questions
4. Click "Submit Quiz"
5. See score and results
6. Check Supabase: quiz_results table should have entry
```

#### Encyclopedia
```
1. From dashboard, click "Security Encyclopedia"
2. Browse articles
3. Click article to read
4. Filter by category
5. Search for keyword
```

#### Feed
```
1. From dashboard, click "Community Feed"
2. Click "New Post"
3. Enter post content
4. Click "Post"
5. Post should appear in feed
6. Click like button
7. Like count should increase
```

### 5.3 Error Cases

#### Test Invalid Inputs
```
1. Sign-up with weak password → Show error
2. Sign-up with invalid email → Show error
3. Sign-in with wrong password → Show error
4. Sign-up with duplicate email → Show error
```

#### Test Unauthorized Access
```
1. Logout
2. Try to access /dashboard directly
3. Should redirect to /auth/login
```

---

## Production Verification

### 🔐 Security Checks

- [ ] All environment variables are set in Vercel dashboard
- [ ] `.env.local` is in `.gitignore` (not exposed in git)
- [ ] Supabase RLS policies are enabled
- [ ] Database passwords are strong (randomly generated)
- [ ] HTTPS is enabled (automatic with Vercel)

### ⚡ Performance Checks

```bash
# Local build test
npm run build

# Should complete without errors
# Output: "✓ Compiled successfully"
```

- [ ] Build completes in < 2 minutes
- [ ] No console errors or warnings
- [ ] Core Web Vitals scores are good
- [ ] Pages load in < 3 seconds

### 🌐 Functionality Checks

- [ ] Sign-up works end-to-end
- [ ] Sign-in works end-to-end
- [ ] All pages load without errors
- [ ] Database operations work
- [ ] Email confirmation ready (optional)
- [ ] Mobile responsive design works

### 📋 Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel project created and linked to GitHub
- [ ] Environment variables configured in Vercel
- [ ] First deployment successful
- [ ] Production domain accessible
- [ ] Database migrations applied
- [ ] Supabase authentication configured
- [ ] Tested sign-up → sign-in → dashboard flow

---

## Troubleshooting

### Build Fails on Vercel

**Error:** `next: command not found` or `Build step failed`

**Solution:**
1. Check `.env.local` has all required variables
2. Check `package.json` has all dependencies
3. Run locally: `npm install && npm run build`
4. Check Vercel build logs for specific error
5. Common fixes:
   ```bash
   # Delete lock file and reinstall
   rm package-lock.json
   npm install
   git add .
   git commit -m "Fix: Reinstall dependencies"
   git push
   ```

### Sign-Up/Sign-In Not Working

**Error:** `Supabase connection failed` or `Database error`

**Solution:**
1. Verify environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` should be `https://xxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be long string
2. Check Supabase project is active
3. Run migrations in Supabase SQL editor
4. Verify authentication is enabled in Supabase

### 404 Pages or Routes Not Found

**Solution:**
1. Check files exist in `/app` directory
2. Clear Vercel cache: Go to project > Settings > Git > Redeploy
3. Verify file names match route paths

### Styling/Colors Look Wrong

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check `globals.css` is imported in layout
3. Verify Tailwind CSS is configured in `tailwind.config.ts`

---

## Next Steps After Deployment

1. **Configure Custom Domain** (optional)
   - Go to Vercel project > Settings > Domains
   - Add your custom domain

2. **Set Up Analytics** (optional)
   - Enable Vercel Analytics in project settings
   - Monitor Core Web Vitals

3. **Set Up Email Notifications** (optional)
   - Configure SMTP in Supabase for email confirmations
   - Supabase Dashboard > Authentication > Email Templates

4. **Monitor & Maintain**
   - Check Vercel deployment logs daily
   - Monitor Supabase database metrics
   - Update dependencies monthly

5. **Scale Up** (when needed)
   - Supabase has free tier limits
   - Monitor usage in Supabase dashboard
   - Upgrade to paid tier when needed

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Format code
npm run format

# Push to GitHub
git add .
git commit -m "Your message"
git push

# View Git log
git log --oneline -10

# See uncommitted changes
git status

# Undo last commit (be careful!)
git reset --soft HEAD~1
```

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Last Updated:** April 8, 2026
**Status:** Ready for Production Deployment ✓

For issues or questions, refer to `PRODUCTION_CHECKLIST.md`
