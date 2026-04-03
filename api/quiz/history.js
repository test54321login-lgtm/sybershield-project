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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cybershield');

    // Get quiz scores for the user
    const scores = await db.collection('quiz_scores')
      .find({ userId: new ObjectId(user.id) })
      .sort({ takenAt: -1 })
      .limit(10)
      .toArray();

    // Convert ObjectId to string for serialization
    const serializedScores = scores.map(score => ({
      ...score,
      _id: score._id.toString(),
      userId: score.userId.toString()
    }));

    res.status(200).json({ scores: serializedScores });
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};