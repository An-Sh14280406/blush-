const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const serverProc = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: process.env,
  stdio: 'pipe',
});

serverProc.stdout.on('data', (d) => {
  const msg = d.toString();
  // console.log('[Server stdout]:', msg);
  if (msg.includes('blush. backend server running')) {
    console.log('🌸 Server started, making test request to /api/health...');
    http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log('✨ Response status:', res.statusCode);
        console.log('✨ Response body:', data);
        serverProc.kill();
        process.exit(0);
      });
    }).on('error', (err) => {
      console.error('Request failed:', err);
      serverProc.kill();
      process.exit(1);
    });
  }
});

serverProc.stderr.on('data', (d) => {
  console.error('[Server stderr]:', d.toString());
});

setTimeout(() => {
  console.error('Timeout waiting for server start');
  serverProc.kill();
  process.exit(1);
}, 10000);
