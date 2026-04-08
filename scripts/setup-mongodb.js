#!/usr/bin/env node

/**
 * MongoDB Setup Script
 * Creates database collections and indexes for CyberShield
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'cybershield';

if (!MONGODB_URI) {
  console.error('\u274c Error: MONGODB_URI environment variable not set');
  console.error('Please create a .env.local file with your MongoDB connection string');
  process.exit(1);
}

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  });

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected to MongoDB successfully');

    const db = client.db(DB_NAME);

    // Create users collection if it doesn't exist
    console.log('\n📦 Setting up users collection...');
    try {
      await db.createCollection('users');
      console.log('✓ Created users collection');
    } catch (err) {
      if (err.code === 48) {
        console.log('✓ Users collection already exists');
      } else {
        throw err;
      }
    }

    // Create indexes
    console.log('\n📑 Creating indexes...');
    const usersCollection = db.collection('users');

    // Index on email (unique)
    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );
    console.log('✓ Created unique index on email');

    // Index on createdAt (for sorting)
    await usersCollection.createIndex({ createdAt: -1 });
    console.log('✓ Created index on createdAt');

    // Index on lastLogin (for activity tracking)
    await usersCollection.createIndex({ lastLogin: -1 });
    console.log('✓ Created index on lastLogin');

    // Verify database setup
    console.log('\n🔍 Verifying setup...');
    const collectionsList = await db.listCollections().toArray();
    console.log(`✓ Collections in database: ${collectionsList.map(c => c.name).join(', ')}`);

    const indexesList = await usersCollection.listIndexes().toArray();
    console.log(`✓ Indexes on users collection: ${indexesList.map(i => i.name).join(', ')}`);

    // Show sample user document structure
    console.log('\n📋 Sample user document structure:');
    console.log(JSON.stringify({
      _id: 'ObjectId',
      username: 'john_doe',
      email: 'john@example.com',
      password: 'hashed_password_bcrypt',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      lastLogin: 'timestamp or null'
    }, null, 2));

    console.log('\n✅ Database setup completed successfully!\n');
    console.log('You can now:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Create an account using the signup form\n');

  } catch (error) {
    console.error('\n❌ Error during database setup:');
    console.error(error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Tips:');
      console.error('- Check your MongoDB username and password');
      console.error('- Make sure your IP is whitelisted in MongoDB Atlas');
      console.error('- Verify the connection string format');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Tips:');
      console.error('- Check your internet connection');
      console.error('- Verify the MongoDB Atlas cluster is running');
      console.error('- Try again in a moment');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run setup
setupDatabase();
