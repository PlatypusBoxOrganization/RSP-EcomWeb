const fs = require('fs');
const path = require('path');

// Search for python.exe and any 'platypus' package directory
const results = { pythons: [], platypusDirs: [], platypusFiles: [] };

function walk(dir, depth) {
  if (depth > 6) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'platypus') {
        results.platypusDirs.push(full);
        try {
          const files = fs.readdirSync(full);
          results.platypusFiles.push({ dir: full, files });
        } catch (e) {}
      }
      // avoid node_modules and huge dirs
      if (!['node_modules', '.git', 'AppData', 'Windows'].includes(ent.name)) {
        walk(full, depth + 1);
      }
    } else if (ent.name === 'python.exe' || ent.name === 'python3.exe') {
      results.pythons.push(full);
    }
  }
}

// Search likely install roots
const roots = [
  'C:\\Users',
  'C:\\Program Files',
  'C:\\Program Files (x86)',
  process.env.LOCALAPPDATA || '',
  process.env.APPDATA || '',
  'C:\\UnityProjects'
].filter(Boolean);

for (const r of roots) walk(r, 0);

fs.writeFileSync('find-platypus.json', JSON.stringify(results, null, 2));
console.log('done');
