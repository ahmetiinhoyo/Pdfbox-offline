// Görselden PDF kartı: markup'ı ve ikonlarını DOM'a enjekte eder,
// ortak DOM referanslarını ve sayfa ayarlarını sunar.
// Not: index.html'e dokunulmaz (legacy istisna) — kart ayrı modülden gelir.

import cardHtml from '../../ui/images-card.html?raw';

// Karta özel SVG ikonları (mevcut sprite'ın defs'ine eklenir)
const CARD_ICONS = `
  <symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></symbol>
  <symbol id="i-arrow-up" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></symbol>
  <symbol id="i-arrow-down" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></symbol>
`;

export const els = {
  drop: null,
  input: null,
  dropText: null,
  list: null,
  stats: null,
  statsText: null,
  clearBtn: null,
  btn: null,
  previewBtn: null,
  cleanMeta: null,
};

// Kartı footer'dan önce ekler. Başarılıysa true döner.
export function injectImagesCard() {
  const footer = document.querySelector('main footer');
  if (!footer) return false;

  const defs = document.querySelector('svg defs');
  if (defs && !document.getElementById('i-image')) {
    defs.insertAdjacentHTML('beforeend', CARD_ICONS);
  }

  footer.insertAdjacentHTML('beforebegin', cardHtml);
  return true;
}

export function cacheEls() {
  els.input = document.getElementById('imageFiles');
  els.drop = document.querySelector('.file-drop[for="imageFiles"]');
  els.dropText = document.getElementById('imgDropText');
  els.list = document.getElementById('imgList');
  els.stats = document.getElementById('imgStats');
  els.statsText = document.getElementById('imgStatsText');
  els.clearBtn = document.getElementById('imgClearBtn');
  els.btn = document.getElementById('imgBtn');
  els.previewBtn = document.getElementById('imgPreviewBtn');
  els.cleanMeta = document.getElementById('imgCleanMeta');
}

// Seçili sayfa ayarlarını okur
export function getOptions() {
  const pick = (name, fallback) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : fallback;
  };

  return {
    size: pick('imgSize', 'a4'),
    orientation: pick('imgOrient', 'auto'),
    margin: pick('imgMargin', 'none'),
    quality: pick('imgQuality', 'high'),
    cleanMeta: els.cleanMeta ? els.cleanMeta.checked : false,
  };
}
