// Önizleme geçmiş yönetimi: tarayıcı geri tuşu siteyi TERK ETMESİN.
// Modal açılırken geçmişe bir kayıt eklenir ("grid"); büyük görüntüleyiciye
// geçilince ikinci kayıt eklenir ("viewer"). Geri tuşu sırayla çalışır:
//   viewer -> grid -> modal kapanır -> (ancak o zaman) siteden çıkılır
// DOM'a bağımlı değildir: görünürlük kararları onGrid / onClose geri çağrılarında.

const KEY = 'pdfboxPreview';

let depth = 0;       // bizim eklediğimiz kayıt sayısı (0, 1 veya 2)
let onGrid = null;   // görüntüleyici -> galeri görünümü
let onClose = null;  // modalı kapat (geçmişi geri sarmadan)

export function setHistoryHandlers(handlers) {
  onGrid = handlers.showGrid || null;
  onClose = handlers.close || null;
}

// Test/teşhis için: kaç geçmiş kaydı bizim?
export function historyDepth() {
  return depth;
}

// Modal açılışı: tek kayıt yeter. Zaten açıksa kayıt çoğaltmak yerine
// mevcut kaydı 'grid'e indirger (viewer'dan galeriye dönüş senaryosu).
export function pushGridState() {
  if (depth === 0) {
    history.pushState({ [KEY]: 'grid' }, '', location.href);
    depth = 1;
  } else if (depth === 2) {
    history.replaceState({ [KEY]: 'grid' }, '', location.href);
    depth = 1;
  }
}

// Büyük görüntüleyiciye geçiş: ikinci kayıt eklenir.
export function pushViewerState() {
  if (depth === 2) return;
  history.pushState({ [KEY]: 'viewer' }, '', location.href);
  depth = 2;
}

// Kapatmadan önce bıraktığımız kayıtları geri sar. depth önce sıfırlandığı
// için tarayıcının üreteceği popstate olayı modalı tekrar kapatmaya çalışmaz.
export function rewindHistory() {
  if (depth === 0) return;
  const steps = depth;
  depth = 0;
  history.go(-steps);
}

// Görüntüleyiciden galeriye dön: geçmiş kaydımız varsa geri tuşunu kullan,
// yoksa (örn. kayıt eklenmemişse) doğrudan görünümü değiştir.
export function goBackToGrid() {
  if (depth >= 2) {
    depth = 1;
    history.back();
    return;
  }
  if (onGrid) onGrid();
}

window.addEventListener('popstate', (e) => {
  const mark = e.state ? e.state[KEY] : null;

  if (mark === 'viewer') {
    // İleri tuşuyla görüntüleyiciye dönüldü
    depth = 2;
    return;
  }

  if (mark === 'grid') {
    // Geri tuşu: görüntüleyici -> galeri (site terk edilmez)
    depth = 1;
    if (onGrid) onGrid();
    return;
  }

  // Bizim kayıtlarımızın dışına çıkıldı: modalı kapat, siteyi terk etme
  const hadDepth = depth;
  depth = 0;
  if (hadDepth > 0 && onClose) onClose();
});