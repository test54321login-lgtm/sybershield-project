const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clientPromise = require('../lib/db');

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize input
function sanitizeInput(input) {
  return String(input).trim().replace(/[<>]/g, '');
}

// Simple in-memory rate limiting (replace with Redis in production)
const attemptMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(email) {
  const now = Date.now();
  const attempts = attemptMap.get(email) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  
  recentAttempts.push(now);
  attemptMap.set(email, recentAttempts);
  return true;
}

module.exports = async function handler(req, res) {
  // Set secure CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN || '*' : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = sanitizeInput(email).toLowerCase();

  // Validate email format
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Rate limiting
  if (!checkRateLimit(cleanEmail)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cybershield');
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login timestamp
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      username: user.username,
      email: user.email,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error.message);
    
    return res.status(500).json({ error: 'An error occurred during login. Please try again.' });
  }
};
