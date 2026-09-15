// 200 SATIR KURALI DENETIMI  ->  npm run check:lines
// Kural: hicbir KAYNAK dosya 200 satiri gecmez. Cline da bu kurala uyar.
// Muaf: belgeler (README.md, README.tr.md, README.ru.md, llms.txt ve tum *.md)
//       ve index.html (legacy: kullanici "tek dosyada kalsin" dedi).
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

// Muaf dosyalar: belgeler + legacy HTML iskeleti
const DOC_FILES = ['README.md', 'README.tr.md', 'README.ru.md', 'llms.txt'];
const SKIP_FILES = new Set(['package-lock.json', 'index.html']);

function isDoc(file) {
  return DOC_FILES.includes(path.basename(file)) || path.extname(file).toLowerCase() === '.md';
}

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
      if (isDoc(full)) continue;
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT).sort();
const offenders = [];
const sizes = [];

for (const file of files) {
  const lines = countLines(file);
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  sizes.push({ file: rel, lines });
  if (lines > LIMIT) offenders.push({ file: rel, lines });
}

sizes.sort((a, b) => b.lines - a.lines);
offenders.sort((a, b) => b.lines - a.lines);

console.log('Satir limiti : ' + LIMIT);
console.log('Muaf belgeler: ' + DOC_FILES.join(', ') + ' (+ tum *.md dosyalari)');
console.log('Muaf dosya   : index.html (legacy, kullanici karari)');
console.log('Denetlenen   : ' + files.length + ' kaynak dosya');

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

console.log('TAMAM: tum kaynak dosyalar 200 satirin altinda.');
console.log('En buyuk 3 dosya:');
for (const s of sizes.slice(0, 3)) {
  console.log('   ' + String(s.lines).padStart(5) + ' satir   ' + s.file);
}