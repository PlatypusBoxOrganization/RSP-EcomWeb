// Test script using ES Modules
import Razorpay from 'razorpay';

console.log('=== Testing Razorpay with ES Modules ===');
console.log('Node.js version:', process.version);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

console.log('✅ Razorpay instance created');

// Test creating an order
console.log('Creating test order...');

const options = {
  amount: 1000,  // ₹10
  currency: 'INR',
  receipt: `test_${Date.now()}`,
  payment_capture: 1
};

// Using promise-based API
razorpay.orders.create(options)
  .then(order => {
    console.log('\n--- Order Created Successfully ---');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount / 100, 'INR');
    console.log('Status:', order.status);
    console.log('Receipt:', order.receipt);
  })
  .catch(error => {
    console.error('\n--- Error Creating Order ---');
    console.error('Error:', error.message);
    if (error.error) {
      console.error('Razorpay Error:', error.error);
    }
  });

console.log('Request sent, waiting for response...');
