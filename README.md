# 📦 PDFBox Offline

> Offline PDF toolbox — merge, split, clean. No upload. No ads. No tracking.

**🌐 Canlı:** [https://ahmetiinhoyo.github.io/Pdfbox-offline/](https://ahmetiinhoyo.github.io/Pdfbox-offline/)

---

## Neden PDFBox?

Çoğu online PDF aracı:
- ❌ Dosyanı **sunucularına** yükler
- ❌ Reklam ve takip scripti doludur
- ❌ Boyut sınırı koyar
- ❌ Kayıt zorunlu tutar

**PDFBox Offline:**
- ✅ **%100 offline** — dosyan cihazdan çıkmaz
- ✅ **Reklamsız, takipsiz**
- ✅ **Sınırsız** dosya boyutu
- ✅ **Kayıt yok**, kullan direkt
- ✅ **Açık kaynak** — istersen kodu incele

---

## ✨ Özellikler

| Özellik | Durum |
|---|---|
| 📎 PDF Birleştir | ✅ Hazır |
| ✂️ PDF Böl | 🚧 Yakında |
| 🧹 Metadata Temizle | 🚧 Yakında |
| 🗜️ Sıkıştır | 🚧 Yakında |
| 🔄 Sayfa Sil / Döndür | 🚧 Yakında |
| 🖼️ Görselden PDF | 🚧 Yakında |

---

## 🚀 Kullanım

1. Siteyi aç: [https://ahmetiinhoyo.github.io/Pdfbox-offline/](https://ahmetiinhoyo.github.io/Pdfbox-offline/)
2. **PDF Birleştir** alanına tıkla
3. Birden fazla PDF seç (her seferinde birer tane ekleyebilirsin)
4. İstemediğin dosyayı **✕** ile kaldır
5. **"Birleştir ve İndir"** butonuna bas
6. `birlestirilmis.pdf` inecek 🎉

**Not:** Dosyalar **asla** internete gitmez. Tüm işlem tarayıcında (WebAssembly) olur.

---

## 🛠️ Teknolojiler

- **[Vite](https://vitejs.dev/)** — build tool
- **[pdf-lib](https://pdf-lib.js.org/)** — PDF işlemleri
- **Vanilla JS** — framework yok, hafif ve hızlı
- **GitHub Pages** — bedava hosting

---

## 💻 Yerel Geliştirme

```bash
git clone https://github.com/ahmetiinhoyo/Pdfbox-offline.git
cd Pdfbox-offline
npm install
npm run dev