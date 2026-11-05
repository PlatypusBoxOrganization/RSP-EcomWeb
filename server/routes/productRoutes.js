import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { protect, admin } from '../middleware/auth.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

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

// Mock data fallback
const mockProducts = [
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1a',
    name: 'Arduino Uno R3',
    description: 'Microcontroller board based on ATmega328P',
    price: 25.99,
    category: 'Microcontrollers',
    brand: 'Arduino',
    countInStock: 50,
    rating: 4.5,
    numReviews: 120,
    image: '/Images/products/arduino-uno.jpg'
  },
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1b',
    name: 'Raspberry Pi 4 Model B',
    description: 'Single-board computer with 4GB RAM',
    price: 55.00,
    category: 'Single Board Computers',
    brand: 'Raspberry Pi',
    countInStock: 30,
    rating: 4.8,
    numReviews: 200,
    image: '/Images/products/raspberry-pi-4.jpg'
  },
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1c',
    name: 'ESP32 Development Board',
    description: 'WiFi + Bluetooth module for IoT projects',
    price: 12.50,
    category: 'IoT Modules',
    brand: 'Espressif',
    countInStock: 100,
    rating: 4.6,
    numReviews: 85,
    image: '/Images/products/esp32.jpg'
  },
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1d',
    name: 'Breadboard 830 Points',
    description: 'Solderless breadboard for prototyping',
    price: 8.99,
    category: 'Prototyping',
    brand: 'Generic',
    countInStock: 200,
    rating: 4.3,
    numReviews: 45,
    image: '/Images/products/breadboard.jpg'
  },
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1e',
    name: 'Jumper Wires Kit',
    description: 'Male-to-male, male-to-female, female-to-female wires',
    price: 6.99,
    category: 'Prototyping',
    brand: 'Generic',
    countInStock: 150,
    rating: 4.4,
    numReviews: 60,
    image: '/Images/products/jumper-wires.jpg'
  },
  {
    _id: '60d5ec49e1b0dc2c4c8d8f1f',
    name: 'Servo Motor SG90',
    description: '9g micro servo for robotics and RC projects',
    price: 3.99,
    category: 'Motors',
    brand: 'Tower Pro',
    countInStock: 300,
    rating: 4.2,
    numReviews: 150,
    image: '/Images/products/servo-sg90.jpg'
  }
];

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const products = await Product.find({});
      if (products && products.length > 0) {
        res.json(products);
      } else {
        console.log('No products in DB, returning mock data');
        res.json(mockProducts);
      }
    } catch (error) {
      console.error('DB error, returning mock products:', error.message);
      res.json(mockProducts);
    }
  })
);

// @desc    Fetch multiple products by IDs
// @route   GET /api/products/ids
// @access  Public
router.get(
  '/ids',
  asyncHandler(async (req, res) => {
    const { ids } = req.query;

    if (!ids) {
      res.status(400);
      throw new Error('Product IDs are required');
    }

    const idArray = ids.split(',').map(id => id.trim());

    // Validate that all IDs are valid MongoDB ObjectIds
    const validIds = idArray.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      res.status(400);
      throw new Error('No valid product IDs provided');
    }

    try {
      const products = await Product.find({
        _id: { $in: validIds }
      });
      if (products && products.length > 0) {
        return res.json(products);
      }
      // Fallback: match mock products by id
      const mockMatch = mockProducts.filter(p => validIds.includes(String(p._id)));
      res.json(mockMatch);
    } catch (error) {
      console.error('DB error in /ids, returning mock data:', error.message);
      const mockMatch = mockProducts.filter(p => validIds.includes(String(p._id)));
      res.json(mockMatch);
    }
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
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.json(product);
      }
      // Fallback to mock data
      const mockProduct = mockProducts.find(p => String(p._id) === String(req.params.id));
      if (mockProduct) {
        return res.json(mockProduct);
      }
      res.status(404);
      throw new Error('Product not found');
    } catch (error) {
      const mockProduct = mockProducts.find(p => String(p._id) === String(req.params.id));
      if (mockProduct) {
        return res.json(mockProduct);
      }
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// Admin CRUD routes
router.use(protect);
router.use(admin);

router.get('/admin/all', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
