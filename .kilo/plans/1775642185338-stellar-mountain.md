# Plan: Restore & Fix API Routes Issue

## Goal
Restore vercel.json, fix the 405 Method Not Allowed error properly, and verify the application works.

## Root Cause of 405 Error
The original `vercel.json` has `"handle": "filesystem"` in the routes section which causes static file handlers to intercept API requests before they reach the Node.js API handlers.

## Steps to Execute

### Step 1: Restore vercel.json to original state
- Run: `git checkout vercel.json`

### Step 2: Fix the routes configuration properly
The issue is the route order. The fix is to remove the `"handle": "filesystem"` block but keep the proper route handling:
```json
"routes": [
  { "src": "/api/(.*)", "dest": "/api/$1" },
  { "src": "/.*", "dest": "/index.html" }
]
```

### Step 3: Start Vercel dev server
- Run: `vercel dev` or `npm run dev`
- Server starts at http://localhost:3000

### Step 4: Verify API routes work
- GET `/api/feed` - should return tips data
- POST `/api/auth/signup` - should work (no 405)
- POST `/api/auth/login` - should work (no 405)

### Step 5: Test frontend functionality
- Visit http://localhost:3000/login.html
- Test login form submission
- Test signup toggle
- Verify CSS styles applied correctly
- Test all navigation links work

## Safety Note
We will:
1. First restore original file using git
2. Then apply a proper fix to routes (not just removing filesystem handler)
3. Test thoroughly before declaring success