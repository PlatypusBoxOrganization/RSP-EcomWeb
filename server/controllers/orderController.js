import asyncHandler from '../middleware/async.js';
import { Order, orderStatus } from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

// Initialize WebSocket server
let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join_admin_room', () => {
      socket.join('admin_room');
      console.log('Admin joined admin room');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

// Helper to emit order update events
const emitOrderUpdate = (order) => {
  if (io) {
    io.to('admin_room').emit('order_updated', order);
    io.to(`user_${order.user}`).emit('order_updated', order);
  }
};

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
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    razorpayOrderId, 
    razorpayPaymentId, 
    razorpaySignature,
    isPaid = false,
    paidAt = null,
    status = orderStatus.PLACED
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate payment method
  if (!paymentMethod) {
    res.status(400);
    throw new Error('Payment method is required');
  }

  // Validate Razorpay details for Razorpay payments
  if (paymentMethod === 'Razorpay' && (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)) {
    res.status(400);
    throw new Error('Missing Razorpay payment details');
  }

  // Validate order items and calculate prices
  const { validatedItems, itemsPrice } = await validateOrderItems(orderItems);
  
  // Calculate shipping price (free for orders over $100)
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  
  // Calculate tax (10% of items price)
  const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
  
  // Calculate total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create order
  const orderData = {
    user: req.user._id,
    orderItems: validatedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status,
    isPaid,
    statusHistory: [{
      status: status,
      changedAt: new Date(),
      changedBy: req.user._id,
      reason: `Order ${status}`
    }]
  };

  // Add Razorpay details if payment method is Razorpay
  if (paymentMethod === 'Razorpay') {
    orderData.razorpayOrderId = razorpayOrderId;
    orderData.razorpayPaymentId = razorpayPaymentId;
    orderData.razorpaySignature = razorpaySignature;
    
    if (isPaid) {
      const paidDate = paidAt ? new Date(paidAt) : new Date();
      orderData.paidAt = paidDate;
      orderData.paymentResult = {
        id: razorpayPaymentId,
        status: 'completed',
        update_time: paidDate.toISOString()
      };
    }
  }

  const order = new Order(orderData);

  const createdOrder = await order.save();
  emitOrderUpdate(createdOrder);
  
  // Populate user and order items for the response
  const populatedOrder = await Order.findById(createdOrder._id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price');
  
  // Format the response to match frontend expectations
  const response = {
    success: true,
    message: 'Order created successfully',
    order: populatedOrder.toObject(),
    _id: populatedOrder._id
  };
  
  res.status(201).json(response);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price countInStock');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only the user who placed the order or admin can view it
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Verify payment with Razorpay
  // Note: In a real app, you should verify the payment signature here
  // const isValidSignature = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  // if (!isValidSignature) {
  //   res.status(400);
  //   throw new Error('Invalid payment signature');
  // }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: razorpay_payment_id,
    status: 'completed',
    update_time: new Date().toISOString(),
    email_address: req.user.email
  };
  order.status = orderStatus.PROCESSING;
  order.statusHistory.push({
    status: orderStatus.PROCESSING,
    changedAt: new Date(),
    changedBy: req.user._id,
    reason: 'Payment received'
  });

  // Update product stock
  await Promise.all(
    order.orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }
    })
  );

  const updatedOrder = await order.save();
  emitOrderUpdate(updatedOrder);

  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!order.isPaid) {
    res.status(400);
    throw new Error('Order is not paid');
  }

  order.status = orderStatus.DELIVERED;
  order.deliveredAt = Date.now();
  order.statusHistory.push({
    status: orderStatus.DELIVERED,
    changedAt: new Date(),
    changedBy: req.user._id,
    reason: 'Order delivered to customer'
  });

  const updatedOrder = await order.save();
  emitOrderUpdate(updatedOrder);

  res.json(updatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, reason } = req.body;
  
  if (!Object.values(orderStatus).includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Prevent status changes for cancelled or delivered orders
  if (order.status === orderStatus.CANCELLED || order.status === orderStatus.DELIVERED) {
    res.status(400);
    throw new Error(`Cannot update status of ${order.status} order`);
  }

  // Special handling for cancellation
  if (status === orderStatus.CANCELLED) {
    order.cancelledAt = Date.now();
    order.cancelledBy = req.user._id;
    order.cancellationReason = reason || 'No reason provided';
    
    // Restore product stock if order was paid
    if (order.isPaid) {
      await Promise.all(
        order.orderItems.map(async (item) => {
          const product = await Product.findById(item.product);
          if (product) {
            product.countInStock += item.quantity;
            product.sold -= item.quantity;
            await product.save();
          }
        })
      );
    }
  }

  order.status = status;
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy: req.user._id,
    reason: reason || 'Status updated by admin'
  });

  const updatedOrder = await order.save();
  emitOrderUpdate(updatedOrder);

  res.json(updatedOrder);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only the user who placed the order or admin can cancel it
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to cancel this order');
  }

  if (!order.canBeCancelled()) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.status = orderStatus.CANCELLED;
  order.cancelledAt = Date.now();
  order.cancelledBy = req.user._id;
  order.cancellationReason = reason || 'Cancelled by customer';
  
  order.statusHistory.push({
    status: orderStatus.CANCELLED,
    changedAt: new Date(),
    changedBy: req.user._id,
    reason: reason || 'Cancelled by customer'
  });

  // Restore product stock if order was paid
  if (order.isPaid) {
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.quantity;
          product.sold = Math.max(0, product.sold - item.quantity); // Ensure sold count doesn't go below 0
          await product.save();
        }
      })
    );
  }

  const updatedOrder = await order.save();
  
  // Emit order update event
  if (io) {
    emitOrderUpdate(updatedOrder);
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order: updatedOrder
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  
  const status = req.query.status;
  const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
  const search = req.query.search;

  let query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (dateFrom && dateTo) {
    query.createdAt = {
      $gte: dateFrom,
      $lte: dateTo
    };
  }

  // Search by order number or user name/email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }).select('_id');
    
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } },
      { 'shippingAddress.email': { $regex: search, $options: 'i' } },
      { user: { $in: users.map(u => u._id) } }
    ];
  }

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'id name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  try {
    console.log('getMyOrders called with user:', req.user);
    
    if (!req.user || !req.user._id) {
      console.error('No user found in request');
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const status = req.query.status;
    
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    console.log('Querying orders with:', { query, page, pageSize });
    
    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    console.log(`Found ${orders.length} orders out of ${count} total`);
    
    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error('Error in getMyOrders:', {
      message: error.message,
      stack: error.stack,
      user: req.user ? { id: req.user._id } : 'No user'
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
