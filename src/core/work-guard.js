// Sayfadan çıkış koruması: yüklü dosya varken tarayıcı "emin misiniz?" uyarısı gösterir.
// Özellik modülleri registerWorkChecker() ile kendi kontrolünü kaydeder
// (lang.js'teki registerLangRenderer deseninin aynısı; döngüsel import yok).

const checkers = [];

// fn: () => boolean — "bu özellikte kaybedilecek iş var mı?"
export function registerWorkChecker(fn) {
  if (typeof fn === 'function') checkers.push(fn);
}

// Herhangi bir özellikte yüklü dosya var mı?
export function hasWork() {
  return checkers.some((fn) => {
    try {
      return !!fn();
    } catch {
      return false;
    }
  });
}

// Tarayıcı geri tuşu, sekme kapatma ve sayfa yenileme öncesi onay ister.
// Not: Tarayıcılar beforeunload mesajını özelleştirmeye izin vermez —
// arayüz diline göre kendi yerelleştirilmiş metnini gösterirler,
// bu yüzden burada çeviri anahtarı kullanılmaz.
export function initWorkGuard() {
  window.addEventListener('beforeunload', (e) => {
    if (!hasWork()) return;
    e.preventDefault();
    e.returnValue = '';
  });
}
