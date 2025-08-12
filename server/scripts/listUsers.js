import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // List all users
    const users = await User.find({}).select('name email role');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log('\nExisting Users:');
      console.log('---------------');
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role} (${user.role === 'admin' ? 'Admin' : 'Regular User'})`);
      });
    }
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    process.exit();
  }
};

listUsers();
