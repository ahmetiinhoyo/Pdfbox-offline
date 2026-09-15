// Yeni PDF üretimi: seçilen sayfaları istenen sırayla yeni dokümana kopyalar.
// pdf-lib copyPages kopyalama sırasını korur — sil/sırala tek geçişte uygulanır.

import { PDFDocument } from 'pdf-lib';
import { cleanPdfMetadata } from '../../core/helpers.js';

// order: 1 tabanlı orijinal sayfa numaraları, hedef sırayla
export async function buildPagesPdf(file, order, cleanMeta) {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, order.map((n) => n - 1));
  copied.forEach((page) => out.addPage(page));

  if (cleanMeta) {
    cleanPdfMetadata(out);
  }

  return out.save();
}
