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

  const { completedItems } = req.body;

  if (!completedItems || !Array.isArray(completedItems)) {
    return res.status(400).json({ error: 'completedItems array required' });
  }

  // Validate that all items are numbers
  for (const item of completedItems) {
    if (typeof item !== 'number' && typeof item !== 'string') {
      return res.status(400).json({ error: 'All items in completedItems must be numbers' });
    }
  }

  try {
    const client = await clientPromise;
    const db = client.db('cybershield');

    // Update or insert checklist progress
    await db.collection('checklist_progress').updateOne(
      { userId: new ObjectId(user.id) },
      { 
        $set: { 
          completedItems: completedItems.map(item => parseInt(item)), 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: 'Checklist updated successfully' });
  } catch (error) {
    console.error('Checklist update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};