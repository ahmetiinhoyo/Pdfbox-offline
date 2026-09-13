import { PDFDocument } from 'pdf-lib';
import { detectLang, t } from './i18n.js';

let currentLang = detectLang();

// ============================================================
// TOAST BİLDİRİMLERİ
// ============================================================
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  toastContainer.appendChild(toast);

  const remove = () => {
    if (!toast.parentNode) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, duration);

  return toast;
}

// ============================================================
// DİL
// ============================================================
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('pdfbox-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(lang, key);
  });

  const rangeInput = document.getElementById('pageRange');
  if (rangeInput) {
    rangeInput.placeholder = t(lang, 'splitRangePlaceholder');
  }

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderMergeList();
  renderSplitDrop();
}

document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// ============================================================
// ORTAK YARDIMCILAR
// ============================================================
function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * "1-3, 5, 7-9" → [0,1,2,4,6,7,8]  (0-indexed)
 */
function parsePageRange(input, maxPage) {
  const trimmed = input.trim();
  if (trimmed === '') {
    return Array.from({ length: maxPage }, (_, i) => i);
  }

  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const pages = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(x => x.trim());
      const start = Number(a);
      const end = Number(b);
      if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
      if (start < 1 || end < 1 || start > end) return null;
      if (end > maxPage) return { error: 'outOfRange', max: maxPage };
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const n = Number(part);
      if (!Number.isInteger(n) || n < 1) return null;
      if (n > maxPage) return { error: 'outOfRange', max: maxPage };
      pages.add(n - 1);
    }
  }

  if (pages.size === 0) return null;
  return Array.from(pages).sort((a, b) => a - b);
}

// ============================================================
// BİRLEŞTİR
// ============================================================
const mergeInput = document.getElementById('files');
const mergeList = document.getElementById('list');
const mergeBtn = document.getElementById('merge');
const mergeDropText = document.querySelector('.file-drop .drop-text');

let mergeFiles = [];

mergeInput.addEventListener('change', () => {
  const newFiles = Array.from(mergeInput.files);
  newFiles.forEach(f => {
    const already = mergeFiles.some(
      s => s.name === f.name && s.size === f.size
    );
    if (!already) mergeFiles.push(f);
  });
  mergeInput.value = '';
  renderMergeList();
});

function renderMergeList() {
  mergeList.innerHTML = '';

  if (mergeFiles.length === 0) {
    mergeDropText.textContent = t(currentLang, 'dropText');
    mergeBtn.disabled = true;
    return;
  }

  mergeDropText.textContent = t(currentLang, 'dropTextMulti', mergeFiles.length);

  mergeFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="file-name">${i + 1}. ${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(0)} KB</span>
      <button class="remove" data-i="${i}" title="${t(currentLang, 'remove')}">✕</button>
    `;
    mergeList.appendChild(li);
  });

  mergeList.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.i);
      mergeFiles.splice(idx, 1);
      renderMergeList();
    });
  });

  mergeBtn.disabled = mergeFiles.length < 2;
}

mergeBtn.addEventListener('click', async () => {
  if (mergeFiles.length < 2) {
    showToast(t(currentLang, 'needTwo'), 'error');
    return;
  }

  mergeBtn.disabled = true;
  mergeBtn.textContent = t(currentLang, 'merging');

  try {
    const merged = await PDFDocument.create();

    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }

    const outBytes = await merged.save();
    downloadPdf(outBytes, 'birlestirilmis.pdf');

    showToast(t(currentLang, 'mergeSuccess'), 'success');

    mergeBtn.textContent = t(currentLang, 'done');
    setTimeout(() => {
      mergeBtn.textContent = t(currentLang, 'mergeBtn');
      mergeBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    mergeBtn.textContent = t(currentLang, 'mergeBtn');
    mergeBtn.disabled = false;
  }
});

// ============================================================
// BÖL
// ============================================================
const splitInput = document.getElementById('splitFile');
const splitBtn = document.getElementById('split');
const splitDropText = document.getElementById('splitDropText');
const rangeInput = document.getElementById('pageRange');

let splitFile = null;
let splitPageCount = 0;

splitInput.addEventListener('change', async () => {
  const file = splitInput.files[0];
  if (!file) return;

  splitFile = file;

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    splitPageCount = pdf.getPageCount();
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    splitFile = null;
    splitInput.value = '';
    return;
  }

  splitInput.value = '';
  renderSplitDrop();
});

function renderSplitDrop() {
  if (!splitFile) {
    splitDropText.textContent = t(currentLang, 'splitDropText');
    splitBtn.disabled = true;
    return;
  }

  splitDropText.textContent = t(
    currentLang,
    'splitDropSelected',
    splitFile.name,
    splitPageCount
  );
  splitBtn.disabled = false;
}

splitBtn.addEventListener('click', async () => {
  if (!splitFile) {
    showToast(t(currentLang, 'splitNeedFile'), 'error');
    return;
  }

  const parsed = parsePageRange(rangeInput.value, splitPageCount);

  if (parsed === null) {
    showToast(t(currentLang, 'splitInvalidRange'), 'error');
    return;
  }

  if (parsed && typeof parsed === 'object' && parsed.error === 'outOfRange') {
    showToast(t(currentLang, 'splitOutOfRange', parsed.max), 'error');
    return;
  }

  splitBtn.disabled = true;
  splitBtn.textContent = t(currentLang, 'splitting');

  try {
    const bytes = await splitFile.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const output = await PDFDocument.create();
    const copied = await output.copyPages(source, parsed);
    copied.forEach(p => output.addPage(p));

    const outBytes = await output.save();
    downloadPdf(outBytes, 'bolunmus.pdf');

    showToast(t(currentLang, 'splitSuccess'), 'success');

    splitBtn.textContent = t(currentLang, 'splitDone');
    setTimeout(() => {
      splitBtn.textContent = t(currentLang, 'splitBtn');
      splitBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    splitBtn.textContent = t(currentLang, 'splitBtn');
    splitBtn.disabled = false;
  }
});

// ============================================================
// BAŞLAT
// ============================================================
applyLang(currentLang);