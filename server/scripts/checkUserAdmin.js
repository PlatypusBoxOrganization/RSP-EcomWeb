import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();

const checkUserAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find the user by email
    const user = await User.findOne({ email }).select('name email isAdmin');
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    console.log('\nUser Details:');
    console.log('------------');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('Error checking user admin status:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    process.exit();
  }
};

// Get email from command line arguments or use the provided email
const email = process.argv[2] || 'amoghhambarde123@gmail.com';
checkUserAdmin(email);
