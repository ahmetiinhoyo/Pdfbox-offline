// Görüntüleyici yakınlaştırma: CSS ölçekleme + netlik için gecikmeli yeniden render.
// viewer.js kendi render fonksiyonunu setZoomRenderHook() ile bağlar
// (zoom.js -> viewer.js yönünde import olmadığı için döngüsel bağımlılık oluşmaz).

import { t, registerLangRenderer } from '../../core/lang.js';
import { els, pv } from './state.js';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const STEP = 0.25;
const RERENDER_DELAY = 350;

let renderHook = null;
let rerenderTimer = null;

export function setZoomRenderHook(fn) {
  renderHook = fn;
}

// Canvas'ı kapsayıcıya sığdıran ölçek: gösterim = doğal boyut * fit * zoom
function fitScale() {
  const wrap = els.canvas.parentElement;
  if (!wrap || !els.canvas.width || !els.canvas.height) return 1;
  return Math.min(wrap.clientWidth / els.canvas.width, wrap.clientHeight / els.canvas.height);
}

export function applyZoom() {
  if (!pv.isViewerMode) return;

  pv.fitScale = fitScale();

  els.canvas.style.width = `${els.canvas.width * pv.fitScale * pv.zoom}px`;
  els.canvas.style.height = `${els.canvas.height * pv.fitScale * pv.zoom}px`;

  els.zoomLevel.textContent = `${Math.round(pv.zoom * 100)}%`;
  els.zoomOut.disabled = pv.zoom <= MIN_ZOOM;
  els.zoomIn.disabled = pv.zoom >= MAX_ZOOM;
}

// Yakınlaştırma durulduktan sonra sayfayı daha yüksek çözünürlükte render eder.
function scheduleRerender() {
  clearTimeout(rerenderTimer);
  rerenderTimer = setTimeout(() => {
    if (renderHook) renderHook();
  }, RERENDER_DELAY);
}

export function zoomBy(direction) {
  const step = direction * STEP;
  const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((pv.zoom + step).toFixed(2))));
  if (next === pv.zoom) return;

  pv.zoom = next;
  applyZoom();
  scheduleRerender();
}

export function resetZoom() {
  if (pv.zoom === 1) return;
  pv.zoom = 1;
  applyZoom();
  scheduleRerender();
}

els.zoomIn.addEventListener('click', () => zoomBy(1));
els.zoomOut.addEventListener('click', () => zoomBy(-1));
els.zoomFit.addEventListener('click', resetZoom);

// Ctrl + fare tekerleği ile yakınlaştırma
els.viewer.addEventListener('wheel', (e) => {
  if (!pv.isViewerMode || !e.ctrlKey) return;
  e.preventDefault();
  zoomBy(e.deltaY < 0 ? 1 : -1);
}, { passive: false });

// Buton ipuçları dile göre yenilenir
function refreshZoomLabels() {
  els.zoomIn.title = t('zoomIn');
  els.zoomOut.title = t('zoomOut');
  els.zoomFit.title = t('zoomFit');
}

refreshZoomLabels();
registerLangRenderer(refreshZoomLabels);
