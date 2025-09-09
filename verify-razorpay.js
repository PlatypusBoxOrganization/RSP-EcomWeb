const crypto = require('crypto');

// Your Razorpay key secret from .env
const RAZORPAY_KEY_SECRET = 'iRBFMvfhQ9xDQsCng2ucNuiW';

// Payment details
const razorpay_order_id = 'order_R8HrPFxh7f1O95';
const razorpay_payment_id = 'pay_R8HreEVKM1RXMZ';
const razorpay_signature = 'a7fb38e2b43dabe34735be7319e3436b3a5a628a43f5b4fd6bfad5534c8c4161';

// Create the expected signature
const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
const generatedSignature = hmac.digest('hex');

// Compare the signatures
const isSignatureValid = crypto.timingSafeEqual(
  Buffer.from(generatedSignature, 'utf8'),
  Buffer.from(razorpay_signature, 'utf8')
);

console.log('Generated Signature:', generatedSignature);
console.log('Expected Signature:', razorpay_signature);
console.log('Signature Valid:', isSignatureValid);

if (!isSignatureValid) {
  console.error('\nError: The payment signature is not valid!');
  console.log('\nTroubleshooting:');
  console.log('1. Verify the RAZORPAY_KEY_SECRET matches your Razorpay dashboard');
  console.log('2. Ensure the order ID and payment ID are correct');
  console.log('3. Check if you\'re using the correct environment (test vs production)');
} else {
  console.log('\n✅ Payment signature is valid! You can proceed with order fulfillment.');
}
