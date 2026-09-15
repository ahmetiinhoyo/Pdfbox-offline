// Uygulama genelindeki paylaşılan durum.
// Modüller arası tek doğru kaynak: aktif dil, tema, vurgu rengi.

import { detectLang } from '../i18n.js';

export const state = {
  lang: detectLang(),
  theme: 'dark',
  accent: 'blue',
};
