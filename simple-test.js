// Simple test to verify Node.js environment
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

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
  
} catch (error) {
  console.error('❌ Error loading Razorpay:');
  console.error(error);
}
