// PDF üretimi: sayfa ölçüsü hesabı ve görsellerin PDF'e gömülmesi.
// Görsel işleme (yükleme, canvas, thumbnail) normalize.js içindedir.

import { PDFDocument } from 'pdf-lib';
import { cleanPdfMetadata } from '../../core/helpers.js';
import {
  QUALITY, loadSource, sourceSize, drawToCanvas,
  canvasToJpegBytes, releaseCanvas,
} from './normalize.js';

// list.js'in import yüzeyi sabit kalsın diye yeniden dışa aktarım
export {
  MAX_IMAGES, isHeic, isSupportedImage, makeThumb, readImageSize,
} from './normalize.js';

// Sayfa boyutları (pt)
const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] };

// Kenar boşlukları (pt)
const MARGINS = { none: 0, small: 18, medium: 36 };

const PT_PER_PX = 0.75;    // 96 dpi → 72 dpi
const MAX_FIT_EDGE = 842;  // "görsele göre" modunda en uzun kenar sınırı (pt)

// Sayfa ölçüsü: [genişlik, yükseklik] (pt)
function resolvePageSize(imgW, imgH, opts) {
  if (opts.size === 'fit') {
    const ratio = imgW / imgH || 1;
    const long = Math.min(Math.max(imgW, imgH) * PT_PER_PX, MAX_FIT_EDGE);
    return imgW >= imgH ? [long, long / ratio] : [long * ratio, long];
  }

  const base = PAGE_SIZES[opts.size] || PAGE_SIZES.a4;
  const landscape = opts.orientation === 'landscape'
    || (opts.orientation === 'auto' && imgW > imgH);

  return landscape ? [base[1], base[0]] : [base[0], base[1]];
}

// Görselleri sırayla PDF'e çevirir.
// onProgress(işlenen, toplam) geri çağrısı ilerleme göstergesi için kullanılır.
export async function buildImagesPdf(files, opts, onProgress) {
  const pdf = await PDFDocument.create();
  const preset = QUALITY[opts.quality] || QUALITY.high;
  const margin = MARGINS[opts.margin] || 0;

  let done = 0;

  for (const file of files) {
    const source = await loadSource(file);

    try {
      const { w, h } = sourceSize(source);
      const canvas = drawToCanvas(source, preset.maxEdge);
      const bytes = await canvasToJpegBytes(canvas, preset.jpeg);
      releaseCanvas(canvas);

      const image = await pdf.embedJpg(bytes);
      const [pageW, pageH] = resolvePageSize(w, h, opts);
      const page = pdf.addPage([pageW, pageH]);

      const fitted = image.scaleToFit(
        Math.max(1, pageW - margin * 2),
        Math.max(1, pageH - margin * 2)
      );

      page.drawImage(image, {
        x: (pageW - fitted.width) / 2,
        y: (pageH - fitted.height) / 2,
        width: fitted.width,
        height: fitted.height,
      });
    } finally {
      if (source.close) source.close();
      done += 1;
      if (onProgress) onProgress(done, files.length);
    }
  }

  if (opts.cleanMeta) {
    cleanPdfMetadata(pdf);
  }

  return pdf.save();
}
