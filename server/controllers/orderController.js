import asyncHandler from '../middleware/async.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// @desc    Validate order items before order creation
const validateOrderItems = async (orderItems) => {
  const validatedItems = [];
  const invalidItems = [];
  let itemsPrice = 0;
  
  console.log('Validating order items:', JSON.stringify(orderItems, null, 2));
  
  for (const item of orderItems) {
    try {
      console.log(`Processing order item:`, item);
      
      // Try to find the product by ID
      const product = await Product.findById(item.product);
      
      if (!product) {
        console.error(`Product not found with ID: ${item.product}`);
        invalidItems.push({
          productId: item.product,
          name: item.name || 'Unknown Product',
          reason: 'Product not found in database',
          details: `No product found with ID: ${item.product}`
        });
        continue;
      }
      
      // Check if product is active
      if (product.isActive === false) {
        console.error(`Product is inactive: ${product._id} - ${product.name}`);
        invalidItems.push({
          productId: product._id,
          name: product.name,
          reason: 'Product is not available',
          details: 'This product is currently not available for purchase'
        });
        continue;
      }
      
      // Check stock
      if (product.countInStock < item.quantity) {
        console.error(`Insufficient stock for product: ${product._id} - ${product.name}. Available: ${product.countInStock}, Requested: ${item.quantity}`);
        invalidItems.push({
          productId: product._id,
          name: product.name,
          reason: 'Insufficient stock',
          available: product.countInStock,
          requested: item.quantity,
          details: `Only ${product.countInStock} items available in stock`
        });
        continue;
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
        details: error.stack || 'No additional details available'
      });
    }
  }
  
  return { validatedItems, invalidItems, itemsPrice };
};

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

    if (!razorpayOrderId || !razorpayPaymentId) {
      console.error('Razorpay order ID and payment ID are required');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Missing payment details'
      });
    }
    
    // Validate all order items
    const { validatedItems, invalidItems, itemsPrice } = await validateOrderItems(orderItems);
    
    // If there are any invalid items, return them to the client
    if (invalidItems.length > 0) {
      console.error('Order contains invalid items:', invalidItems);
      return res.status(400).json({
        success: false,
        message: 'Some items in your cart are no longer available',
        invalidItems,
        validItems: validatedItems
      });
    }
    
    // Calculate order totals
    const shippingPrice = itemsPrice > 0 ? 5.99 : 0; // Example shipping calculation
    const taxPrice = Number((0.1 * itemsPrice).toFixed(2)); // Example 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Verify all products exist and update inventory
    const orderItemsWithProducts = [];
    let orderTotal = 0;
    
    for (const item of orderItems) {
      try {
        const product = await Product.findById(item.product);
        
        if (!product) {
          console.error(`Product not found: ${item.product}`);
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`,
            productId: item.product
          });
        }
        
        // Check if product is in stock
        if (product.countInStock < item.quantity) {
          console.error(`Not enough stock for: ${product.name}. Requested: ${item.quantity}, Available: ${product.countInStock}`);
          return res.status(400).json({
            success: false,
            message: `Not enough stock for: ${product.name}. Available: ${product.countInStock}`,
            productId: product._id,
            available: product.countInStock
          });
        }
        
        // Calculate item total
        const itemTotal = product.price * item.quantity;
        orderTotal += itemTotal;
        
        orderItemsWithProducts.push({
          name: product.name,
          quantity: item.quantity,
          image: product.image,
          price: product.price,
          product: item.product,
          total: itemTotal
        });
        
        // Update product stock
        product.countInStock -= item.quantity;
        await product.save();
        
      } catch (error) {
        console.error(`Error processing product ${item.product}:`, error);
        return res.status(500).json({
          success: false,
          message: `Error processing product: ${error.message}`,
          productId: item.product
        });
      }
    }
    
    // Create order
    const order = new Order({
      orderItems: orderItemsWithProducts,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: orderTotal,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: orderTotal + (shippingPrice || 0) + (taxPrice || 0),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isPaid: true,
      paidAt: Date.now()
    });
    
    const createdOrder = await order.save();
  } catch (error) {
    console.error('=== ERROR IN CREATE ORDER ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      errors: error.errors
    });
    
    // Send detailed error in development, generic in production
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        success: false,
        message: `Error creating order: ${error.message}`,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code,
          keyPattern: error.keyPattern,
          keyValue: error.keyValue
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating order. Please try again.'
      });
    }
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
    order.deliveredAt = Date.now();
    order.status = 'delivered';

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
