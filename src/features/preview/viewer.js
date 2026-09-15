// Tek sayfa görüntüleyici: yüksek çözünürlüklü render + sayfalar arası gezinme.

import { els, pv } from './state.js';

export async function openViewer(flatIndex) {
  if (pv.flatPages.length === 0) return;

  pv.isViewerMode = true;
  els.grid.hidden = true;
  els.viewer.hidden = false;
  els.back.hidden = false;

  await goToPage(flatIndex);
}

export async function goToPage(flatIndex) {
  if (pv.flatPages.length === 0) return;
  if (flatIndex < 0 || flatIndex >= pv.flatPages.length) return;

  pv.currentPage = flatIndex;

  const { docIndex, pageInDoc } = pv.flatPages[flatIndex];
  const doc = pv.loadedDocs[docIndex];

  els.counter.textContent = `${flatIndex + 1} / ${pv.flatPages.length}`;
  els.prev.disabled = flatIndex === 0;
  els.next.disabled = flatIndex === pv.flatPages.length - 1;

  if (pv.renderingTask) {
    try { pv.renderingTask.cancel(); } catch { /* zaten bitmiş olabilir */ }
    pv.renderingTask = null;
  }

  const page = await doc.getPage(pageInDoc);

  const devicePixelRatio = window.devicePixelRatio || 1;
  const targetWidth = Math.min(window.innerWidth * 0.8, 1400);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = Math.max(2, (targetWidth / baseViewport.width) * devicePixelRatio * 0.6);

  const viewport = page.getViewport({ scale });

  els.canvas.width = viewport.width;
  els.canvas.height = viewport.height;

  const ctx = els.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  pv.renderingTask = page.render({ canvasContext: ctx, viewport });
  try {
    await pv.renderingTask.promise;
  } catch (err) {
    // İptal edildiyse sessizce geç
  } finally {
    pv.renderingTask = null;
  }
}

els.prev.addEventListener('click', () => goToPage(pv.currentPage - 1));
els.next.addEventListener('click', () => goToPage(pv.currentPage + 1));
