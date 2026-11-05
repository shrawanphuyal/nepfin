// ===== start =====
VERBS_LIST = WORDS.filter(w => w.vf);
function init() {
  shell(); applySet();
  $('#langs').onclick = e => { const b = e.target.closest('[data-q]'); if (!b) return; SET[b.dataset.q] = !SET[b.dataset.q]; saveSet(); applySet(); };
  window.addEventListener('hashchange', render);
  render();
  loadCaps().then(() => { if (/^#(write|asetukset|lesson)/.test(location.hash)) render(); });
  if (dateOf(todayISO()).getDay() === 0 && sget('lastBackup', '') !== todayISO()) setTimeout(() => toast('Sunday: download a backup of your progress. · आइतबार: ब्याकअप लिनुहोस्।', 'Backup', () => go('asetukset')), 2500);
  // offline app: service worker + update banner (GitHub Pages build only)
  if (window.FI61_PWA && 'serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ask = w => toast('New version ready – tap to update · नयाँ संस्करण तयार', 'Update', () => { w.postMessage('skip'); });
      if (reg.waiting) ask(reg.waiting);
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); }); });
    }).catch(() => { });
    let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
