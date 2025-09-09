console.log('Starting Razorpay minimal test...');

// Simple Razorpay test with direct require
const Razorpay = require('razorpay');
console.log('✅ Razorpay module loaded');

const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

console.log('🔑 Razorpay instance created');

razorpay.orders.create({
  amount: 1000,
  currency: 'INR',
  receipt: 'test_receipt_1'
}, (err, order) => {
  console.log('\n--- Callback executed ---');
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log('✅ Success:', order);
  }
});

console.log('Request sent, waiting for response...');
