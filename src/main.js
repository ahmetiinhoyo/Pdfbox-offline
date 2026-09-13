import { PDFDocument } from 'pdf-lib';
import { detectLang, t } from './i18n.js';

const input = document.getElementById('files');
const list = document.getElementById('list');
const button = document.getElementById('merge');
const dropText = document.querySelector('.drop-text');

let selectedFiles = [];
let currentLang = detectLang();

// ---------- DİL ----------
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('pdfbox-lang', lang);
  document.documentElement.lang = lang;

  // data-i18n olan tüm elementleri güncelle
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(lang, key);
  });

  // Aktif butonu işaretle
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Dosya listesi varsa yeniden render et (çeviriler için)
  renderList();
}

// Dil butonları
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// ---------- DOSYA SEÇİMİ ----------
input.addEventListener('change', () => {
  const newFiles = Array.from(input.files);
  newFiles.forEach(f => {
    const already = selectedFiles.some(
      s => s.name === f.name && s.size === f.size
    );
    if (!already) selectedFiles.push(f);
  });
  input.value = '';
  renderList();
});

function renderList() {
  list.innerHTML = '';

  if (selectedFiles.length === 0) {
    dropText.textContent = t(currentLang, 'dropText');
    button.disabled = true;
    return;
  }

  dropText.textContent = t(currentLang, 'dropTextMulti', selectedFiles.length);

  selectedFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="file-name">${i + 1}. ${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(0)} KB</span>
      <button class="remove" data-i="${i}" title="${t(currentLang, 'remove')}">✕</button>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.i);
      selectedFiles.splice(idx, 1);
      renderList();
    });
  });

  button.disabled = selectedFiles.length < 2;
}

// ---------- BİRLEŞTİR ----------
button.addEventListener('click', async () => {
  if (selectedFiles.length < 2) {
    alert(t(currentLang, 'needTwo'));
    return;
  }

  button.disabled = true;
  button.textContent = t(currentLang, 'merging');

  try {
    const merged = await PDFDocument.create();

    for (const file of selectedFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }

    const outBytes = await merged.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'birlestirilmis.pdf';
    a.click();
    URL.revokeObjectURL(url);

    button.textContent = t(currentLang, 'done');
    setTimeout(() => {
      button.textContent = t(currentLang, 'mergeBtn');
      button.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    alert(t(currentLang, 'error') + err.message);
    button.textContent = t(currentLang, 'mergeBtn');
    button.disabled = false;
  }
});

// ---------- BAŞLAT ----------
applyLang(currentLang);