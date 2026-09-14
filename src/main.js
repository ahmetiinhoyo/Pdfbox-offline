import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { detectLang, t } from './i18n.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let currentLang = detectLang();

// ============================================================
// TEMA & RENK
// ============================================================
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

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pdfbox-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function applyAccent(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  localStorage.setItem('pdfbox-accent', accent);
}

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
// ÖNİZLEME MODAL + GÖRÜNTÜLEYİCİ
// ============================================================
const previewModal = document.getElementById('previewModal');
const previewBackdrop = document.getElementById('previewBackdrop');
const previewClose = document.getElementById('previewClose');
const previewBack = document.getElementById('previewBack');
const previewTitle = document.getElementById('previewTitle');
const previewGrid = document.getElementById('previewGrid');
const previewViewer = document.getElementById('previewViewer');
const viewerCanvas = document.getElementById('viewerCanvas');
const viewerPrev = document.getElementById('viewerPrev');
const viewerNext = document.getElementById('viewerNext');
const viewerCounter = document.getElementById('viewerCounter');

let loadedDocs = [];   // pdfjs belgeleri (her dosya için bir tane)
let docMeta = [];      // { name, numPages }
let flatPages = [];    // [{ docIndex, pageInDoc }] — tüm dosyaların düz sayfa haritası
let currentPage = 0;   // düz (flat) sayfa indeksi
let isViewerMode = false;
let renderingTask = null;
let currentFileName = '';

function closePreview() {
  previewModal.hidden = true;
  previewGrid.innerHTML = '';
  previewViewer.hidden = true;
  previewBack.hidden = true;
  isViewerMode = false;
  loadedDocs = [];
  docMeta = [];
  flatPages = [];
  currentPage = 0;
  renderingTask = null;
}

previewClose.addEventListener('click', closePreview);
previewBackdrop.addEventListener('click', closePreview);

previewBack.addEventListener('click', () => {
  isViewerMode = false;
  previewViewer.hidden = true;
  previewGrid.hidden = false;
  previewBack.hidden = true;
  previewTitle.textContent = loadedDocs.length > 1
    ? t(currentLang, 'previewAllTitle', loadedDocs.length, flatPages.length)
    : t(currentLang, 'previewTitle', currentFileName);
});

document.addEventListener('keydown', (e) => {
  if (previewModal.hidden) return;

  if (e.key === 'Escape') {
    if (isViewerMode) {
      previewBack.click();
    } else {
      closePreview();
    }
  } else if (isViewerMode) {
    if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
  }
});

// files: File | File[]  — showHeaders: her dosyanın başlığını göster
async function openPreview(files, showHeaders = false) {
  if (!files) return;

  const fileArr = Array.isArray(files) ? files : [files];
  if (fileArr.length === 0) return;

  currentFileName = fileArr[0].name;

  previewGrid.innerHTML = `<div class="preview-loading">⏳ ${t(currentLang, 'previewLoading')}</div>`;
  previewModal.hidden = false;
  isViewerMode = false;
  previewViewer.hidden = true;
  previewGrid.hidden = false;
  previewBack.hidden = true;

  try {
    loadedDocs = [];
    docMeta = [];
    flatPages = [];

    // Tüm dosyaları sırayla yükle
    for (const f of fileArr) {
      const bytes = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      loadedDocs.push(doc);
      docMeta.push({ name: f.name, numPages: doc.numPages });
    }

    // Başlık
    const totalPages = docMeta.reduce((s, m) => s + m.numPages, 0);
    previewTitle.textContent = showHeaders
      ? t(currentLang, 'previewAllTitle', docMeta.length, totalPages)
      : t(currentLang, 'previewTitle', docMeta[0].name);

    // Tüm dosyaların sayfalarını tek düz listede topla
    loadedDocs.forEach((doc, di) => {
      for (let p = 1; p <= doc.numPages; p++) {
        flatPages.push({ docIndex: di, pageInDoc: p });
      }
    });

    previewGrid.innerHTML = '';

    for (let di = 0; di < loadedDocs.length; di++) {
      const doc = loadedDocs[di];

      // Dosya başlığı (üstte PDF ismi)
      if (showHeaders) {
        const header = document.createElement('div');
        header.className = 'preview-file-header';
        header.textContent = t(
          currentLang,
          'previewFileHeader',
          di + 1,
          docMeta[di].name,
          doc.numPages
        );
        previewGrid.appendChild(header);
      }

      // Altında o dosyanın sayfaları
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const viewport = page.getViewport({ scale: 1.5 });

        const pageWrap = document.createElement('div');
        pageWrap.className = 'preview-page';
        pageWrap.dataset.page = p;

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const label = document.createElement('span');
        label.className = 'preview-page-label';
        label.textContent = t(currentLang, 'previewPage', p);

        pageWrap.appendChild(canvas);
        pageWrap.appendChild(label);

        const flatIndex = flatPages.findIndex(
          fp => fp.docIndex === di && fp.pageInDoc === p
        );
        pageWrap.addEventListener('click', () => openViewer(flatIndex));

        previewGrid.appendChild(pageWrap);
      }
    }
  } catch (err) {
    console.error(err);
    previewGrid.innerHTML = `<div class="preview-error">❌ ${t(currentLang, 'previewError')}</div>`;
  }
}

