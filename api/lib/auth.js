const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from request headers
 * @param {Object} req - Request object
 * @returns {Object|null} Decoded token payload or null if invalid
 */
function verifyToken(req) {
  const header = req.headers['authorization'] || '';
  const token = header.replace('Bearer ', '').trim();

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null; // expired or invalid
  }
}

module.exports = { verifyToken };