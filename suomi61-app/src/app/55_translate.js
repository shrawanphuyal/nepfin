// ===== Kääntäjä · translator =====
// Engines, best first: online (Claude inside the artifact, MyMemory in the phone app) → Chrome's built-in
// on-device translator → downloaded offline pack → offline course dictionary (always there).
const TR_L = { fi: ['suomi', 'Finnish', 'फिनिस'], en: ['englanti', 'English', 'अंग्रेजी'], ne: ['nepali', 'Nepali', 'नेपाली'] };
const TJS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';
const NLLB = { fi: 'fin_Latn', en: 'eng_Latn', ne: 'npi_Deva' };
const PACKS = {
  fien: { fi: 'Suomi ↔ englanti', en: 'Finnish ↔ English', ne: 'फिनिस ↔ अंग्रेजी', mb: 240, phone: true, pairs: ['fi>en', 'en>fi'], models: { 'fi>en': 'Xenova/opus-mt-fi-en', 'en>fi': 'Xenova/opus-mt-en-fi' }, note: ['Good quality. Works on most phones. Sentences take 1–3 seconds.', 'राम्रो गुणस्तर। धेरैजसो फोनमा चल्छ।'] },
  nllb: { fi: 'Kaikki kolme kieltä', en: 'All three languages, with Nepali', ne: 'तीनै भाषा, नेपाली सहित', mb: 920, phone: false, pairs: ['fi>en', 'en>fi', 'fi>ne', 'ne>fi', 'en>ne', 'ne>en'], models: { all: 'Xenova/nllb-200-distilled-600M' }, note: ['Laptop only: needs about 3 GB of free memory. Slow (5–20 seconds a sentence). Nepali quality is fair, not perfect.', 'ल्यापटपमा मात्र। ढिलो चल्छ। नेपालीको गुणस्तर ठिकै मात्र।'] }
};
const ENGINE_NAME = { claude: 'Online · Claude', mymemory: 'Online · MyMemory', chrome: 'Offline · built into Chrome', 'pack:fien': 'Offline pack · Finnish ↔ English', 'pack:nllb': 'Offline pack · all languages', dict: 'Offline dictionary' };
const TR = { lib: null, pipes: {}, dl: null };
const packState = () => sget('packs', {});
const online = () => navigator.onLine !== false;

