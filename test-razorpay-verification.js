import { verifyPaymentSignature } from './server/utils/razorpay.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test payment details
const testPayment = {
  razorpay_order_id: "order_R8HrPFxh7f1O95",
  razorpay_payment_id: "pay_R8HreEVKM1RXMZ",
  razorpay_signature: "a7fb38e2b43dabe34735be7319e3436b3a5a628a43f5b4fd6bfad5534c8c4161"
};

// Verify the signature
const isSignatureValid = verifyPaymentSignature(
  testPayment.razorpay_order_id,
  testPayment.razorpay_payment_id,
  testPayment.razorpay_signature
);

console.log('=== RAZORPAY PAYMENT VERIFICATION ===');
console.log('Order ID:', testPayment.razorpay_order_id);
console.log('Payment ID:', testPayment.razorpay_payment_id);
console.log('Signature:', '***' + testPayment.razorpay_signature.slice(-4));
console.log('\nVerification Result:', isSignatureValid ? '✅ Valid' : '❌ Invalid');

if (!isSignatureValid) {
  console.log('\nTroubleshooting:');
  console.log('1. Verify RAZORPAY_KEY_SECRET in your .env file matches your Razorpay dashboard');
  console.log('2. Ensure the order ID and payment ID are correct');
  console.log('3. Check if the payment was made in test mode (using test API keys)');
}
