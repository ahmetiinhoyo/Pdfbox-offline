// Önizleme galerisi: tek dosya veya çoklu dosya sayfalarını tek ızgarada render eder.

import { t } from '../../core/lang.js';
import { pdfjsLib } from '../../core/pdf.js';
import { els, pv } from './state.js';
import { openViewer } from './viewer.js';

export async function openPreview(files, showHeaders = false) {
  if (!files) return;

  const fileArr = Array.isArray(files) ? files : [files];
  if (fileArr.length === 0) return;

  pv.currentFileName = fileArr[0].name;

  els.grid.innerHTML = `<div class="preview-loading">${t('previewLoading')}</div>`;
  els.modal.hidden = false;
  pv.isViewerMode = false;
  els.viewer.hidden = true;
  els.grid.hidden = false;
  els.back.hidden = true;
  pv.zoom = 1;
  pv.fitScale = 1;

  try {
    pv.loadedDocs = [];
    pv.docMeta = [];
    pv.flatPages = [];

    for (const f of fileArr) {
      const bytes = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      pv.loadedDocs.push(doc);
      pv.docMeta.push({ name: f.name, numPages: doc.numPages });
    }

    const totalPages = pv.docMeta.reduce((s, m) => s + m.numPages, 0);
    els.title.textContent = showHeaders
      ? t('previewAllTitle', pv.docMeta.length, totalPages)
      : t('previewTitle', pv.docMeta[0].name);

    pv.loadedDocs.forEach((doc, di) => {
      for (let p = 1; p <= doc.numPages; p++) {
        pv.flatPages.push({ docIndex: di, pageInDoc: p });
      }
    });

    els.grid.innerHTML = '';

    for (let di = 0; di < pv.loadedDocs.length; di++) {
      const doc = pv.loadedDocs[di];

      if (showHeaders) {
        const header = document.createElement('div');
        header.className = 'preview-file-header';
        header.textContent = t(
          'previewFileHeader',
          di + 1,
          pv.docMeta[di].name,
          doc.numPages
        );
        els.grid.appendChild(header);
      }

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
        label.textContent = t('previewPage', p);

        pageWrap.appendChild(canvas);
        pageWrap.appendChild(label);

        const flatIndex = pv.flatPages.findIndex(
          fp => fp.docIndex === di && fp.pageInDoc === p
        );
        pageWrap.addEventListener('click', () => openViewer(flatIndex));

        els.grid.appendChild(pageWrap);
      }
    }
  } catch (err) {
    console.error(err);
    els.grid.innerHTML = `<div class="preview-error">${t('previewError')}</div>`;
  }
}
