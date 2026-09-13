
# 📦 PDFBox Offline

> Offline PDF araç kutusu — birleştir, böl, temizle. Yükleme yok. Reklam yok. Takip yok.

[![Canlı](https://img.shields.io/badge/🌐_Canlı-Demo-blue?style=flat)](https://ahmetiinhoyo.github.io/Pdfbox-offline/)
[![Kahve Ismarla](https://img.shields.io/badge/☕_Kahve_Ismarla-destek-yellow?style=flat)](https://www.buymeacoffee.com/Thorix)
[![GitHub stars](https://img.shields.io/github/stars/ahmetiinhoyo/Pdfbox-offline?style=social)](https://github.com/ahmetiinhoyo/Pdfbox-offline)

**Diller:** [🇬🇧 English](README.md) · 🇹🇷 Türkçe · [🇷🇺 Русский](README.ru.md)

---

## ✨ Özellikler

| Özellik | Durum |
|---|---|
| 📎 PDF Birleştir | ✅ Hazır |
| ✂️ PDF Böl | ✅ Hazır |
| 🌍 Çoklu Dil (TR/EN/RU) | ✅ Hazır |
| 🧹 Metadata Temizle | 🚧 Yakında |
| 🖼️ Görselden PDF | 🚧 Yakında |
| 🔄 Sayfa Sil / Sırala | 🚧 Yakında |
| 🗜️ Sıkıştır | 🚧 Yakında |

---

## 🚀 Canlı Demo

**→ [https://ahmetiinhoyo.github.io/Pdfbox-offline/](https://ahmetiinhoyo.github.io/Pdfbox-offline/)**

Tamamen tarayıcında çalışır. Kurulum yok, kayıt yok.

---

## 🤔 Neden PDFBox?

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
- ✅ **Çok dilli** — English / Türkçe / Русский
- ✅ **Açık kaynak** — istersen kodu incele

---

## 📖 Kullanım

### 📎 PDF Birleştir
1. **PDF Birleştir** alanına tıkla
2. Birden fazla PDF seç (her seferinde birer tane — listede birikir)
3. İstemediğini **✕** ile kaldır
4. **"Birleştir ve İndir"** butonuna bas
5. `birlestirilmis.pdf` inecek 🎉

### ✂️ PDF Böl
1. **PDF Böl** alanına tıkla, bir PDF seç
2. **Sayfa aralığı** kutusuna yaz:
   - `1-3` → 1, 2, 3. sayfalar
   - `1, 3, 5` → sadece 1, 3, 5
   - `1-2, 5, 7-9` → karışık aralıklar
   - Boş bırak → tüm sayfalar
3. **"Böl ve İndir"** butonuna bas
4. `bolunmus.pdf` inecek 🎉

### 🌍 Dil Değiştir
Sağ üstteki **TR / ENG / RU** butonlarına bas. Seçim hatırlanır.

---

## 🛠️ Teknolojiler

- **[Vite](https://vitejs.dev/)** — build tool
- **[pdf-lib](https://pdf-lib.js.org/)** — PDF işlemleri
- **Vanilla JS** — framework yok, hafif ve hızlı
- **GitHub Actions** — CI/CD (otomatik build + deploy)
- **GitHub Pages** — bedava hosting

---

## 💻 Yerel Geliştirme

```bash
git clone https://github.com/ahmetiinhoyo/Pdfbox-offline.git
cd Pdfbox-offline
npm install
npm run dev
