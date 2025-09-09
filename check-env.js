// Simple environment check
console.log('=== Environment Check ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Check if we can write to filesystem
const fs = require('fs');
try {
  fs.writeFileSync('test-write.txt', 'test');
  fs.unlinkSync('test-write.txt');
  console.log('✅ File system access: OK');
} catch (e) {
  console.error('❌ File system access failed:', e.message);
}

// Check network access
const https = require('https');
const req = https.get('https://www.google.com', (res) => {
  console.log('✅ Network access: OK');
  res.resume();
}).on('error', (e) => {
  console.error('❌ Network access failed:', e.message);
});

// Check environment variables
console.log('\nEnvironment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH ? 'OK' : 'Not found');
