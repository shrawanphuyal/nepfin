// ===== core helpers, storage, dates, audio, markup =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const uniq = a => [...new Set(a)];
const hash = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };

// storage: every key starts with fi61: and every call survives blocked storage
const PFX = 'fi61:';
const MEM = {};
function sget(k, d) { try { const v = localStorage.getItem(PFX + k); return v == null ? (k in MEM ? MEM[k] : d) : JSON.parse(v); } catch (e) { return k in MEM ? MEM[k] : d; } }
function sset(k, v) { MEM[k] = v; try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) { } }
function sdel(k) { delete MEM[k]; try { localStorage.removeItem(PFX + k); } catch (e) { } }
function allKeys() { const o = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) o[k] = localStorage.getItem(k); } } catch (e) { for (const k in MEM) o[PFX + k] = JSON.stringify(MEM[k]); } return o; }

const SET = Object.assign({ en: true, ne: true, size: 'm', rate: 1, theme: 'auto', start: '2026-11-04', name: 'Ram' }, sget('set', {}));
const saveSet = () => sset('set', SET);

// dates
const DAY_MS = 86400000;
const pad = n => String(n).padStart(2, '0');
const isoOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const dateOf = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const todayISO = () => isoOf(new Date());
const addDays = (iso, n) => isoOf(new Date(dateOf(iso).getTime() + n * DAY_MS));
const diffDays = (a, b) => Math.round((dateOf(b) - dateOf(a)) / DAY_MS);
const dayISO = n => addDays(START_ISO, n - 1);
const dayOfISO = iso => diffDays(START_ISO, iso) + 1;
const todayDay = () => Math.max(1, Math.min(61, dayOfISO(todayISO())));
const WD_FI = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'];
const WD_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = n => { const d = dateOf(dayISO(n)); return WD_EN[d.getDay()] + ' ' + d.getDate() + ' ' + MON_EN[d.getMonth()]; };
const fmtFi = n => { const d = dateOf(dayISO(n)); return WD_FI[d.getDay()] + ' ' + d.getDate() + '.' + (d.getMonth() + 1) + '.'; };
const calOf = n => CAL[n - 1];
const kindOf = n => calOf(n)[3];
const isShort = n => ['exam', 'light'].includes(kindOf(n));
const blocksOf = n => isShort(n) ? BLOCKS.filter(b => SHORT_BLOCKS.includes(b.id)) : BLOCKS;

// day progress
const blockState = n => sget('blocks', {})[n] || {};
function setBlock(n, id, v) { const all = sget('blocks', {}); all[n] = all[n] || {}; if (v) all[n][id] = 1; else delete all[n][id]; sset('blocks', all); if (v) bumpStreak(); }
const dayDone = n => { const st = blockState(n); return blocksOf(n).every(b => st[b.id]); };
const dayProgress = n => { const st = blockState(n); const bl = blocksOf(n); return bl.filter(b => st[b.id]).length / bl.length; };
function catchUps() { const t = dayOfISO(todayISO()); const out = []; for (let n = 1; n < Math.min(t, 62); n++) { if (!dayDone(n) && !['exam'].includes(kindOf(n))) out.push(n); } return out; }
function bumpStreak() { const s = sget('streak', { last: '', n: 0 }); const t = todayISO(); if (s.last === t) return; s.n = s.last === addDays(t, -1) ? s.n + 1 : 1; s.last = t; sset('streak', s); }
const streakNow = () => { const s = sget('streak', { last: '', n: 0 }); return (s.last === todayISO() || s.last === addDays(todayISO(), -1)) ? s.n : 0; };
function addMinutes(min) { const m = sget('min', {}); const t = todayISO(); m[t] = Math.round(((m[t] || 0) + min) * 10) / 10; sset('min', m); }

