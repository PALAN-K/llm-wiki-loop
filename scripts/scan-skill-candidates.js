#!/usr/bin/env node
/**
 * scan-skill-candidates — 0-overhead report-only helper for auto-skillifying
 * Counts repeated ingest/update patterns in log.md (2+ occurrences → skill candidate)
 * Keeps Karpathy philosophy: report only, no daemon, no DB, no over-engineering
 * Usage: node scripts/scan-skill-candidates.js [--strict] [vaultDir]
 *  --strict: exit 1 if any candidate found (CI gate, optional)
 */
const fs = require('fs');
const path = require('path');

function stripFences(text) {
  const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})(.*)$/;
  const FENCE_CLOSE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/;
  let fenceChar = null, fenceLen = 0;
  const out = [];
  for (const line of text.splitlines ? text.splitlines() : text.split('\n')) {
    if (fenceChar) {
      const m = line.match(FENCE_CLOSE);
      if (m && m[1][0] === fenceChar && m[1].length >= fenceLen) fenceChar = null;
      continue;
    }
    const o = line.match(FENCE_OPEN);
    if (o) {
      const marker = o[1];
      if (marker[0] === '`' && o[2].includes('`')) { out.push(line); continue; }
      fenceChar = marker[0]; fenceLen = marker.length; continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function findVaultRoot(start) {
  for (let dir = path.resolve(start); ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'wiki')) && fs.existsSync(path.join(dir, 'raw'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start);
  }
}

function scan(logPath) {
  if (!fs.existsSync(logPath)) {
    console.log(`No log file at ${logPath}`);
    return { counts: new Map(), candidates: [] };
  }
  const text = stripFences(fs.readFileSync(logPath, 'utf-8'));
  const re = /^## \[[^\]]*\]\s*(ingest|update|fix|lint)\s*\|\s*(.+?)\s*$/gim;
  const counts = new Map();
  let m;
  while ((m = re.exec(text)) !== null) {
    const title = m[2].trim().toLowerCase().replace(/\s+/g, ' ');
    // Normalize to first 6 words as key to catch near-duplicates
    const key = title.split(' ').slice(0, 6).join(' ');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const candidates = [];
  for (const [k, c] of counts.entries()) if (c >= 2) candidates.push({ key: k, count: c });
  candidates.sort((a,b)=>b.count-a.count);
  return { counts, candidates };
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const vaultArg = args.find(a => !a.startsWith('-'));
  const root = vaultArg ? path.resolve(vaultArg) : findVaultRoot(process.cwd());
  const logPath = path.join(root, 'log.md');
  const { candidates } = scan(logPath);
  console.log(`# Skill candidates scan (${logPath})`);
  console.log(`Scanned vault: ${root}`);
  if (candidates.length === 0) {
    console.log('(no candidates - no pattern repeated 2+ times)');
  } else {
    for (const c of candidates) console.log(`- "${c.key}" → ${c.count} times`);
    console.log(`\nPropose promoting ${candidates.length} candidate(s) to SKILL.md (human approval required per AGENTS.md:7)`);
  }
  if (strict && candidates.length > 0) process.exit(1);
  process.exit(0);
}

if (require.main === module) main();
module.exports = { scan };
