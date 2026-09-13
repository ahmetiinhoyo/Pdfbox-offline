import { PDFDocument } from 'pdf-lib';

const input = document.getElementById('files');
const list = document.getElementById('list');
const button = document.getElementById('merge');
const dropText = document.querySelector('.drop-text');

let selectedFiles = [];

input.addEventListener('change', () => {
  // Yeni seçilen dosyaları mevcut listeye EKLE (üzerine yazma)
  const newFiles = Array.from(input.files);

  // Aynı isimli dosyayı tekrar eklemesin
  newFiles.forEach(f => {
    const already = selectedFiles.some(
      s => s.name === f.name && s.size === f.size
    );
    if (!already) selectedFiles.push(f);
  });

  // Input'u sıfırla ki aynı dosyayı tekrar seçebilesin
  input.value = '';

  renderList();
});

function renderList() {
  list.innerHTML = '';

  if (selectedFiles.length === 0) {
    dropText.textContent = 'PDF seçmek için tıkla';
    button.disabled = true;
    return;
  }

  dropText.textContent = `${selectedFiles.length} dosya seçildi`;

  selectedFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="file-name">${i + 1}. ${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(0)} KB</span>
      <button class="remove" data-i="${i}" title="Kaldır">✕</button>
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

button.addEventListener('click', async () => {
  button.disabled = true;
  button.textContent = 'Birleştiriliyor...';

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

    button.textContent = '✅ İndirildi!';
    setTimeout(() => {
      button.textContent = 'Birleştir ve İndir';
      button.disabled = false;
    }, 1500);
  } catch (err) {
    console.error(err);
    alert('Hata: ' + err.message);
    button.textContent = 'Birleştir ve İndir';
    button.disabled = false;
  }
});