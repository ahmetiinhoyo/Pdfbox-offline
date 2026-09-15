// Bölme özelliği: seçilen sayfa aralığını yeni bir PDF olarak indirir.

import { PDFDocument } from 'pdf-lib';
import { t, registerLangRenderer } from '../core/lang.js';
import { showToast } from '../core/toast.js';
import {
  downloadPdf, parsePageRange, setupDropZone, cleanPdfMetadata,
} from '../core/helpers.js';
import { openPreview } from './preview/index.js';

const splitInput = document.getElementById('splitFile');
const splitBtn = document.getElementById('split');
const splitDropText = document.getElementById('splitDropText');
const rangeInput = document.getElementById('pageRange');
const splitDrop = document.querySelector('.file-drop[for="splitFile"]');
const splitActions = document.getElementById('splitActions');
const splitPreviewBtn = document.getElementById('splitPreviewBtn');
const splitCleanMeta = document.getElementById('splitCleanMeta');

let splitFile = null;
let splitPageCount = 0;

async function handleSplitFile(file) {
  if (!file) return;

  if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    showToast(t('onlyPdf'), 'error');
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
    showToast(t('error') + err.message, 'error');
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
    showToast(t('oneFileSplit'), 'info');
  }
  handleSplitFile(files[0]);
});

splitPreviewBtn.addEventListener('click', () => {
  if (splitFile) openPreview(splitFile);
});

function renderSplitDrop() {
  if (!splitFile) {
    splitDropText.textContent = t('splitDropText');
    splitBtn.disabled = true;
    splitActions.hidden = true;
    return;
  }

  splitDropText.textContent = t('splitDropSelected', splitFile.name, splitPageCount);
  splitBtn.disabled = false;
  splitActions.hidden = false;
}

splitBtn.addEventListener('click', async () => {
  if (!splitFile) {
    showToast(t('splitNeedFile'), 'error');
    return;
  }

  const parsed = parsePageRange(rangeInput.value, splitPageCount);

  if (parsed === null) {
    showToast(t('splitInvalidRange'), 'error');
    return;
  }

  if (parsed && typeof parsed === 'object' && parsed.error === 'outOfRange') {
    showToast(t('splitOutOfRange', parsed.max), 'error');
    return;
  }

  const shouldCleanMeta = splitCleanMeta.checked;

  splitBtn.disabled = true;
  splitBtn.textContent = t('splitting');

  try {
    const bytes = await splitFile.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const output = await PDFDocument.create();
    const copied = await output.copyPages(source, parsed);
    copied.forEach(p => output.addPage(p));

    if (shouldCleanMeta) {
      cleanPdfMetadata(output);
    }

    const outBytes = await output.save();
    const fileName = shouldCleanMeta ? 'split-clean.pdf' : 'split.pdf';
    downloadPdf(outBytes, fileName);

    showToast(t(shouldCleanMeta ? 'splitSuccessClean' : 'splitSuccess'), 'success');

    splitBtn.textContent = t('splitDone');
    setTimeout(() => {
      splitBtn.textContent = t('splitBtn');
      splitBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    showToast(t('error') + err.message, 'error');
    splitBtn.textContent = t('splitBtn');
    splitBtn.disabled = false;
  }
});

registerLangRenderer(renderSplitDrop);