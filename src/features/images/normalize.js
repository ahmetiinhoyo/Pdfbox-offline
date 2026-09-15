// Görsel işleme katmanı: bitmap yükleme, canvas normalizasyonu, thumbnail üretimi.
// PDF sayfa hesabı build.js içindedir; bu modül oradan da yeniden dışa aktarılır.

// Desteklenen dosyalar
const SUPPORTED_EXT = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;
const HEIC_EXT = /\.(heic|heif)$/i;

export const MAX_IMAGES = 300;

// Kalite ön ayarları: uzun kenar (px, 0 = küçültme yok) + JPEG kalitesi
export const QUALITY = {
  screen: { maxEdge: 1600, jpeg: 0.8 },
  high: { maxEdge: 2400, jpeg: 0.92 },
  original: { maxEdge: 0, jpeg: 0.95 },
};

export function isHeic(file) {
  return HEIC_EXT.test(file.name);
}

export function isSupportedImage(file) {
  if (isHeic(file)) return false;
  return /^image\//.test(file.type) || SUPPORTED_EXT.test(file.name);
}

// Tarayıcının çözebildiği kaynağı döndürür (ImageBitmap veya HTMLImageElement).
// <img> yolu, EXIF yönünü tarayıcı otomatik uyguladığı için güvenli bir yedektir.
export async function loadSource(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      try {
        return await createImageBitmap(file);
      } catch {
        // <img> yoluna düş
      }
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('decode'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function sourceSize(source) {
  return {
    w: source.width || source.naturalWidth || 0,
    h: source.height || source.naturalHeight || 0,
  };
}

// Kaynağı canvasa çizer: gerekirse küçültür, JPEG için beyaz zemin ekler.
export function drawToCanvas(source, maxEdge) {
  const { w, h } = sourceSize(source);
  const scale = maxEdge > 0 ? Math.min(1, maxEdge / Math.max(w, h)) : 1;
  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  return canvas;
}

export function canvasToJpegBytes(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('jpeg'));
        return;
      }
      blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
    }, 'image/jpeg', quality);
  });
}

export function releaseCanvas(canvas) {
  canvas.width = 0;
  canvas.height = 0;
}

// Liste için küçük önizleme görseli (data URL)
export async function makeThumb(file, maxEdge = 96) {
  const source = await loadSource(file);
  try {
    const canvas = drawToCanvas(source, maxEdge);
    const url = canvas.toDataURL('image/jpeg', 0.7);
    releaseCanvas(canvas);
    return url;
  } finally {
    if (source.close) source.close();
  }
}

// Görselin doğal çözünürlüğü (liste bilgisi için)
export async function readImageSize(file) {
  const source = await loadSource(file);
  try {
    return sourceSize(source);
  } finally {
    if (source.close) source.close();
  }
}