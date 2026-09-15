// Toast bildirimleri (sağ üstten kayan kutular).

import { icon } from './dom.js';

const toastContainer = document.getElementById('toast-container');

export function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconId = type === 'success' ? 'i-check-circle' : type === 'error' ? 'i-alert' : 'i-info';

  toast.innerHTML = `
    <span class="toast-icon">${icon(iconId)}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">${icon('i-x')}</button>
  `;

  toastContainer.appendChild(toast);

  const remove = () => {
    if (!toast.parentNode) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, duration);

  return toast;
}
