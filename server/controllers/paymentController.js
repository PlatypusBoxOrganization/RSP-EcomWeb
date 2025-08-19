import { createHmac } from 'crypto';
import { createRazorpayRequest } from '../utils/razorpay.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

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
  // Log the complete request body for debugging (mask sensitive data)
  const loggableBody = { ...req.body };
  if (loggableBody.razorpay_signature) {
    loggableBody.razorpay_signature = '***';
  }
  
  console.log('=== PAYMENT VERIFICATION REQUEST ===');
  console.log('Request body:', JSON.stringify(loggableBody, null, 2));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  
  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error('Missing required fields for payment verification:', {
      razorpay_order_id: !!razorpay_order_id,
      razorpay_payment_id: !!razorpay_payment_id,
      razorpay_signature: !!razorpay_signature
    });
    return next(new ErrorResponse('Missing required payment verification data', 400));
  }

  try {
    console.log('Step 1: Verifying payment signature...');
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not set in environment variables');
      throw new Error('Server configuration error');
    }
    
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(data)
      .digest('hex');
    
    console.log('Signature verification details:', {
      data,
      generatedSignature,
      receivedSignature: razorpay_signature ? '***' : 'missing',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'set' : 'missing'
    });

    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      console.error('Invalid signature received:', {
        received: razorpay_signature,
        generated: generatedSignature,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
      return next(new ErrorResponse('Payment verification failed: Invalid signature', 400));
    }

    console.log('Signature verified successfully for order:', razorpay_order_id);

    // 2. Fetch payment details from Razorpay
    console.log('Step 2: Fetching payment details from Razorpay...');
    let payment;
    try {
      payment = await createRazorpayRequest('payments.fetch', razorpay_payment_id);
      console.log('Payment details received from Razorpay:', {
        payment_id: payment?.id,
        status: payment?.status,
        amount: payment?.amount,
        order_id: payment?.order_id,
        method: payment?.method,
        captured: payment?.captured
      });
    } catch (fetchError) {
      console.error('Error fetching payment details from Razorpay:', {
        error: fetchError.message,
        statusCode: fetchError.statusCode,
        errorDetails: fetchError.error || fetchError,
        payment_id: razorpay_payment_id
      });
      return next(new ErrorResponse(`Failed to fetch payment details: ${fetchError.message}`, 500));
    }
    
    if (!payment) {
      console.error('No payment details returned from Razorpay for payment ID:', razorpay_payment_id);
      return next(new ErrorResponse('Payment not found in Razorpay system', 404));
    }

    console.log('Payment details received:', {
      payment_id: payment.id,
      order_id: payment.order_id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency
    });
    
    // 3. Additional validation
    if (payment.order_id !== razorpay_order_id) {
      console.error('Order ID mismatch:', {
        expected: razorpay_order_id,
        actual: payment.order_id,
        payment_id: razorpay_payment_id
      });
      return next(new ErrorResponse('Payment verification failed: Order ID mismatch', 400));
    }

    if (payment.status !== 'captured') {
      return next(new ErrorResponse(`Payment status is ${payment.status}`, 400));
    }

    try {
      // 4. Update your database with the payment details
      // Example (uncomment and modify as needed):
      // const updatedOrder = await Order.findByIdAndUpdate(
      //   order_id,
      //   {
      //     status: 'paid',
      //     paymentStatus: 'captured',
      //     paymentId: razorpay_payment_id,
      //     paymentMethod: payment.method,
      //     paymentDetails: {
      //       amount: payment.amount,
      //       currency: payment.currency,
      //       captured: true,
      //       paymentDate: new Date()
      //     }
      //   },
      //   { new: true }
      // );

      console.log('Payment verification successful:', {
        payment_id: payment.id,
        order_id: razorpay_order_id,
        amount: payment.amount,
        currency: payment.currency
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          amount: payment.amount,
          amount_paid: payment.amount_paid || payment.amount,
          amount_due: payment.amount_due || 0,
          currency: payment.currency,
          method: payment.method,
          created_at: payment.created_at,
          captured: payment.captured,
          description: payment.description || '',
          bank: payment.bank || null,
          wallet: payment.wallet || null,
          vpa: payment.vpa || null,
          email: payment.email || null,
          contact: payment.contact || null
        }
      });
    } catch (dbError) {
      console.error('Database update error during payment verification:', {
        error: dbError.message,
        stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
      
      // Even if database update fails, we still return success to Razorpay
      // but log the error for admin review
      res.status(200).json({
        success: true,
        message: 'Payment verified but database update failed',
        payment: {
          id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          databaseUpdateFailed: true
        },
        warning: 'Payment verified but database update failed. Please check server logs.'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', {
      error: error.message,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      stack: error.stack
    });
    return next(new ErrorResponse(`Payment verification failed: ${error.message}`, 500));
  }
});
