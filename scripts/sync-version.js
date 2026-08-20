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
  const p = path.join(root, 'docs', 'index.html');
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf-8');
  const before = html;
  // Badge: v1.2.0
  html = html.replace(/(<span class="logo-badge">)v[\d.]+(<\/span>)/, `$1v${version}$2`);
  // Any other vX.Y.Z in html comments? keep minimal
  if (html !== before) {
    fs.writeFileSync(p, html, 'utf-8');
    console.log(`[sync] docs/index.html -> v${version}`);
  }
}

function syncSitemap() {
  const p = path.join(root, 'docs', 'sitemap.xml');
  if (!fs.existsSync(p)) return;
  let xml = fs.readFileSync(p, 'utf-8');
  const today = new Date().toISOString().split('T')[0];
  const before = xml;
  xml = xml.replace(/<lastmod>[\d-]+<\/lastmod>/, `<lastmod>${today}</lastmod>`);
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
syncSitemap();
cleanPycache();
