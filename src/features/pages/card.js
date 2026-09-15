// Sayfa Düzenle kartı: markup enjeksiyonu + DOM referansları.
// Not: index.html'e dokunulmaz — kart ayrı modülden gelir (images kartı deseni).

import cardHtml from '../../ui/pages-card.html?raw';

// Grid butonlarının kullandığı ikonlar: sol/sağ ok için sprite'taki
// statik i-chevron-left / i-chevron-right kullanılır (ek enjeksiyon gerekmez).

export const els = {
  drop: null,
  input: null,
  stats: null,
  statsText: null,
  resetBtn: null,
  grid: null,
  applyBtn: null,
  previewBtn: null,
  cleanMeta: null,
};

// Kartı araç paneli alanına ekler. Başarılıysa true döner.
export function injectPagesCard() {
  const panels = document.getElementById('toolPanels');
  if (!panels) return false;

  panels.insertAdjacentHTML('beforeend', cardHtml);
  return true;
}

export function cacheEls() {
  els.input = document.getElementById('pagesFile');
  els.drop = document.querySelector('.file-drop[for="pagesFile"]');
  els.stats = document.getElementById('pagesStats');
  els.statsText = document.getElementById('pagesStatsText');
  els.resetBtn = document.getElementById('pagesResetBtn');
  els.grid = document.getElementById('pagesGrid');
  els.applyBtn = document.getElementById('pagesApplyBtn');
  els.previewBtn = document.getElementById('pagesPreviewBtn');
  els.cleanMeta = document.getElementById('pagesCleanMeta');
}

export function getCleanMeta() {
  return els.cleanMeta ? els.cleanMeta.checked : false;
}
