const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGO_URI;
  console.log('Connecting to MongoDB...');
  
  if (!uri) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    
    console.log('\nAvailable databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

testConnection();
