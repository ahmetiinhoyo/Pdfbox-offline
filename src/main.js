// PDFBox Offline — uygulama başlangıcı (bootstrap).
// Modüller içe aktarılırken kendi DOM referanslarını ve olay dinleyicilerini kurar;
// burada yalnızca tema, dil ve Dark Reader kontrolü başlatılır. Sıra önemlidir:
// dil uygulanmadan önce tüm özellikler yüklenmiş (render'larını kaydetmiş) olmalıdır.

import { state } from './core/state.js';
import { initTheme } from './core/theme.js';
import { applyLang } from './core/lang.js';
import { watchDarkReader } from './core/dark-reader.js';
import { initToolNav } from './core/toolnav.js';
import { initWorkGuard } from './core/work-guard.js';

// Özellikler (kendi kendini kurar + dil render'larını kaydeder)
import './features/preview/index.js';
import './features/merge.js';
import './features/split.js';
import './features/meta-tool.js';
import './features/images/index.js';
import './features/pages/index.js';

initTheme();
initToolNav();
initWorkGuard();
applyLang(state.lang);
watchDarkReader();