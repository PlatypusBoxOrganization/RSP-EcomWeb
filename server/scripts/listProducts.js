import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

// Load environment variables
dotenv.config();

const listProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // List all products with basic info
    const products = await Product.find({}).select('name slug price countInStock category').lean();
    
    if (products.length === 0) {
      console.log('No products found in the database.');
    } else {
      console.log('\nSample Products:');
      console.log('---------------');
      products.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`Name: ${product.name}`);
        console.log(`Slug: ${product.slug}`);
        console.log(`Price: $${product.price}`);
        console.log(`In Stock: ${product.countInStock}`);
        console.log(`Category: ${product.category}`);
      });
    }
  } catch (error) {
    console.error('Error listing products:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    process.exit();
  }
};

listProducts();
