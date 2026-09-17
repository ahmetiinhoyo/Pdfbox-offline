// Birleştirme özelliği: çoklu PDF seç → sırala → tek dosya olarak indir.

import { PDFDocument } from 'pdf-lib';
import { icon } from '../core/dom.js';
import { t, registerLangRenderer } from '../core/lang.js';
import { showToast } from '../core/toast.js';
import { downloadPdf, setupDropZone, cleanPdfMetadata } from '../core/helpers.js';
import { openPreview } from './preview/index.js';
import { registerWorkChecker } from '../core/work-guard.js';

const mergeInput = document.getElementById('files');
const mergeList = document.getElementById('list');
const mergeBtn = document.getElementById('merge');
const mergeDropText = document.querySelector('.card .file-drop[for="files"] .drop-text');
const mergeDrop = document.querySelector('.card .file-drop[for="files"]');
const mergeStatsEl = document.getElementById('mergeStats');
const mergeStatsText = document.getElementById('mergeStatsText');
const mergeCleanMeta = document.getElementById('mergeCleanMeta');

let mergeFiles = [];

// Dosya listesi boş değilken sayfadan çıkışta onay istensin
registerWorkChecker(() => mergeFiles.length > 0);

// "Tümünü Önizle" butonu (2+ dosyada görünür, HTML'de yok)
const previewAllBtn = document.createElement('button');
previewAllBtn.type = 'button';
previewAllBtn.className = 'ghost-btn';
previewAllBtn.hidden = true;
previewAllBtn.addEventListener('click', () => {
  if (mergeFiles.length > 0) openPreview(mergeFiles, true);
});
mergeStatsEl.insertAdjacentElement('afterend', previewAllBtn);

async function addMergeFiles(newFiles) {
  const pdfs = newFiles.filter(f =>
    f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
  );

  if (pdfs.length === 0) {
    showToast(t('onlyPdf'), 'error');
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
    mergeDropText.textContent = t('dropText');
    mergeBtn.disabled = true;
    mergeStatsEl.hidden = true;
    previewAllBtn.hidden = true;
    return;
  }

  mergeDropText.textContent = t('dropTextMulti', mergeFiles.length);

  const totalPages = mergeFiles.reduce((sum, f) => sum + (f._pageCount || 0), 0);
  mergeStatsText.textContent = t('statsLine', mergeFiles.length, totalPages);
  mergeStatsEl.hidden = false;

  previewAllBtn.hidden = mergeFiles.length < 2;
  previewAllBtn.innerHTML = `${icon('i-eye')}<span>${t('previewAllBtn')}</span>`;

  mergeFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="file-index">${i + 1}</span>
      <span class="file-name">${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(0)} KB</span>
      <button class="icon-btn-sm preview-btn" data-i="${i}" title="${t('previewBtn')}">${icon('i-eye')}</button>
      <button class="icon-btn-sm remove" data-i="${i}" title="${t('remove')}">${icon('i-trash')}</button>
    `;
    mergeList.appendChild(li);
  });

  mergeList.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.i);
      openPreview(mergeFiles[idx]);
    });
  });

  mergeList.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.i);
      mergeFiles.splice(idx, 1);
      renderMergeList();
    });
  });

  mergeBtn.disabled = mergeFiles.length < 2;
}

mergeBtn.addEventListener('click', async () => {
  if (mergeFiles.length < 2) {
    showToast(t('needTwo'), 'error');
    return;
  }

  const shouldCleanMeta = mergeCleanMeta.checked;

  mergeBtn.disabled = true;
  mergeBtn.textContent = t('merging');

  try {
    const merged = await PDFDocument.create();

    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }

    if (shouldCleanMeta) {
      cleanPdfMetadata(merged);
    }

    const outBytes = await merged.save();
    const fileName = shouldCleanMeta ? 'merged-clean.pdf' : 'merged.pdf';
    downloadPdf(outBytes, fileName);

    showToast(t(shouldCleanMeta ? 'mergeSuccessClean' : 'mergeSuccess'), 'success');

    mergeBtn.textContent = t('done');
    setTimeout(() => {
      mergeBtn.textContent = t('mergeBtn');
      mergeBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
    mergeBtn.textContent = t('mergeBtn');
    mergeBtn.disabled = false;
  }
});

registerLangRenderer(renderMergeList);