// ===== audio: Web Speech, fi-FI, normal and slow =====
const TTS = { ok: typeof window !== 'undefined' && 'speechSynthesis' in window, voice: null, warned: false };
function pickVoice() { if (!TTS.ok) return; const vs = speechSynthesis.getVoices() || []; TTS.voice = vs.find(v => /^fi(-|_|$)/i.test(v.lang)) || null; }
if (TTS.ok) { pickVoice(); try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) { } }
function speak(text, slow, onend) {
  text = String(text || '').replace(/\^\^/g, '').replace(/[«»"]/g, '');
  if (!TTS.ok) { voiceNote(); onend && onend(); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fi-FI'; if (TTS.voice) u.voice = TTS.voice;
    u.rate = slow ? 0.75 : (+SET.rate || 1);
    if (onend) { u.onend = onend; u.onerror = onend; }
    speechSynthesis.speak(u);
    if (!TTS.voice) { pickVoice(); if (!TTS.voice) setTimeout(() => { pickVoice(); if (!TTS.voice) voiceNote(); }, 600); }
  } catch (e) { onend && onend(); }
}
function voiceNote() { if (TTS.warned) return; TTS.warned = true; toast('No Finnish voice found on this device. See Settings → “Install the Finnish voice”. · यो उपकरणमा फिनिस आवाज छैन। सेटिङमा हेर्नुहोस्।', 'Settings', () => go('asetukset')); }
const IC_SAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const IC_SLOW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15c0-4 3.5-7 8-7s8 3 8 7H3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 15h2M7 15v2M15 15v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const sayBtn = (t, slow) => `<button type="button" class="say" data-say="${esc(t)}"${slow ? ' data-slow="1"' : ''} aria-label="${slow ? 'Slow: ' : 'Listen: '}${esc(t)}">${slow ? IC_SLOW : IC_SAY}</button>`;

// ===== markup: [[fi]] tap-to-hear, **bold**, ^^ending^^ =====
function md(s) {
  let h = esc(s);
  h = h.replace(/\[\[(.+?)\]\]/g, (m, w) => `<span class="fiw" data-say="${w.replace(/\^\^/g, '')}">${w}</span>`);
  h = h.replace(/\^\^(.+?)\^\^/g, '<mark class="end">$1</mark>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  h = h.replace(/\{\{(.+?)\}\}/g, '<span class="sp">$1</span>');
  return h;
}
// one line in three languages: Finnish first and bold, then English, then Nepali
function tri(fi, en, ne, o = {}) {
  return `<div class="tri${o.cls ? ' ' + o.cls : ''}"${o.idx != null ? ` data-i="${o.idx}"` : ''}>${sayBtn(fi)}<div class="tx">${o.who ? `<span class="who">${esc(o.who)}</span>` : ''}<span class="fi tfi">${o.raw ? fi : md(fi)}</span>${o.sp ? `<span class="t-sp small">🗣 ${esc(o.sp)}</span>` : ''}${en ? `<span class="t-en">${md(en)}</span>` : ''}${ne ? `<span class="t-ne">${esc(ne)}</span>` : ''}</div></div>`;
}
const srcTag = s => `<span class="tag src" title="${s === 'Lisä' ? 'Extra material' : 'Follows a Suomen mestari 1 chapter'}">${s === 'Lisä' ? '[Lisä]' : '[SM1-linjattu]'}</span>`;

// toast / banner
let toastT = null;
function toast(msg, act, fn) {
  let b = $('#toast'); if (!b) { b = document.createElement('div'); b.id = 'toast'; b.className = 'banner'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.innerHTML = `<span>${esc(msg)}</span>${act ? `<button type="button">${esc(act)}</button>` : ''}`; b.hidden = false;
  if (act) b.querySelector('button').onclick = () => { b.hidden = true; fn && fn(); };
  clearTimeout(toastT); toastT = setTimeout(() => { b.hidden = true; }, act ? 9000 : 3500);
}

// ===== Finnish numbers, prices and clock =====
const ONES = ['nolla', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän'];
function numFi(n) {
  if (n < 10) return ONES[n];
  if (n === 10) return 'kymmenen';
  if (n < 20) return ONES[n - 10] + 'toista';
  if (n < 100) { const t = Math.floor(n / 10), o = n % 10; return ONES[t] + 'kymmentä' + (o ? ONES[o] : ''); }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? 'sata' : ONES[h] + 'sataa') + (r ? numFi(r) : ''); }
  if (n < 10000) { const t = Math.floor(n / 1000), r = n % 1000; return (t === 1 ? 'tuhat' : ONES[t] + 'tuhatta') + (r ? numFi(r) : ''); }
  return String(n);
}
function priceFi(cents) {
  const e = Math.floor(cents / 100), c = cents % 100;
  if (!e) return numFi(c) + (c === 1 ? ' sentti' : ' senttiä');
  return (e === 1 ? 'yksi euro' : numFi(e) + ' euroa') + (c ? ' ' + numFi(c) : '');
}
const priceStr = cents => (Math.floor(cents / 100)) + ',' + pad(cents % 100) + ' €';
const HOUR_NEXT = h => h % 12 + 1;
function clockFi(h, m) { // h 1–12
  if (m === 0) return 'Kello on ' + numFi(h) + '.';
  if (m === 30) return 'Kello on puoli ' + numFi(HOUR_NEXT(h)) + '.';
  if (m === 15) return 'Kello on varttia yli ' + numFi(h) + '.';
  if (m === 45) return 'Kello on varttia vaille ' + numFi(HOUR_NEXT(h)) + '.';
  const P = { 5: 'viittä', 10: 'kymmentä', 20: 'kahtakymmentä', 25: 'kahtakymmentäviittä' }; // minutes in the partitive
  if (m < 30) return 'Kello on ' + P[m] + ' yli ' + numFi(h) + '.';
  return 'Kello on ' + P[60 - m] + ' vaille ' + numFi(HOUR_NEXT(h)) + '.';
}

// capabilities that exist only inside a Claude artifact
const CAP = { sample: null, downloads: null };
async function loadCaps() {
  try { if (window.claude && window.claude.use) { CAP.sample = await window.claude.use('sample'); CAP.downloads = await window.claude.use('downloads'); } } catch (e) { }
  document.documentElement.classList.toggle('has-claude', !!CAP.sample);
  $$('[data-claude]').forEach(el => { el.hidden = !CAP.sample; });
}
