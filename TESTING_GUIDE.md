# CyberShield Testing Guide

Complete guide for testing all features of the CyberShield platform before and after deployment.

## Table of Contents

1. [Pre-Deployment Testing (Local)](#pre-deployment-testing-local)
2. [Post-Deployment Testing (Production)](#post-deployment-testing-production)
3. [Feature-Specific Testing](#feature-specific-testing)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)
6. [Browser Compatibility](#browser-compatibility)
7. [Troubleshooting Failed Tests](#troubleshooting-failed-tests)

---

## Pre-Deployment Testing (Local)

Run these tests before pushing to GitHub and deploying to Vercel.

### 1. Setup & Installation

```bash
# Navigate to project directory
cd cybershield

# Install dependencies (should work now without conflicts)
npm install

# Verify installation
npm list | grep -E "next|react|framer-motion"

# Expected output (or similar versions):
# next@15.x.x
# react@19.x.x
# framer-motion@11.x.x
```

**Expected Result:** ✅ No error messages, all packages installed

### 2. Build Test

```bash
# Build the project
npm run build

# Expected output:
# ✓ Compiled successfully
# ○ (Static)  GET    /
# ● (SSR)    GET    /dashboard [auth required]
# ... (more routes)
```

**Expected Result:** ✅ Build succeeds with no errors

### 3. Development Server Test

```bash
# Start development server
npm run dev

# Expected output:
# ▲ Next.js 15.x.x
# - Ready in 2s
# ○ Listening on http://localhost:3000
```

**Expected Result:** ✅ Server starts and listens on port 3000

### 4. Visual Inspection Test

Open http://localhost:3000 in browser and verify:

**Landing Page:**
- [ ] Page loads without errors
- [ ] Hero section displays with text
- [ ] Feature cards show (4+ cards)
- [ ] Call-to-action buttons visible
- [ ] Footer displays
- [ ] Colors are correct (blue primary, slate grays)
- [ ] Text is readable
- [ ] Images load (if any)

**Navigation:**
- [ ] Logo/brand clickable
- [ ] Sign Up button links to /auth/sign-up
- [ ] Sign In button links to /auth/login
- [ ] No broken links in footer

**Responsive Design:**
- [ ] Open DevTools (F12) → Device toolbar
- [ ] Test at 375px (iPhone)
- [ ] Test at 768px (Tablet)
- [ ] Test at 1024px (Desktop)
- [ ] All elements responsive
- [ ] No horizontal scrolling on mobile

---

## Post-Deployment Testing (Production)

Run these tests after deploying to Vercel.

### Setup

Replace `https://cybershield.vercel.app` with your actual Vercel deployment URL.

---

## Feature-Specific Testing

### Feature 1: Sign-Up Flow

**Test Case 1.1: Valid Sign-Up**

```
1. Navigate to https://yourapp.vercel.app/auth/sign-up
2. Fill form:
   - Full Name: "Jane Doe"
   - Email: "janedoe@example.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
3. Click "Create Account"
```

**Expected Result:**
- [ ] Page redirects to /auth/sign-up-success
- [ ] Success message displays
- [ ] Confirmation page shows next steps
- [ ] User appears in Supabase > Authentication > Users
- [ ] New profile created in Supabase > profiles table

**Test Case 1.2: Invalid Email**

```
1. Go to /auth/sign-up
2. Enter:
   - Full Name: "Test User"
   - Email: "invalid-email"
   - Password: "SecurePass123!"
   - Confirm: "SecurePass123!"
3. Click "Create Account"
```

**Expected Result:**
- [ ] Error message: "Please enter a valid email address"
- [ ] Form doesn't submit
- [ ] Page stays on sign-up form

**Test Case 1.3: Weak Password**

```
1. Go to /auth/sign-up
2. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "weak123"
   - Confirm: "weak123"
3. Click "Create Account"
```

**Expected Result:**
- [ ] Error message about password strength
- [ ] Lists specific requirements not met
- [ ] Form doesn't submit

**Test Case 1.4: Password Mismatch**

```
1. Go to /auth/sign-up
2. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "SecurePass123!"
   - Confirm: "SecurePass456!"
3. Click "Create Account"
```

**Expected Result:**
- [ ] Error: "Passwords do not match"
- [ ] Form doesn't submit

**Test Case 1.5: Duplicate Email**

```
1. Go to /auth/sign-up
2. Use email that already exists in database
3. Fill other fields correctly
4. Click "Create Account"
```

**Expected Result:**
- [ ] Error: "Email already in use"
- [ ] Form doesn't submit
- [ ] User is not created

---

### Feature 2: Sign-In Flow

**Test Case 2.1: Valid Sign-In**

```
1. Navigate to /auth/login
2. Enter:
   - Email: janedoe@example.com (from sign-up test)
   - Password: SecurePass123!
3. Click "Sign In"
```

**Expected Result:**
- [ ] Page redirects to /dashboard
- [ ] User profile displays at top
- [ ] No authentication errors
- [ ] Session persists (refresh page, still logged in)

**Test Case 2.2: Wrong Password**

```
1. Go to /auth/login
2. Enter:
   - Email: janedoe@example.com
   - Password: WrongPassword123!
3. Click "Sign In"
```

**Expected Result:**
- [ ] Error message displays
- [ ] Page stays on login form
- [ ] User is not logged in

**Test Case 2.3: Non-Existent Email**

```
1. Go to /auth/login
2. Enter:
   - Email: nonexistent@example.com
   - Password: SomePassword123!
3. Click "Sign In"
```

**Expected Result:**
- [ ] Error message displays
- [ ] Form doesn't submit
- [ ] User is not logged in

**Test Case 2.4: Session Persistence**

```
1. Sign in (test 2.1)
2. Press F5 or click refresh button
3. Observe page behavior
```

**Expected Result:**
- [ ] Page reloads
- [ ] User remains logged in
- [ ] Dashboard loads with user data
- [ ] No redirect to login

---

### Feature 3: Security Checklist

**Test Case 3.1: Create Checklist Item**

```
1. Sign in to account
2. Navigate to /checklist or click "Security Checklist"
3. Click "Add New Item" button
4. Fill form:
   - Item Name: "Enable 2FA"
   - Category: "Account Security"
5. Click "Add Item"
```

**Expected Result:**
- [ ] Item appears in checklist
- [ ] Item displays with correct category
- [ ] Item is unchecked initially
- [ ] Item saved in Supabase > checklist_items table

**Test Case 3.2: Mark Item Complete**

```
1. From checklist, click checkbox next to item
2. Observe item status change
```

**Expected Result:**
- [ ] Item shows as checked/complete
- [ ] Visual styling changes (strikethrough, color change)
- [ ] Status saved in database
- [ ] Status persists on page refresh

**Test Case 3.3: Delete Item**

```
1. From checklist, click delete button on item
2. Confirm deletion (if prompted)
```

**Expected Result:**
- [ ] Item removed from list
- [ ] Deletion saved in database
- [ ] Item not visible on page refresh

**Test Case 3.4: Progress Tracking**

```
1. Add 5+ items to checklist
2. Complete some items (50%)
3. Check progress percentage
```

**Expected Result:**
- [ ] Progress bar shows correct percentage
- [ ] Progress updates as you check items
- [ ] Progress persists on refresh

**Test Case 3.5: Category Filtering**

```
1. Add items to multiple categories
2. Try to filter by category (if feature exists)
```

**Expected Result:**
- [ ] Only selected category items display
- [ ] All categories work
- [ ] "All Categories" shows everything

---

### Feature 4: Quiz

**Test Case 4.1: Start Quiz**

```
1. Sign in and go to /quiz
2. Click "Start Quiz" or select a category
3. Answer questions
```

**Expected Result:**
- [ ] Quiz loads questions
- [ ] Questions display correctly
- [ ] Answer options are clickable
- [ ] Only one answer selectable (radio button)

**Test Case 4.2: Submit Quiz**

```
1. After answering all questions
2. Click "Submit Quiz" button
```

**Expected Result:**
- [ ] Score calculated and displayed
- [ ] Correct answers highlighted
- [ ] User's answers shown
- [ ] Score saved in Supabase > quiz_results table
- [ ] Redirects to results page

**Test Case 4.3: Quiz History**

```
1. Go to Quiz Results/History page
2. View previous quiz attempts
```

**Expected Result:**
- [ ] Previous quiz scores displayed
- [ ] Date and time shown
- [ ] Score and percentage visible
- [ ] Can retake quiz

**Test Case 4.4: Different Difficulty Levels**

```
1. Take quiz at Easy level
2. Take quiz at Medium level
3. Take quiz at Hard level
```

**Expected Result:**
- [ ] Difficulty level affects questions
- [ ] Scores calculated correctly
- [ ] All attempts saved separately

---

### Feature 5: Encyclopedia

**Test Case 5.1: Browse Articles**

```
1. Go to /encyclopedia
2. Scroll through articles
3. Click on an article to read
```

**Expected Result:**
- [ ] Articles load without errors
- [ ] Article content displays
- [ ] Metadata shows (date, category, severity)
- [ ] Read time estimate displays

**Test Case 5.2: Search Functionality**

```
1. Go to Encyclopedia
2. Search for "phishing" (if search exists)
3. Results display
```

**Expected Result:**
- [ ] Search returns relevant articles
- [ ] Results highlight matching terms
- [ ] Search is responsive

**Test Case 5.3: Category Filtering**

```
1. Go to Encyclopedia
2. Click on a category (Malware, Phishing, etc.)
3. Observe filtered results
```

**Expected Result:**
- [ ] Only articles in selected category show
- [ ] All categories work correctly
- [ ] "All" category shows everything

---

### Feature 6: Community Feed

**Test Case 6.1: Create Post**

```
1. Go to /feed
2. Click "Create Post" or text area
3. Enter post content: "Cybersecurity tip: Use strong passwords"
4. Click "Post"
```

**Expected Result:**
- [ ] Post appears at top of feed
- [ ] User name/profile displays
- [ ] Timestamp shows "Just now"
- [ ] Post saved in Supabase > feed_posts table

**Test Case 6.2: View Feed**

```
1. Go to /feed
2. Scroll through posts
3. View different posts
```

**Expected Result:**
- [ ] Posts display with user info
- [ ] Posts ordered by newest first
- [ ] Timestamps display
- [ ] Multiple posts visible

**Test Case 6.3: Like Post**

```
1. From feed, click like button on a post
2. Observe like count change
```

**Expected Result:**
- [ ] Like button changes color/style
- [ ] Like count increments
- [ ] Can unlike by clicking again
- [ ] Like count decrements

**Test Case 6.4: Delete Own Post**

```
1. Find your own post in feed
2. Click delete button (should only appear on your posts)
3. Confirm deletion
```

**Expected Result:**
- [ ] Post removed from feed
- [ ] Delete button only shows on your posts
- [ ] Deletion persists on refresh

**Test Case 6.5: Comment on Post** (if feature exists)

```
1. From feed, click comment button on post
2. Type comment
3. Submit comment
```

**Expected Result:**
- [ ] Comment appears under post
- [ ] Comment shows author name
- [ ] Comment count increases
- [ ] Comments load on page refresh

---

### Feature 7: Dashboard

**Test Case 7.1: Dashboard Load**

```
1. Sign in
2. You should be on /dashboard
```

**Expected Result:**
- [ ] Dashboard loads without errors
- [ ] User profile section displays
- [ ] Stats display correctly
- [ ] Quick action buttons visible
- [ ] All links work

**Test Case 7.2: User Profile**

```
1. On dashboard, look for user info section
2. Verify information is correct
```

**Expected Result:**
- [ ] Full name displays correctly
- [ ] Email is shown
- [ ] Profile picture shows (if applicable)
- [ ] Join date displays

**Test Case 7.3: Quick Stats**

```
1. Check stats on dashboard:
   - Checklist completion %
   - Quizzes taken
   - Encyclopedia articles read
   - Forum posts created
```

**Expected Result:**
- [ ] All stats display
- [ ] Stats reflect user activity
- [ ] Numbers update as features are used

---

## Performance Testing

### Load Time Testing

**Test Case P1: Home Page Load Time**

```
1. Go to https://yourapp.vercel.app
2. Open DevTools (F12) > Network tab
3. Reload page
4. Check load time
```

**Expected Result:**
- [ ] Page loads in < 3 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

**Test Case P2: Dashboard Load Time**

```
1. Sign in
2. Dashboard should load quickly
```

**Expected Result:**
- [ ] Dashboard loads in < 2 seconds
- [ ] All data displays
- [ ] No lag or delays

**Test Case P3: Image/Asset Loading**

```
1. Go through all pages
2. Verify images load properly
3. Check DevTools Network tab
```

**Expected Result:**
- [ ] All images load
- [ ] No broken image icons
- [ ] Image file sizes reasonable

---

## Security Testing

### Test Case S1: Protected Routes

```
1. Open new incognito/private window
2. Try to access https://yourapp.vercel.app/dashboard
```

**Expected Result:**
- [ ] Redirects to /auth/login
- [ ] Cannot access protected pages without login

**Test Case S2: Session Security**

```
1. Sign in
2. Open DevTools > Application/Storage > Cookies
3. Look for session token
```

**Expected Result:**
- [ ] Session token exists
- [ ] Token is secure (marked as HttpOnly if visible)
- [ ] Token changes on logout

**Test Case S3: Data Isolation**

```
1. Sign in with Account A
2. Note something you created (e.g., post ID)
3. Sign out and sign in with Account B
4. Try to access Account A's private data
```

**Expected Result:**
- [ ] Account B cannot see Account A's private data
- [ ] RLS policies working correctly

**Test Case S4: Input Validation**

```
1. Try to submit form with:
   - HTML tags: <script>alert('xss')</script>
   - SQL: ' OR '1'='1
   - Very long inputs
```

**Expected Result:**
- [ ] Input is sanitized
- [ ] No errors or unexpected behavior
- [ ] Data stored safely

---

## Browser Compatibility

Test on these browsers:

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari (iPhone)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile (Android)

**For each browser, verify:**
- [ ] Page loads without errors
- [ ] Styling displays correctly
- [ ] Forms are usable
- [ ] Buttons are clickable
- [ ] Responsive design works

---

## Automated Test Checklist

Create a browser automation test using Cypress, Playwright, or Selenium:

```javascript
// Example test structure (Playwright)
test('User can sign up and access dashboard', async ({ page }) => {
  // 1. Navigate to sign-up
  await page.goto('/auth/sign-up');
  
  // 2. Fill form
  await page.fill('input[name="fullName"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
  
  // 3. Submit
  await page.click('button:has-text("Create Account")');
  
  // 4. Verify redirect
  await expect(page).toHaveURL('/auth/sign-up-success');
  
  // 5. Sign in (after email confirmation)
  // ... more steps
});
```

---

## Troubleshooting Failed Tests

### "Page not loading" Error

**Possible causes:**
1. Server not running
2. Wrong URL
3. Network connection issue

**Solution:**
```bash
# Check server is running
npm run dev

# Verify URL is correct
# Should be http://localhost:3000 or your Vercel URL

# Check internet connection
ping google.com
```

### "Cannot sign up - database error"

**Possible causes:**
1. Supabase not connected
2. Missing environment variables
3. Migrations not run

**Solution:**
1. Check `.env.local` has all variables
2. Verify Supabase project is active
3. Run all migrations in Supabase SQL editor
4. Check Supabase > Authentication is enabled

### "Components not styling correctly"

**Possible causes:**
1. Tailwind CSS not compiling
2. Browser cache
3. CSS file not loaded

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run dev

# Clear browser cache
# Chrome: Ctrl+Shift+Delete > All time > Clear data

# Check globals.css is imported
# Should be in app/layout.tsx
```

### "Authentication stuck/not working"

**Possible causes:**
1. Middleware issue
2. Cookie problem
3. Session expired

**Solution:**
1. Clear browser cookies
2. Close and reopen browser
3. Check browser DevTools Console for errors
4. Verify Supabase session settings

### "Feature data not saving"

**Possible causes:**
1. RLS policies blocking writes
2. Database connection issue
3. Wrong user ID

**Solution:**
1. Check Supabase > Authentication > Policies
2. Verify RLS is enabled on tables
3. Check browser console for error messages
4. Verify user ID matches in database

---

## Test Results Template

Use this template to track test results:

```
Date: [Date]
Environment: [Local/Vercel]
Tester: [Your name]
Build Version: [Version number]

SIGN-UP TESTS
[ ] Valid signup works
[ ] Invalid email rejected
[ ] Weak password rejected
[ ] Password mismatch detected
[ ] Duplicate email prevented

SIGN-IN TESTS
[ ] Valid signin works
[ ] Wrong password rejected
[ ] Non-existent email rejected
[ ] Session persists on refresh

FEATURE TESTS
[ ] Checklist CRUD operations work
[ ] Quiz submit and scoring works
[ ] Encyclopedia articles load
[ ] Feed posts create and like
[ ] Dashboard loads with stats

PERFORMANCE TESTS
[ ] Home page loads < 3s
[ ] Dashboard loads < 2s
[ ] Images load properly
[ ] No console errors

SECURITY TESTS
[ ] Protected routes redirect
[ ] Session tokens secure
[ ] Data isolation working
[ ] Input validation works

BROWSERS TESTED
[ ] Chrome
[ ] Firefox
[ ] Safari
[ ] Mobile Safari
[ ] Chrome Mobile

ISSUES FOUND
1. [Issue description]
   - Severity: [Low/Medium/High]
   - Steps to reproduce: [Steps]
   - Fix applied: [What was done]

OVERALL STATUS: [PASS/FAIL]
Ready for production: [YES/NO]
```

---

## Conclusion

After completing all tests in this guide:

1. ✅ All tests pass on local development
2. ✅ All tests pass on production (Vercel)
3. ✅ No console errors or warnings
4. ✅ All features work as expected
5. ✅ Performance is acceptable
6. ✅ Security measures in place
7. ✅ Mobile responsive
8. ✅ Browser compatible

You're ready to launch!

---

**Last Updated:** April 8, 2026
**Status:** Complete Testing Guide Ready
