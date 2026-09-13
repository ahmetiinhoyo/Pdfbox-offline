export const translations = {
  tr: {
    tagline: "Dosyan cihazından çıkmaz. Reklam yok. Kayıt yok.",
    mergeTitle: "📎 PDF Birleştir",
    mergeDesc: "Birden fazla PDF seç, sırala, tek dosya olarak indir.",
    dropText: "PDF seçmek için tıkla",
    dropTextMulti: (n) => `${n} dosya seçildi`,
    mergeBtn: "Birleştir ve İndir",
    merging: "Birleştiriliyor...",
    done: "✅ İndirildi!",
    error: "Hata: ",
    noFile: "Önce PDF seç kanka 😄",
    fileListLabel: "Seçilen dosyalar:",
    remove: "Kaldır",
    footer: "%100 offline çalışır · Dosyalar sunucuya gitmez",
    needTwo: "En az 2 PDF seçmelisin",
  },
  en: {
    tagline: "Your file never leaves your device. No ads. No tracking.",
    mergeTitle: "📎 Merge PDFs",
    mergeDesc: "Select multiple PDFs, order them, download as one file.",
    dropText: "Click to select PDFs",
    dropTextMulti: (n) => `${n} files selected`,
    mergeBtn: "Merge & Download",
    merging: "Merging...",
    done: "✅ Downloaded!",
    error: "Error: ",
    noFile: "Pick a PDF first 😄",
    fileListLabel: "Selected files:",
    remove: "Remove",
    footer: "100% offline · Files never touch a server",
    needTwo: "You need at least 2 PDFs",
  },
  ru: {
    tagline: "Ваш файл не покидает устройство. Без рекламы. Без слежки.",
    mergeTitle: "📎 Объединить PDF",
    mergeDesc: "Выберите несколько PDF, упорядочите, скачайте одним файлом.",
    dropText: "Нажмите, чтобы выбрать PDF",
    dropTextMulti: (n) => `Выбрано файлов: ${n}`,
    mergeBtn: "Объединить и скачать",
    merging: "Объединение...",
    done: "✅ Загружено!",
    error: "Ошибка: ",
    noFile: "Сначала выберите PDF 😄",
    fileListLabel: "Выбранные файлы:",
    remove: "Удалить",
    footer: "100% офлайн · Файлы не отправляются на сервер",
    needTwo: "Нужно минимум 2 PDF",
  },
};

export function detectLang() {
  // 1. Kullanıcı daha önce seçtiyse onu kullan
  const saved = localStorage.getItem('pdfbox-lang');
  if (saved && translations[saved]) return saved;

  // 2. Tarayıcı diline bak
  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (translations[browserLang]) return browserLang;

  // 3. Varsayılan: İngilizce
  return 'en';
}

export function t(lang, key, ...args) {
  const value = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}