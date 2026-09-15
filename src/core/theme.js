// Tema (dark/light) ve vurgu rengi (accent) yönetimi + sağ üst kontroller.

import { icon } from './dom.js';
import { showToast } from './toast.js';
import { t } from './lang.js';

const ACCENTS = ['blue', 'green', 'orange', 'pink'];

function getSavedTheme() {
  const saved = localStorage.getItem('pdfbox-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function getSavedAccent() {
  const saved = localStorage.getItem('pdfbox-accent');
  return ACCENTS.includes(saved) ? saved : 'blue';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pdfbox-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = icon(theme === 'dark' ? 'i-moon' : 'i-sun');
  }
}

export function applyAccent(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  localStorage.setItem('pdfbox-accent', accent);
}

// Aktif rengi menüde işaretle
export function markActiveAccent() {
  const current = document.documentElement.getAttribute('data-accent') || 'blue';
  accentMenu.querySelectorAll('.accent-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.accent === current);
  });
}

const themeToggle = document.getElementById('themeToggle');
const accentBtn = document.getElementById('accentBtn');
const accentMenu = document.getElementById('accentMenu');

function openAccentMenu() {
  accentMenu.hidden = false;
  accentBtn.classList.add('active');
}

function closeAccentMenu() {
  accentMenu.hidden = true;
  accentBtn.classList.remove('active');
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(t(next === 'dark' ? 'themeDark' : 'themeLight'), 'info', 2000);
});

// Renk menüsü (dropdown)
accentBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (accentMenu.hidden) {
    openAccentMenu();
  } else {
    closeAccentMenu();
  }
});

accentMenu.querySelectorAll('.accent-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    e.stopPropagation();
    const accent = swatch.dataset.accent;
    applyAccent(accent);
    markActiveAccent();

    const key = 'accent' + accent.charAt(0).toUpperCase() + accent.slice(1);
    showToast(t(key), 'info', 2000);
    closeAccentMenu();
  });
});

// Menü dışına tıklayınca kapat
document.addEventListener('click', () => {
  if (!accentMenu.hidden) closeAccentMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !accentMenu.hidden) closeAccentMenu();
});

// Kayıtlı tema ve rengi uygular, menüde aktif rengi işaretler.
export function initTheme() {
  applyTheme(getSavedTheme());
  applyAccent(getSavedAccent());
  markActiveAccent();
}
