// ===== Helper language (8 Nov) =====
// Finnish and English are always on. The learner picks one helper language in Settings (Nepali by default).
// Nepali is built into the course. For the other languages the app translates the Nepali/English helper lines
// online when they come into view (Claude inside the artifact, MyMemory in the phone app) and keeps them on this device.
const HL_LANGS = {
  ne: { en: 'Nepali', native: 'नेपाली', short: 'ने', mm: 'ne' },
  sq: { en: 'Albanian', native: 'Shqip', short: 'SQ', mm: 'sq' },
  vi: { en: 'Vietnamese', native: 'Tiếng Việt', short: 'VI', mm: 'vi' },
  uk: { en: 'Ukrainian', native: 'Українська', short: 'УК', mm: 'uk' },
  fa: { en: 'Persian', native: 'فارسی', short: 'فا', mm: 'fa', rtl: 1, arab: 1, claude: 'Persian (Farsi, as used in Iran)' },
  ar: { en: 'Arabic (Iraqi)', native: 'العربية · العراق', short: 'ع', mm: 'ar', rtl: 1, arab: 1, claude: 'Arabic for readers from Iraq: clear Modern Standard Arabic, with common Iraqi words where they sound more natural' },
  fil: { en: 'Filipino', native: 'Filipino', short: 'FIL', mm: 'tl', claude: 'Filipino (Tagalog)' },
  tr: { en: 'Turkish', native: 'Türkçe', short: 'TR', mm: 'tr' }
};
if (!HL_LANGS[SET.hl]) SET.hl = 'ne';
const HL = () => HL_LANGS[SET.hl];
const hlName = () => HL().en;
const hlWrite = () => SET.hl === 'ne' ? 'Nepali (in Devanagari script)' : (HL().claude || HL().en);
const hlFont = () => HL().arab ? '"Noto Sans Arabic",Tahoma,"Segoe UI",sans-serif' : SET.hl === 'ne' ? '' : 'var(--font)';
const DEVA = /[ऀ-ॿ]/;
const HLS = { cache: null, loading: null, lang: null, q: new Map(), timer: null, running: 0, io: null, mo: null, told: false, stop: false, pend: [] };

// ---- saved translations (IndexedDB, one object per language)
function hlLoad() {
  if (HLS.lang !== SET.hl) { HLS.lang = SET.hl; HLS.cache = null; HLS.loading = null; HLS.stop = false; }
  if (!HLS.loading) { const lang = SET.hl; HLS.loading = (async () => { let c = null; try { c = await idbGet('txt', 'hl:' + lang); } catch (e) { } if (HLS.lang === lang) { HLS.cache = c && typeof c === 'object' ? c : {}; HLS.cache[hlKey('ne', 'नेपाली')] = HL().native; HLS.cache[hlKey('ne', 'नेपालीमा')] = HL().native; } })(); }
  return HLS.loading;
}
let hlSaveT = null;
const hlSave = () => { clearTimeout(hlSaveT); const lang = SET.hl, c = HLS.cache; hlSaveT = setTimeout(() => idbPut('txt', 'hl:' + lang, c), 900); };
const hlKey = (f, s) => f + '\u0001' + s;
const hlCount = () => HLS.cache ? Object.keys(HLS.cache).length : 0;
async function hlClear() { HLS.cache = {}; await idbDel('txt', 'hl:' + SET.hl); }

