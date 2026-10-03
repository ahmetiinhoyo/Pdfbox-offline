import { defineConfig } from 'vite';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Base path host'a gore degisir:
//   - Vercel       -> site kok dizinde yayinlanir, base '/'
//   - GitHub Pages -> /Pdfbox-offline/ alt dizininde yayinlanir
// Vercel, build sirasinda VERCEL=1 degiskenini otomatik saglar;
// GitHub Actions'ta bu degisken yoktur -> eski davranis korunur.
const CACHE_VERSION = '1.0.0';
const ASSET_RE = /\.(js|mjs|css|html|svg|png|ico|webmanifest|json)$/i;

// public/ klasorunu ozyinelemeli tarar (SW onbellek listesi icin)
function listFiles(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listFiles(full, base);
    return [relative(base, full).split('\\').join('/')];
  });
}

// Build sonrasi tum varliklari listeleyip service-worker.js'e enjekte eder.
function pdfboxServiceWorker() {
  return {
    name: 'pdfbox-service-worker',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const built = Object.keys(bundle).filter((f) => ASSET_RE.test(f));
      const publicFiles = listFiles('public').filter((f) => ASSET_RE.test(f));
      const precache = [...new Set(['', 'index.html', ...built, ...publicFiles])];

      const source = readFileSync('src/service-worker.js', 'utf8')
        .replace('__CACHE_VERSION__', CACHE_VERSION)
        .replace('/*__PRECACHE_MANIFEST__*/[]', JSON.stringify(precache));

      this.emitFile({ type: 'asset', fileName: 'service-worker.js', source });
    },
  };
}

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/Pdfbox-offline/',
  plugins: [pdfboxServiceWorker()],
});