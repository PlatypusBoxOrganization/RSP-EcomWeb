console.log('Testing module loading...');

// Try to load a core module
try {
  const fs = require('fs');
  console.log('✅ Core module (fs) loaded successfully');
} catch (e) {
  console.error('❌ Failed to load core module:', e.message);
}

// Try to load Razorpay
try {
  const Razorpay = require('razorpay');
  console.log('✅ Razorpay module loaded successfully');
  
  // Try to create an instance
  const rzp = new Razorpay({
    key_id: 'rzp_test_RJgQjyW5DIRbPa',
    key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
  });
  
  console.log('✅ Razorpay instance created successfully');
  
  // Test creating an order
  const options = {
    amount: 1000,  // 1000 paise = ₹10
    currency: 'INR',
    receipt: 'test_receipt_1'
  };
  
  rzp.orders.create(options, function(err, order) {
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
  
} catch (e) {
  console.error('❌ Error loading Razorpay:');
  console.error(e);
}
