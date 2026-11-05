import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc Get all users (admin only)
// @route GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});
