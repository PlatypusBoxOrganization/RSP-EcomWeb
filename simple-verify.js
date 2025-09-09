const crypto = require('crypto');

// Input values
const orderId = 'order_R8HrPFxh7f1O95';
const paymentId = 'pay_R8HreEVKM1RXMZ';
const signature = 'a7fb38e2b43dabe34735be7319e3436b3a5a628a43f5b4fd6bfad5534c8c4161';
const keySecret = 'iRBFMvfhQ9xDQsCng2ucNuiW';

// Generate the expected signature
const hmac = crypto.createHmac('sha256', keySecret);
hmac.update(`${orderId}|${paymentId}`);
const expectedSignature = hmac.digest('hex');

// Compare signatures
console.log('Expected:', expectedSignature);
console.log('Actual:  ', signature);
console.log('Match:   ', expectedSignature === signature);
