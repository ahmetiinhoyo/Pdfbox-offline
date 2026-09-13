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

    splitTitle: "✂️ PDF Böl",
    splitDesc: "PDF'ten istediğin sayfaları ayır, yeni bir dosya olarak indir.",
    splitDropText: "PDF seçmek için tıkla",
    splitDropSelected: (name, total) => `📄 ${name} · ${total} sayfa`,
    splitRangeLabel: "Sayfa aralığı",
    splitRangePlaceholder: "örn: 1-3, 5, 7-9",
    splitRangeHint: "Virgülle ayır, tire ile aralık ver. Boş bırakırsan tüm sayfalar alınır.",
    splitBtn: "Böl ve İndir",
    splitting: "Bölünüyor...",
    splitDone: "✅ İndirildi!",
    splitNeedFile: "Önce bir PDF seç 😄",
    splitInvalidRange: "Geçersiz sayfa aralığı. Örnek: 1-3, 5, 7-9",
    splitOutOfRange: (max) => `Sayfa numarası dosyada yok. En fazla ${max} sayfa var.`,

    buyCoffee: "Kahve Ismarla",
    giveStar: "Yıldız Ver",
    feedback: "Geri Bildirim",

    mergeSuccess: "PDF başarıyla birleştirildi!",
    splitSuccess: "PDF başarıyla bölündü!",

    themeLight: "☀️ Açık tema",
    themeDark: "🌙 Koyu tema",
    accentBlue: "🎨 Mavi",
    accentGreen: "🎨 Yeşil",
    accentOrange: "🎨 Turuncu",
    accentPink: "🎨 Pembe",
    onlyPdf: "Sadece PDF dosyaları kabul edilir",
    oneFileSplit: "PDF Böl için tek dosya seç",

    statsLine: (files, pages) => `📄 ${files} dosya · ${pages} sayfa toplam`,

    darkReaderWarning: "💡 Dark Reader eklentisi açık. Daha iyi görünüm için kapatabilirsin.",
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

    splitTitle: "✂️ Split PDF",
    splitDesc: "Extract specific pages from a PDF and download as a new file.",
    splitDropText: "Click to select a PDF",
    splitDropSelected: (name, total) => `📄 ${name} · ${total} pages`,
    splitRangeLabel: "Page range",
    splitRangePlaceholder: "e.g. 1-3, 5, 7-9",
    splitRangeHint: "Separate with commas, use dash for ranges. Leave empty for all pages.",
    splitBtn: "Split & Download",
    splitting: "Splitting...",
    splitDone: "✅ Downloaded!",
    splitNeedFile: "Pick a PDF first 😄",
    splitInvalidRange: "Invalid page range. Example: 1-3, 5, 7-9",
    splitOutOfRange: (max) => `Page number out of range. This PDF has ${max} pages.`,

    buyCoffee: "Buy me a coffee",
    giveStar: "Star on GitHub",
    feedback: "Feedback",

    mergeSuccess: "PDFs merged successfully!",
    splitSuccess: "PDF split successfully!",

    themeLight: "☀️ Light theme",
    themeDark: "🌙 Dark theme",
    accentBlue: "🎨 Blue",
    accentGreen: "🎨 Green",
    accentOrange: "🎨 Orange",
    accentPink: "🎨 Pink",
    onlyPdf: "Only PDF files are accepted",
    oneFileSplit: "Pick one file for Split",

    statsLine: (files, pages) => `📄 ${files} files · ${pages} pages total`,

    darkReaderWarning: "💡 Dark Reader extension detected. Turn it off for best experience.",
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

    splitTitle: "✂️ Разделить PDF",
    splitDesc: "Извлеките нужные страницы из PDF и скачайте как новый файл.",
    splitDropText: "Нажмите, чтобы выбрать PDF",
    splitDropSelected: (name, total) => `📄 ${name} · ${total} стр.`,
    splitRangeLabel: "Диапазон страниц",
    splitRangePlaceholder: "напр: 1-3, 5, 7-9",
    splitRangeHint: "Разделяйте запятыми, диапазон через дефис. Пусто — все страницы.",
    splitBtn: "Разделить и скачать",
    splitting: "Разделение...",
    splitDone: "✅ Загружено!",
    splitNeedFile: "Сначала выберите PDF 😄",
    splitInvalidRange: "Неверный диапазон. Пример: 1-3, 5, 7-9",
    splitOutOfRange: (max) => `Номер страницы вне диапазона. В PDF ${max} страниц.`,

    buyCoffee: "Угостить кофе",
    giveStar: "Звезда на GitHub",
    feedback: "Обратная связь",

    mergeSuccess: "PDF успешно объединён!",
    splitSuccess: "PDF успешно разделён!",

    themeLight: "☀️ Светлая тема",
    themeDark: "🌙 Тёмная тема",
    accentBlue: "🎨 Синий",
    accentGreen: "🎨 Зелёный",
    accentOrange: "🎨 Оранжевый",
    accentPink: "🎨 Розовый",
    onlyPdf: "Принимаются только PDF файлы",
    oneFileSplit: "Выберите один файл для Разделения",

    statsLine: (files, pages) => `📄 ${files} файлов · ${pages} страниц всего`,

    darkReaderWarning: "💡 Обнаружено расширение Dark Reader. Отключите для лучшего вида.",
  },
};

export function detectLang() {
  const saved = localStorage.getItem('pdfbox-lang');
  if (saved && translations[saved]) return saved;
  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (translations[browserLang]) return browserLang;
  return 'en';
}

export function t(lang, key, ...args) {
  const value = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}