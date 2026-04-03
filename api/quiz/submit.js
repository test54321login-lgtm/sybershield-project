const { verifyToken } = require('../lib/auth');
const { ObjectId } = require('mongodb');
const clientPromise = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify token for protected route
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score } = req.body;

  if (score === undefined || score === null) {
    return res.status(400).json({ error: 'Score required' });
  }

  if (typeof score !== 'number' || score < 0 || score > 10) {
    return res.status(400).json({ error: 'Score must be a number between 0 and 10' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cybershield');

    // Insert quiz score
    await db.collection('quiz_scores').insertOne({
      userId: new ObjectId(user.id),
      score: Number(score),
      totalQ: 10,
      takenAt: new Date()
    });

    res.status(200).json({ success: true, message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};