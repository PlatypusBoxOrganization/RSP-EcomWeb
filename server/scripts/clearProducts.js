import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

// Load environment variables
dotenv.config();

const clearProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear all products
    const result = await Product.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} products from the database.`);
    
  } catch (error) {
    console.error('Error clearing products:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    process.exit();
  }
};

clearProducts();
