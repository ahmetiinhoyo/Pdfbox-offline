// pdf.js worker ayarı.
// Önizleme modülleri pdf.js'i doğrudan değil, buradan içe aktarır.

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };
