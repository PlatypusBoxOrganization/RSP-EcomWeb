const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  return mongoose.connection.db.listCollections().toArray();
})
.then(collections => {
  console.log('\nCollections in database:');
  collections.forEach(collection => console.log(`- ${collection.name}`));
  
  // Check if products collection exists and count documents
  if (collections.some(c => c.name === 'products')) {
    return mongoose.connection.db.collection('products').countDocuments();
  }
  return 0;
})
.then(count => {
  console.log(`\nFound ${count} products in the database`);
  process.exit(0);
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});
