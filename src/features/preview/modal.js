// Önizleme modalının kapatma / geri dönme davranışları + klavye kısayolları.

import { t } from '../../core/lang.js';
import { els, pv } from './state.js';
import { goToPage } from './viewer.js';
import { resetZoom, zoomBy } from './zoom.js';
import { goBackToGrid, rewindHistory, setHistoryHandlers } from './history.js';

// Görüntüleyiciden galeri görünümüne dön (geçmişe dokunmaz)
export function showGridMode() {
  if (els.modal.hidden) return;

  pv.isViewerMode = false;
  els.viewer.hidden = true;
  els.grid.hidden = false;
  els.back.hidden = true;
  els.title.textContent = pv.loadedDocs.length > 1
    ? t('previewAllTitle', pv.loadedDocs.length, pv.flatPages.length)
    : t('previewTitle', pv.currentFileName);
}

// Modalı kapat: yalnızca görünürlük + durum temizliği (geçmişe dokunmaz).
// Tarayıcı geri tuşu bunu çağırır — kayıt zaten tarayıcı tarafından geri sarıldı.
function closePreviewNow() {
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
  pv.zoom = 1;
  pv.fitScale = 1;
}

// Dışa açılan kapatma: bıraktığımız geçmiş kayıtlarını da geri sar
export function closePreview() {
  rewindHistory();
  closePreviewNow();
}

// Tarayıcı geri/ileri tuşları için geri çağrılar.
// Modal kapalıyken gelen popstate zararsız olmalı: temizliği tekrar çalıştırma.
setHistoryHandlers({
  showGrid: showGridMode,
  close: () => {
    if (els.modal.hidden) return;
    closePreviewNow();
  },
});

els.close.addEventListener('click', closePreview);
els.backdrop.addEventListener('click', closePreview);

els.back.addEventListener('click', () => goBackToGrid());

document.addEventListener('keydown', (e) => {
  if (els.modal.hidden) return;

  if (e.key === 'Escape') {
    if (pv.isViewerMode) {
      goBackToGrid();
    } else {
      closePreview();
    }
  } else if (pv.isViewerMode) {
    if (e.key === 'ArrowLeft') goToPage(pv.currentPage - 1);
    if (e.key === 'ArrowRight') goToPage(pv.currentPage + 1);
    if (e.key === '+' || e.key === '=') zoomBy(1);
    if (e.key === '-' || e.key === '_') zoomBy(-1);
    if (e.key === '0') resetZoom();
  }
});
