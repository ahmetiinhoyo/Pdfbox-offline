// Önizleme modalı: DOM referansları + paylaşılan durum.
// Script type="module" olduğu için HTML parse edilmiş olur; modül üstünde sorgu güvenli.

export const els = {
  modal: document.getElementById('previewModal'),
  backdrop: document.getElementById('previewBackdrop'),
  close: document.getElementById('previewClose'),
  back: document.getElementById('previewBack'),
  title: document.getElementById('previewTitle'),
  grid: document.getElementById('previewGrid'),
  viewer: document.getElementById('previewViewer'),
  canvas: document.getElementById('viewerCanvas'),
  prev: document.getElementById('viewerPrev'),
  next: document.getElementById('viewerNext'),
  counter: document.getElementById('viewerCounter'),
};

export const pv = {
  loadedDocs: [],
  docMeta: [],
  flatPages: [],
  currentPage: 0,
  isViewerMode: false,
  renderingTask: null,
  currentFileName: '',
};
