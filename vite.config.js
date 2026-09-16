import { defineConfig } from 'vite';

// Base path host'a gore degisir:
//   - Vercel       -> site kok dizinde yayinlanir, base '/'
//   - GitHub Pages -> /Pdfbox-offline/ alt dizininde yayinlanir
// Vercel, build sirasinda VERCEL=1 degiskenini otomatik saglar;
// GitHub Actions'ta bu degisken yoktur -> eski davranis korunur.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/Pdfbox-offline/',
});