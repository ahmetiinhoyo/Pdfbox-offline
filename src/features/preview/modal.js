// Önizleme modalının kapatma / geri dönme davranışları + klavye kısayolları.

import { t } from '../../core/lang.js';
import { els, pv } from './state.js';
import { goToPage } from './viewer.js';

export function closePreview() {
  els.modal.hidden = true;
  els.grid.innerHTML = '';
  els.viewer.hidden = true;
  els.back.hidden = true;
  pv.isViewerMode = false;
  pv.loadedDocs = [];
  pv.docMeta = [];
  pv.flatPages = [];
  pv.currentPage = 0;
  pv.renderingTask = null;
}

els.close.addEventListener('click', closePreview);
els.backdrop.addEventListener('click', closePreview);

els.back.addEventListener('click', () => {
  pv.isViewerMode = false;
  els.viewer.hidden = true;
  els.grid.hidden = false;
  els.back.hidden = true;
  els.title.textContent = pv.loadedDocs.length > 1
    ? t('previewAllTitle', pv.loadedDocs.length, pv.flatPages.length)
    : t('previewTitle', pv.currentFileName);
});

document.addEventListener('keydown', (e) => {
  if (els.modal.hidden) return;

  if (e.key === 'Escape') {
    if (pv.isViewerMode) {
      els.back.click();
    } else {
      closePreview();
    }
  } else if (pv.isViewerMode) {
    if (e.key === 'ArrowLeft') goToPage(pv.currentPage - 1);
    if (e.key === 'ArrowRight') goToPage(pv.currentPage + 1);
  }
});
