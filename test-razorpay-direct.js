// Simple Razorpay test script
const Razorpay = require('razorpay');

console.log('Testing Razorpay integration...');

// Initialize Razorpay with test credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

console.log('✅ Razorpay instance created');

// Test creating an order
const options = {
  amount: 1000,  // 1000 paise = ₹10
  currency: 'INR',
  receipt: 'test_receipt_1'
};

razorpay.orders.create(options, function(err, order) {
  if (err) {
    console.error('❌ Error creating order:');
    console.error(err);
  } else {
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount);
    console.log('Currency:', order.currency);
  }
});
