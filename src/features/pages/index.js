// Sayfa Düzenle özelliği: kart enjeksiyonu, olay bağlama ve üretim akışı.

import { t, registerLangRenderer } from '../../core/lang.js';
import { showToast } from '../../core/toast.js';
import { setupDropZone, downloadPdf } from '../../core/helpers.js';
import { openPreview } from '../preview/index.js';
import { injectPagesCard, cacheEls, els, getCleanMeta } from './card.js';
import { ps, loadPages, renderGrid, resetPages, resetOrder } from './grid.js';
import { buildPagesPdf } from './build.js';

function setBusy(busy) {
  els.applyBtn.disabled = busy || ps.order.length === 0;
  els.previewBtn.disabled = busy || ps.order.length === 0;
  els.input.disabled = busy;
}

function refresh() {
  const has = !!ps.file;
  els.stats.hidden = !has;
  if (has) {
    els.statsText.textContent = ps.order.length === ps.total
      ? t('pagesSelected', ps.file.name, ps.total)
      : t('pagesRemaining', ps.order.length);
  }
  setBusy(false);
}

// Her sil/taşı değişiminde grid'i yeniden render eder.
// Thumbnail cache sayesinde bu işlem ucuzdur — canvas'lar yeniden çizilmez.
async function rerender() {
  await renderGrid(els.grid, rerender);
  refresh();
}

async function onFile(file) {
  try {
    await loadPages(file);
    els.grid.innerHTML = '';
    await rerender();
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
  }
}

async function createPdf(withDownload) {
  if (!ps.file || ps.order.length === 0) {
    showToast(t('pagesNeedFile'), 'error');
    return;
  }

  setBusy(true);
  els.applyBtn.textContent = t('imgWorking', 0, ps.order.length);

  try {
    const bytes = await buildPagesPdf(ps.file, ps.order, getCleanMeta());
    const name = getCleanMeta() ? 'edited-clean.pdf' : 'edited.pdf';

    if (withDownload) {
      downloadPdf(bytes, name);
      showToast(t(getCleanMeta() ? 'imgSuccessClean' : 'imgSuccess'), 'success');
      els.applyBtn.textContent = t('imgDone');
      setTimeout(() => {
        els.applyBtn.textContent = t('imgBtn');
        setBusy(false);
      }, 1500);
    } else {
      els.applyBtn.textContent = t('imgBtn');
      setBusy(false);
      openPreview(new File([bytes], name, { type: 'application/pdf' }));
    }
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
    els.applyBtn.textContent = t('imgBtn');
    setBusy(false);
  }
}

async function onReset() {
  if (!ps.file) return;
  resetOrder();
  await rerender();
}

async function rerenderLang() {
  if (ps.file) await rerender();
  else refresh();
}

function initPagesFeature() {
  if (!injectPagesCard()) return;

  cacheEls();

  els.input.addEventListener('change', () => {
    const file = els.input.files[0];
    els.input.value = '';
    if (file) onFile(file);
  });

  setupDropZone(els.drop, (files) => {
    const file = files[0];
    if (file) onFile(file);
  });

  els.resetBtn.addEventListener('click', onReset);
  els.applyBtn.addEventListener('click', () => createPdf(true));
  els.previewBtn.addEventListener('click', () => createPdf(false));

  registerLangRenderer(rerenderLang);
  refresh();
}

initPagesFeature();