async function openViewer(flatIndex) {
  if (flatPages.length === 0) return;

  isViewerMode = true;
  previewGrid.hidden = true;
  previewViewer.hidden = false;
  previewBack.hidden = false;

  await goToPage(flatIndex);
}

async function goToPage(flatIndex) {
  if (flatPages.length === 0) return;
  if (flatIndex < 0 || flatIndex >= flatPages.length) return;

  currentPage = flatIndex;

  const { docIndex, pageInDoc } = flatPages[flatIndex];
  const doc = loadedDocs[docIndex];

  viewerCounter.textContent = `${flatIndex + 1} / ${flatPages.length}`;
  viewerPrev.disabled = flatIndex === 0;
  viewerNext.disabled = flatIndex === flatPages.length - 1;

  if (renderingTask) {
    try { renderingTask.cancel(); } catch {}
    renderingTask = null;
  }

  const page = await doc.getPage(pageInDoc);

  // Yüksek çözünürlükte render et (CSS ile küçültülecek)
  // Ekran boyutuna göre dinamik scale
  const devicePixelRatio = window.devicePixelRatio || 1;
  const targetWidth = Math.min(window.innerWidth * 0.8, 1400);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = Math.max(2, (targetWidth / baseViewport.width) * devicePixelRatio * 0.6);

  const viewport = page.getViewport({ scale });

  viewerCanvas.width = viewport.width;
  viewerCanvas.height = viewport.height;

  const ctx = viewerCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  renderingTask = page.render({ canvasContext: ctx, viewport });
  try {
    await renderingTask.promise;
  } catch (err) {
    // İptal edildiyse
  } finally {
    renderingTask = null;
  }
}

viewerPrev.addEventListener('click', () => goToPage(currentPage - 1));
viewerNext.addEventListener('click', () => goToPage(currentPage + 1));

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
  renderMetaDrop();
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
// SÜRÜKLE-BIRAK
// ============================================================
function setupDropZone(dropElement, onFiles) {
  if (!dropElement) return;

  ['dragenter', 'dragover'].forEach(evt => {
    dropElement.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropElement.classList.add('dragover');
    });
  });

  dropElement.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropElement.contains(e.relatedTarget)) return;
    dropElement.classList.remove('dragover');
  });

  dropElement.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropElement.classList.remove('dragover');

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFiles(Array.from(files));
    }
  });
}

// ============================================================
// BİRLEŞTİR
// ============================================================
const mergeInput = document.getElementById('files');
const mergeList = document.getElementById('list');
const mergeBtn = document.getElementById('merge');
const mergeDropText = document.querySelector('.file-drop .drop-text');
const mergeDrop = document.querySelector('.file-drop[for="files"]');
const mergeStatsEl = document.getElementById('mergeStats');
const mergeStatsText = document.getElementById('mergeStatsText');

// "Tümünü Önizle" butonu (dinamik oluşturulur, HTML'e dokunmadan)
const previewAllBtn = document.createElement('button');
previewAllBtn.type = 'button';
previewAllBtn.className = 'preview-all-btn';
previewAllBtn.hidden = true;
previewAllBtn.addEventListener('click', () => {
  if (mergeFiles.length > 0) openPreview(mergeFiles, true);
});
mergeStatsEl.insertAdjacentElement('afterend', previewAllBtn);

let mergeFiles = [];

