import crypto from 'crypto';

/**
 * Generate HMAC-SHA256 signature for Razorpay payment verification
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} secret - Razorpay webhook secret or API secret
 * @returns {string} - Generated HMAC-SHA256 signature
 */
export const generateHmacSignature = (orderId, paymentId, secret) => {
  if (!orderId || !paymentId || !secret) {
    throw new Error('Missing required parameters for HMAC generation');
  }
  
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    return hmac.digest('hex');
  } catch (error) {
    console.error('Error generating HMAC signature:', error);
    throw new Error('Failed to generate payment signature');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature to verify
 * @param {string} secret - Razorpay webhook secret or API secret
 * @returns {boolean} - True if signature is valid, false otherwise
 */
export const verifyPaymentSignature = (orderId, paymentId, signature, secret) => {
  if (!orderId || !paymentId || !signature || !secret) {
    console.error('Missing required parameters for signature verification');
    return false;
  }
  
  try {
    const generatedSignature = generateHmacSignature(orderId, paymentId, secret);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
    
    if (!isValid) {
      console.error('Signature verification failed');
      console.debug('Generated signature:', generatedSignature);
      console.debug('Received signature:', signature);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};
