// Görsel listesi: dosya ekleme, thumbnail'lı liste, sıralama, silme, istatistik.
// Liste sırası = PDF sayfa sırası.

import { icon } from '../../core/dom.js';
import { t } from '../../core/lang.js';
import { showToast } from '../../core/toast.js';
import { registerWorkChecker } from '../../core/work-guard.js';
import { els } from './card.js';
import {
  isSupportedImage, isHeic, makeThumb, readImageSize, MAX_IMAGES,
} from './build.js';

export const images = [];

// Görsel listesi boş değilken sayfadan çıkışta onay istensin
registerWorkChecker(() => images.length > 0);

let adding = false;

export function isAdding() {
  return adding;
}

export async function addImageFiles(newFiles) {
  const incoming = Array.from(newFiles || []);
  if (incoming.length === 0) return;

  const heicFiles = incoming.filter(isHeic);
  const usable = incoming.filter((f) => !isHeic(f) && isSupportedImage(f));

  if (usable.length === 0) {
    const message = heicFiles.length > 0
      ? t('imgHeicUnsupported', heicFiles[0].name)
      : t('imgOnlyImages');
    showToast(message, 'error', 5000);
    return;
  }

  if (heicFiles.length > 0) {
    showToast(t('imgHeicSkipped', heicFiles.length), 'info', 4500);
  }

  adding = true;
  const total = usable.length;
  let current = 0;

  for (const file of usable) {
    if (images.length >= MAX_IMAGES) {
      showToast(t('imgTooMany', MAX_IMAGES), 'info', 4000);
      break;
    }

    const duplicate = images.some((i) => i.file.name === file.name && i.file.size === file.size);
    if (duplicate) continue;

    current += 1;
    els.dropText.textContent = t('imgLoading', current, total);

    try {
      const thumb = await makeThumb(file);
      const size = await readImageSize(file);
      images.push({ file, size, thumb });
    } catch {
      showToast(t('imgLoadError', file.name), 'error', 4000);
    }
  }

  adding = false;
  renderImages();
}

export function moveImage(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= images.length) return;

  const [item] = images.splice(index, 1);
  images.splice(target, 0, item);
  renderImages();
}

export function removeImage(index) {
  images.splice(index, 1);
  renderImages();
}

export function clearImages() {
  images.length = 0;
  renderImages();
}

export function renderImages() {
  const count = images.length;

  if (count === 0) {
    els.list.innerHTML = '';
    els.dropText.textContent = t('imgDropText');
    els.stats.hidden = true;
    els.btn.disabled = true;
    els.previewBtn.disabled = true;
    return;
  }

  els.dropText.textContent = t('imgDropTextMulti', count);
  els.statsText.textContent = t('imgStats', count);
  els.stats.hidden = false;
  els.btn.disabled = false;
  els.previewBtn.disabled = false;

  els.list.innerHTML = '';

  images.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'img-item';
    li.innerHTML = `
      <img class="img-thumb" src="${item.thumb}" alt="" />
      <span class="img-meta">
        <span class="img-name">${item.file.name}</span>
        <span class="img-sub">${item.size.w}×${item.size.h} · ${(item.file.size / 1024).toFixed(0)} KB</span>
      </span>
      <button class="icon-btn-sm" type="button" data-act="up" data-i="${i}" title="${t('imgMoveUp')}" ${i === 0 ? 'disabled' : ''}>${icon('i-arrow-up')}</button>
      <button class="icon-btn-sm" type="button" data-act="down" data-i="${i}" title="${t('imgMoveDown')}" ${i === count - 1 ? 'disabled' : ''}>${icon('i-arrow-down')}</button>
      <button class="icon-btn-sm remove" type="button" data-act="del" data-i="${i}" title="${t('remove')}">${icon('i-trash')}</button>
    `;
    els.list.appendChild(li);
  });

  els.list.querySelectorAll('button[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.i);
      const act = btn.dataset.act;
      if (act === 'up') moveImage(index, -1);
      else if (act === 'down') moveImage(index, 1);
      else removeImage(index);
    });
  });
}
