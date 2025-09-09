const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    console.error('Error: MONGO_URI is not defined in .env file');
    return;
  }
  
  console.log('Testing connection to:', uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@'));
  
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    
    // Test the connection
    await client.db().command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB');
    
    // List databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    
    console.log('\nAvailable databases:');
    dbList.databases.forEach(db => console.log(`- ${db.name}`));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\nTroubleshooting tips:');
      console.log('1. Check if MongoDB is running');
      console.log('2. Verify the connection string in .env file');
      console.log('3. Check your internet connection');
      console.log('4. If using MongoDB Atlas, ensure your IP is whitelisted');
      console.log('5. Check if authentication credentials are correct');
    }
    
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

testConnection();
