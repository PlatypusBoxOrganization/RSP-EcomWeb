import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Demo account used when MongoDB is unreachable (local development fallback)
export const DEMO_USER = {
  _id: '60d5ec49e1b0dc2c4c8d8f99',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '9999999999',
  password: 'demo123',
  role: 'user',
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user with email or phone already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Phone number';
      return res.status(400).json({
        success: false,
        error: `${field} is already in use`
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user'
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    // Fallback error handling in case something else goes wrong
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// Issue a JWT for the demo user (used when MongoDB is unreachable)
export const issueDemoToken = () => {
  return jwt.sign({ id: DEMO_USER._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an email and password'
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    // Fallback to demo account when MongoDB is unreachable
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const token = issueDemoToken();
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: DEMO_USER._id,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          phone: DEMO_USER.phone,
          role: DEMO_USER.role
        }
      });
    }
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // If user is the demo user (DB unreachable), return it directly
    if (req.user && String(req.user._id) === String(DEMO_USER._id)) {
      return res.status(200).json({
        success: true,
        data: req.user
      });
    }
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
