// 200 SATIR KURALI DENETIMI
// Kullanim: npm run check:lines
// Kural: hicbir kaynak dosya 200 satiri gecmez (tek muaf: index.html + ikili dosyalar)
// Not: konsol mesajlari bilerek ASCII - Windows/CI loglarinda bozulmasin.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LIMIT = 200;

// Taranmayacak klasorler
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'dist-ssr', 'screenshots', '.vscode', '.idea', 'coverage',
]);

// Taranmayacak uzantilar (ikili / medya dosyalari)
const SKIP_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip',
  '.woff', '.woff2', '.ttf', '.mp4', '.mov',
]);

// Tek tek muaf dosyalar
const SKIP_FILES = new Set([
  'package-lock.json', // otomatik uretilir
  'index.html',        // kullanici karari: HTML iskeleti tek dosyada kalir
]);

function countLines(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (raw.length === 0) return 0;
  const normalized = raw.replace(/\r\n/g, '\n');
  return normalized.endsWith('\n')
    ? normalized.split('\n').length - 1
    : normalized.split('\n').length;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      if (SKIP_EXT.has(path.extname(entry.name).toLowerCase())) continue;
      if (SKIP_FILES.has(entry.name)) continue;
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT).sort();
const offenders = [];
let biggest = { file: '-', lines: 0 };

for (const file of files) {
  const lines = countLines(file);
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (lines > biggest.lines) biggest = { file: rel, lines };
  if (lines > LIMIT) offenders.push({ file: rel, lines });
}

offenders.sort((a, b) => b.lines - a.lines);

console.log('Satir limiti: ' + LIMIT + ' satir (muaf: index.html, ikili dosyalar)');
console.log('Kontrol edilen dosya: ' + files.length);

if (offenders.length > 0) {
  console.error('');
  console.error('BASARISIZ: ' + offenders.length + ' dosya limiti asiyor');
  console.error('');
  for (const o of offenders) {
    console.error('   ' + String(o.lines).padStart(5) + ' satir   ' + o.file);
  }
  console.error('');
  console.error('Cozum: dosyayi sorumluluga gore BOL. Kodu sikistirmak yasak.');
  process.exit(1);
}

console.log('TAMAM: tum dosyalar uyumlu.');
console.log('En buyuk dosya: ' + biggest.file + ' (' + biggest.lines + ' satir)');