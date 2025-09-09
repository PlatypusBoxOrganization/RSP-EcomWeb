console.log('Simple test running...');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Try to access a file
const fs = require('fs');
fs.writeFileSync('test-output.txt', 'Test content');
console.log('Wrote test file');
fs.unlinkSync('test-output.txt');
console.log('Test completed!');
