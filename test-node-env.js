// Simple Node.js environment test
console.log('=== Node.js Environment Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Test file system access
import fs from 'fs';
try {
  const testFile = 'test-write-' + Date.now() + '.txt';
  fs.writeFileSync(testFile, 'test');
  console.log('✅ File system write test: PASSED');
  fs.unlinkSync(testFile);
} catch (e) {
  console.error('❌ File system write test FAILED:', e.message);
}

// Test network access
import https from 'https';
const req = https.get('https://www.google.com', (res) => {
  console.log('✅ Network access: OK');
  res.resume();
}).on('error', (e) => {
  console.error('❌ Network access failed:', e.message);
});
