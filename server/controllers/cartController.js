import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if item already in cart
  const user = await User.findById(req.user._id);
  const existingItemIndex = user.cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  let updatedCartItems = [...user.cart.items];
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    updatedCartItems[existingItemIndex].quantity += Number(quantity);
  } else {
    // Add new item
    updatedCartItems.push({
      product: productId,
      quantity: Number(quantity)
    });
  }

  // Calculate total price and items
  const totalPrice = updatedCartItems.reduce((total, item) => {
    return total + (item.quantity * product.price);
  }, 0);

  const totalItems = updatedCartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  // Update user's cart
  user.cart = {
    items: updatedCartItems,
    totalPrice,
    totalItems
  };

  await user.save();
  
  res.status(201).json({
    success: true,
    cart: user.cart
  });
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.items.product', 'name price image countInStock');
  
  res.json({
    success: true,
    cart: user.cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const user = await User.findById(req.user._id);
  const itemIndex = user.cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Update quantity
  user.cart.items[itemIndex].quantity = Number(quantity);
  
  // Recalculate totals
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
    cart: user.cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const user = await User.findById(req.user._id);
  
  const initialLength = user.cart.items.length;
  user.cart.items = user.cart.items.filter(
    (item) => item._id.toString() !== itemId
  );
  
  if (initialLength === user.cart.items.length) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  // Recalculate totals if items remain
  if (user.cart.items.length > 0) {
    const populatedUser = await user.populate('cart.items.product', 'price');
    
    user.cart.totalPrice = populatedUser.cart.items.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);
    
    user.cart.totalItems = populatedUser.cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  } else {
    // Reset cart if empty
    user.cart = {
      items: [],
      totalPrice: 0,
      totalItems: 0
    };
  }
  
  await user.save();
  
  res.json({
    success: true,
    cart: user.cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  user.cart = {
    items: [],
    totalPrice: 0,
    totalItems: 0
  };
  
  await user.save();
  
  res.json({
    success: true,
    message: 'Cart cleared successfully'
  });
});
