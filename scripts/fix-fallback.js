import { readFileSync, writeFileSync, copyFileSync } from 'fs';

// Fix fallback index.html to use relative paths
const file = 'dist/index.html';
let html = readFileSync(file, 'utf-8');

html = html
  .replace(/href="\//g, 'href="./')
  .replace(/import\("\//g, 'import("./');

writeFileSync(file, html);
console.log('Fixed fallback index.html to use relative paths');

// Copy offline server into dist for zip distribution
copyFileSync('scripts/offline-server.cjs', 'dist/server.cjs');
console.log('Copied offline server to dist/');
