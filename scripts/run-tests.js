#!/usr/bin/env node
const { spawnSync } = require('child_process');
const candidates = process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python', 'py'];
let last = null;
for (const cmd of candidates) {
  const res = spawnSync(cmd, ['-m', 'unittest', 'discover', '-s', 'tests'], { stdio: 'inherit' });
  if (res.error && res.error.code === 'ENOENT') continue;
  // If command was found (even if tests failed), exit with its status
  if (res.status !== null || res.error) {
    last = res;
    process.exit(res.status ?? 1);
  }
}
console.error('No Python runtime found for tests. Need python3/py >=3.9');
process.exit(1);
