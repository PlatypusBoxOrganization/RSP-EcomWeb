import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple test endpoint
router.get('/status', (req, res) => {
  console.log('Test status endpoint hit');
  res.json({ 
    success: true, 
    message: 'Test endpoint is working',
    time: new Date().toISOString() 
  });
});

// Test order endpoint (no auth)
router.post('/test-order', asyncHandler(async (req, res) => {
  console.log('Test order endpoint hit with body:', req.body);
  res.json({
    success: true,
    message: 'Test order endpoint working',
    data: req.body
  });
}));

// Test order creation with auth
router.post('/create-test-order', protect, asyncHandler(async (req, res) => {
  console.log('Test order creation with user:', req.user);
  res.json({
    success: true,
    message: 'Test order created successfully',
    user: req.user.id,
    timestamp: new Date().toISOString()
  });
}));

export default router;
