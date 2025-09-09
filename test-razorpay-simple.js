// Simple Razorpay test with detailed logging
console.log('Starting Razorpay test...');

// Use dynamic import for better error handling
import('razorpay')
  .then(module => {
    const Razorpay = module.default;
    console.log('✅ Razorpay module loaded successfully');
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: 'rzp_test_RJgQjyW5DIRbPa',
      key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
    });
    
    console.log('🔑 Razorpay instance created');
    
    // Test creating an order
    const options = {
      amount: 1000,  // ₹10
      currency: 'INR',
      receipt: `test_rcpt_${Date.now()}`
    };
    
    console.log('📝 Creating test order...');
    
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.error('❌ Error creating order:');
        console.error(err);
        if (err.error) {
          console.error('Razorpay Error:', err.error);
        }
      } else {
        console.log('✅ Order created successfully!');
        console.log('Order ID:', order.id);
        console.log('Amount:', order.amount / 100, 'INR');
        console.log('Status:', order.status);
        console.log('Receipt:', order.receipt);
      }
    });
    
  })
  .catch(error => {
    console.error('❌ Failed to load Razorpay module:');
    console.error(error);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure Razorpay is installed: npm install razorpay');
    console.log('2. Check your internet connection');
    console.log('3. Verify Node.js version (current:', process.version, ')');
  });
