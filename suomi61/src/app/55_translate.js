// ===== Kääntäjä · translator (online only, 8 Nov) =====
// Online engines: Claude inside the artifact, MyMemory in the phone app. No offline packs: they made the app heavy.
// The course dictionary ("In the course") still searches Finnish, English and Nepali words with no download.
const TR_L = Object.assign({ fi: ['suomi', 'Finnish'], en: ['englanti', 'English'] }, Object.fromEntries(Object.entries(HL_LANGS).map(([k, v]) => [k, [v.native, v.en]])));
const mmCode = k => (HL_LANGS[k] && HL_LANGS[k].mm) || k;
const trTarget = to => to === 'fi' ? 'standard written Finnish (kirjakieli)' : to === 'en' ? 'English' : to === 'ne' ? 'Nepali in Devanagari' : (HL_LANGS[to].claude || HL_LANGS[to].en);
const ENGINE_NAME = { claude: 'Online · Claude', mymemory: 'Online · MyMemory', none: 'Needs internet' };
const online = () => navigator.onLine !== false;
const withTimeout = (pr, ms, msg) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error(msg || 'timeout')), ms))]);

// --- online engines
async function claudeTranslate(text, from, to) {
  if (!CAP.sample) throw new Error('no claude');
  const fiSide = from === 'fi' || to === 'fi';
  const prompt = `Translate from ${TR_L[from][1]} to ${TR_L[to][1]} for an adult A1 learner of Finnish whose own language is ${hlName()} and who also knows English.
Return JSON only, in this shape: {"translation":"","spoken":"","note_en":"","note_hl":""}
- translation: natural, correct ${trTarget(to)}.
- spoken: ${fiSide ? 'the Finnish sentence as everyday Helsinki-region spoken Finnish (puhekieli); "" if it is the same' : '""'}.
- note_en: one short sentence on one useful point in the Finnish sentence (a case ending, verb form, k-p-t change or word choice), or "".
- note_hl: the same note in ${hlWrite()}, or "".
Text:
<<<${text}>>>`;
  try { const j = await CAP.sample.json(prompt, { modelTier: 'default' }); if (!j || !j.translation) throw new Error('empty'); return { text: String(j.translation), sp: j.spoken || '', note: j.note_en || '', noteNe: j.note_hl || '', engine: 'claude' }; }
  catch (e) { if (e && e.code === 'invalid_json' && e.text) return { text: e.text.trim(), engine: 'claude' }; throw e; }
}
const decodeHTML = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
async function myMemory(text, from, to) {
  const parts = text.length <= 480 ? [text] : text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
  const out = [];
  for (const p of parts) {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 12000);
    try {
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(p.slice(0, 480)) + '&langpair=' + mmCode(from) + '|' + mmCode(to) + (SET.mmEmail ? '&de=' + encodeURIComponent(SET.mmEmail) : '');
      const r = await fetch(url, { signal: ctl.signal });
      const j = await r.json();
      const t = j && j.responseData && j.responseData.translatedText;
      if (!t || +j.responseStatus !== 200 || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE/i.test(t) || j.quotaFinished) throw new Error(/WARNING/i.test(t || '') || j.quotaFinished ? 'limit' : 'failed');
      out.push(decodeHTML(t));
    } finally { clearTimeout(tm); }
  }
  return { text: out.join(' ').replace(/\s+/g, ' ').trim(), engine: 'mymemory' };
}
const trEngine = () => !online() ? null : CAP.sample ? 'claude' : window.FI61_PWA ? 'mymemory' : null;

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


// --- run one translation online
async function translateText(text, from, to) {
  const e = trEngine(); if (!e) return { text: '', engine: 'none', errs: [] };
  try { const r = await withTimeout(e === 'claude' ? claudeTranslate(text, from, to) : myMemory(text, from, to), 30000, 'timeout'); if (r && r.text) { r.errs = []; return r; } }
  catch (er) { return { text: '', engine: 'none', errs: [[e, (er && (er.code || er.message)) || 'failed']] }; }
  return { text: '', engine: 'none', errs: [[e, 'failed']] };
}
function planLabel() { const e = trEngine(); return e ? ENGINE_NAME[e] : online() ? 'Online translation is not available here' : 'You are offline'; }
const DICT_LANGS = ['fi', 'en', 'ne'];

// --- my translation cards
function saveTrCard(src, res, from, to) {
  const fi = from === 'fi' ? src : to === 'fi' ? res : ''; if (!fi) return false;
  const other = from === 'fi' ? res : src; const lang = from === 'fi' ? to : from;
  const id = 't:' + hash(fi + '|' + other);
  const mc = sget('mycards', {}); mc[id] = { fi, en: lang === 'en' ? other : '', ne: lang === SET.hl ? other : '' }; sset('mycards', mc);
  if (!cards()[id]) cardSet(id, 1);
  return true;
}

