require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, title, message) {
  console.log(`${color}${title}${colors.reset} ${message}`);
}

async function testConnection() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}       CyberShield MongoDB & JWT Connection Test${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  // Check environment variables
  log(colors.blue, '[ENV CHECK]', 'Checking environment variables...');
  
  if (!process.env.MONGODB_URI) {
    log(colors.red, '[ERROR]', 'MONGODB_URI is not set');
    return;
  }
  log(colors.green, '[✓]', 'MONGODB_URI found');

  if (!process.env.JWT_SECRET) {
    log(colors.red, '[ERROR]', 'JWT_SECRET is not set');
    return;
  }
  log(colors.green, '[✓]', 'JWT_SECRET found');

  // Test MongoDB Connection
  console.log(`\n${colors.blue}Testing MongoDB Connection...${colors.reset}`);
  
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  });

  try {
    await client.connect();
    log(colors.green, '[✓]', 'Successfully connected to MongoDB');

    const admin = client.db().admin();
    const status = await admin.ping();
    log(colors.green, '[✓]', 'MongoDB ping successful');

    // List databases
    const databases = await admin.listDatabases();
    log(colors.green, '[✓]', `Found ${databases.databases.length} database(s)`);

    // Check for cybershield database
    const cyberDb = client.db('cybershield');
    const collections = await cyberDb.listCollections().toArray();
    log(colors.green, '[✓]', `CyberShield database has ${collections.length} collection(s)`);

    if (collections.length > 0) {
      console.log(`\n${colors.cyan}Collections:${colors.reset}`);
      collections.forEach(col => console.log(`  - ${col.name}`));
    }

  } catch (error) {
    log(colors.red, '[ERROR]', `MongoDB connection failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
  }

  // Test JWT Token Generation
  console.log(`\n${colors.blue}Testing JWT Token Generation...${colors.reset}`);

  try {
    const testUser = {
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      username: 'testuser'
    };

    // Generate token
    const token = jwt.sign(
      testUser,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    log(colors.green, '[✓]', 'Token generated successfully');
    console.log(`\n${colors.cyan}Generated Token:${colors.reset}`);
    console.log(`${token}\n`);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    log(colors.green, '[✓]', 'Token verified successfully');
    
    console.log(`\n${colors.cyan}Token Data:${colors.reset}`);
    console.log(`  ID: ${decoded.id}`);
    console.log(`  Email: ${decoded.email}`);
    console.log(`  Username: ${decoded.username}`);
    console.log(`  Expires: ${new Date(decoded.exp * 1000).toLocaleString()}\n`);

  } catch (error) {
    log(colors.red, '[ERROR]', `JWT test failed: ${error.message}`);
    process.exit(1);
  }

  // Test Password Hashing
  console.log(`${colors.blue}Testing Password Hashing...${colors.reset}`);

  try {
    const testPassword = 'SecurePassword123!';
    const hashed = await bcrypt.hash(testPassword, 12);
    log(colors.green, '[✓]', 'Password hashed successfully');

    const isMatch = await bcrypt.compare(testPassword, hashed);
    if (isMatch) {
      log(colors.green, '[✓]', 'Password comparison successful');
    } else {
      log(colors.red, '[ERROR]', 'Password comparison failed');
      process.exit(1);
    }

    console.log(`\n${colors.cyan}Hash Example:${colors.reset}`);
    console.log(`Original: ${testPassword}`);
    console.log(`Hashed: ${hashed.substring(0, 50)}...\n`);

  } catch (error) {
    log(colors.red, '[ERROR]', `Password hashing test failed: ${error.message}`);
    process.exit(1);
  }

  // Final Summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  log(colors.green, '[SUCCESS]', 'All connection tests passed! Your system is ready.');
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.cyan}Next Steps:${colors.reset}`);
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000');
  console.log('3. Try signup/login on http://localhost:3000/login.html\n');
}

// Run tests
testConnection().catch(error => {
  log(colors.red, '[FATAL]', error.message);
  process.exit(1);
});
