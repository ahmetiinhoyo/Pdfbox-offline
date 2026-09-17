// Metadata temizleme aracı (sol üst buton → modal).
// Bulunan metadata'yı listeler, temizlenmiş yeni PDF indirir.

import { PDFDocument } from 'pdf-lib';
import { t, registerLangRenderer } from '../core/lang.js';
import { showToast } from '../core/toast.js';
import { downloadPdf, setupDropZone, cleanPdfMetadata } from '../core/helpers.js';
import { openPreview } from './preview/index.js';
import { registerWorkChecker } from '../core/work-guard.js';

const metaToolBtn = document.getElementById('metaToolBtn');
const metaToolModal = document.getElementById('metaToolModal');
const metaToolBackdrop = document.getElementById('metaToolBackdrop');
const metaToolClose = document.getElementById('metaToolClose');

const metaInput = document.getElementById('metaFile');
const metaBtn = document.getElementById('metaBtn');
const metaDropText = document.getElementById('metaDropText');
const metaDrop = document.querySelector('.meta-tool-body .file-drop[for="metaFile"]');
const metaActions = document.getElementById('metaActions');
const metaPreviewBtn = document.getElementById('metaPreviewBtn');
const metaInfo = document.getElementById('metaInfo');

let metaFile = null;

// Seçili PDF varken sayfadan çıkışta onay istensin
registerWorkChecker(() => !!metaFile);

function openMetaTool() {
  metaToolModal.hidden = false;
}

function closeMetaTool() {
  metaToolModal.hidden = true;
  metaFile = null;
  metaInput.value = '';
  metaInfo.hidden = true;
  metaInfo.innerHTML = '';
  metaActions.hidden = true;
  renderMetaDrop();
}

metaToolBtn.addEventListener('click', openMetaTool);
metaToolClose.addEventListener('click', closeMetaTool);
metaToolBackdrop.addEventListener('click', closeMetaTool);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !metaToolModal.hidden) {
    closeMetaTool();
  }
});

function formatMetaLine(label, value) {
  if (!value) return '';
  return `<div class="meta-line"><span class="meta-label">${label}</span><span class="meta-value">${value}</span></div>`;
}

async function handleMetaFile(file) {
  if (!file) return;

  if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    showToast(t('onlyPdf'), 'error');
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

    const foundItems = [];
    if (author) foundItems.push(formatMetaLine(t('metaAuthor'), author));
    if (title) foundItems.push(formatMetaLine(t('metaTitleField'), title));
    if (subject) foundItems.push(formatMetaLine(t('metaSubject'), subject));
    if (creator) foundItems.push(formatMetaLine(t('metaCreator'), creator));
    if (producer) foundItems.push(formatMetaLine(t('metaProducer'), producer));
    if (keywords) foundItems.push(formatMetaLine(t('metaKeywords'), keywords));

    if (foundItems.length > 0) {
      metaInfo.innerHTML = `
        <div class="meta-info-title">${t('metaWhatFound')}</div>
        ${foundItems.join('')}
        <div class="meta-info-hint">${t('metaWhatClean')}</div>
      `;
    } else {
      metaInfo.innerHTML = `<div class="meta-info-hint">${t('metaNoInfo')}</div>`;
    }
    metaInfo.hidden = false;

    renderMetaDrop();
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
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
    showToast(t('oneFileSplit'), 'info');
  }
  handleMetaFile(files[0]);
});

metaPreviewBtn.addEventListener('click', () => {
  if (metaFile) openPreview(metaFile);
});

function renderMetaDrop() {
  if (!metaFile) {
    metaDropText.textContent = t('metaDropText');
    metaBtn.disabled = true;
    metaActions.hidden = true;
    return;
  }

  metaDropText.textContent = t('metaDropSelected', metaFile.name);
  metaBtn.disabled = false;
  metaActions.hidden = false;
}

metaBtn.addEventListener('click', async () => {
  if (!metaFile) {
    showToast(t('metaNeedFile'), 'error');
    return;
  }

  metaBtn.disabled = true;
  metaBtn.textContent = t('metaWorking');

  try {
    const bytes = await metaFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    cleanPdfMetadata(pdf);

    const outBytes = await pdf.save();
    downloadPdf(outBytes, 'cleaned.pdf');

    showToast(t('metaSuccess'), 'success');

    metaBtn.textContent = t('metaDone');
    setTimeout(() => {
      metaBtn.textContent = t('metaBtn');
      metaBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
    metaBtn.textContent = t('metaBtn');
    metaBtn.disabled = false;
  }
});

registerLangRenderer(renderMetaDrop);