import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Function to generate slug from product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const sampleProducts = [
  // PCB Fabrication (20 products)
  {
    name: '4-Layer Medical Grade PCB',
    image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // PCB placeholder
    description: 'High-reliability 4-layer PCB for medical devices with 2oz copper thickness. RoHS compliant and IPC Class 3 certified.',
    brand: 'Portronics',
    category: 'Electronics',
    price: 249.99,
    countInStock: 15,
    color: 'Green',
    discount: 10,
    rating: 4.7,
    numReviews: 8,
  },
  {
    name: '6-Layer Aerospace PCB',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Aerospace PCB
    description: 'High-temperature 6-layer PCB for aerospace applications with 3oz copper. Withstands extreme conditions and vibrations.',
    brand: 'PCBPro',
    category: 'Electronics',
    price: 499.99,
    countInStock: 8,
    color: 'Black',
    discount: 15,
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: '8-Layer Defense PCB',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Defense PCB
    description: 'Military-grade 8-layer PCB with 4oz copper for defense applications. High durability and signal integrity.',
    brand: 'CircuitMasters',
    category: 'Electronics',
    price: 899.99,
    countInStock: 5,
    color: 'Blue',
    discount: 5,
    rating: 4.8,
    numReviews: 15,
  },
  {
    name: '2-Layer IOT Module',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6701?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // IOT Module
    description: 'Cost-effective 2-layer PCB for IOT applications. Ideal for home automation projects.',
    brand: 'IOTech',
    category: 'Electronics',
    price: 49.99,
    countInStock: 30,
    color: 'Green',
    discount: 10,
    rating: 4.5,
    numReviews: 24,
  },
  {
    name: '10-Layer Medical Imaging PCB',
    image: 'https://images.unsplash.com/photo-1551817958-2daf0e85e7b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Medical Imaging PCB
    description: 'High-density 10-layer PCB for medical imaging equipment. Precision engineered for signal integrity.',
    brand: 'Portronics',
    category: 'Electronics',
    price: 1299.99,
    countInStock: 4,
    color: 'Black',
    discount: 15,
    rating: 4.9,
    numReviews: 9,
  },
  {
    name: 'Flexible PCB for Wearables',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Flexible PCB
    description: 'Ultra-thin flexible PCB for wearable medical devices. Bends without breaking.',
    brand: 'ElectroFab',
    category: 'Electronics',
    price: 199.99,
    countInStock: 18,
    color: 'Yellow',
    discount: 12,
    rating: 4.6,
    numReviews: 11,
  },
  {
    name: 'High-Frequency RF PCB',
    image: 'https://images.unsplash.com/photo-1592292029834-8c8b2c3e3c1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // RF PCB
    description: 'High-frequency RF PCB for wireless communication. Low signal loss and stable performance.',
    brand: 'PCBPro',
    category: 'Electronics',
    price: 349.99,
    countInStock: 12,
    color: 'Blue',
    discount: 5,
    rating: 4.7,
    numReviews: 7,
  },
  {
    name: 'Automotive IOT Module',
    image: 'https://images.unsplash.com/photo-1554744512-d6c603f8502a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Automotive IOT
    description: 'Rugged IOT module for automotive applications. Withstands temperature extremes and vibrations.',
    brand: 'IOTech',
    category: 'Electronics',
    price: 179.99,
    countInStock: 22,
    color: 'Black',
    discount: 15,
    rating: 4.5,
    numReviews: 16,
  },
  {
    name: '16-Layer Server PCB',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6701?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Server PCB
    description: 'High-density 16-layer PCB for server applications. Optimized for high-speed data transfer.',
    brand: 'CircuitMasters',
    category: 'Electronics',
    price: 1899.99,
    countInStock: 3,
    color: 'Green',
    discount: 10,
    rating: 4.9,
    numReviews: 5,
  },
  {
    name: 'Medical Sensor PCB',
    image: 'https://images.unsplash.com/photo-1551817958-2daf0e85e7b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Medical Sensor PCB
    description: 'Precision PCB for medical sensors. High accuracy and reliability for critical applications.',
    brand: 'Portronics',
    category: 'Electronics',
    price: 299.99,
    countInStock: 14,
    color: 'Black',
    discount: 15,
    rating: 4.8,
    numReviews: 13,
  },

  // Medical Furniture (30 products)
  {
    name: 'Electric Hospital Bed',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Hospital Bed
    description: 'Premium electric hospital bed with adjustable height and backrest. Includes side rails and IV pole holder.',
    brand: 'MediFurn',
    category: 'Medical',
    price: 1299.99,
    countInStock: 8,
    color: 'White',
    discount: 8,
    rating: 4.7,
    numReviews: 24,
  },
  {
    name: 'Veterinary Examination Table',
    image: 'https://images.unsplash.com/photo-1582456891954-6bdc35f00a1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Vet Table
    description: 'Stainless steel veterinary examination table with adjustable height. Easy to clean and disinfect.',
    brand: 'VetEquip',
    category: 'Medical',
    price: 899.99,
    countInStock: 5,
    color: 'Silver',
    rating: 4.8,
    numReviews: 18,
  },
  {
    name: 'Surgical LED Light',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Surgical Light
    description: 'High-intensity LED surgical light with adjustable brightness and color temperature.',
    brand: 'SurgicalPro',
    category: 'Medical',
    price: 2499.99,
    countInStock: 4,
    color: 'White',
    discount: 8,
    rating: 4.9,
    numReviews: 15,
  },
  {
    name: 'Medical Stretcher',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Stretcher
    description: 'Lightweight yet sturdy medical stretcher with adjustable backrest and safety rails.',
    brand: 'CareLine',
    category: 'Medical',
    price: 799.99,
    countInStock: 7,
    color: 'Blue',
    discount: 5,
    rating: 4.6,
    numReviews: 22,
  },
  {
    name: 'Dental Chair Unit',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Dental Chair
    description: 'Ergonomic dental chair with integrated instrument tray and adjustable headrest.',
    brand: 'HealthCarePlus',
    category: 'Medical',
    price: 3299.99,
    countInStock: 3,
    color: 'Beige',
    rating: 4.8,
    numReviews: 9,
  },
  {
    name: 'Veterinary Surgical Table',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Vet Surgical Table
    description: 'Heavy-duty surgical table for veterinary use with adjustable height and tilt.',
    brand: 'VetEquip',
    category: 'Medical',
    price: 1899.99,
    countInStock: 4,
    color: 'Stainless Steel',
    rating: 4.7,
    numReviews: 11,
  },
  {
    name: 'Patient Monitor Stand',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Monitor Stand
    description: 'Mobile stand for patient monitors with adjustable height and cable management.',
    brand: 'MediFurn',
    category: 'Medical',
    price: 349.99,
    countInStock: 12,
    color: 'White',
    discount: 8,
    rating: 4.5,
    numReviews: 14,
  },
  {
    name: 'Medical Storage Cabinet',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Storage Cabinet
    description: 'Secure storage cabinet for medical supplies with adjustable shelves and lockable doors.',
    brand: 'CareLine',
    category: 'Medical',
    price: 499.99,
    countInStock: 9,
    color: 'Grey',
    rating: 4.6,
    numReviews: 8,
  },
  {
    name: 'Examination Light',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Examination Light
    description: 'LED examination light with adjustable arm and intensity control for precise illumination.',
    brand: 'SurgicalPro',
    category: 'Medical',
    price: 429.99,
    countInStock: 11,
    color: 'White',
    discount: 8,
    rating: 4.7,
    numReviews: 13,
  },
  {
    name: 'Medical Stool',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Medical Stool
    description: 'Ergonomic medical stool with adjustable height and backrest for long procedures.',
    brand: 'HealthCarePlus',
    category: 'Medical',
    price: 189.99,
    countInStock: 15,
    color: 'Black',
    discount: 15,
    rating: 4.4,
    numReviews: 17,
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
      console.error('Error: No admin user found. Please create an admin user first.'.red.bold);
      process.exit(1);
    }

    // Add admin as owner and generate slugs
    const productsWithOwner = sampleProducts.map(product => ({
      ...product,
      user: adminUser._id,
      slug: generateSlug(product.name)
    }));

    // Insert products
    await Product.insertMany(productsWithOwner);
    
    console.log('Data imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

importData();
