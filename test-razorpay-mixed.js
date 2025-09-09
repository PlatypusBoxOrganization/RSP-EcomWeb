// Test script using both ES modules and CommonJS

// Part 1: Test with CommonJS
console.log('=== Testing with CommonJS ===');
try {
  const RazorpayCJS = require('razorpay');
  console.log('✅ Razorpay loaded with CommonJS');
  
  const rzpCJS = new RazorpayCJS({
    key_id: 'rzp_test_RJgQjyW5DIRbPa',
    key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
  });
  
  console.log('✅ Razorpay instance created with CommonJS');
  
  rzpCJS.orders.create({
    amount: 1000,
    currency: 'INR',
    receipt: 'test_cjs_1'
  }, (err, order) => {
    console.log('\n--- CommonJS Callback ---');
    if (err) console.error('❌ Error (CJS):', err.message);
    else console.log('✅ Order created (CJS):', order.id);
  });
  
} catch (error) {
  console.error('❌ CommonJS test failed:', error.message);
}

// Part 2: Test with ES Modules
console.log('\n=== Testing with ES Modules ===');
import('razorpay')
  .then(module => {
    const RazorpayESM = module.default;
    console.log('✅ Razorpay loaded with ES Modules');
    
    const rzpESM = new RazorpayESM({
      key_id: 'rzp_test_RJgQjyW5DIRbPa',
      key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
    });
    
    console.log('✅ Razorpay instance created with ES Modules');
    
    return new Promise((resolve, reject) => {
      rzpESM.orders.create({
        amount: 1000,
        currency: 'INR',
        receipt: 'test_esm_1'
      }, (err, order) => {
        console.log('\n--- ES Module Callback ---');
        if (err) {
          console.error('❌ Error (ESM):', err.message);
          reject(err);
        } else {
          console.log('✅ Order created (ESM):', order.id);
          resolve(order);
        }
      });
    });
  })
  .catch(error => {
    console.error('❌ ES Module test failed:', error.message);
  });

console.log('\nTests started, waiting for callbacks...');
