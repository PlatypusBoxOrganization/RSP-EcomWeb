import asyncHandler from '../middleware/async.js';
import { Order, orderStatus } from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Validate order items before order creation
const validateOrderItems = async (orderItems) => {
  const validatedItems = [];
  const invalidItems = [];
  let itemsPrice = 0;
  
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('No order items provided');
  }

  for (const item of orderItems) {
    try {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        invalidItems.push({
          productId: item.product,
          reason: 'Invalid product ID format'
        });
        continue;
      }

      const product = await Product.findById(item.product);
      
      if (!product) {
        invalidItems.push({
          productId: item.product,
          reason: 'Product not found'
        });
        continue;
      }
      
      if (product.isActive === false) {
        invalidItems.push({
          productId: product._id,
          name: product.name,
          reason: 'Product is not available'
        });
        continue;
      }
      
      const quantity = Number(item.quantity) || 0;
      if (quantity <= 0) {
        invalidItems.push({
          productId: product._id,
          name: product.name,
          reason: 'Invalid quantity',
          requested: quantity
        });
        continue;
      }
      
      if (product.countInStock < quantity) {
        invalidItems.push({
          productId: product._id,
          name: product.name,
          reason: 'Insufficient stock',
          available: product.countInStock,
          requested: quantity
        });
        continue;
      }
      
      const itemPrice = product.discount > 0 
        ? product.price * (1 - (product.discount / 100))
        : product.price;
        
      const itemTotal = itemPrice * quantity;
      itemsPrice += itemTotal;
      
      validatedItems.push({
        name: product.name,
        quantity,
        image: product.images?.[0] || '/images/default-product.png',
        price: itemPrice,
        product: product._id,
        total: itemTotal
      });
      
    } catch (error) {
      console.error(`Error validating product ${item.product || 'unknown'}:`, error);
      invalidItems.push({
        productId: item.product || 'unknown',
        reason: 'Error validating product',
        error: error.message
      });
    }
  }
  
  if (invalidItems.length > 0) {
    const error = new Error('Some items in your order are invalid');
    error.invalidItems = invalidItems;
    throw error;
  }
  
  return { validatedItems, itemsPrice };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  console.log('=== CREATE ORDER REQUEST ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('User:', req.user);

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      user: userId
    } = req.body;

    // Basic validation
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Missing payment details'
      });
    }
      
      // Calculate item total using the correct price (accounting for discount if any)
      const itemPrice = product.discount > 0 
        ? product.price * (1 - (product.discount / 100))
        : product.price;
        
      const itemTotal = itemPrice * item.quantity;
      itemsPrice += itemTotal;
      
      console.log(`Adding validated item: ${product.name} (${product._id}), Qty: ${item.quantity}, Price: ${itemPrice}, Total: ${itemTotal}`);
      
      validatedItems.push({
        name: product.name,
        quantity: item.quantity,
        image: product.image,
        price: itemPrice, // Use the calculated price (with discount if any)
        product: product._id,
        total: itemTotal
      });
      
    } catch (error) {
      console.error(`Error validating product ${item.product || 'unknown'}:`, error);
      console.error('Error stack:', error.stack);
      invalidItems.push({
        productId: item.product || 'unknown',
        name: item.name || 'Unknown Product',
        reason: 'Error validating product',
        error: error.message,
        error: error.message
      });
    }
  }
  
  if (invalidItems.length > 0) {
    const error = new Error('Some items in your order are invalid');
    error.invalidItems = invalidItems;
    throw error;
  }
  
  return { validatedItems, itemsPrice };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  console.log('=== CREATE ORDER REQUEST ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('User:', req.user);

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Razorpay',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    // Validate required fields
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      console.error('No order items provided or invalid format');
      return res.status(400).json({
        success: false,
        message: 'No order items provided or invalid format'
      });
    }

    if (!shippingAddress) {
      console.error('Shipping address is required');
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Missing payment details'
      });
    }

    // Validate order items and calculate prices
    const { validatedItems, itemsPrice } = await validateOrderItems(orderItems);
    
    // Calculate shipping and tax
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = Number((itemsPrice * 0.02).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    // Create order
    const order = new Order({
      user: userId,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'processing'
    });

    // Save order and update product stock
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const createdOrder = await order.save({ session });
      
      // Update product stock
      for (const item of order.orderItems) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { countInStock: -item.quantity } },
          { session }
        );
      }
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(201).json({
        success: true,
        order: createdOrder
      });
      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate order detected. Please contact support if this is an error.'
      });
    }
    
    // Handle invalid items error
    if (error.invalidItems) {
      return res.status(400).json({
        success: false,
        message: 'Some items in your order are invalid',
        invalidItems: error.invalidItems
      });
    }
    
    // Generic error response
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An error occurred while creating your order';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate status update
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Update status and timestamps
  order.status = status;
  
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  } else if (status === 'cancelled') {
    // Restore product quantities if order is cancelled
    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { countInStock: item.quantity } }
      );
    }
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
