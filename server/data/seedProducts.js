import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Function to generate slug from product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/--+/g, '-')       // Replace multiple hyphens with a single hyphen
    .trim();
};

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Wireless Earbuds Pro',
    image: '/images/airpods.jpg',
    description: 'High-quality wireless earbuds with noise cancellation',
    brand: 'SoundBeats',
    category: 'Electronics',
    price: 129.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Smartphone X',
    image: '/images/phone.jpg',
    description: 'Latest smartphone with advanced camera features',
    brand: 'TechGadget',
    category: 'Electronics',
    price: 699.99,
    countInStock: 5,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: 'Mechanical Keyboard',
    image: '/images/keyboard.jpg',
    description: 'RGB mechanical keyboard with blue switches',
    brand: 'KeyMaster',
    category: 'Accessories',
    price: 89.99,
    countInStock: 15,
    rating: 4.3,
    numReviews: 24,
  },
  {
    name: 'Gaming Mouse',
    image: '/images/mouse.jpg',
    description: 'High DPI gaming mouse with customizable buttons',
    brand: 'GameGear',
    category: 'Accessories',
    price: 59.99,
    countInStock: 20,
    rating: 4.6,
    numReviews: 15,
  },
  {
    name: '4K Monitor',
    image: '/images/monitor.jpg',
    description: '27-inch 4K UHD monitor with HDR',
    brand: 'ViewPlus',
    category: 'Monitors',
    price: 349.99,
    countInStock: 7,
    rating: 4.7,
    numReviews: 18,
  },
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Get admin user to set as product owner
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.'.red);
      process.exit(1);
    }
    
    // Add admin user as owner and generate slugs for all sample products
    const sampleProductsWithOwner = sampleProducts.map(product => ({
      ...product,
      user: adminUser._id,
      slug: generateSlug(product.name)
    }));
    
    // Insert sample products
    await Product.insertMany(sampleProductsWithOwner);
    
    console.log('Sample products imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

importData();
