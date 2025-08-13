import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to get random products (simplified version)
const getRandomProducts = async (count) => {
  try {
    console.log('Getting random products (simplified)...');
    
    // First, try a simple count query
    const totalProducts = await Product.countDocuments({});
    console.log('Total products in database:', totalProducts);
    
    if (totalProducts === 0) {
      console.log('No products found in the database');
      return [];
    }
    
    // Get all products (temporarily simplified for debugging)
    const allProducts = await Product.find({}).limit(10).lean();
    console.log('Sample products from database:', allProducts);
    
    // Return a subset of products (or all if less than count)
    return allProducts.slice(0, Math.min(count, allProducts.length));
    
  } catch (error) {
    console.error('Error in getRandomProducts (simplified):', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    // Return empty array instead of throwing to prevent 500 errors
    return [];
  }
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc    Get suggested products (random products from different categories)
// @route   GET /api/products/suggested
// @access  Public
router.get(
  '/suggested',
  asyncHandler(async (req, res) => {
    console.log('\n===== SUGGESTED PRODUCTS ENDPOINT =====');
    console.log('Request received at:', new Date().toISOString());
    
    try {
      // Get total number of products
      const totalProducts = await Product.countDocuments({});
      
      if (totalProducts === 0) {
        console.log('No products found in the database');
        return res.json([]);
      }
      
      // Get 6 random products (or all if less than 6)
      const limit = Math.min(6, totalProducts);
      const randomSkip = Math.floor(Math.random() * (totalProducts - limit));
      
      const suggestedProducts = await Product.aggregate([
        { $sample: { size: limit } },
        { $match: { countInStock: { $gt: 0 } } },
        { $limit: limit }
      ]);
      
      console.log(`Returning ${suggestedProducts.length} suggested products`);
      return res.json(suggestedProducts);
      
    } catch (error) {
      console.error('Error in /suggested endpoint:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Return empty array to prevent UI issues
      return res.json([]);
    }
  })
);

// Test endpoint to check database connection and product count
router.get('/test-db', async (req, res) => {
  try {
    // Check MongoDB connection
    const db = mongoose.connection;
    const isConnected = db.readyState === 1;
    
    // Get product count
    const productCount = await Product.countDocuments({});
    
    // Get a sample product
    const sampleProduct = await Product.findOne({});
    
    res.json({
      status: 'success',
      mongoConnected: isConnected,
      productCount,
      sampleProduct,
      collections: (await mongoose.connection.db.listCollections().toArray()).map(c => c.name)
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Simple test endpoint to verify server is working
router.get('/test', (req, res) => {
  console.log('\n===== TEST ENDPOINT HIT =====');
  console.log('Request received at:', new Date().toISOString());
  console.log('Request headers:', req.headers);
  
  res.json({ 
    success: true, 
    message: 'Test endpoint working', 
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    mongoConnected: mongoose.connection.readyState === 1,
    endpoints: {
      test: '/api/products/test',
      suggested: '/api/products/suggested',
      related: '/api/products/related/:id',
      testDb: '/api/products/test-db'
    }
  });
});

// @desc    Get related products (same category)
// @route   GET /api/products/related/:id
// @access  Public
router.get(
  '/related/:id',
  asyncHandler(async (req, res) => {
    try {
      console.log('Fetching related products for product ID:', req.params.id);
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        console.log('Product not found with ID:', req.params.id);
        return res.status(404).json({ message: 'Product not found' });
      }
      
      console.log('Found product category:', product.category);
      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(6).lean();
      
      console.log(`Found ${relatedProducts.length} related products`);
      res.json(relatedProducts);
    } catch (error) {
      console.error('Error in /related/:id endpoint:', error);
      res.status(500).json({
        message: 'Error fetching related products',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  })
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;
