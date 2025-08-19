import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required Razorpay environment variables: ${missingVars.join(', ')}`);
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Enhanced Razorpay request handler
const createRazorpayRequest = async (methodPath, ...args) => {
  console.log(`Razorpay API Request: ${methodPath}`, { args });
  
  try {
    // Special handling for payments.fetch
    if (methodPath === 'payments.fetch') {
      const paymentId = args[0];
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }
      return await razorpay.payments.fetch(paymentId);
    }
    
    // Special handling for orders.create
    if (methodPath === 'orders.create') {
      const orderOptions = args[0];
      return await razorpay.orders.create(orderOptions);
    }
    
    // Generic method handler
    const methodParts = methodPath.split('.');
    let method = razorpay;
    
    for (const part of methodParts) {
      method = method[part];
      if (!method) {
        throw new Error(`Razorpay method not found: ${methodPath}`);
      }
    }
    
    const result = await method.apply(razorpay, args);
    console.log(`Razorpay API ${methodPath} success:`, result);
    return result;
    
  } catch (error) {
    const errorDetails = {
      method: methodPath,
      error: error.message,
      statusCode: error.statusCode || error.status_code,
      errorResponse: error.error || error.description,
      code: error.code
    };
    
    console.error('Razorpay API Error:', errorDetails);
    
    // Enhance the error with more details
    const enhancedError = new Error(error.message || 'Razorpay API Error');
    Object.assign(enhancedError, errorDetails);
    
    throw enhancedError;
  }
};

export default razorpay;
export { createRazorpayRequest };
