// Simple Node.js environment check
console.log('=== Node.js Environment Check ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Check if we can write to filesystem
const fs = require('fs');
try {
  const testFile = 'test-write-' + Date.now() + '.txt';
  fs.writeFileSync(testFile, 'test');
  console.log('✅ File system write test: PASSED');
  fs.unlinkSync(testFile);
} catch (e) {
  console.error('❌ File system write test FAILED:', e.message);
}

// Check if we can load Razorpay
try {
  console.log('\n=== Testing Razorpay Module ===');
  const Razorpay = require('razorpay');
  console.log('✅ Razorpay module loaded successfully');
  
  const rzp = new Razorpay({
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
  
  console.log('Attempting to create test order...');
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
