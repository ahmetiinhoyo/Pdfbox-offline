// Dil yönetimi: ortak t() kısayolu, dil değiştirme ve yeniden render kaydı.
// Özellik modülleri registerLangRenderer() ile kendi render fonksiyonunu kaydeder.
// Böylece core → features yönünde bağımlılık OLUŞMAZ (döngüsel import yok).

import { t as translate } from '../i18n.js';
import { state } from './state.js';

const renderers = [];

// Aktif dile göre çeviri yapar: t('mergeBtn') veya t('dropTextMulti', 3)
export function t(key, ...args) {
  return translate(state.lang, key, ...args);
}

export function registerLangRenderer(fn) {
  renderers.push(fn);
}

export function applyLang(lang) {
  state.lang = lang;
  localStorage.setItem('pdfbox-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translate(lang, key);
  });

  const rangeInput = document.getElementById('pageRange');
  if (rangeInput) {
    rangeInput.placeholder = translate(lang, 'splitRangePlaceholder');
  }

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderers.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error(err);
    }
  });
}

// Dil değiştirme butonları
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});