// --- online engines
async function claudeTranslate(text, from, to) {
  if (!CAP.sample) throw new Error('no claude');
  const fiSide = from === 'fi' || to === 'fi';
  const prompt = `Translate from ${TR_L[from][1]} to ${TR_L[to][1]} for an A1 learner of Finnish whose first language is Nepali and who also knows English.
Return JSON only, in this shape: {"translation":"","spoken":"","note_en":"","note_ne":""}
- translation: natural, correct ${to === 'fi' ? 'standard written Finnish (kirjakieli)' : to === 'ne' ? 'Nepali in Devanagari' : 'English'}.
- spoken: ${fiSide ? 'the Finnish sentence as everyday Helsinki-region spoken Finnish (puhekieli); "" if it is the same' : '""'}.
- note_en: one short sentence on one useful point in the Finnish sentence (a case ending, verb form, k-p-t change or word choice), or "".
- note_ne: the same note in Nepali (Devanagari), or "".
Text:
<<<${text}>>>`;
  try { const j = await CAP.sample.json(prompt, { modelTier: 'default' }); if (!j || !j.translation) throw new Error('empty'); return { text: String(j.translation), sp: j.spoken || '', note: j.note_en || '', noteNe: j.note_ne || '', engine: 'claude' }; }
  catch (e) { if (e && e.code === 'invalid_json' && e.text) return { text: e.text.trim(), engine: 'claude' }; throw e; }
}
const decodeHTML = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
async function myMemory(text, from, to) {
  const parts = text.length <= 480 ? [text] : text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
  const out = [];
  for (const p of parts) {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 12000);
    try {
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(p.slice(0, 480)) + '&langpair=' + from + '|' + to + (SET.mmEmail ? '&de=' + encodeURIComponent(SET.mmEmail) : '');
      const r = await fetch(url, { signal: ctl.signal });
      const j = await r.json();
      const t = j && j.responseData && j.responseData.translatedText;
      if (!t || +j.responseStatus !== 200 || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE/i.test(t) || j.quotaFinished) throw new Error(/WARNING/i.test(t || '') || j.quotaFinished ? 'limit' : 'failed');
      out.push(decodeHTML(t));
    } finally { clearTimeout(tm); }
  }
  return { text: out.join(' ').replace(/\s+/g, ' ').trim(), engine: 'mymemory' };
}
// --- Chrome's built-in on-device translator (Chrome on a laptop; downloads its own language packs)
const withTimeout = (pr, ms, msg) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error(msg || 'timeout')), ms))]);
async function chromeAvail(from, to) { try { if (!('Translator' in self)) return 'no'; return await withTimeout(self.Translator.availability({ sourceLanguage: from, targetLanguage: to }), 3000); } catch (e) { return 'no'; } }
// used only when its language pack is already on the device, so a translation never starts a hidden download
async function chromeTranslate(text, from, to) { const a = await chromeAvail(from, to); if (a !== 'available') throw new Error('unavailable'); const t = await withTimeout(self.Translator.create({ sourceLanguage: from, targetLanguage: to }), 8000); return { text: await withTimeout(t.translate(text), 20000), engine: 'chrome' }; }
// --- offline packs (Transformers.js + ONNX models, stored in the browser's Cache Storage)
async function tjs() { if (!TR.lib) { TR.lib = await import(TJS_URL); TR.lib.env.allowLocalModels = false; TR.lib.env.useBrowserCache = true; } return TR.lib; }
async function getPipe(model, progress) {
  if (!TR.pipes[model]) {
    if (model.includes('nllb')) await freePipes(m => !m.includes('nllb')); else await freePipes(m => m.includes('nllb'));
    const { pipeline } = await tjs();
    TR.pipes[model] = await pipeline('translation', model, { dtype: 'q8', progress_callback: progress });
  }
  return TR.pipes[model];
}
async function freePipes(test) { for (const m of Object.keys(TR.pipes)) if (test(m)) { try { await TR.pipes[m].dispose(); } catch (e) { } delete TR.pipes[m]; } }
function packFor(from, to) { const ps = packState(); const k = from + '>' + to; if (ps.fien === 'ready' && PACKS.fien.models[k]) return 'fien'; if (ps.nllb === 'ready') return 'nllb'; return null; }
async function packTranslate(text, from, to, force) {
  const id = force || packFor(from, to); if (!id) throw new Error('no pack');
  if (id === 'fien') { const p = await getPipe(PACKS.fien.models[from + '>' + to]); const r = await p(text, { max_new_tokens: 256 }); return { text: r[0].translation_text, engine: 'pack:fien' }; }
  const p = await getPipe(PACKS.nllb.models.all); const r = await p(text, { src_lang: NLLB[from], tgt_lang: NLLB[to], max_new_tokens: 256 }); return { text: r[0].translation_text, engine: 'pack:nllb' };
}
async function downloadPack(id, onProg) {
  const P = PACKS[id]; const files = {}; const total = P.mb * 1e6;
  TR.dl = { id, pct: 0 };
  const prog = p => { if (p && p.status === 'progress' && p.file) { files[p.name + '/' + p.file] = p.loaded || 0; const loaded = Object.values(files).reduce((s, x) => s + x, 0); TR.dl.pct = Math.min(99, Math.round(loaded / total * 100)); onProg && onProg(TR.dl.pct); } };
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { }
  try {
    for (const model of Object.values(P.models)) {
      const pipe = await getPipe(model, prog);
      await pipe(id === 'nllb' ? 'Hei' : (model.endsWith('fi-en') ? 'Hei' : 'Hello'), id === 'nllb' ? { src_lang: NLLB.fi, tgt_lang: NLLB.en, max_new_tokens: 8 } : { max_new_tokens: 8 });
    }
    const ps = packState(); ps[id] = 'ready'; sset('packs', ps); TR.dl = null; onProg && onProg(100); return true;
  } catch (e) { TR.dl = null; throw e; }
}
async function packFilesCount(id) { try { if (!('caches' in self)) return -1; const c = await caches.open('transformers-cache'); const ks = await c.keys(); return ks.filter(r => Object.values(PACKS[id].models).some(m => r.url.includes('/' + m + '/'))).length; } catch (e) { return -1; } }
async function deletePack(id) {
  await freePipes(m => Object.values(PACKS[id].models).includes(m));
  try { const c = await caches.open('transformers-cache'); for (const r of await c.keys()) if (Object.values(PACKS[id].models).some(m => r.url.includes('/' + m + '/'))) await c.delete(r); } catch (e) { }
  const ps = packState(); delete ps[id]; sset('packs', ps);
  if (!Object.keys(ps).length) { try { const c = await caches.open('suomi61-lib'); for (const r of await c.keys()) await c.delete(r); } catch (e) { } }
}

