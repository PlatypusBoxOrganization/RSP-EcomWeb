import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

// Test creating an order
console.log('Creating test order...');
razorpay.orders.create({
  amount: 1000, // ₹10
  currency: 'INR',
  receipt: `test_rcpt_${Date.now()}`
}, (err, order) => {
  if (err) {
    console.error('Error creating order:', err);
  } else {
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount / 100, 'INR');
    console.log('Status:', order.status);
  }
});
