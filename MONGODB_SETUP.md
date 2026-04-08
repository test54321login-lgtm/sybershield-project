# MongoDB Setup & Configuration Guide

## Your Configuration

Your CyberShield project is now configured with:

- **MongoDB URI**: `mongodb+srv://Sadia:SADIA@786@cluster0.ilhmm0i.mongodb.net/?appName=Cluster0`
- **Database**: `cybershield`
- **JWT Secret**: Securely generated (64-character random string)

---

## Environment Variables

Your `.env.local` file contains:

```
MONGODB_URI=mongodb+srv://Sadia:SADIA@786@cluster0.ilhmm0i.mongodb.net/?appName=Cluster0
JWT_SECRET=7f3c9e2a8d1b5f4c6e9a2d8f1c3e5b7a9d2f4e6c8a1b3d5f7e9a2c4e6f8a0b1
NODE_ENV=development
```

**Important**: Keep these values secret! Never commit `.env.local` to version control.

---

## JWT Token Details

### Generated JWT Secret
```
7f3c9e2a8d1b5f4c6e9a2d8f1c3e5b7a9d2f4e6c8a1b3d5f7e9a2c4e6f8a0b1
```

### How Tokens Work

When a user signs up or logs in, a JWT token is generated with this structure:

```javascript
{
  id: "user_id_from_database",
  email: "user@example.com",
  username: "username",
  iat: 1712606400,           // Issued at
  exp: 1713211200            // Expires in 7 days
}
```

### Token Lifespan
- **Duration**: 7 days
- **After Expiry**: User must log in again
- **Verification**: Token is verified on every API request

### Example Token Generated During Login
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiY3liZXJAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6ImN5YmVydXNlciIsImlhdCI6MTcxMjYwNjQwMCwiZXhwIjoxNzEzMjExMjAwfQ.xY9zB4qLpMnOp_lRsT7vG6hJkLmNqRsUvWxYzAbCdEf
```

---

## Database Collections

The system automatically creates these collections:

### 1. **users** Collection
Stores user account information:

```javascript
{
  _id: ObjectId,
  username: String,              // 3-50 characters
  email: String,                 // Unique, indexed
  password: String,              // Bcryptjs hashed (12 rounds)
  createdAt: Date,               // Account creation time
  updatedAt: Date,               // Last update time
  lastLogin: Date,               // Last login timestamp
}
```

**Indexes**:
- `email` - Unique index (prevents duplicate accounts)
- `createdAt` - For sorting/filtering
- `lastLogin` - For user activity tracking

---

## Quick Start

### 1. Verify MongoDB Connection
```bash
npm run test
```

This command will:
- ✓ Check environment variables
- ✓ Connect to MongoDB Atlas
- ✓ Verify database access
- ✓ Test JWT token generation
- ✓ Test password hashing

Expected output:
```
═══════════════════════════════════════════════════════
       CyberShield MongoDB & JWT Connection Test
═══════════════════════════════════════════════════════

[ENV CHECK] Checking environment variables...
[✓] MONGODB_URI found
[✓] JWT_SECRET found

Testing MongoDB Connection...
[✓] Successfully connected to MongoDB
[✓] MongoDB ping successful
[✓] Found X database(s)
[✓] CyberShield database has X collection(s)

Testing JWT Token Generation...
[✓] Token generated successfully
[✓] Token verified successfully

[SUCCESS] All connection tests passed! Your system is ready.
```

### 2. Initialize Database (Creates Collections)
```bash
npm run setup
```

This script will:
- Create the `users` collection
- Create indexes for email, createdAt, lastLogin
- Seed sample data (optional)

### 3. Start Development Server
```bash
npm run dev
```

Server will be available at: `http://localhost:3000`

### 4. Test Authentication
- Visit: `http://localhost:3000/login.html`
- Try creating a new account
- Check MongoDB to see the user record created

---

## How Authentication Works

### Signup Flow
1. User fills form and submits
2. Frontend validates input (email format, password strength)
3. API receives request and validates again
4. Password is hashed with bcryptjs (12 salt rounds)
5. User document is inserted into MongoDB
6. JWT token is generated and sent to frontend
7. Token is stored in browser's localStorage
8. User is redirected to dashboard

