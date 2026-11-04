const fs = require('fs');
const path = require('path');
const src = path.resolve(__dirname, 'platypus', 'shellcompat.py');
const dest = 'C:/Users/ADMIN/AppData/Local/Temp/_MEI000046302/platypus/shellcompat.py';
try {
  fs.copyFileSync(src, dest);
  console.log('Copied shellcompat');
} catch (e) {
  console.error('Copy failed', e);
}
// Keep process alive
setInterval(()=>{}, 60000);
