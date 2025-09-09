// Test script using CommonJS
console.log('Starting Razorpay test with CommonJS...');

const Razorpay = require('razorpay');
console.log('✅ Razorpay module loaded');

const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

console.log('🔑 Razorpay instance created');

console.log('Creating test order...');
razorpay.orders.create({
  amount: 1000,
  currency: 'INR',
  receipt: 'test_final_1'
}, (err, order) => {
  console.log('\n--- Order Creation Callback ---');
  if (err) {
    console.error('❌ Error creating order:');
    console.error(err);
  } else {
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount / 100, 'INR');
    console.log('Status:', order.status);
  }
});

console.log('Request sent, waiting for response...');
