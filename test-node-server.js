const http = require('http');
const fs = require('fs');
const log = (m) => fs.appendFileSync('node-test.log', `[${new Date().toISOString()}] ${m}\n`);
log('starting test server, node ' + process.version);
const srv = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, node: process.version, path: req.url }));
});
srv.listen(5999, () => log('listening on 5999'));
