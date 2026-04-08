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

  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const cleanUsername = sanitizeInput(username);
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const cleanPassword = password;

  // Validate username
  if (cleanUsername.length < 3 || cleanUsername.length > 50) {
    return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
  }

  // Validate email
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Validate password
  if (cleanPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (cleanPassword.length > 128) {
    return res.status(400).json({ error: 'Password is too long' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cybershield');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered. Please try logging in instead.' });
    }

    // Hash password with salt rounds
    const hashed = await bcrypt.hash(cleanPassword, 12);

    // Insert user with additional metadata
    const result = await usersCollection.insertOne({
      username: cleanUsername,
      email: cleanEmail,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    });

    // Verify insertion
    if (!result.insertedId) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      { 
        id: result.insertedId.toString(), 
        email: cleanEmail,
        username: cleanUsername 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      username: cleanUsername,
      email: cleanEmail,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    
    // Don't expose internal error details
    if (error.message.includes('Failed to create user')) {
      return res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
    
    return res.status(500).json({ error: 'An error occurred during signup. Please try again.' });
  }
};
