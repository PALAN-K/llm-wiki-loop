#!/usr/bin/env node
/**
 * Lightweight version sync: package.json -> docs/index.html, docs/sitemap.xml
 * 5-10 lines core, no deps. Run via npm run sync:version or prepack.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const version = pkg.version;

function syncIndexHtml() {
  const paths = [
    path.join(root, 'docs', 'index.html'),
    path.join(root, 'docs', 'ja', 'index.html'),
    path.join(root, 'docs', 'ko', 'index.html'),
  ];
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    let html = fs.readFileSync(p, 'utf-8');
    const before = html;
    html = html.replace(/(<span class="logo-badge">)v[\d.]+(<\/span>)/g, `$1v${version}$2`);
    if (html !== before) {
      fs.writeFileSync(p, html, 'utf-8');
      console.log(`[sync] ${path.relative(root, p)} -> v${version}`);
    }
  }
}

function syncReadme() {
  const paths = [
    path.join(root, 'README.md'),
    path.join(root, 'README.ja.md'),
    path.join(root, 'README.ko.md'),
  ];
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    let md = fs.readFileSync(p, 'utf-8');
    const before = md;
    // Sync trailing "vX.Y.Z" in badge line: "• v1.3.0" or "v1.3.0"
    md = md.replace(/(Zero-DB[^•]*•\s*)v[\d.]+/g, `$1v${version}`);
    md = md.replace(/(Zero-DB[^•\n]*•[^•\n]*•[^•\n]*•\s*)v[\d.]+/g, (m) => m.replace(/v[\d.]+/, `v${version}`));
    // Fallback: any isolated " • v1.3.0" at end of badge line
    md = md.replace(/(•\s*)v\d+\.\d+\.\d+(?=\s*<\/i>|\s*\n)/g, `$1v${version}`);
    if (md !== before) {
      fs.writeFileSync(p, md, 'utf-8');
      console.log(`[sync] ${path.relative(root, p)} -> v${version}`);
    }
  }
}

function syncSitemap() {
  const p = path.join(root, 'docs', 'sitemap.xml');
  if (!fs.existsSync(p)) return;
  let xml = fs.readFileSync(p, 'utf-8');
  const today = new Date().toISOString().split('T')[0];
  const before = xml;
  xml = xml.replace(/<lastmod>[\d-]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  if (xml !== before) {
    fs.writeFileSync(p, xml, 'utf-8');
    console.log(`[sync] docs/sitemap.xml -> ${today}`);
  }
}

function cleanPycache() {
  const p = path.join(root, 'skills', 'wiki-manager', 'scripts', '__pycache__');
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`[sync] cleaned ${path.relative(root, p)}`);
  }
}

syncIndexHtml();
syncReadme();
syncSitemap();
cleanPycache();
