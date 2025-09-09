import { createRazorpayRequest, verifyPaymentSignature } from '../utils/razorpay.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import Order from '../models/orderModel.js';

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  console.log('Creating Razorpay order with amount:', req.body.amount);
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    console.error('Invalid amount provided:', amount);
    return next(new ErrorResponse('Please provide a valid amount', 400));
  }

  // Amount is already in paise from frontend
  const paymentAmount = Math.round(amount);

  const options = {
    amount: paymentAmount,
    currency: 'INR',
    receipt: `order_rcpt_${Date.now()}`,
    payment_capture: 1 // Auto capture payment
  };

  try {
    console.log('Creating Razorpay order with options:', options);
    const order = await createRazorpayRequest('orders.create', options);
    
    if (!order || !order.id) {
      console.error('Invalid order response from Razorpay:', order);
      return next(new ErrorResponse('Invalid response from payment gateway', 500));
    }
    
    console.log('Order created successfully:', order.id);
    
    // Ensure the response has all required fields
    const response = {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      created_at: order.created_at,
      receipt: order.receipt
    };
    
    res.status(200).json({
      success: true,
      order: response
    });
  } catch (error) {
    console.error('Razorpay order creation error:', {
      message: error.message,
      statusCode: error.statusCode || error.status_code,
      error: error.error || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    const errorMessage = error.error?.description || 
                        error.error?.message || 
                        error.message || 
                        'Failed to create payment order';
    
    return next(new ErrorResponse(`Error creating order: ${errorMessage}`, 500));
  }
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res, next) => {
  // Get payment details from request body
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = req.body;
  
  try {
    // Log the request (masking sensitive data in logs)
    console.log('=== PAYMENT VERIFICATION REQUEST ===');
    console.log('Order ID:', order_id);
    console.log('Razorpay Order ID:', razorpay_order_id);
    console.log('Razorpay Payment ID:', razorpay_payment_id);
    console.log('Signature:', '***' + (razorpay_signature ? razorpay_signature.slice(-4) : 'none'));
    
    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      const missingFields = [];
      if (!razorpay_payment_id) missingFields.push('razorpay_payment_id');
      if (!razorpay_order_id) missingFields.push('razorpay_order_id');
      if (!razorpay_signature) missingFields.push('razorpay_signature');
      
      console.error('Missing required payment verification fields:', missingFields);
      return next(new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    console.log('Step 1: Verifying payment signature...');
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not set in environment variables');
      return next(new ErrorResponse('Payment verification configuration error', 500));
    }
    
    // Verify the signature using our utility function
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    
    if (!isSignatureValid) {
      console.error('Invalid payment signature');
      return next(new ErrorResponse('Payment verification failed: Invalid signature', 400));
    }
    
    console.log('Step 2: Signature verification successful');
    
    // Verify payment status with Razorpay
    console.log('Step 3: Verifying payment status with Razorpay...');
    const payment = await createRazorpayRequest('payments.fetch', razorpay_payment_id);
    
    if (!payment) {
      console.error('No payment details returned from Razorpay');
      return next(new ErrorResponse('Payment not found in Razorpay system', 404));
    }
    
    console.log('Payment details:', {
      payment_id: payment.id,
      order_id: payment.order_id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency
    });
    
    // Additional validation
    if (payment.order_id !== razorpay_order_id) {
      console.error('Order ID mismatch:', {
        expected: razorpay_order_id,
        actual: payment.order_id,
        payment_id: razorpay_payment_id
      });
      return next(new ErrorResponse('Payment verification failed: Order ID mismatch', 400));
    }
    
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      console.error('Payment not captured or authorized. Status:', payment.status);
      return next(new ErrorResponse(`Payment not completed. Status: ${payment.status}`, 400));
    }
    
    // For Razorpay, we don't need to find an existing order
    // as we'll create it after successful verification
    // Just verify the payment with Razorpay
    console.log('Payment verification successful with Razorpay');
    
    // Return success response with payment details
    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        timestamp: payment.created_at
      }
    });
    
    // Update order status and payment details
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: payment.status,
      update_time: payment.created_at,
      email_address: req.user?.email || 'unknown@example.com'
    };
    
    const updatedOrder = await order.save();
    
    console.log('Order updated successfully:', updatedOrder._id);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
      payment: {
        id: payment.id,
        orderId: razorpay_order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        captured: payment.captured,
        timestamp: payment.created_at
      }
    });
    
  } catch (error) {
    console.error('Payment verification error:', {
      error: error.message,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    const errorMessage = error.error?.description || 
                       error.error?.message || 
                       error.message || 
                       'Failed to verify payment';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});