// --- the offline course dictionary
let DICT = null, FORMMAP = null;
const tn = s => String(s || '').toLowerCase().replace(/[\[\]*^{}]/g, '').replace(/[.,!?;:"“”«»()–—।…]/g, ' ').replace(/\s+/g, ' ').trim();
const clean = s => String(s || '').replace(/\[\[|\]\]|\*\*|\^\^/g, '');
function buildDict() {
  const E = []; const seen = new Set();
  const add = (fi, en, ne, o = {}) => { fi = clean(fi); if (!fi) return; const k = tn(fi) + '|' + tn(en); if (seen.has(k)) return; seen.add(k); E.push(Object.assign({ fi, en: clean(en), ne: clean(ne), nfi: tn(fi), nen: tn(en), nne: tn(ne) }, o)); };
  WORDS.forEach(w => { add(w.fi, w.en, w.ne, { w: 1, e: w.e, sp: w.sp, forms: [...(w.vf || []), ...(w.f ? Object.values(w.f) : []), w.k || ''].filter(Boolean).map(tn) }); });
  WORDS.forEach(w => { if (w.x && w.x[0]) add(w.x[0], w.x[1], w.x[2]); });
  LESSONS.forEach(L => L.s7.forEach(s => add(s[0], s[1], s[2])));
  DIALOGUES.forEach(D => { D.lines.forEach(l => add(l[1], l[3], l[4], { sp: l[2] })); D.key.forEach(k => add(k[0], k[1], k[2])); });
  Object.values(DAYS).forEach(D => { D.read.lines.forEach(l => add(l[0], l[1], l[2])); if (D.lis && D.lis.lines) D.lis.lines.forEach(l => add(l[1], l[2], l[3])); });
  ARKI.forEach(a => a.lines.forEach(l => add(l[0], l[1], l[2], { sp: l[3] })));
  PLACES.forEach(p => p.lines.forEach(l => add(l[1], l[2], l[3], { sp: l[4] })));
  STORIES.forEach(s => s.lines.forEach(l => add(l[0], l[1], l[2])));
  [...PUHE_PAIRS, ...PUHE_SENT].forEach(p => add(p[0], p[2], p[3], { sp: p[1] }));
  QA_BANK.forEach(q => { add(q[0], q[1], q[2]); add(q[3], q[4], ''); });
  POLITE.forEach(p => add(p[0], p[1], p[2]));
  GRAMMAR.forEach(g => g.blocks.filter(b => b.t === 'ex').forEach(b => b.items.forEach(x => add(x[0], x[1], x[2]))));
  DICT = E;
  FORMMAP = new Map(); const put = (k, e, how) => { if (k && !FORMMAP.has(k)) FORMMAP.set(k, [e, how]); };
  E.filter(e => e.w).forEach(e => { e.nfi.split(' / ').forEach(b => put(b.trim(), e, '')); (e.forms || []).forEach(f => put(f, e, 'form')); if (e.sp) tn(e.sp).split(' / ').forEach(s => put(s.trim(), e, 'spoken')); });
  [['ja', 'and', 'र'], ['tai', 'or', 'वा'], ['mutta', 'but', 'तर'], ['että', 'that', 'कि'], ['koska', 'because', 'किनभने'], ['kun', 'when', 'जब'], ['jos', 'if', 'यदि'], ['myös', 'also', 'पनि'], ['on', 'is; has', 'छ / हो'], ['ovat', 'are', 'छन् / हुन्'], ['olen', 'I am', 'म हुँ / छु'], ['olet', 'you are', 'तिमी हौ / छौ'], ['en', "I don't / not", 'म … होइन'], ['et', "you don't", 'तिमी … होइनौ'], ['ei', 'no; not', 'होइन; छैन'], ['tämä', 'this', 'यो'], ['tuo', 'that', 'त्यो'], ['se', 'it', 'त्यो / यो'], ['hyvin', 'well', 'राम्रोसँग'], ['vähän', 'a little', 'अलिअलि'], ['paljon', 'a lot', 'धेरै'], ['nyt', 'now', 'अहिले'], ['täällä', 'here', 'यहाँ'], ['siellä', 'there', 'त्यहाँ'], ['vain', 'only', 'मात्र'], ['jo', 'already', 'पहिले नै'], ['vielä', 'still; yet', 'अझै'], ['aina', 'always', 'सधैँ'], ['joskus', 'sometimes', 'कहिलेकाहीँ'], ['usein', 'often', 'प्रायः'], ['minun', 'my', 'मेरो'], ['sinun', 'your', 'तिम्रो'], ['hänen', 'his / her', 'उसको'], ['minulla', 'I have (at me)', 'मसँग'], ['sinulla', 'you have', 'तिमीसँग'], ['minulle', 'to me', 'मलाई'], ['minua', 'me', 'मलाई']].forEach(([fi, en, ne]) => { const k = tn(fi); if (!FORMMAP.has(k)) { const e = { fi, en, ne, nfi: k, nen: tn(en), nne: tn(ne), w: 1 }; FORMMAP.set(k, [e, '']); DICT.push(e); } });
  // stems for endings: genitive and k-p-t weak forms without -n, and the base word
  DICT.STEMS = E.filter(e => e.w && !e.nfi.includes(' ')).flatMap(e => uniq([e.nfi, ...(e.forms || []).filter(f => /n$/.test(f) && !f.includes(' ')).map(f => f.slice(0, -1))]).filter(s => s.length >= 4).map(s => [s, e])).sort((a, b) => b[0].length - a[0].length);
}
const meaningParts = s => tn(s).split(/ \/ |, |; /).map(x => x.replace(/^to /, '').replace(/\(.*?\)/g, '').trim()).filter(Boolean);
function dictSearch(q, from) {
  if (!DICT) buildDict();
  const nq = tn(q); if (!nq) return [];
  const qt = nq.split(' ').filter(t => t.length >= 3); const single = !nq.includes(' ');
  const fld = e => from === 'fi' ? e.nfi : from === 'en' ? e.nen : e.nne;
  const out = [];
  for (const e of DICT) {
    const f = fld(e); if (!f) continue; let s = 0;
    if (f === nq || (from === 'fi' && e.sp && tn(e.sp) === nq)) s = 100;
    else if (e.w && (from === 'fi' ? f.split(' / ').includes(nq) : meaningParts(from === 'en' ? e.en : e.ne).includes(nq))) s = 92;
    else if (from === 'fi' && e.forms && e.forms.includes(nq)) s = 86;
    else if (single && (' ' + f + ' ').includes(' ' + nq + ' ')) s = e.w ? 60 : 50;
    else if (f.startsWith(nq)) s = 40;
    else if (nq.length >= 3 && f.includes(nq)) s = 25;
    else if (!single && qt.length) { const ft = new Set(f.split(' ')); const hit = qt.filter(t => ft.has(t)).length; if (hit === qt.length) s = 45; else if (hit >= Math.ceil(qt.length / 2)) s = 15 + hit; }
    if (s) out.push([s + (single && e.w ? 5 : 0) + (!single && !e.w ? 3 : 0), e]);
  }
  return out.sort((a, b) => b[0] - a[0] || a[1].fi.length - b[1].fi.length).slice(0, 20).map(x => x[1]);
}
function glossFi(token) {
  const t = tn(token).replace(/(kin|kaan|kään|han|hän|ko|kö)$/, m => FORMMAP.has(tn(token)) ? m : ''); const raw = tn(token);
  if (FORMMAP.has(raw)) return FORMMAP.get(raw);
  if (FORMMAP.has(t)) return FORMMAP.get(t);
  const v = /^(.+?)(n|t|mme|tte|vat|vät)$/.exec(raw); // verb type 1 guess: ostan → ostaa, puhun → puhua
  if (v) { const st = v[1]; const last = st.slice(-1); for (const c of [st + last, st + 'a', st + 'ä']) if (FORMMAP.has(c) && FORMMAP.get(c)[0].w) return [FORMMAP.get(c)[0], 'verb']; }
  const hit = DICT.STEMS.find(([s]) => raw.startsWith(s) && raw.length - s.length <= 5); if (hit) return [hit[1], 'stem'];
  return null;
}
function glossOther(token, lang) { const t = tn(token); if (t.length < 2) return null; const e = DICT.find(e => e.w && meaningParts(lang === 'en' ? e.en : e.ne).includes(t)); return e ? [e, ''] : null; }
function wordByWord(text, from) {
  if (!DICT) buildDict();
  const toks = text.split(/\s+/).map(w => w.replace(/^[«"“(]+|[.,!?;:"”»)।]+$/g, '')).filter(Boolean).slice(0, 25);
  return toks.map(w => { const g = from === 'fi' ? glossFi(w) : glossOther(w, from); return { w, e: g && g[0], how: g && g[1] }; });
}

// --- run one translation through the engines in order
async function translateText(text, from, to) {
  const errs = []; const offOnly = SET.trMode === 'offline';
  const tries = [];
  if (!offOnly && online()) { if (CAP.sample) tries.push(['claude', claudeTranslate]); else if (window.FI61_PWA) tries.push(['mymemory', myMemory]); }
  if ('Translator' in self) tries.push(['chrome', chromeTranslate]);
  if (packFor(from, to)) tries.push(['pack', packTranslate]);
  for (const [name, fn] of tries) {
    try { const r = await withTimeout(fn(text, from, to), name === 'pack' ? 120000 : 30000, 'timeout'); if (r && r.text) { r.errs = errs; return r; } }
    catch (e) { if (name !== 'chrome' || !/unavailable/.test(e.message || '')) errs.push([name, (e && (e.code || e.message)) || 'failed']); }
  }
  return { text: '', engine: 'dict', errs };
}
function planLabel(from, to) {
  const offOnly = SET.trMode === 'offline';
  if (!offOnly && online() && CAP.sample) return ENGINE_NAME.claude;
  if (!offOnly && online() && window.FI61_PWA) return ENGINE_NAME.mymemory;
  const p = packFor(from, to); if (p) return ENGINE_NAME['pack:' + p];
  return ENGINE_NAME.dict + (offOnly ? '' : online() ? '' : ' · you are offline');
}

// --- my translation cards
function saveTrCard(src, res, from, to) {
  const fi = from === 'fi' ? src : to === 'fi' ? res : ''; if (!fi) return false;
  const other = from === 'fi' ? res : src; const lang = from === 'fi' ? to : from;
  const id = 't:' + hash(fi + '|' + other);
  const mc = sget('mycards', {}); mc[id] = { fi, en: lang === 'en' ? other : '', ne: lang === 'ne' ? other : '' }; sset('mycards', mc);
  if (!cards()[id]) cardSet(id, 1);
  return true;
}

R.kaannos = m => {
  const st = Object.assign({ from: 'fi', to: 'en', text: '' }, sget('trlast', {}));
  const langOpt = sel => Object.entries(TR_L).map(([k, v]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${v[1]}</option>`).join('');
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Kääntäjä · Translator</h1><p class="lede">Finnish, English and Nepali in every direction. Online it translates any sentence; offline it searches every word and sentence in the course. · फिनिस, अंग्रेजी र नेपाली, सबै दिशामा।</p>
  <div class="card"><div class="row"><select id="trf" aria-label="From" style="flex:1;min-width:130px">${langOpt(st.from)}</select><button type="button" class="btn sm ghost" id="trsw" aria-label="Swap languages">⇄</button><select id="trt" aria-label="To" style="flex:1;min-width:130px">${langOpt(st.to)}</select></div>
  <textarea id="trin" maxlength="500" aria-label="Text to translate" placeholder="Kirjoita tähän · Type here · यहाँ लेख्नुहोस्" style="margin-top:10px;min-height:100px">${esc(st.text)}</textarea>
  <div class="keys" id="trkeys">${['ä', 'ö', 'å'].map(c => `<button type="button" class="key" data-k="${c}">${c}</button>`).join('')}<span class="small muted" style="margin-left:auto" id="trcnt"></span></div>
  <div class="row"><button type="button" class="btn pri" id="trgo">Translate · अनुवाद</button><button type="button" class="btn ghost" id="trsay" aria-label="Listen to the Finnish text">${IC_SAY} Listen</button><button type="button" class="btn ghost" id="trclr">Clear</button><span class="tag" id="trplan"></span></div></div>
  <div id="trout" style="margin-top:12px"></div>
  <div id="trdict"></div>
  <h2>Recent · हालैका</h2><div id="trhist"></div>
  <p class="small muted" style="margin-top:12px">Offline packs and the online setting are in <a href="#asetukset">Settings → Translator</a>. Online translation sends your text to ${CAP.sample ? 'Claude' : 'the MyMemory translation service'}; turn on “Offline only” there to keep everything on this device.</p>`;
  const F = $('#trf', m), T = $('#trt', m), I = $('#trin', m);
  const save = () => { st.from = F.value; st.to = T.value; st.text = I.value; sset('trlast', st); $('#trcnt', m).textContent = I.value.length + '/500'; $('#trsay', m).hidden = F.value !== 'fi' && T.value !== 'fi'; $('#trplan', m).textContent = planLabel(F.value, T.value); };
  const fixSame = changed => { if (F.value === T.value) { const other = Object.keys(TR_L).find(k => k !== F.value); if (changed === F) T.value = other; else F.value = Object.keys(TR_L).find(k => k !== T.value); } };
  let deb = null; const live = () => { clearTimeout(deb); deb = setTimeout(() => drawDict($('#trdict', m), I.value, F.value), 220); };
  F.onchange = () => { fixSame(F); save(); live(); }; T.onchange = () => { fixSame(T); save(); };
  $('#trsw', m).onclick = () => { const a = F.value; F.value = T.value; T.value = a; const out = $('#trout [data-res]', m); if (out) I.value = out.dataset.res; save(); live(); };
  I.oninput = () => { save(); live(); };
  I.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go1(); } };
  $$('[data-k]', m).forEach(b => b.onclick = () => { const p = I.selectionStart; I.value = I.value.slice(0, p) + b.dataset.k + I.value.slice(I.selectionEnd); I.focus(); I.setSelectionRange(p + 1, p + 1); I.oninput(); });
  $('#trclr', m).onclick = () => { I.value = ''; $('#trout', m).innerHTML = ''; save(); live(); I.focus(); };
  $('#trsay', m).onclick = () => { const r = $('#trout [data-res]', m); speak(F.value === 'fi' ? I.value : (r && T.value === 'fi' ? r.dataset.res : I.value)); };
  const go1 = async () => {
    const text = I.value.trim(); if (!text) { I.focus(); return; }
    const from = F.value, to = T.value; const out = $('#trout', m);
    out.innerHTML = `<div class="card"><span class="muted">Translating… · अनुवाद हुँदैछ… (${esc(planLabel(from, to))})</span></div>`;
    await new Promise(r => setTimeout(r, 30));
    let r; try { r = await translateText(text, from, to); } catch (er) { r = { text: '', engine: 'dict', errs: [['app', 'failed']] }; }
    drawResult(out, text, r, from, to);
    if (r.text) { const h = sget('trh', []).filter(x => !(x.s === text && x.f === from && x.t === to)); h.unshift({ s: text, r: r.text, f: from, t: to, e: r.engine }); sset('trh', h.slice(0, 30)); drawHist(); }
    drawDict($('#trdict', m), text, from);
  };
  $('#trgo', m).onclick = go1;
  function drawResult(out, src, r, from, to) {
    const errLine = r.errs && r.errs.length ? `<p class="small muted" style="margin:6px 0 0">${r.errs.map(([n, c]) => `${esc(ENGINE_NAME[n] || n)}: ${c === 'limit' ? 'daily free limit reached' : c === 'rate_limited' ? 'too many requests, try again in a minute' : 'not reachable'}`).join(' · ')}</p>` : '';
    if (!r.text) { out.innerHTML = `<div class="note warn"><b>No full translation right now.</b> ${online() && SET.trMode !== 'offline' ? 'The online service did not answer.' : SET.trMode === 'offline' ? 'Offline only is on and no offline pack covers this language pair.' : 'You are offline and no offline pack covers this language pair.'} The course dictionary below shows the closest words and sentences. · पूरा अनुवाद अहिले सम्भव भएन; तलको शब्दकोश हेर्नुहोस्।${errLine}</div>${src.trim().split(/\s+/).length > 1 ? wbwHTML(src, from) : ''}`; return; }
    const toFi = to === 'fi';
    out.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="tag ${r.engine === 'claude' || r.engine === 'mymemory' ? 'src' : 'ok'}">${esc(ENGINE_NAME[r.engine] || r.engine)}</span><span class="small muted">${TR_L[from][1]} → ${TR_L[to][1]}</span></div>
      <div class="tri" style="border:0"><div class="tx"><span data-res="${esc(r.text)}" style="font-size:1.25rem;font-weight:700;${to === 'ne' ? 'font-family:var(--font-ne)' : ''}">${esc(r.text)}</span>${r.sp ? `<span class="t-sp small">🗣 ${esc(r.sp)}</span>` : ''}${r.note ? `<span class="t-en small">💡 ${esc(r.note)}</span>` : ''}${r.noteNe ? `<span class="t-ne small">${esc(r.noteNe)}</span>` : ''}</div>${toFi ? sayBtn(r.text) + sayBtn(r.text, 1) : from === 'fi' ? sayBtn(src) : ''}</div>
      <div class="row" style="margin-top:6px"><button type="button" class="btn sm" data-copy>Copy</button>${from === 'fi' || to === 'fi' ? '<button type="button" class="btn sm" data-card>+ Flashcard</button>' : ''}<button type="button" class="btn sm ghost" data-back>Translate back ⇄</button></div>${errLine}
      ${r.engine === 'mymemory' || r.engine === 'chrome' || r.engine.startsWith('pack') ? '<p class="small muted" style="margin:6px 0 0">Machine translation: check important sentences with your teacher. · महत्त्वपूर्ण वाक्य शिक्षकसँग जाँच गराउनुहोस्।</p>' : ''}</div>${from === 'fi' && src.trim().includes(' ') ? wbwHTML(src, from) : ''}`;
    $('[data-copy]', out).onclick = async e => { try { await navigator.clipboard.writeText(r.text); e.target.textContent = 'Copied ✓'; } catch (er) { const s = $('[data-res]', out); const rg = document.createRange(); rg.selectNodeContents(s); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rg); e.target.textContent = 'Selected: press copy'; } };
    const cb = $('[data-card]', out); if (cb) cb.onclick = e => { e.target.textContent = saveTrCard(src, r.text, from, to) ? 'Added to flashcards ✓' : 'Only Finnish pairs can be cards'; };
    $('[data-back]', out).onclick = () => { F.value = to; T.value = from; I.value = r.text; save(); go1(); };
  }
  function drawHist() { const h = sget('trh', []); $('#trhist', m).innerHTML = h.length ? `<div class="card">${h.slice(0, 12).map((x, i) => `<button type="button" class="tri" data-h="${i}" style="width:100%;background:none;border-left:0;border-right:0;border-bottom:0;text-align:left;cursor:pointer;color:inherit"><span class="tx"><span class="small muted">${TR_L[x.f][1]} → ${TR_L[x.t][1]} · ${esc(ENGINE_NAME[x.e] || '')}</span><span class="fi">${esc(x.s)}</span><span style="${x.t === 'ne' ? 'font-family:var(--font-ne)' : ''}">${esc(x.r)}</span></span></button>`).join('')}</div><div class="row" style="margin-top:6px"><button type="button" class="btn sm ghost" id="trhc">Clear history</button></div>` : '<p class="empty">Your translations will appear here, on this device only.</p>';
    $$('[data-h]', m).forEach(b => b.onclick = () => { const x = sget('trh', [])[+b.dataset.h]; F.value = x.f; T.value = x.t; I.value = x.s; save(); drawResult($('#trout', m), x.s, { text: x.r, engine: x.e, errs: [] }, x.f, x.t); drawDict($('#trdict', m), x.s, x.f); window.scrollTo(0, 0); });
    const c = $('#trhc', m); if (c) c.onclick = () => { sset('trh', []); drawHist(); };
  }
  save(); drawHist(); if (I.value.trim()) drawDict($('#trdict', m), I.value, F.value);
};
function wbwHTML(text, from) {
  const g = wordByWord(text, from);
  return `<details class="blk" style="margin-top:10px"><summary><span class="bn">≈</span><span class="bt"><b>Word by word</b><span class="t-en small">Rough help from the course dictionary, not a translation</span></span><span class="bm">${g.filter(x => x.e).length}/${g.length}</span></summary><div class="bd"><div class="row" style="gap:6px">${g.map(x => `<span class="card" style="padding:6px 10px;margin:0"><b>${esc(x.w)}</b>${x.e ? ` → <span class="t-en">${esc(from === 'fi' ? x.e.en : x.e.fi)}</span>${from === 'fi' && x.e.ne ? ` <span class="t-ne">${esc(x.e.ne)}</span>` : ''}${x.how && from === 'fi' && tn(x.w) !== x.e.nfi ? ` <span class="small muted">(${esc(x.e.fi)})</span>` : ''}` : ' <span class="muted">?</span>'}</span>`).join('')}</div></div></details>`;
}
function drawDict(host, q, from) {
  if (!q.trim()) { host.innerHTML = ''; return; }
  const hits = dictSearch(q, from);
  host.innerHTML = `<h2>In the course · पाठ्यक्रममा <span class="tag">${hits.length}</span></h2>${hits.length ? `<div class="card">${hits.slice(0, 14).map(e => `<div class="tri">${sayBtn(e.fi)}<div class="tx">${e.w ? `<span class="small muted">${e.e || ''} word</span>` : ''}<span class="fi">${esc(e.fi)}</span>${e.sp ? `<span class="t-sp small">🗣 ${esc(e.sp)}</span>` : ''}${e.en ? `<span class="t-en">${esc(e.en)}</span>` : ''}${e.ne ? `<span class="t-ne">${esc(e.ne)}</span>` : ''}</div></div>`).join('')}</div>` : '<p class="empty">Nothing close in the course. Try one word, or the basic form (kauppa, not kaupassa). · एउटा शब्द वा मूल रूप खोज्नुहोस्।</p>'}`;
}

// --- Settings section
function trSettings(host) {
  const pwa = !!window.FI61_PWA; const ps = packState();
  const small = (navigator.deviceMemory && navigator.deviceMemory < 4) || Math.min(screen.width, screen.height) < 600;
  host.innerHTML = `<div class="row">${[['auto', 'Online first (best quality)'], ['offline', 'Offline only']].map(o => `<button type="button" class="chip" data-trm="${o[0]}" aria-pressed="${(SET.trMode || 'auto') === o[0]}">${o[1]}</button>`).join('')}</div>
  <p class="small muted">${CAP.sample ? 'Inside Claude, online translation uses Claude.' : 'In the phone app, online translation uses MyMemory, a free service with a daily limit.'} With “Offline only”, nothing you type leaves this device. The course dictionary is always on and needs no download.</p>
  ${pwa ? `<div class="row"><label class="small" for="mme">Email for MyMemory (optional, raises the daily limit)</label><input type="text" id="mme" inputmode="email" autocomplete="email" value="${esc(SET.mmEmail || '')}" style="flex:1;min-width:180px"></div>` : ''}
  <h3>Offline packs · अफलाइन प्याक</h3>
  ${!pwa ? '<div class="note small">Downloads work in the installed app (the GitHub Pages version, on phone or laptop). Inside Claude the translator works online with Claude, and the offline dictionary works everywhere.</div>' : '<p class="small muted">Use Wi‑Fi. A pack is stored in this browser only and works without internet after the download.</p>'}
  <div class="stack" style="margin-top:8px">${Object.entries(PACKS).map(([id, P]) => `<div class="card" data-pk="${id}"><div class="row" style="justify-content:space-between"><b>${esc(P.en)}</b><span class="tag" data-pst>${ps[id] === 'ready' ? 'Ready ✓' : 'Not downloaded'}</span></div><div class="small">${esc(P.fi)} · <span class="t-ne">${esc(P.ne)}</span></div><div class="small" style="margin-top:4px">About <b>${P.mb} MB</b> · ${P.pairs.map(p => p.replace('>', '→')).join(', ')}</div><p class="small muted" style="margin:4px 0">${esc(P.note[0])} <span class="t-ne">${esc(P.note[1])}</span></p>${!P.phone && small ? '<div class="note warn small">This looks like a phone. This pack will probably not fit in its memory. Use the Finnish ↔ English pack here and this one on a laptop.</div>' : ''}<div class="bar" data-pbar hidden style="margin:6px 0"><i></i></div><div class="row"><button type="button" class="btn sm ${ps[id] === 'ready' ? '' : 'pri'}" data-pdl ${pwa ? '' : 'disabled'}>${ps[id] === 'ready' ? 'Download again' : 'Download'}</button>${ps[id] === 'ready' ? '<button type="button" class="btn sm ghost" data-pdel>Delete</button><button type="button" class="btn sm ghost" data-ptest>Test</button>' : ''}<span class="small muted" data-pmsg></span></div></div>`).join('')}</div>
  <p class="small muted" id="stor" style="margin-top:8px"></p><p class="small muted" id="chromeTr"></p>`;
  if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(e => { $('#stor', host).textContent = `Storage used by this app in this browser: ${Math.round((e.usage || 0) / 1e6)} MB${e.quota ? ' of about ' + Math.round(e.quota / 1e6) + ' MB available' : ''}.`; }).catch(() => { });
  if ('Translator' in self) Promise.all([['fi', 'en'], ['en', 'fi'], ['fi', 'ne'], ['ne', 'fi']].map(([a, b]) => chromeAvail(a, b).then(s => `${a}→${b}: ${s === 'available' ? 'ready' : s === 'downloadable' || s === 'downloading' ? 'downloads on first use' : 'not available'}`))).then(l => { $('#chromeTr', host).textContent = 'This browser also has a built-in offline translator. ' + l.join(' · ') + '.'; });
  Object.keys(PACKS).forEach(async id => { if (ps[id] === 'ready') { const n = await packFilesCount(id); if (n === 0) { const box = $(`[data-pk="${id}"]`, host); if (box) { $('[data-pst]', box).textContent = 'Files missing'; $('[data-pst]', box).className = 'tag warn'; $('[data-pmsg]', box).textContent = 'The browser removed the files. Download again.'; } } } });
  if (TR.dl) showProg(TR.dl.id, TR.dl.pct);
  function showProg(id, pct) { const box = $(`[data-pk="${id}"]`, host); if (!box) return; const b = $('[data-pbar]', box); b.hidden = false; $('i', b).style.width = pct + '%'; $('[data-pst]', box).textContent = pct >= 100 ? 'Ready ✓' : 'Downloading ' + pct + '%'; $('[data-pdl]', box).disabled = pct < 100; }
  host.onclick = async e => {
    const mo = e.target.closest('[data-trm]'); if (mo) { SET.trMode = mo.dataset.trm; saveSet(); $$('[data-trm]', host).forEach(b => b.setAttribute('aria-pressed', b === mo)); return; }
    const box = e.target.closest('[data-pk]'); if (!box) return; const id = box.dataset.pk; const msg = $('[data-pmsg]', box);
    if (e.target.closest('[data-pdl]')) {
      if (TR.dl) { msg.textContent = 'Another download is running.'; return; }
      if (!online()) { msg.textContent = 'You are offline. Connect to Wi‑Fi first.'; return; }
      const btn = e.target.closest('[data-pdl]');
      if (!PACKS[id].phone && small && !btn.dataset.sure) { btn.dataset.sure = 1; btn.textContent = 'Tap again to download anyway'; return; }
      msg.textContent = 'Starting… keep this screen open.'; showProg(id, 0);
      try { await downloadPack(id, p => showProg(id, p)); msg.textContent = 'Done. Translations for these languages now work offline.'; toast('Offline pack ready · अफलाइन प्याक तयार'); trSettings(host); }
      catch (er) { console.error(er); msg.textContent = 'The download stopped (' + ((er && er.message) || 'error').slice(0, 80) + '). Check Wi‑Fi and free space, then tap Download again; finished files are kept.'; $('[data-pst]', box).textContent = 'Not complete'; $('[data-pdl]', box).disabled = false; }
    }
    if (e.target.closest('[data-pdel]')) { const d = e.target.closest('[data-pdel]'); if (!d.dataset.sure) { d.dataset.sure = 1; d.textContent = 'Tap again to delete'; return; } await deletePack(id); toast('Pack deleted · प्याक हटाइयो'); trSettings(host); }
    if (e.target.closest('[data-ptest]')) { msg.textContent = 'Testing…'; try { const [a, b] = PACKS[id].pairs[0].split('>'); const r = await packTranslate('Minä asun Helsingissä.', a, b, id); msg.textContent = 'Minä asun Helsingissä. → ' + r.text; } catch (er) { msg.textContent = 'Test failed: ' + ((er && er.message) || 'error').slice(0, 80); } }
  };
  const mme = $('#mme', host); if (mme) mme.onchange = () => { SET.mmEmail = mme.value.trim(); saveSet(); };
}
