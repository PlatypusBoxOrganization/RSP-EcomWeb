import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const log = [];
const target = 'C:/Users/ADMIN/AppData/Local/Temp/_MEI000046302/platypus';
const src = path.resolve(__dirname, 'platypus', 'shellcompat.py');

try {
  log.push('src exists: ' + fs.existsSync(src));
  log.push('target dir exists: ' + fs.existsSync(target));
  if (fs.existsSync(target)) {
    log.push('target listing: ' + JSON.stringify(fs.readdirSync(target)));
  }
  const testFile = path.join(target, 'write-test.txt');
  try {
    fs.writeFileSync(testFile, 'hello');
    log.push('WRITE-TEST: OK, wrote ' + testFile);
    fs.unlinkSync(testFile);
    log.push('unlink test: OK');
  } catch (e) {
    log.push('WRITE-TEST FAILED: ' + e.code + ' ' + e.message);
  }
  try {
    fs.copyFileSync(src, path.join(target, 'shellcompat.py'));
    log.push('COPY: OK');
    log.push('verify exists: ' + fs.existsSync(path.join(target, 'shellcompat.py')));
  } catch (e) {
    log.push('COPY FAILED: ' + e.code + ' ' + e.message);
  }
} catch (e) {
  log.push('FATAL: ' + e.message);
}

fs.writeFileSync(path.resolve(__dirname, 'copy-result.txt'), log.join('\n'));
console.log(log.join('\n'));
setInterval(() => {}, 60000);