R.kaannos = m => {
  const st = Object.assign({ from: 'fi', to: 'en', text: '' }, sget('trlast', {}));
  const langOpt = sel => Object.entries(TR_L).map(([k, v]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${v[1]}${v[1] !== v[0] && k !== 'fi' && k !== 'en' ? ' · ' + v[0] : ''}</option>`).join('');
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Kääntäjä · Translator</h1><p class="lede">Finnish, English and the helper languages, in every direction. It works online. Without internet, “In the course” still finds words and sentences from the course. · फिनिस, अंग्रेजी र अरू भाषा।</p>
  <div class="card"><div class="row"><select id="trf" aria-label="From" style="flex:1;min-width:130px">${langOpt(st.from)}</select><button type="button" class="btn sm ghost" id="trsw" aria-label="Swap languages">⇄</button><select id="trt" aria-label="To" style="flex:1;min-width:130px">${langOpt(st.to)}</select></div>
  <textarea id="trin" maxlength="500" aria-label="Text to translate" placeholder="Kirjoita tähän · Type here · यहाँ लेख्नुहोस्" style="margin-top:10px;min-height:100px">${esc(st.text)}</textarea>
  <div class="keys" id="trkeys">${['ä', 'ö', 'å'].map(c => `<button type="button" class="key" data-k="${c}">${c}</button>`).join('')}<span class="small muted" style="margin-left:auto" id="trcnt"></span></div>
  <div class="row"><button type="button" class="btn pri" id="trgo">Translate · अनुवाद</button><button type="button" class="btn ghost" id="trsay" aria-label="Listen to the Finnish text">${IC_SAY} Listen</button><button type="button" class="btn ghost" id="trclr">Clear</button><span class="tag" id="trplan"></span></div></div>
  <div id="trout" style="margin-top:12px"></div>
  <div id="trdict"></div>
  <h2>Recent · हालैका</h2><div id="trhist"></div>
  <p class="small muted" style="margin-top:12px">Translation sends your text to ${CAP.sample ? 'Claude' : 'the MyMemory translation service'}. Settings: <a href="#asetukset">Settings → Languages</a>.</p>`;
  const F = $('#trf', m), T = $('#trt', m), I = $('#trin', m);
  const save = () => { st.from = F.value; st.to = T.value; st.text = I.value; sset('trlast', st); $('#trcnt', m).textContent = I.value.length + '/500'; $('#trsay', m).hidden = F.value !== 'fi' && T.value !== 'fi'; $('#trplan', m).textContent = planLabel(); };
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
    let r; try { r = await translateText(text, from, to); } catch (er) { r = { text: '', engine: 'none', errs: [['app', 'failed']] }; }
    drawResult(out, text, r, from, to);
    if (r.text) { const h = sget('trh', []).filter(x => !(x.s === text && x.f === from && x.t === to)); h.unshift({ s: text, r: r.text, f: from, t: to, e: r.engine }); sset('trh', h.slice(0, 30)); drawHist(); }
    drawDict($('#trdict', m), text, from);
  };
  $('#trgo', m).onclick = go1;
  function drawResult(out, src, r, from, to) {
    const errLine = r.errs && r.errs.length ? `<p class="small muted" style="margin:6px 0 0">${r.errs.map(([n, c]) => `${esc(ENGINE_NAME[n] || n)}: ${c === 'limit' ? 'daily free limit reached' : c === 'rate_limited' ? 'too many requests, try again in a minute' : 'not reachable'}`).join(' · ')}</p>` : '';
    if (!r.text) { out.innerHTML = `<div class="note warn"><b>No full translation right now.</b> ${!online() ? 'You are offline. Translation needs the internet.' : !trEngine() ? 'Online translation works in the installed phone app and inside Claude.' : 'The online service did not answer. Try again in a minute.'}${DICT_LANGS.includes(from) ? ' The course dictionary below shows the closest words and sentences.' : ''} · अनुवादका लागि इन्टरनेट चाहिन्छ।${errLine}</div>${DICT_LANGS.includes(from) && src.trim().split(/\s+/).length > 1 ? wbwHTML(src, from) : ''}`; return; }
    const toFi = to === 'fi';
    out.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="tag ${r.engine === 'claude' || r.engine === 'mymemory' ? 'src' : 'ok'}">${esc(ENGINE_NAME[r.engine] || r.engine)}</span><span class="small muted">${TR_L[from][1]} → ${TR_L[to][1]}</span></div>
      <div class="tri" style="border:0"><div class="tx"><span data-res="${esc(r.text)}" dir="auto" lang="${to}" style="font-size:1.25rem;font-weight:700;${to === SET.hl ? 'font-family:var(--font-ne)' : ''}">${esc(r.text)}</span>${r.sp ? `<span class="t-sp small">🗣 ${esc(r.sp)}</span>` : ''}${r.note ? `<span class="t-en small">💡 ${esc(r.note)}</span>` : ''}${r.noteNe ? `<span class="t-ne small">${esc(r.noteNe)}</span>` : ''}</div>${toFi ? sayBtn(r.text) + sayBtn(r.text, 1) : from === 'fi' ? sayBtn(src) : ''}</div>
      <div class="row" style="margin-top:6px"><button type="button" class="btn sm" data-copy>Copy</button>${from === 'fi' || to === 'fi' ? '<button type="button" class="btn sm" data-card>+ Flashcard</button>' : ''}<button type="button" class="btn sm ghost" data-back>Translate back ⇄</button></div>${errLine}
      ${r.engine === 'mymemory' ? '<p class="small muted" style="margin:6px 0 0">Machine translation: check important sentences with your teacher. · महत्त्वपूर्ण वाक्य शिक्षकसँग जाँच गराउनुहोस्।</p>' : ''}</div>${from === 'fi' && src.trim().includes(' ') ? wbwHTML(src, from) : ''}`;
    $('[data-copy]', out).onclick = async e => { try { await navigator.clipboard.writeText(r.text); e.target.textContent = 'Copied ✓'; } catch (er) { const s = $('[data-res]', out); const rg = document.createRange(); rg.selectNodeContents(s); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rg); e.target.textContent = 'Selected: press copy'; } };
    const cb = $('[data-card]', out); if (cb) cb.onclick = e => { e.target.textContent = saveTrCard(src, r.text, from, to) ? 'Added to flashcards ✓' : 'Only Finnish pairs can be cards'; };
    $('[data-back]', out).onclick = () => { F.value = to; T.value = from; I.value = r.text; save(); go1(); };
  }
  function drawHist() { const h = sget('trh', []); $('#trhist', m).innerHTML = h.length ? `<div class="card">${h.slice(0, 12).map((x, i) => `<button type="button" class="tri" data-h="${i}" style="width:100%;background:none;border-left:0;border-right:0;border-bottom:0;text-align:left;cursor:pointer;color:inherit"><span class="tx"><span class="small muted">${TR_L[x.f][1]} → ${TR_L[x.t][1]} · ${esc(ENGINE_NAME[x.e] || '')}</span><span class="fi">${esc(x.s)}</span><span dir="auto" lang="${x.t}" style="${x.t === SET.hl ? 'font-family:var(--font-ne)' : ''}">${esc(x.r)}</span></span></button>`).join('')}</div><div class="row" style="margin-top:6px"><button type="button" class="btn sm ghost" id="trhc">Clear history</button></div>` : '<p class="empty">Your translations will appear here, on this device only.</p>';
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
  if (!q.trim() || !DICT_LANGS.includes(from)) { host.innerHTML = ''; return; }
  const hits = dictSearch(q, from);
  host.innerHTML = `<h2>In the course · पाठ्यक्रममा <span class="tag">${hits.length}</span></h2>${hits.length ? `<div class="card">${hits.slice(0, 14).map(e => `<div class="tri">${sayBtn(e.fi)}<div class="tx">${e.w ? `<span class="small muted">${e.e || ''} word</span>` : ''}<span class="fi">${esc(e.fi)}</span>${e.sp ? `<span class="t-sp small">🗣 ${esc(e.sp)}</span>` : ''}${e.en ? `<span class="t-en">${esc(e.en)}</span>` : ''}${e.ne ? `<span class="t-ne">${esc(e.ne)}</span>` : ''}</div></div>`).join('')}</div>` : '<p class="empty">Nothing close in the course. Try one word, or the basic form (kauppa, not kaupassa). · एउटा शब्द वा मूल रूप खोज्नुहोस्।</p>'}`;
}

// --- Settings section
function trSettings(host) {
  const pwa = !!window.FI61_PWA;
  host.innerHTML = `<p class="small">${CAP.sample ? 'Inside Claude, translation uses Claude.' : pwa ? 'In the phone app, translation uses MyMemory, a free online service with a daily limit.' : 'Translation needs the installed phone app or Claude.'} It needs the internet. The app has no offline translation packs, so it stays small. · अनुवादका लागि इन्टरनेट चाहिन्छ।</p>
  ${pwa ? `<div class="row"><label class="small" for="mme">Email for MyMemory (optional, raises the daily limit)</label><input type="text" id="mme" inputmode="email" autocomplete="email" value="${esc(SET.mmEmail || '')}" style="flex:1;min-width:180px"></div>` : ''}`;
  const mme = $('#mme', host); if (mme) mme.onchange = () => { SET.mmEmail = mme.value.trim(); saveSet(); };
  // free the space of offline packs downloaded by earlier versions
  try { if ('caches' in self) { caches.delete('transformers-cache'); caches.delete('suomi61-lib'); } } catch (e) { }
  sset('packs', {});
}
