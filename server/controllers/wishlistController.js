import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

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
