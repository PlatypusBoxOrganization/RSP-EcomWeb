console.log('Testing ESM module system...');
console.log('Node.js version:', process.version);

// Test dynamic import
const testImport = async () => {
  try {
    const module = await import('crypto');
    console.log('✅ Crypto module loaded successfully');
  } catch (error) {
    console.error('❌ Error loading module:', error);
  }
};

testImport();
