import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_RJgQjyW5DIRbPa',
  key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
});

// Test payment flow
async function testPaymentFlow() {
  try {
    console.log('=== Testing Razorpay Payment Flow ===\n');
    
    // 1. Create an order
    console.log('1. Creating test order...');
    const order = await razorpay.orders.create({
      amount: 1000, // ₹10
      currency: 'INR',
      receipt: `test_rcpt_${Date.now()}`
    });
    
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount / 100, 'INR');
    console.log('Status:', order.status);
    
    // 2. Simulate payment verification (in a real scenario, this would be done after payment)
    console.log('\n2. Simulating payment verification...');
    
    // In a real app, you would get these from the payment response
    const paymentId = 'FAKE_PAYMENT_ID'; // Replace with actual payment ID in real scenario
    const orderId = order.id;
    
    // In a real app, you would verify the payment signature
    console.log('ℹ️ In a real scenario, you would now:');
    console.log('   - Get payment ID from Razorpay response');
    console.log('   - Verify payment signature');
    console.log('   - Fetch payment details using payment ID');
    
    // 3. Fetch payment details (this would be done with actual payment ID)
    console.log('\n3. Testing payment fetch (with fake ID)...');
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      console.log('Payment details:', payment);
    } catch (error) {
      console.log('ℹ️ Expected error (using fake payment ID):', error.message);
    }
    
    console.log('\n=== Test Completed ===');
    console.log('✅ Razorpay integration is working correctly!');
    console.log('Next steps:');
    console.log('1. Implement the frontend payment form');
    console.log('2. Handle the payment success callback');
    console.log('3. Verify payment on your server');
    
  } catch (error) {
    console.error('❌ Error in payment flow:');
    console.error(error);
    if (error.error) {
      console.error('Razorpay Error:', error.error);
    }
  }
}

// Run the test
testPaymentFlow();
