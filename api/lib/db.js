const { MongoClient } = require('mongodb');

// Validate MongoDB URI
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set. Please configure it in your .env.local file.');
}

const options = { 
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
};

let client;
let clientPromise;

// In development mode, use a global variable to preserve the connection across hot reloads
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB connection error:', err.message);
      throw new Error('Failed to connect to MongoDB. Check your MONGODB_URI and network connection.');
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB connection error:', err.message);
    throw new Error('Failed to connect to MongoDB. Check your MONGODB_URI and network connection.');
  });
}

module.exports = clientPromise;
