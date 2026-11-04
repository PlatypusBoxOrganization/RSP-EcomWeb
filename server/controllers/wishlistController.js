import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { DEMO_USER } from './authController.js';

// In-memory wishlist for the demo user (used when MongoDB is unreachable)
const demoWishlist = [];

const isDemo = (user) => user && String(user._id) === String(DEMO_USER._id);

// Mock products (same data the /api/products route falls back to)
const mockProducts = [
  { _id: '60d5ec49e1b0dc2c4c8d8f1a', name: 'Arduino Uno R3', price: 25.99, image: '/Images/placeholder.webp', countInStock: 50 },
  { _id: '60d5ec49e1b0dc2c4c8d8f1b', name: 'Raspberry Pi 4 Model B', price: 55, image: '/Images/placeholder.webp', countInStock: 30 },
  { _id: '60d5ec49e1b0dc2c4c8d8f1c', name: 'ESP32 Development Board', price: 12.5, image: '/Images/placeholder.webp', countInStock: 100 },
  { _id: '60d5ec49e1b0dc2c4c8d8f1d', name: 'Breadboard 830 Points', price: 8.99, image: '/Images/placeholder.webp', countInStock: 200 },
  { _id: '60d5ec49e1b0dc2c4c8d8f1e', name: 'Jumper Wires Kit', price: 6.99, image: '/Images/placeholder.webp', countInStock: 150 },
  { _id: '60d5ec49e1b0dc2c4c8d8f1f', name: 'Servo Motor SG90', price: 3.99, image: '/Images/placeholder.webp', countInStock: 300 },
];

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (isDemo(req.user)) {
    if (!mockProducts.some(p => String(p._id) === String(productId))) {
      res.status(404);
      throw new Error('Product not found');
    }
    if (demoWishlist.some(id => String(id) === String(productId))) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }
    demoWishlist.push(productId);
    const populated = demoWishlist.map(id => ({
      product: mockProducts.find(p => String(p._id) === String(id)) || { _id: id },
      addedAt: new Date().toISOString()
    }));
    return res.status(201).json({ success: true, message: 'Product added to wishlist', wishlist: populated });
  }

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  
  // Check if already in wishlist
  const alreadyInWishlist = user.wishlist.some(
    (item) => item.product.toString() === productId
  );

  if (alreadyInWishlist) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  // Add to wishlist
  user.wishlist.push({ product: productId });
  await user.save();
  
  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    wishlist: user.wishlist
  });
});

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  if (isDemo(req.user)) {
    const populated = demoWishlist.map(id => ({
      product: mockProducts.find(p => String(p._id) === String(id)) || { _id: id },
      addedAt: new Date().toISOString()
    }));
    return res.json({ success: true, wishlist: populated });
  }

  const user = await User.findById(req.user._id).populate({
    path: 'wishlist.product',
    select: 'name price image countInStock'
  });

  res.json({
    success: true,
    wishlist: user.wishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (isDemo(req.user)) {
    const initialLength = demoWishlist.length;
    for (let i = demoWishlist.length - 1; i >= 0; i--) {
      if (String(demoWishlist[i]) === String(productId)) {
        demoWishlist.splice(i, 1);
      }
    }
    if (initialLength === demoWishlist.length) {
      res.status(404);
      throw new Error('Product not found in wishlist');
    }
    const populated = demoWishlist.map(id => ({
      product: mockProducts.find(p => String(p._id) === String(id)) || { _id: id },
      addedAt: new Date().toISOString()
    }));
    return res.json({ success: true, message: 'Product removed from wishlist', wishlist: populated });
  }

  const user = await User.findById(req.user._id);
  
  const initialLength = user.wishlist.length;
  user.wishlist = user.wishlist.filter(
    (item) => item.product.toString() !== productId
  );
  
  if (initialLength === user.wishlist.length) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Product removed from wishlist',
    wishlist: user.wishlist
  });
});

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
export const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;
  
  // First remove from wishlist
  const user = await User.findById(req.user._id);
  const wishlistItem = user.wishlist.find(
    (item) => item.product.toString() === productId
  );
  
  if (!wishlistItem) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }
  
  // Remove from wishlist
  user.wishlist = user.wishlist.filter(
    (item) => item.product.toString() !== productId
  );
  
  // Add to cart
  const existingCartItemIndex = user.cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  
  if (existingCartItemIndex >= 0) {
    // Update quantity if already in cart
    user.cart.items[existingCartItemIndex].quantity += Number(quantity);
  } else {
    // Add new item to cart
    user.cart.items.push({
      product: productId,
      quantity: Number(quantity)
    });
  }
  
  // Recalculate cart totals
  const populatedUser = await user.populate('cart.items.product', 'price');
  
  user.cart.totalPrice = populatedUser.cart.items.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);
  
  user.cart.totalItems = populatedUser.cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Product moved to cart',
    wishlist: user.wishlist,
    cart: user.cart
  });
});
