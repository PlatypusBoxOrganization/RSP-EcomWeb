const crypto = require('crypto');
require('dotenv').config();

// Test payment details
const testPayment = {
  razorpay_order_id: "order_R8HrPFxh7f1O95",
  razorpay_payment_id: "pay_R8HreEVKM1RXMZ",
  razorpay_signature: "a7fb38e2b43dabe34735be7319e3436b3a5a628a43f5b4fd6bfad5534c8c4161"
};

// Get the Razorpay key secret from environment variables
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keySecret) {
  console.error('Error: RAZORPAY_KEY_SECRET is not set in environment variables');
  process.exit(1);
}

// Function to verify the signature
function verifySignature(orderId, paymentId, signature, keySecret) {
  try {
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');
    
    // Compare the signatures in a timing-safe manner
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Verify the signature
const isSignatureValid = verifySignature(
  testPayment.razorpay_order_id,
  testPayment.razorpay_payment_id,
  testPayment.razorpay_signature,
  keySecret
);

// Output the result
console.log('=== RAZORPAY PAYMENT VERIFICATION ===');
console.log('Order ID:', testPayment.razorpay_order_id);
console.log('Payment ID:', testPayment.razorpay_payment_id);
console.log('Signature (last 4 chars):', '***' + testPayment.razorpay_signature.slice(-4));
console.log('Key Secret (first 4 chars):', keySecret ? keySecret.substring(0, 4) + '...' : 'Not set');
console.log('\nVerification Result:', isSignatureValid ? '✅ Valid' : '❌ Invalid');

if (!isSignatureValid) {
  console.log('\nTroubleshooting:');
  console.log('1. Verify RAZORPAY_KEY_SECRET in your .env file matches your Razorpay dashboard');
  console.log('2. Ensure the order ID and payment ID are correct');
  console.log('3. Check if the payment was made in test mode (using test API keys)');
}