// ---- find the helper lines on a screen
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'TITLE', 'NOSCRIPT', 'svg']);
function devaRange(s) {
  let a = s.search(DEVA); if (a < 0) return null; let b = a;
  for (let i = s.length - 1; i >= a; i--) if (DEVA.test(s[i])) { b = i; break; }
  while (b + 1 < s.length && /[।?!.)…”"'’]/.test(s[b + 1])) b++;
  while (a > 0 && /[(“"‘]/.test(s[a - 1])) a--;
  return [a, b + 1];
}
const latinOK = s => s && s.length <= 400 && !DEVA.test(s) && (s.match(/[A-Za-z]/g) || []).length >= 3;
// an English twin next to the Nepali line gives a better source than the Nepali
function enTwinOf(el) {
  const p = el.parentElement; if (!p) return '';
  const en = [...p.children].filter(c => c.classList.contains('t-en')); const ne = [...p.children].filter(c => c.classList.contains('t-ne'));
  if (en.length === 1 && ne.length === 1) { const t = en[0].textContent.trim(); if (latinOK(t)) return t; }
  return '';
}
function hlMark(el, src, from) { el.dataset.hls = src; el.dataset.hlf = from; el.setAttribute('lang', SET.hl); el.setAttribute('dir', 'auto'); el.classList.add('hlt'); }
function hlScan(root) {
  if (SET.hl === 'ne' || !root) return;
  if (!HLS.cache) { HLS.pend.push(root); if (HLS.pend.length === 1) hlLoad().then(() => { const r = HLS.pend.splice(0); r.forEach(hlScan); }); return; }
  if (root.nodeType === 3) { if (root.parentElement) hlScan(root.parentElement); return; }
  if (root.nodeType !== 1 || !root.isConnected) return;
  const found = [];
  // 1. elements that hold only a helper line
  const els = [...(root.matches && root.matches('.t-ne,[style*="font-ne"]') ? [root] : []), ...root.querySelectorAll('.t-ne,[style*="font-ne"]')];
  for (const el of els) {
    if (el.closest('[data-hls]') && !el.matches('[data-hls]')) continue;
    if (el.children.length) continue; // mixed content is handled as text below
    const t = el.textContent; if (!DEVA.test(t)) continue;
    if (el.dataset.hls && el.dataset.hlsrc === t) continue;
    const en = enTwinOf(el);
    hlMark(el, en || t.trim(), en ? 'en' : 'ne'); el.dataset.hlsrc = t; found.push(el);
  }
  // 2. Nepali inside running text, usually "English text · नेपाली"
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => DEVA.test(n.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
  for (const n of nodes) {
    const p = n.parentElement; if (!p || SKIP_TAGS.has(p.tagName)) continue;
    const owner = p.closest('[data-hls]'); if (owner) { if (owner.dataset.hlsrc !== owner.textContent) { delete owner.dataset.hls; hlScan(owner.parentElement || owner); } continue; }
    const r = devaRange(n.data); if (!r) continue;
    const before = n.data.slice(0, r[0]), seg = n.data.slice(r[0], r[1]).trim(), after = n.data.slice(r[1]);
    let en = '';
    const bt = before.trimEnd();
    if (bt.endsWith('·')) { en = bt.slice(0, -1).split('·').pop().trim(); if (!latinOK(en)) en = ''; if (!en && !bt.slice(0, -1).trim()) { const ps = n.previousSibling; if (ps && ps.nodeType === 1) { const t = ps.textContent.trim(); if (latinOK(t)) en = t; } } }
    if (p.tagName === 'OPTION') { const c = HLS.cache[hlKey(en ? 'en' : 'ne', en || seg)]; n.data = (before + (c || '') + after).replace(/\s*·\s*$/, ''); continue; }
    const sp = document.createElement('span'); hlMark(sp, en || seg, en ? 'en' : 'ne'); sp.dataset.hlsrc = '';
    const frag = document.createDocumentFragment(); if (before) frag.appendChild(document.createTextNode(before)); frag.appendChild(sp); if (after) frag.appendChild(document.createTextNode(after));
    p.replaceChild(frag, n); sp.dataset.hlsrc = sp.textContent; found.push(sp);
  }
  // 3. attributes: drop the Nepali part (placeholders, labels, tooltips)
  for (const a of ['placeholder', 'title', 'aria-label']) $$(`[${a}]`, root).forEach(el => { const v = el.getAttribute(a); if (DEVA.test(v)) el.setAttribute(a, v.split('·').filter(x => !DEVA.test(x)).join('·').trim() || v.replace(/[ऀ-ॿ।]+/g, '').trim()); });
  found.forEach(hlFill);
}
function hlFill(el) {
  const k = hlKey(el.dataset.hlf, el.dataset.hls); const c = HLS.cache[k];
  if (c != null) { hlSet(el, c); return; }
  hlSet(el, '…'); el.classList.add('hl-wait');
  if (!HLS.io) HLS.io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { HLS.io.unobserve(e.target); hlQueue(e.target); } }), { rootMargin: '400px 0px' }) : { observe: hlQueue, unobserve() { } };
  HLS.io.observe(el);
}
function hlSet(el, text) { el.textContent = text; el.dataset.hlsrc = text; el.classList.remove('hl-wait', 'hl-off'); }
function hlQueue(el) {
  if (!el.isConnected) return;
  const k = hlKey(el.dataset.hlf, el.dataset.hls); const c = HLS.cache[k]; if (c != null) { hlSet(el, c); return; }
  if (!HLS.q.has(k)) HLS.q.set(k, new Set()); HLS.q.get(k).add(el);
  clearTimeout(HLS.timer); HLS.timer = setTimeout(hlRun, 120);
}
// ---- the online engines, in batches
const hlEngine = () => navigator.onLine === false ? null : CAP.sample ? 'claude' : window.FI61_PWA ? 'mymemory' : null;
async function hlClaude(items) {
  const prompt = `Translate each item into ${hlWrite()}. The items are short lines from a Finnish course for adult beginners: app buttons and labels, grammar explanations, and the meanings of Finnish example sentences. Each item is [source language, text]; "en" is English, "ne" is Nepali.
Rules: keep Finnish words, Finnish endings (like -ssa, -lle), names, numbers, emoji and symbols (→ · = / ✓) exactly as they are. Translate the rest naturally and briefly. No explanations, no quotes around the result.
Return JSON only: an array of ${items.length} strings, one per item, in the same order.
Items:
${JSON.stringify(items.map(x => [x.f, x.s]))}`;
  const j = await CAP.sample.json(prompt, { modelTier: 'quick' });
  const arr = Array.isArray(j) ? j : j && Array.isArray(j.items) ? j.items : null;
  if (!arr || arr.length !== items.length) throw new Error('shape');
  return arr.map(x => String(x == null ? '' : x).trim());
}
async function hlMyMemory(items) { const out = []; for (const it of items) { try { const r = await myMemory(it.s, it.f, SET.hl); out.push(r.text); } catch (e) { if ((e && e.message) === 'limit') throw e; out.push(''); } } return out; }
async function hlRun() {
  if (HLS.running || !HLS.q.size) return;
  if (HLS.caps) { HLS.running = 1; try { await HLS.caps; } catch (e) { } HLS.caps = null; HLS.running = 0; }
  const eng = hlEngine();
  if (!eng || HLS.stop) { for (const [, set] of HLS.q) set.forEach(el => { el.textContent = ''; el.classList.remove('hl-wait'); el.classList.add('hl-off'); }); HLS.q.clear(); hlTell(eng ? 'limit' : navigator.onLine === false ? 'offline' : 'none'); return; }
  HLS.running = 1; const lang = SET.hl;
  try {
    while (HLS.q.size && lang === SET.hl && !HLS.stop) {
      const max = eng === 'claude' ? 40 : 6; const batch = []; let chars = 0;
      for (const k of HLS.q.keys()) { const i = k.indexOf('\u0001'); const it = { k, f: k.slice(0, i), s: k.slice(i + 1) }; if (batch.length && (batch.length >= max || chars + it.s.length > 3500)) break; batch.push(it); chars += it.s.length; }
      let res = null;
      try { res = await withTimeout(eng === 'claude' ? hlClaude(batch) : hlMyMemory(batch), 60000, 'timeout'); }
      catch (e) { const code = (e && (e.code || e.message)) || ''; if (/limit|rate_limited|not_granted|quota/.test(code)) { HLS.stop = true; hlTell(code === 'not_granted' ? 'denied' : 'limit'); } res = null; if (!HLS.stop) await new Promise(r => setTimeout(r, 1500)); }
      batch.forEach((it, i) => {
        const set = HLS.q.get(it.k); HLS.q.delete(it.k);
        const t = res && res[i];
        if (t) { HLS.cache[it.k] = t; set && set.forEach(el => el.isConnected && hlSet(el, t)); }
        else if (set) set.forEach(el => { el.textContent = ''; el.classList.remove('hl-wait'); el.classList.add('hl-off'); });
      });
      if (res) hlSave();
    }
  } finally { HLS.running = 0; if (HLS.q.size && !HLS.stop) hlRun(); else if (HLS.stop) hlRun(); }
}
function hlTell(why) {
  if (HLS.told === why) return; HLS.told = why;
  const n = hlName();
  const msg = { offline: `${n} needs the internet the first time. Finnish and English work offline.`, none: `${n} is translated online in the phone app or inside Claude. Finnish and English are shown.`, limit: `The free translation limit for today is reached. ${n} lines that are not saved yet are hidden; try again tomorrow.`, denied: `Translation into ${n} was not allowed. Finnish and English are shown. You can allow it from the page's permissions.` }[why];
  if (msg) toast(msg);
}
// retry hidden lines when the connection comes back
window.addEventListener('online', () => { HLS.told = false; $$('.hl-off').forEach(el => hlFill(el)); });

// ---- watch the page for new helper lines
function hlStart() {
  if (HLS.mo) { HLS.mo.disconnect(); HLS.mo = null; }
  if (SET.hl === 'ne') return;
  hlLoad();
  let roots = new Set(), t = null;
  HLS.mo = new MutationObserver(ms => {
    for (const m of ms) { if (m.type === 'characterData') roots.add(m.target); else m.addedNodes.forEach(n => { if (n.nodeType === 1 ? !n.classList.contains('hlt') || n.children.length : n.nodeType === 3 && DEVA.test(n.data)) roots.add(n); }); }
    clearTimeout(t); t = setTimeout(() => { const r = [...roots]; roots = new Set(); r.forEach(hlScan); }, 30);
  });
  HLS.mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  hlScan(document.body);
}
