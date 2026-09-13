# 📦 PDFBox Offline

> Offline PDF toolbox — merge, split, clean. No upload. No ads. No tracking.

[![Live](https://img.shields.io/badge/🌐_Live-Demo-blue?style=flat)](https://ahmetiinhoyo.github.io/Pdfbox-offline/)
[![Buy Me a Coffee](https://img.shields.io/badge/☕_Buy_me_a_coffee-support-yellow?style=flat)](https://www.buymeacoffee.com/Thorix)
[![GitHub stars](https://img.shields.io/github/stars/ahmetiinhoyo/Pdfbox-offline?style=social)](https://github.com/ahmetiinhoyo/Pdfbox-offline)

**Languages:** 🇬🇧 English · [🇹🇷 Türkçe](README.tr.md) · [🇷🇺 Русский](README.ru.md)

---

## ✨ Features

| Feature | Status |
|---|---|
| 📎 Merge PDFs | ✅ Ready |
| ✂️ Split PDF | ✅ Ready |
| 🌍 Multilingual (EN/TR/RU) | ✅ Ready |
| 🧹 Clean Metadata | 🚧 Soon |
| 🖼️ Images to PDF | 🚧 Soon |
| 🔄 Delete / Reorder pages | 🚧 Soon |
| 🗜️ Compress | 🚧 Soon |

---

## 🚀 Live Demo

**→ [https://ahmetiinhoyo.github.io/Pdfbox-offline/](https://ahmetiinhoyo.github.io/Pdfbox-offline/)**

Runs entirely in your browser. No installation, no sign-up.

---

## 🤔 Why PDFBox?

Most online PDF tools:
- ❌ Upload your file to **their servers**
- ❌ Are full of ads and tracking scripts
- ❌ Impose file size limits
- ❌ Require registration

**PDFBox Offline:**
- ✅ **100% offline** — your file never leaves your device
- ✅ **No ads, no tracking**
- ✅ **Unlimited** file size
- ✅ **No sign-up**, just use it
- ✅ **Multilingual** — English / Türkçe / Русский
- ✅ **Open source** — inspect the code yourself

---

## 📖 Usage

### 📎 Merge PDFs
1. Click the **Merge PDFs** area
2. Select multiple PDFs (one at a time — they pile up)
3. Remove unwanted ones with **✕**
4. Hit **"Merge & Download"**
5. `merged.pdf` gets downloaded 🎉

### ✂️ Split PDF
1. Click the **Split PDF** area, pick a PDF
2. In **Page range**, type what you want:
   - `1-3` → pages 1, 2, 3
   - `1, 3, 5` → only 1, 3, 5
   - `1-2, 5, 7-9` → mixed ranges
   - Empty → all pages
3. Hit **"Split & Download"**
4. `split.pdf` gets downloaded 🎉

### 🌍 Change Language
Click **TR / ENG / RU** in the top right. Your choice is remembered.

---

## 🛠️ Tech Stack

- **[Vite](https://vitejs.dev/)** — build tool
- **[pdf-lib](https://pdf-lib.js.org/)** — PDF manipulation
- **Vanilla JS** — no framework, fast and light
- **GitHub Actions** — CI/CD (auto build + deploy)
- **GitHub Pages** — free hosting

---

## 💻 Local Development

```bash
git clone https://github.com/ahmetiinhoyo/Pdfbox-offline.git
cd Pdfbox-offline
npm install
npm run dev