// DOM yardımcıları: SVG ikon üretimi ve seçici kısayolları.

// SVG ikon yardımcısı
export function icon(id, cls = 'icon') {
  return `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
}

export function byId(id) {
  return document.getElementById(id);
}

export function $one(selector, root = document) {
  return root.querySelector(selector);
}

export function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}
