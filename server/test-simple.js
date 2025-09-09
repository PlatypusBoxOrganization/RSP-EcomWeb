console.log('Simple test script running!');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Try to require a core module
const fs = require('fs');
console.log('FS module loaded successfully');

// Try to use ES modules
import { fileURLToPath } from 'url';
console.log('ES modules working:', fileURLToPath(import.meta.url));
