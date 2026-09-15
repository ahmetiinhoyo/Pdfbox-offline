// Sayfa ızgarası: thumbnail cache + sil/taşı durumu.
// Thumbnail'lar sayfa numarasına göre cache'lenir; sıralama değişince
// yeniden render gerekmez, cache'teki canvas yeniden kullanılır.

import { t } from '../../core/lang.js';
import { pdfjsLib } from '../../core/pdf.js';

export const ps = {
  file: null,   // seçilen PDF dosyası
  doc: null,    // pdfjs dökümanı (thumbnail kaynağı)
  total: 0,     // toplam sayfa
  order: [],    // mevcut sıra — 1 tabanlı orijinal sayfa numaraları
};

const thumbCache = new Map();
const THUMB_SCALE = 1.1;

export function resetPages() {
  ps.file = null;
  ps.doc = null;
  ps.total = 0;
  ps.order = [];
  thumbCache.clear();
}

export function resetOrder() {
  ps.order = Array.from({ length: ps.total }, (_, i) => i + 1);
}

// PDF'i yükler ve orijinal sırayı kurar
export async function loadPages(file) {
  const bytes = await file.arrayBuffer();
  ps.file = file;
  ps.doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  ps.total = ps.doc.numPages;
  ps.order = Array.from({ length: ps.total }, (_, i) => i + 1);
  thumbCache.clear();
}

function movePage(pos, dir) {
  const [page] = ps.order.splice(pos, 1);
  ps.order.splice(pos + dir, 0, page);
}

async function getThumb(num) {
  if (thumbCache.has(num)) return thumbCache.get(num);

  const page = await ps.doc.getPage(num);
  const viewport = page.getViewport({ scale: THUMB_SCALE });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

  thumbCache.set(num, canvas);
  return canvas;
}

function makeToolBtn(icon, labelKey, disabled, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'page-tool-btn';
  btn.title = t(labelKey);
  btn.setAttribute('aria-label', t(labelKey));
  btn.disabled = disabled;
  btn.addEventListener('click', onClick);
  btn.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg>`;
  return btn;
}

function makeCell(canvas, num, pos, onChange) {
  const total = ps.order.length;

  const cell = document.createElement('div');
  cell.className = 'page-cell';

  const thumb = document.createElement('div');
  thumb.className = 'page-thumb';
  thumb.appendChild(canvas);
  cell.appendChild(thumb);

  const num_ = document.createElement('span');
  num_.className = 'page-num';
  num_.textContent = t('pagesPage', num);
  cell.appendChild(num_);

  const tools = document.createElement('div');
  tools.className = 'page-tools';
  // Sola/sağa taşı — en soldaki sayfada sol, en sağdakinde sağ butonu kilitli
  tools.appendChild(makeToolBtn('i-chevron-left', 'pagesMoveLeft', pos === 0, () => {
    movePage(pos, -1); onChange();
  }));
  tools.appendChild(makeToolBtn('i-chevron-right', 'pagesMoveRight', pos === total - 1, () => {
    movePage(pos, 1); onChange();
  }));
  tools.appendChild(makeToolBtn('i-x', 'remove', false, () => {
    ps.order.splice(pos, 1); onChange();
  }));
  cell.appendChild(tools);

  return cell;
}

// Izgarayı mevcut sıraya göre render eder (cache'li thumbnail'larla)
export async function renderGrid(container, onChange) {
  container.innerHTML = '';

  for (let pos = 0; pos < ps.order.length; pos++) {
    const canvas = await getThumb(ps.order[pos]);
    container.appendChild(makeCell(canvas, ps.order[pos], pos, onChange));
  }

  if (ps.order.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'pages-empty';
    hint.textContent = t('pagesAllDeleted');
    container.appendChild(hint);
  }
}
