# 📦 PDFBox Offline

> Offline PDF araç kutusu — birleştir, böl, önizle, metadata temizle. Yükleme yok. Reklam yok. Takip yok.

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
| 🖼️ Tümünü Önizle (çoklu dosya galerisi) | ✅ Hazır |
| 🔍 Tam ekran sayfa görüntüleyici | ✅ Hazır |
| 🧹 Metadata Temizle (3 yol) | ✅ Hazır |
| 🌙 Koyu / Açık tema + 4 vurgu rengi | ✅ Hazır |
| 🌍 Çoklu Dil (TR/EN/RU) | ✅ Hazır |
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
1. **PDF Birleştir** alanına tıkla veya sürükle-bırak yap
2. Birden fazla PDF seç — sayfa sayılarıyla listeye eklenir
3. İstemediğini çöp kutusu butonuyla kaldır
4. *(İsteğe bağlı)* **"Metadata'yı temizle"** kutusunu işaretle — çıktıdan yazar, üreten program, başlık, anahtar kelimeler vb. silinir
5. **"Birleştir ve İndir"** butonuna bas → `birlestirilmis.pdf` (veya `cleanmeta-birlestirilmis.pdf`) iner

### ✂️ PDF Böl
1. **PDF Böl** alanına tıkla, bir PDF seç
2. **Sayfa aralığı** kutusuna yaz:
   - `1-3` → 1, 2, 3. sayfalar
   - `1, 3, 5` → sadece 1, 3, 5
   - `1-2, 5, 7-9` → karışık aralıklar
   - Boş bırak → tüm sayfalar
3. *(İsteğe bağlı)* **"Metadata'yı temizle"** kutusunu işaretle
4. **"Böl ve İndir"** butonuna bas → `bolunmus.pdf` (veya `cleanmeta-bolunmus.pdf`) iner

### 🖼️ Tümünü Önizle
1. Birleştirme listesine 2+ dosya ekle
2. **"Tümünü Önizle"** butonuna bas
3. Her PDF'in sayfaları, **dosya başlıkları altında gruplanmış** şekilde tek galeride — birleştirme sırasına göre görünür
4. Bir sayfaya tıkla → **tam ekran görüntüleyici** açılır
5. Ok tuşları veya ekrandaki butonlarla gez — **dosyalar arasında akar** (1. dosya biter → 2. dosyanın 1. sayfası)
6. Sayfalar yüksek çözünürlükte render edilir — metin net görünür

### 🧹 Metadata Temizle
PDF'lerin içinde gizli bilgi vardır: yazar adı, oluşturan program, tarih, başlık, anahtar kelimeler. 3 yolla temizleyebilirsin:

1. **Sol üstteki "Metadata Temizle" butonu** → özel araç açılır:
   - PDF seç → tam olarak **hangi metadata bulunduğunu gör** (yazar, başlık, konu, oluşturan, üreten, anahtar kelimeler)
   - Önizle, sonra **"Temizle ve İndir"** bas → `cleanmeta.pdf` iner
2. **Birleştir + checkbox** → birleştir ve tek seferde temizle
3. **Böl + checkbox** → böl ve tek seferde temizle

> Not: Belgenin oluşturma/değiştirme **tarihleri korunur** — sadece kimlik bilgileri silinir.

### 🌍 Dil Değiştir
Sağ üstteki **TR / EN / RU** butonlarına bas. Seçim hatırlanır.

### 🎨 Tema ve Vurgu Rengi
- Ay/Güneş butonuyla **koyu / açık** tema değiştir
- Renk dropdown'ından **4 vurgu renginden** birini seç (mavi, yeşil, turuncu, pembe) — seçili swatch işaretli görünür

---

## 🛠️ Teknolojiler

- **[Vite](https://vitejs.dev/)** — build tool
- **[pdf-lib](https://pdf-lib.js.org/)** — PDF işlemleri (birleştirme, bölme, metadata)
- **[pdfjs-dist](https://mozilla.github.io/pdf.js/)** — PDF render (önizlemeler)
- **Vanilla JS** — framework yok, hafif ve hızlı
- **Inline SVG ikon sprite** — emoji yok, ikon fontu yok
- **GitHub Actions** — CI/CD (otomatik build + deploy)
- **GitHub Pages** — bedava hosting

---

## 💻 Yerel Geliştirme

```bash
git clone https://github.com/ahmetiinhoyo/Pdfbox-offline.git
cd Pdfbox-offline
npm install
npm run dev
```

Tarayıcında `http://localhost:5173/Pdfbox-offline/` adresini aç.

---

## ☕ Destek

PDFBox Offline zaman kazandırıyorsa [kahve ısmarlayabilirsin](https://www.buymeacoffee.com/Thorix) — projenin reklamsız ve canlı kalmasını sağlar.

## 📄 Lisans

MIT — bkz. [LICENSE](LICENSE).