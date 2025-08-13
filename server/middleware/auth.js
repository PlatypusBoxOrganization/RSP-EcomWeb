import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * @desc    Protect routes with JWT authentication
 * @access  Private
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the cookie first
  token = req.cookies?.jwt;

  // If no cookie, check Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid token format');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401);
    throw new Error('Not authorized, token verification failed');
  }
});

/**
 * @desc    Grant access to specific roles
 * @param   {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${req.user?.role} is not authorized to access this route`
      );
    }
    next();
  };
};

/**
 * @desc    Check if user is admin
 * @access  Private/Admin
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};
