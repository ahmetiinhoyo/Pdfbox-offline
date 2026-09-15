// Dark Reader eklentisi tespiti ve uyarısı.

import { showToast } from './toast.js';
import { t } from './lang.js';

function detectDarkReader() {
  if (document.querySelector('style.darkreader')) return true;
  if (document.querySelector('style[class*="darkreader"]')) return true;
  if (document.documentElement.hasAttribute('data-darkreader-scheme')) return true;
  if (document.documentElement.hasAttribute('data-darkreader-mode')) return true;
  return false;
}

export function watchDarkReader() {
  setTimeout(() => {
    if (detectDarkReader()) {
      showToast(t('darkReaderWarning'), 'info', 7000);
    }
  }, 2000);
}
