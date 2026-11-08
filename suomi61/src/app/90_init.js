// ===== start =====
// install: Chrome/Edge give a prompt we keep for the Install button; iPhone uses Share → Add to Home Screen
const INST = { ev: null };
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); INST.ev = e; const b = $('#instbtn'); if (b) b.hidden = false; const s = $('#instset'); if (s) instSettings(s); });
window.addEventListener('appinstalled', () => { INST.ev = null; const b = $('#instbtn'); if (b) b.hidden = true; toast('Installed. Open Suomi 61 from your home screen. · एप राखियो।'); });
async function doInstall() { if (!INST.ev) { go('asetukset'); return; } INST.ev.prompt(); try { await INST.ev.userChoice; } catch (e) { } INST.ev = null; const b = $('#instbtn'); if (b) b.hidden = true; }
function instSettings(host) {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const where = !window.FI61_PWA ? 'This copy runs inside Claude and cannot be installed. Open your GitHub Pages address (https://<your-name>.github.io/suomi61/) in Chrome to install it.' : isStandalone() ? 'The app is installed and running from your home screen. ✓' : '';
  host.innerHTML = where ? `<p class="small">${esc(where)}</p>` : `${INST.ev ? '<button type="button" class="btn pri" data-inst>⬇ Install Suomi 61</button>' : ''}
  <div class="note small" style="margin-top:10px"><p style="margin:0 0 6px"><b>${ios ? 'iPhone / iPad (Safari)' : 'Android (Chrome)'}:</b> ${ios ? 'tap Share □↑ → <b>Add to Home Screen</b> → Add.' : 'menu ⋮ → <b>Install app</b> (or <b>Add to Home screen</b> → Install).'}</p>
  <p style="margin:0 0 6px"><b>Laptop (Chrome or Edge):</b> the install icon ⊕ at the right end of the address bar, or menu → <b>Install Suomi 61</b>.</p>
  <p style="margin:0">If it says it cannot install: open the page in <b>Chrome</b> itself (not inside Gmail, WhatsApp or another app's browser), use the <b>https://…github.io/…</b> address, reload once, and wait a few seconds. · इन्स्टल भएन भने Chrome मै https ठेगाना खोलेर एक पटक reload गर्नुहोस्।</p></div>`;
  const b = $('[data-inst]', host); if (b) b.onclick = doInstall;
}
VERBS_LIST = WORDS.filter(w => w.vf);
function init() {
  shell(); applySet();
  $('#instbtn').onclick = doInstall;
  $('#langs').onclick = e => { const b = e.target.closest('[data-q]'); if (!b) return; SET[b.dataset.q] = !SET[b.dataset.q]; saveSet(); applySet(); };
  window.addEventListener('hashchange', render);
  render();
  HLS.caps = loadCaps(); HLS.caps.then(() => { if (/^#(write|asetukset|lesson|kaannos)/.test(location.hash)) render(); });
  hlStart();
  if (dateOf(todayISO()).getDay() === 0 && sget('lastBackup', '') !== todayISO()) setTimeout(() => toast('Sunday: download a backup of your progress. · आइतबार: ब्याकअप लिनुहोस्।', 'Backup', () => go('asetukset')), 2500);
  // offline app: service worker + update banner (GitHub Pages build only)
  if (window.FI61_PWA && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ask = w => toast('New version ready – tap to update · नयाँ संस्करण तयार', 'Update', () => { w.postMessage('skip'); });
      if (reg.waiting) ask(reg.waiting);
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); }); });
    }).catch(() => { });
    let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
