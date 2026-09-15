// Ortak yardımcılar: indirme, sayfa aralığı ayrıştırma, sürükle-bırak, metadata temizleme.

export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// "1-3, 5, 7-9" gibi girdiyi sayfa indekslerine çevirir.
// Boş girdi → tüm sayfalar. Hatalı girdi → null. Aralık dışı → { error: 'outOfRange' }.
export function parsePageRange(input, maxPage) {
  const trimmed = input.trim();
  if (trimmed === '') {
    return Array.from({ length: maxPage }, (_, i) => i);
  }

  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const pages = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(x => x.trim());
      const start = Number(a);
      const end = Number(b);
      if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
      if (start < 1 || end < 1 || start > end) return null;
      if (end > maxPage) return { error: 'outOfRange', max: maxPage };
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const n = Number(part);
      if (!Number.isInteger(n) || n < 1) return null;
      if (n > maxPage) return { error: 'outOfRange', max: maxPage };
      pages.add(n - 1);
    }
  }

  if (pages.size === 0) return null;
  return Array.from(pages).sort((a, b) => a - b);
}

// Sürükle-bırak alanı kurulumu
export function setupDropZone(dropElement, onFiles) {
  if (!dropElement) return;

  ['dragenter', 'dragover'].forEach(evt => {
    dropElement.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropElement.classList.add('dragover');
    });
  });

  dropElement.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropElement.contains(e.relatedTarget)) return;
    dropElement.classList.remove('dragover');
  });

  dropElement.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropElement.classList.remove('dragover');

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFiles(Array.from(files));
    }
  });
}

// PDF metadata temizle
// Not: Tarihler korunur (setCreationDate/setModificationDate çağrılmaz)
export function cleanPdfMetadata(pdf) {
  pdf.setAuthor('');
  pdf.setTitle('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setCreator('');
  pdf.setProducer('');
}