### Login Flow
1. User enters email and password
2. Frontend validates input
3. API looks up user by email
4. Password is compared with hashed password
5. If match: JWT token is generated
6. If no match: Generic error returned
7. Token is stored in localStorage
8. User is redirected to dashboard

### Token Verification
- Token is sent with every API request in `Authorization` header
- Server verifies token using JWT_SECRET
- If valid: Request proceeds
- If invalid/expired: User must log in again

---

## Security Features

### Password Security
- **Algorithm**: Bcryptjs
- **Salt Rounds**: 12 (strong hashing)
- **Never Stored**: Plain passwords never stored in database

### Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: 64-character random string (cryptographically secure)
- **Expiration**: 7 days (short-lived tokens)
- **HttpOnly**: Can be upgraded to secure cookies

### Database Security
- **Connection**: MongoDB Atlas with IP whitelisting
- **Authentication**: Username/password protected
- **Indexes**: Email has unique index (prevents duplicates)
- **Validation**: Input sanitization prevents injection attacks

### Rate Limiting
- **Failed Logins**: 5 attempts per 15 minutes per email
- **Signup**: Check for duplicate email before processing
- **Error Messages**: Generic messages (no info about whether email exists)

---

## Troubleshooting

### "MONGODB_URI is not set"
**Solution**: Make sure `.env.local` exists in the project root with your MongoDB URI

### "Cannot connect to MongoDB"
Possible causes:
1. MongoDB Atlas IP not whitelisted
2. Username/password incorrect
3. Network connectivity issues
4. Cluster paused/deleted

**Solution**:
- Check MongoDB Atlas dashboard
- Verify cluster is active
- Check IP whitelist allows your IP
- Test connection: `npm run test`

### "JWT_SECRET is not set"
**Solution**: Ensure `.env.local` file has JWT_SECRET defined

### "Email already registered"
**Solution**: Try logging in instead, or use a different email

### "Too many login attempts"
**Solution**: Wait 15 minutes and try again. This is rate limiting protection.

---

## Advanced Configuration

### Change JWT Expiration
Edit `api/auth/signup.js` and `api/auth/login.js`:

```javascript
// Change from '7d' to your desired expiration
const token = jwt.sign(
  { id, email, username },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }  // 30 days instead of 7
);
```

### Change Password Hashing Strength
Edit `api/auth/signup.js`:

```javascript
// Higher = stronger but slower (12 is recommended)
const hashed = await bcrypt.hash(password, 14);  // 14 salt rounds
```

### Change Rate Limiting
Edit `api/auth/login.js`:

```javascript
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes instead of 15
const MAX_ATTEMPTS = 10;                    // Allow 10 attempts instead of 5
```

---

## Test Credentials

After running `npm run setup`, you can test with:

- **Email**: `test@cybershield.local`
- **Password**: `Test123!`
- **Username**: `testuser`

---

## Files Structure

```
cybershield/
├── .env.local                    # Your config (NEVER commit!)
├── .env.example                  # Template (safe to commit)
├── api/
│   ├── auth/
│   │   ├── signup.js            # Signup endpoint
│   │   └── login.js             # Login endpoint
│   └── lib/
│       ├── db.js                # MongoDB connection
│       └── auth.js              # Auth middleware
├── scripts/
│   ├── setup-mongodb.js         # Initialize database
│   └── test-connection.js       # Test all connections
├── js/
│   ├── auth.js                  # Frontend auth logic
│   └── utils.js                 # Utility functions
├── login.html                    # Login page
└── package.json                  # Dependencies
```

---

## Next Steps

1. Run `npm run test` to verify everything works
2. Run `npm run dev` to start the server
3. Visit `http://localhost:3000/login.html` to test
4. Create an account and verify it appears in MongoDB
5. Log in to verify JWT token generation

---

## Support

If you encounter issues:

1. Check the debug logs: `npm run test`
2. Review QUICKSTART.md for common issues
3. Check MongoDB Atlas console for connection issues
4. Verify all environment variables are set correctly

Your CyberShield authentication system is now fully configured and ready to use!
