# 📦 PDFBox Offline

> Offline PDF toolbox — merge, split, preview, clean metadata. No upload. No ads. No tracking.

[![Live](https://img.shields.io/badge/🌐_Live-Demo-blue?style=flat)](https://ahmetiinhoyo.github.io/Pdfbox-offline/)
[![Buy Me a Coffee](https://img.shields.io/badge/☕_Buy_me_a_coffee-support-yellow?style=flat)](https://www.buymeacoffee.com/Thorix)
[![GitHub stars](https://img.shields.io/github/stars/ahmetiinhoyo/Pdfbox-offline?style=social)](https://github.com/ahmetiinhoyo/Pdfbox-offline)

**Languages:** 🇬🇧 English · [🇹🇷 Türkçe](README.tr.md) · [🇷🇺 Русский](README.ru.md)

---

## 📸 Screenshots

| 📎 Merge PDFs | ✂️ Split PDF | 🧹 Clean Metadata |
|:---:|:---:|:---:|
| ![Merge PDFs](screenshots/merge.png) | ![Split PDF](screenshots/split.png) | ![Clean Metadata](screenshots/clean-metadata.png) |

---

## ✨ Features

| Feature | Status |
|---|---|
| 📎 Merge PDFs | ✅ Ready |
| ✂️ Split PDF | ✅ Ready |
| 🖼️ Preview All (multi-file gallery) | ✅ Ready |
| 🔍 Fullscreen page viewer | ✅ Ready |
| 🧹 Clean Metadata (3 ways) | ✅ Ready |
| 🌙 Dark / Light theme + 4 accent colors | ✅ Ready |
| 🌍 Multilingual (EN/TR/RU) | ✅ Ready |
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
1. Click the **Merge PDFs** area or drag & drop
2. Select multiple PDFs — they pile up with page counts
3. Remove unwanted ones with the trash button
4. *(Optional)* Check **"Clean metadata"** to strip author, producer, title, keywords etc. from the output
5. Hit **"Merge & Download"** → `birlestirilmis.pdf` (or `cleanmeta-birlestirilmis.pdf`) gets downloaded

### ✂️ Split PDF
1. Click the **Split PDF** area, pick a PDF
2. In **Page range**, type what you want:
   - `1-3` → pages 1, 2, 3
   - `1, 3, 5` → only 1, 3, 5
   - `1-2, 5, 7-9` → mixed ranges
   - Empty → all pages
3. *(Optional)* Check **"Clean metadata"**
4. Hit **"Split & Download"** → `bolunmus.pdf` (or `cleanmeta-bolunmus.pdf`) gets downloaded

### 🖼️ Preview All
1. Add 2+ files to the merge list
2. Hit **"Preview All"**
3. Every PDF's pages appear in one gallery, grouped under file headers — in merge order
4. Click any page to open the **fullscreen viewer**
5. Navigate with arrow keys or on-screen buttons — it flows across files (end of file 1 → start of file 2)
6. Pages are rendered at high resolution for crisp text

### 🧹 Clean Metadata
PDFs carry hidden info: author name, creating program, dates, title, keywords. Remove it in 3 ways:

1. **Top-left "Clean Metadata" button** → opens a dedicated tool:
   - Pick a PDF → see exactly **what metadata was found** (author, title, subject, creator, producer, keywords)
   - Preview it, then hit **"Clean & Download"** → `cleanmeta.pdf`
2. **Merge + checkbox** → merge and clean in one go
3. **Split + checkbox** → split and clean in one go

> Note: Document creation/modification **dates are preserved** — only identity fields are wiped.

### 🌍 Change Language
Click **TR / EN / RU** in the top right. Your choice is remembered.

### 🎨 Theme & Accent Color
- Toggle **dark / light** theme with the moon/sun button
- Pick one of **4 accent colors** (blue, green, orange, pink) from the color dropdown — the selected swatch is highlighted

---

## 🛠️ Tech Stack

- **[Vite](https://vitejs.dev/)** — build tool
- **[pdf-lib](https://pdf-lib.js.org/)** — PDF manipulation (merge, split, metadata)
- **[pdfjs-dist](https://mozilla.github.io/pdf.js/)** — PDF rendering (previews)
- **Vanilla JS** — no framework, fast and light
- **Inline SVG icon sprite** — no emoji, no icon font
- **GitHub Actions** — CI/CD (auto build + deploy)
- **GitHub Pages** — free hosting

---

## 💻 Local Development

```bash
git clone https://github.com/ahmetiinhoyo/Pdfbox-offline.git
cd Pdfbox-offline
npm install
npm run dev
```

Open `http://localhost:5173/Pdfbox-offline/` in your browser.

---

## ☕ Support

If PDFBox Offline saves you time, consider [buying me a coffee](https://www.buymeacoffee.com/Thorix) — it keeps the project ad-free and alive.

## 📄 License

MIT — see [LICENSE](LICENSE).