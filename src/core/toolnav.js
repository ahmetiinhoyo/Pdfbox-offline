// Araç sekmeleri: yalnızca aktif aracın paneli görünür.
// Depolama: localStorage("pdfbox-tool") + URL hash (#merge / #split / #images).
// Dil değişince sekme etiketleri registerLangRenderer ile yenilenir.

import { t, registerLangRenderer } from './lang.js';

const STORAGE_KEY = 'pdfbox-tool';

// Geriye dönük uyumluluk: eski/başka hash değerleri bilinen bir araca eşlenir
const HASH_ALIASES = {
  imagescard: 'images',
};

const els = {
  nav: null,
  tabs: [],
  panels: [],
};

function resolveTool(raw) {
  const clean = String(raw || '').replace('#', '').trim().toLowerCase();
  const id = HASH_ALIASES[clean] || clean;
  return els.panels.some((p) => p.dataset.tool === id) ? id : 'merge';
}

// Paneli göster/gizle; gösterirken kısa fade+slide animasyonu uygula
function setPanelVisible(panel, visible) {
  panel.hidden = !visible;
  if (!visible) return;

  panel.classList.remove('panel-enter');
  // Reflow: aynı panel tekrar gösterilirken animasyonun yeniden başlaması için
  void panel.offsetWidth;
  panel.classList.add('panel-enter');
}

function selectTool(tool) {
  if (!els.tabs.length || !els.panels.length) return;

  const target = resolveTool(tool);

  els.tabs.forEach((tab) => {
    const active = tab.dataset.tool === target;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  els.panels.forEach((panel) => {
    setPanelVisible(panel, panel.dataset.tool === target);
  });

  // merge varsayılan araç olduğu için hash'te taşımıyoruz
  if (target === 'merge') {
    history.replaceState(null, '', location.pathname + location.search);
  } else {
    history.replaceState(null, '', `#${target}`);
  }

  try {
    localStorage.setItem(STORAGE_KEY, target);
  } catch {
    /* private mode: yoksay */
  }
}

function refreshLabels() {
  els.tabs.forEach((tab) => {
    const label = tab.querySelector('span[data-i18n]');
    if (label) label.textContent = t(`nav${cap(tab.dataset.tool)}`);
  });
}

function cap(id) {
  return id ? id[0].toUpperCase() + id.slice(1) : '';
}

function cacheEls() {
  els.nav = document.getElementById('toolNav');
  els.tabs = Array.from(document.querySelectorAll('.tool-tab'));
  els.panels = Array.from(document.querySelectorAll('.tool-panel'));
}

export function initToolNav() {
  cacheEls();
  if (!els.nav || !els.tabs.length || !els.panels.length) return;

  els.nav.addEventListener('click', (e) => {
    const tab = e.target.closest('.tool-tab');
    if (tab) selectTool(tab.dataset.tool);
  });

  // Geri/ileri tuşları veya dış bağlantılar hash'i değiştirince senkron kal
  window.addEventListener('hashchange', () => {
    selectTool(location.hash || 'merge');
  });

  // İlk araç: hash > localStorage > varsayılan (merge)
  let initial = 'merge';
  try {
    initial = location.hash || localStorage.getItem(STORAGE_KEY) || 'merge';
  } catch {
    initial = location.hash || 'merge';
  }
  selectTool(initial);

  registerLangRenderer(refreshLabels);
  refreshLabels();
}
