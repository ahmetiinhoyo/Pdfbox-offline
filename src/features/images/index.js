// Görselden PDF özelliği: kart enjeksiyonu, olay bağlama ve üretim akışı.

import { t, registerLangRenderer } from '../../core/lang.js';
import { showToast } from '../../core/toast.js';
import { setupDropZone, downloadPdf } from '../../core/helpers.js';
import { openPreview } from '../preview/index.js';
import { injectImagesCard, cacheEls, els, getOptions } from './card.js';
import { images, addImageFiles, clearImages, renderImages } from './list.js';
import { buildImagesPdf } from './build.js';

function setBusy(busy) {
  const empty = images.length === 0;
  els.btn.disabled = busy || empty;
  els.previewBtn.disabled = busy || empty;
  els.input.disabled = busy;
}

function showProgress(done, total) {
  els.btn.textContent = t('imgWorking', done, total);
}

async function createPdf(withDownload) {
  if (images.length === 0) {
    showToast(t('imgNeedFile'), 'error');
    return;
  }

  const opts = getOptions();
  const files = images.map((item) => item.file);

  setBusy(true);
  els.btn.textContent = t('imgWorking', 0, files.length);

  try {
    const bytes = await buildImagesPdf(files, opts, showProgress);
    const name = opts.cleanMeta ? 'cleanmeta-gorselden.pdf' : 'gorselden-pdf.pdf';

    if (withDownload) {
      downloadPdf(bytes, name);
      showToast(t(opts.cleanMeta ? 'imgSuccessClean' : 'imgSuccess'), 'success');
      els.btn.textContent = t('imgDone');
      setTimeout(() => {
        els.btn.textContent = t('imgBtn');
        setBusy(false);
      }, 1500);
    } else {
      els.btn.textContent = t('imgBtn');
      setBusy(false);
      openPreview(new File([bytes], name, { type: 'application/pdf' }));
    }
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
    els.btn.textContent = t('imgBtn');
    setBusy(false);
  }
}

function initImagesFeature() {
  if (!injectImagesCard()) return;

  cacheEls();

  els.input.addEventListener('change', () => {
    const files = Array.from(els.input.files);
    els.input.value = '';
    addImageFiles(files);
  });

  setupDropZone(els.drop, addImageFiles);

  els.clearBtn.addEventListener('click', clearImages);
  els.btn.addEventListener('click', () => createPdf(true));
  els.previewBtn.addEventListener('click', () => createPdf(false));

  registerLangRenderer(renderImages);
  renderImages();
}

initImagesFeature();
