# 🚀 CyberShield Quick Start Guide

**TL;DR:** Get CyberShield running in 20 minutes

---

## 📋 Prerequisites (Have These Ready)

- GitHub account (free)
- Supabase account (free)
- Vercel account (free)
- Terminal/Command prompt access

---

## ⚡ Quick Deployment (20 minutes total)

### Step 1: Set Up Supabase (5 min)

```
1. Go to supabase.com
2. Click "Start your project"
3. Create new project (note the password)
4. Go to Settings > API
5. Copy these 3 values:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
```

### Step 2: Run Database Migrations (5 min)

```
1. In Supabase: SQL Editor > New Query
2. Copy content from supabase/migrations/001_create_profiles.sql
3. Paste and click Run
4. Repeat for files 002 through 006 (in order)
5. Wait for "Success" message each time
```

### Step 3: Test Locally (5 min)

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Visit http://localhost:3000 in browser
# Try signing up at /auth/sign-up
```

### Step 4: Push to GitHub (2 min)

```bash
# Create repository on github.com/new first

# In your project folder:
git add .
git commit -m "Initial commit: Production ready"
git push -u origin main
```

### Step 5: Deploy to Vercel (3 min)

```
1. Go to vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Select your cybershield repo
5. Add Environment Variables (3 variables from Step 1)
6. Click "Deploy"
7. Wait 2-3 minutes for build
```

### Step 6: Test Production (5 min)

```
1. Visit your Vercel URL (e.g., cybershield.vercel.app)
2. Test sign-up at /auth/sign-up
3. Test sign-in at /auth/login
4. Browse to /dashboard
5. Try a feature (checklist, quiz, etc.)
```

---

## 🔐 Environment Variables (Step 1 & 5)

Need to set these 3 in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Get these from: **Supabase > Settings > API**

---

## 📍 Key URLs to Remember

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Local development |
| `https://cybershield.vercel.app` | Production (your URL) |
| `supabase.com` | Database setup |
| `github.com/yourname/cybershield` | Code repository |
| `vercel.com/dashboard` | Deployments |

---

## ✅ What's Working

- ✅ Email/password authentication
- ✅ Security checklist tracker
- ✅ Interactive quizzes
- ✅ Security encyclopedia
- ✅ Community feed
- ✅ User dashboard
- ✅ Responsive design
- ✅ Dark mode support

---

## 📖 Need More Details?

Read these files for complete info:

- **DEPLOYMENT_GUIDE.md** - Step-by-step with explanations
- **TESTING_GUIDE.md** - How to test everything
- **PRODUCTION_CHECKLIST.md** - What to verify
- **FIXES_APPLIED.md** - What was fixed

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Run `rm package-lock.json && npm install` |
| Build fails on Vercel | Check env vars in Vercel dashboard |
| Can't sign up | Run migrations in Supabase SQL Editor |
| Pages not loading | Check `npm run dev` output for errors |
| Wrong styling | Clear browser cache (Ctrl+Shift+Delete) |

---

## 🔗 Git Commands Reference

```bash
# See what changed
git status

# Add all files
git add .

# Create a commit
git commit -m "Your message"

# Push to GitHub
git push

# See recent commits
git log --oneline -5

# Undo last commit (be careful!)
git reset --soft HEAD~1
```

---

## 📊 Architecture at a Glance

```
Frontend (Your Browser)
         ↓
Next.js 15 + React 19
         ↓
Supabase (Database + Auth)
         ↓
PostgreSQL Database
         ↓
Vercel (Hosting)
```

---

## 🎯 Success Looks Like

After deployment:

1. ✅ Can visit your Vercel URL
2. ✅ Landing page loads
3. ✅ Can sign up with email
4. ✅ Can sign in with that email
5. ✅ Dashboard loads
6. ✅ Can use checklist feature
7. ✅ No errors in console

---

## 📱 Test These Features

After sign-in:

- [ ] Add item to checklist
- [ ] Mark checklist item complete
- [ ] Delete checklist item
- [ ] Take a quiz
- [ ] View quiz score
- [ ] Read encyclopedia article
- [ ] Create a feed post
- [ ] Like a post

---

## 🚀 You're Ready!

Everything is fixed and ready to deploy.

**Start with Step 1 above and follow through Step 6.**

You'll be live in ~20 minutes.

Need help? Check the longer guides:
- DEPLOYMENT_GUIDE.md
- TESTING_GUIDE.md

Good luck! 🎉

---

**Version:** 2.0.0
**Last Updated:** April 8, 2026
**Status:** ✅ Production Ready
