// PWA: Service Worker kaydı + "Uygulamayı Yükle" butonu.
// Buton, tarayıcı kuruluma izin verdiğinde görünür (beforeinstallprompt olayı);
// iOS'ta bu olay olmadığı için yönerge gösteren buton açılır.

import { showToast } from './toast.js';
import { t } from './lang.js';

const SW_FILE = 'service-worker.js';

let deferredPrompt = null;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  const ua = window.navigator.userAgent || '';
  const iosDevice = /iPad|iPhone|iPod/.test(ua);
  const ipadDesktop = ua.includes('Macintosh') && 'ontouchend' in document;
  return iosDevice || ipadDesktop;
}

// Service worker yalnizca uretim build'inde kaydedilir (dev'de onbellek karismasin).
function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;

  const firstVisit = !navigator.serviceWorker.controller;

  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(import.meta.env.BASE_URL + SW_FILE, {
        scope: import.meta.env.BASE_URL,
      });
      if (firstVisit) {
        await navigator.serviceWorker.ready;
        showToast(t('offlineReady'), 'success', 4000);
      }
    } catch (err) {
      console.warn('[PWA] Service worker kaydi basarisiz:', err);
    }
  });
}

function setupInstallButton() {
  const btn = document.getElementById('installPwaBtn');
  if (!btn) return;

  if (isStandalone()) {
    btn.hidden = true;
    return;
  }

  if (isIos()) btn.hidden = false;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    btn.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    btn.hidden = true;
    showToast(t('installDone'), 'success');
  });

  btn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice && choice.outcome === 'accepted') btn.hidden = true;
      return;
    }
    showToast(t(isIos() ? 'installIosHint' : 'installUnavailable'), 'info', 6000);
  });
}

export function initPwa() {
  setupInstallButton();
  registerServiceWorker();
}
