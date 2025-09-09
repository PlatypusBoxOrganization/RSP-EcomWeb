// Test Razorpay integration using CommonJS
const Razorpay = require('razorpay');

// Initialize Razorpay with test credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

// Test creating an order
async function testCreateOrder() {
  try {
    console.log('Testing Razorpay order creation...');
    
    const options = {
      amount: 1000,  // amount in smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: 'test_receipt_1',
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount);
    console.log('Currency:', order.currency);
    console.log('Status:', order.status);
    
    return order;
  } catch (error) {
    console.error('❌ Error creating order:');
    console.error(error);
    if (error.error) {
      console.error('Razorpay Error:', error.error);
    }
    throw error;
  }
}

// Run the test
testCreateOrder()
  .then(() => console.log('\\nTest completed successfully!'))
  .catch(() => console.log('\\nTest failed!'));
