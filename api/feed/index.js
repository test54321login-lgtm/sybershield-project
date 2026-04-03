const clientPromise = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query; // optional filter
    
    const client = await clientPromise;
    const db = client.db('cybershield');
    
    // Build filter based on category
    const filter = category && category !== 'All' ? { category } : {};
    
    // Get tips from the database
    const tips = await db.collection('tips_feed')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectId to string for serialization
    const serializedTips = tips.map(tip => ({
      ...tip,
      _id: tip._id.toString()
    }));

    res.status(200).json({ 
      tips: serializedTips,
      count: serializedTips.length,
      message: 'Tips retrieved successfully'
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};