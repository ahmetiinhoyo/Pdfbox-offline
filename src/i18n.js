// PDFBox Offline — i18n çekirdeği
// Çeviriler src/locales/*.js içinde tutulur; burada birleştirilir ve t() ile okunur.
import { tr } from './locales/tr.js';
import { en } from './locales/en.js';
import { ru } from './locales/ru.js';

export const translations = { tr, en, ru };

// Kayitli dili, yoksa tarayici dilini, o da yoksa ingilizceyi dondurur.
export function detectLang() {
  const saved = localStorage.getItem('pdfbox-lang');
  if (saved && translations[saved]) return saved;
  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (translations[browserLang]) return browserLang;
  return 'en';
}

// Ceviri fonksiyonu: fonksiyonlu cevirileri argumanla cagirir, eksikse ingilizceye duser.
export function t(lang, key, ...args) {
  const value = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}