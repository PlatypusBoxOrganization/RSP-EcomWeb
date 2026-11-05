import fs from 'fs';
import path from 'path';
const tmp = 'C:/Users/ADMIN/AppData/Local/Temp';
const log = [];
try {
  const meis = fs.readdirSync(tmp).filter(n => n.startsWith('_MEI'));
  log.push('MEI dirs: ' + JSON.stringify(meis));
  for (const m of meis) {
    const plat = path.join(tmp, m, 'platypus');
    if (fs.existsSync(plat)) {
      const files = fs.readdirSync(plat);
      log.push(`${m}/platypus: ` + JSON.stringify(files));
      // check if shellcompat present and which version
      const sc = path.join(plat, 'shellcompat.py');
      if (fs.existsSync(sc)) {
        const content = fs.readFileSync(sc, 'utf8');
        log.push(`${m} shellcompat.py has V3: ` + content.includes('V3-LOADED'));
        log.push(`${m} shellcompat.py size: ` + fs.statSync(sc).size);
      }
    }
  }
} catch (e) {
  log.push('ERR ' + e.message);
}
fs.writeFileSync(path.resolve('mei-check.txt'), log.join('\n'));
console.log(log.join('\n'));
setInterval(() => {}, 60000);