async function addMergeFiles(newFiles) {
  const pdfs = newFiles.filter(f =>
    f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
  );

  if (pdfs.length === 0) {
    showToast(t(currentLang, 'onlyPdf'), 'error');
    return;
  }

  for (const f of pdfs) {
    const already = mergeFiles.some(s => s.name === f.name && s.size === f.size);
    if (!already) {
      try {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        f._pageCount = pdf.getPageCount();
      } catch {
        f._pageCount = 0;
      }
      mergeFiles.push(f);
    }
  }

  renderMergeList();
}

mergeInput.addEventListener('change', () => {
  const files = Array.from(mergeInput.files);
  mergeInput.value = '';
  addMergeFiles(files);
});

setupDropZone(mergeDrop, addMergeFiles);

function renderMergeList() {
  mergeList.innerHTML = '';

  if (mergeFiles.length === 0) {
    mergeDropText.textContent = t(currentLang, 'dropText');
    mergeBtn.disabled = true;
    mergeStatsEl.hidden = true;
    previewAllBtn.hidden = true;
    return;
  }

  mergeDropText.textContent = t(currentLang, 'dropTextMulti', mergeFiles.length);

  const totalPages = mergeFiles.reduce((sum, f) => sum + (f._pageCount || 0), 0);
  mergeStatsText.textContent = t(currentLang, 'statsLine', mergeFiles.length, totalPages);
  mergeStatsEl.hidden = false;

  // 2+ dosya varsa "Tümünü Önizle" butonu görünür
  previewAllBtn.hidden = mergeFiles.length < 2;
  previewAllBtn.textContent = `👁 ${t(currentLang, 'previewAllBtn')}`;

  mergeFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="file-name">${i + 1}. ${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(0)} KB</span>
      <button class="preview-btn" data-i="${i}" title="${t(currentLang, 'previewBtn')}">👁</button>
      <button class="remove" data-i="${i}" title="${t(currentLang, 'remove')}">✕</button>
    `;
    mergeList.appendChild(li);
  });

  mergeList.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.i);
      openPreview(mergeFiles[idx]);
    });
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
const splitDrop = document.querySelector('.file-drop[for="splitFile"]');
const splitActions = document.getElementById('splitActions');
const splitPreviewBtn = document.getElementById('splitPreviewBtn');

let splitFile = null;
let splitPageCount = 0;

async function handleSplitFile(file) {
  if (!file) return;

  if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    showToast(t(currentLang, 'onlyPdf'), 'error');
    return;
  }

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    splitPageCount = pdf.getPageCount();
    splitFile = file;
    renderSplitDrop();
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    splitFile = null;
    renderSplitDrop();
  }
}

splitInput.addEventListener('change', () => {
  const file = splitInput.files[0];
  splitInput.value = '';
  handleSplitFile(file);
});

setupDropZone(splitDrop, (files) => {
  if (files.length > 1) {
    showToast(t(currentLang, 'oneFileSplit'), 'info');
  }
  handleSplitFile(files[0]);
});

splitPreviewBtn.addEventListener('click', () => {
  if (splitFile) openPreview(splitFile);
});

function renderSplitDrop() {
  if (!splitFile) {
    splitDropText.textContent = t(currentLang, 'splitDropText');
    splitBtn.disabled = true;
    splitActions.hidden = true;
    return;
  }

  splitDropText.textContent = t(
    currentLang,
    'splitDropSelected',
    splitFile.name,
    splitPageCount
  );
  splitBtn.disabled = false;
  splitActions.hidden = false;
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
// METADATA TEMİZLE
// ============================================================
const metaInput = document.getElementById('metaFile');
const metaBtn = document.getElementById('metaBtn');
const metaDropText = document.getElementById('metaDropText');
const metaDrop = document.querySelector('.file-drop[for="metaFile"]');
const metaActions = document.getElementById('metaActions');
const metaPreviewBtn = document.getElementById('metaPreviewBtn');
const metaInfo = document.getElementById('metaInfo');

let metaFile = null;

function formatMetaLine(label, value) {
  if (!value) return '';
  return `<div class="meta-line"><span class="meta-label">${label}:</span> <span class="meta-value">${value}</span></div>`;
}

async function handleMetaFile(file) {
  if (!file) return;

  if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    showToast(t(currentLang, 'onlyPdf'), 'error');
    return;
  }

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    metaFile = file;

    const author = pdf.getAuthor() || '';
    const title = pdf.getTitle() || '';
    const subject = pdf.getSubject() || '';
    const creator = pdf.getCreator() || '';
    const producer = pdf.getProducer() || '';
    const keywords = (pdf.getKeywords() || []).join(', ');

    // Info kutusu
    const foundItems = [];
    if (author) foundItems.push(formatMetaLine(t(currentLang, 'metaAuthor'), author));
    if (title) foundItems.push(formatMetaLine(t(currentLang, 'metaTitleField'), title));
    if (subject) foundItems.push(formatMetaLine(t(currentLang, 'metaSubject'), subject));
    if (creator) foundItems.push(formatMetaLine(t(currentLang, 'metaCreator'), creator));
    if (producer) foundItems.push(formatMetaLine(t(currentLang, 'metaProducer'), producer));
    if (keywords) foundItems.push(formatMetaLine(t(currentLang, 'metaKeywords'), keywords));

    if (foundItems.length > 0) {
      metaInfo.innerHTML = `
        <div class="meta-info-title">${t(currentLang, 'metaWhatFound')}</div>
        ${foundItems.join('')}
        <div class="meta-info-hint">${t(currentLang, 'metaWhatClean')}</div>
      `;
    } else {
      metaInfo.innerHTML = `<div class="meta-info-hint">${t(currentLang, 'metaNoInfo')}</div>`;
    }
    metaInfo.hidden = false;

    renderMetaDrop();
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    metaFile = null;
    renderMetaDrop();
  }
}

metaInput.addEventListener('change', () => {
  const file = metaInput.files[0];
  metaInput.value = '';
  handleMetaFile(file);
});

setupDropZone(metaDrop, (files) => {
  if (files.length > 1) {
    showToast(t(currentLang, 'oneFileSplit'), 'info');
  }
  handleMetaFile(files[0]);
});

metaPreviewBtn.addEventListener('click', () => {
  if (metaFile) openPreview(metaFile);
});

function renderMetaDrop() {
  if (!metaFile) {
    metaDropText.textContent = t(currentLang, 'metaDropText');
    metaBtn.disabled = true;
    metaActions.hidden = true;
    metaInfo.hidden = true;
    return;
  }

  metaDropText.textContent = t(currentLang, 'metaDropSelected', metaFile.name);
  metaBtn.disabled = false;
  metaActions.hidden = false;
}

metaBtn.addEventListener('click', async () => {
  if (!metaFile) {
    showToast(t(currentLang, 'metaNeedFile'), 'error');
    return;
  }

  metaBtn.disabled = true;
  metaBtn.textContent = t(currentLang, 'metaWorking');

  try {
    const bytes = await metaFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    // Tüm metadata'yı sıfırla
    pdf.setAuthor('');
    pdf.setTitle('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setCreator('');
    pdf.setProducer('');
    pdf.setCreationDate(new Date(0));
    pdf.setModificationDate(new Date(0));

    const outBytes = await pdf.save();
    downloadPdf(outBytes, 'metadata-temiz.pdf');

    showToast(t(currentLang, 'metaSuccess'), 'success');

    metaBtn.textContent = t(currentLang, 'metaDone');
    setTimeout(() => {
      metaBtn.textContent = t(currentLang, 'metaBtn');
      metaBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t(currentLang, 'error') + err.message, 'error');
    metaBtn.textContent = t(currentLang, 'metaBtn');
    metaBtn.disabled = false;
  }
});

// ============================================================
// TEMA & RENK BUTONLARI
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const accentBtn = document.getElementById('accentBtn');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(t(currentLang, next === 'dark' ? 'themeDark' : 'themeLight'), 'info', 2000);
});

accentBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-accent') || 'blue';
  const idx = ACCENTS.indexOf(current);
  const next = ACCENTS[(idx + 1) % ACCENTS.length];
  applyAccent(next);

  const key = 'accent' + next.charAt(0).toUpperCase() + next.slice(1);
  showToast(t(currentLang, key), 'info', 2000);
});

// ============================================================
// DARK READER UYARISI
// ============================================================
function detectDarkReader() {
  if (document.querySelector('style.darkreader')) return true;
  if (document.querySelector('style[class*="darkreader"]')) return true;
  if (document.documentElement.hasAttribute('data-darkreader-scheme')) return true;
  if (document.documentElement.hasAttribute('data-darkreader-mode')) return true;
  return false;
}

setTimeout(() => {
  if (detectDarkReader()) {
    showToast(t(currentLang, 'darkReaderWarning'), 'info', 7000);
  }
}, 2000);

// ============================================================
// BAŞLAT
// ============================================================
applyTheme(getSavedTheme());
applyAccent(getSavedAccent());
applyLang(currentLang);