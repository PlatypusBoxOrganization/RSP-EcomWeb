import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();

const makeAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`\nSuccess! ${user.name} (${user.email}) has been promoted to admin.`);
    
  } catch (error) {
    console.error('Error updating user to admin:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    process.exit();
  }
};

// Get email from command line arguments or use the provided email
const email = process.argv[2] || 'amoghhambarde123@gmail.com';
makeAdmin(email);
