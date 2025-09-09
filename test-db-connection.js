const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB');
    
    // Check if Product model exists
    const modelNames = mongoose.modelNames();
    console.log('Available models:', modelNames);
    
    if (modelNames.includes('Product')) {
      const count = await mongoose.model('Product').countDocuments();
      console.log(`Found ${count} products in the database`);
      
      // List first 5 products
      const products = await mongoose.model('Product').find().limit(5).lean();
      console.log('\nSample products:');
      products.forEach((p, i) => {
        console.log(`\nProduct ${i + 1}:`);
        console.log(`  Name: ${p.name}`);
        console.log(`  Price: $${p.price}`);
        console.log(`  Stock: ${p.countInStock}`);
        console.log(`  Active: ${p.isActive}`);
      });
    } else {
      console.log('Product model not found. Make sure the model is properly registered.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testConnection();
