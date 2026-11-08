// ===== exercise items, answer checking, feedback, mistakes =====
const NEG = ['en', 'et', 'ei', 'emme', 'ette', 'eivät'];
const PRON = ['minä', 'sinä', 'hän', 'me', 'te', 'he'];
const PRON_EN = ['I', 'you', 'he / she', 'we', 'you (pl.)', 'they'];
const OLLA = ['olen', 'olet', 'on', 'olemme', 'olette', 'ovat'];
const backV = w => /[aouAOU]/.test(w);
const koKo = w => backV(w) ? 'ko' : 'kö';

// array items → objects
function toItem(a) {
  if (!Array.isArray(a)) return a;
  const t = a[0];
  if (t === 'mc') return { t, q: a[1], o: a[2], a: a[3], x: a[4], xn: a[5], tag: a[6] };
  if (t === 'fill') return { t, q: a[1], a: String(a[2]).split('|'), x: a[3], xn: a[4], tag: a[5] };
  if (t === 'tr') return { t, q: a[1], qn: a[2], a: String(a[3]).split('|'), tag: a[4] };
  if (t === 'ord') return { t, a: a[1], en: a[2], tag: 'wo' };
  if (t === 'lis') return { t, say: a[1], o: a[2], a: a[3], tag: 'ls' };
  if (t === 'say') return { t, q: a[1], qn: a[2], model: a[3] };
  return { t: 'mc', q: String(a), o: ['ok'], a: 0 };
}
const norm = s => String(s || '').toLowerCase().replace(/[‘’´`]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().replace(/^[\s"'«]+|[\s"'».!?,]+$/g, '').replace(/\s*([,?!.])\s*/g, '$1 ').trim();
const flat = s => norm(s).replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a');
function lev(a, b) { const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 3; const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
// returns 'ok' | 'aa' (ä/a mix-up) | 'almost' | 'bad'
function judge(given, answers) {
  const g = norm(given); if (!g) return 'bad';
  const ans = answers.map(norm);
  if (ans.includes(g)) return 'ok';
  // allow a left-out subject pronoun (minä / sinä …)
  const noPron = s => s.replace(/^(minä|sinä|hän|me|te|he) /, '');
  if (ans.map(noPron).includes(noPron(g))) return 'ok';
  if (ans.map(flat).includes(flat(g))) return 'aa';
  if (ans.some(a => a.length > 4 && lev(a, g) === 1)) return 'almost';
  return 'bad';
}

// mistakes notebook (Virhevihko) and error tags
function logMistake(item, given, right) {
  const tag = item.tag || 'wc';
  const t = sget('tags', {}); t[tag] = (t[tag] || 0) + 1; sset('tags', t);
  const th = sget('taghist', {}); const d = todayISO(); th[d] = th[d] || {}; th[d][tag] = (th[d][tag] || 0) + 1; sset('taghist', th);
  const m = sget('mist', []);
  const prompt = item.t === 'tr' ? item.q : item.t === 'lis' ? '🔊 ' + item.say : item.t === 'ord' ? item.en : String(item.q || '').replace(/<[^>]+>/g, '');
  const id = 'm' + hash(prompt + right);
  if (!m.find(x => x.id === id)) { m.unshift({ id, p: prompt, a: right, g: given, tag, x: item.x || '', xn: item.xn || '', d }); sset('mist', m.slice(0, 300)); }
  cardSet('m:' + id, 1);
}
const topTags = n => Object.entries(sget('tags', {})).sort((a, b) => b[1] - a[1]).slice(0, n);

// ===== the quiz runner =====
// opts: {title, key (score key), skill, day, onDone(score,total), back}
function runQuiz(host, rawItems, opts = {}) {
  const items = rawItems.map(toItem);
  const st = { i: 0, score: 0, total: 0, wrong: [], done: false };
  const scored = it => it.t !== 'say';
  const totalScored = items.filter(scored).length;
  const inp = () => $('#qin', host);
  function render() {
    if (st.i >= items.length) return finish();
    const it = items[st.i];
    let body = '';
    const head = `<div class="qhead"><span>${esc(opts.title || 'Harjoitus')} · ${st.i + 1}/${items.length}</span><span class="num">✓ ${st.score}</span></div><div class="bar"><i style="width:${Math.round(st.i / items.length * 100)}%"></i></div>`;
    if (it.t === 'mc' || it.t === 'lis') {
      const order = shuffle(it.o.map((o, k) => k));
      body = (it.t === 'lis' ? `<div class="qp">Listen and choose · <span class="ne">सुनेर छान्नुहोस्</span></div><div class="row">${sayBtn(it.say)} ${sayBtn(it.say, 1)}</div>` : `<div class="qp">${it.q}</div>`) +
        `<div class="opts" style="margin-top:10px">${order.map(k => `<button type="button" class="opt" data-k="${k}">${esc(it.o[k])}</button>`).join('')}</div>`;
    } else if (it.t === 'fill' || it.t === 'tr') {
      body = it.t === 'fill' ? `<div class="qp">${esc(it.q).replace(/___/g, '<span style="border-bottom:3px solid var(--accent);padding:0 1.4em"></span>')}</div>`
        : `<div class="qp">Translate into Finnish · <span class="t-en">${esc(it.q)}</span><br><span class="t-ne" style="font-size:1rem">${esc(it.qn || '')}</span></div>`;
      body += `<input type="text" id="qin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer"><div class="keys">${['ä', 'ö', 'å', 'Ä', 'Ö'].map(c => `<button type="button" class="key" data-key="${c}">${c}</button>`).join('')}</div><button type="button" class="btn pri" data-act="check">Check · जाँच</button>`;
    } else if (it.t === 'ord') {
      const toks = it.a.replace(/[.?!]$/, '').split(' ');
      it._toks = shuffle(toks.map((w, k) => ({ w, k }))); it._ans = [];
      body = `<div class="qp">Put the words in order · <span class="t-en">${esc(it.en)}</span></div><div class="ordans" id="ordans"></div><div class="tiles">${it._toks.map((t, k) => `<button type="button" class="tok" data-t="${k}">${esc(t.w)}</button>`).join('')}</div><div class="row" style="margin-top:10px"><button type="button" class="btn ghost sm" data-act="undo">↶ Undo</button><button type="button" class="btn pri" data-act="check">Check · जाँच</button></div>`;
    } else if (it.t === 'say') {
      body = `<div class="qp">🗣 Say it aloud · <span class="t-en">${esc(it.q)}</span><br><span class="t-ne" style="font-size:1rem">${esc(it.qn || '')}</span></div><p class="muted small">Speak first, then show the model and compare.</p><button type="button" class="btn" data-act="model">Show the model · नमूना</button><div id="model" hidden class="note" style="margin-top:10px">${tri(it.model, '', '')}</div><div class="row" style="margin-top:10px"><button type="button" class="btn pri" data-act="next">I said it · भनेँ →</button></div>`;
    }
    host.innerHTML = `<div class="quiz">${head}${body}<div id="fb"></div><div id="nx"></div></div>`;
    if (it.t === 'lis') setTimeout(() => speak(it.say), 250);
    const i = inp(); if (i) { i.focus({ preventScroll: true }); i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (!st.checked) check(); else next(); } }); }
    st.checked = false;
  }
  function feedback(kind, it, right, given) {
    const V = { ok: ['Oikein!', 'Right!', 'सही!'], almost: ['Melkein!', 'Almost!', 'लगभग ठीक!'], aa: ['Melkein!', 'Almost!', 'लगभग ठीक!'], bad: ['Ei aivan.', 'Not quite.', 'ठ्याक्कै होइन।'] };
    const v = V[kind]; const cls = kind === 'ok' ? 'ok' : (kind === 'bad' ? 'bad' : 'almost');
    let why = '';
    if (kind === 'aa') why = `<div>ä and a are different letters (sää = weather, saa = gets). · ä र a फरक अक्षर हुन्।</div>`;
    if (kind !== 'ok') why += `<div>Right answer · सही उत्तर: <b>${esc(right)}</b> ${sayBtn(right)}</div>`;
    if (it.x) why += `<div class="t-en">${esc(it.x)}</div>`;
    if (it.xn) why += `<div class="t-ne">${esc(it.xn)}</div>`;
    if (kind !== 'ok' && opts.example) { const ex = opts.example(); if (ex) why += `<div class="small" style="margin-top:6px">One more example: <b>${esc(ex[0])}</b> <span class="t-en">· ${esc(ex[1])}</span></div>`; }
    $('#fb', host).innerHTML = `<div class="fb ${cls}"><b class="v">${v[0]} – ${v[1]} – <span class="ne">${v[2]}</span></b>${why}</div>`;
    $('#nx', host).innerHTML = `<div class="row" style="margin-top:10px"><button type="button" class="btn pri" data-act="next">${st.i + 1 < items.length ? 'Next · अर्को →' : 'See result · नतिजा'}</button></div>`;
    $('[data-act=next]', host).focus({ preventScroll: true });
  }
  function grade(it, kind, right, given) {
    st.checked = true; st.total++;
    if (kind === 'ok') st.score++;
    else { if (kind === 'aa') it.tag = 'aa'; st.wrong.push({ it, right, given }); logMistake(it, given, right); }
    feedback(kind, it, right, given);
  }
  function check(k) {
    const it = items[st.i]; if (st.checked) return;
    if (it.t === 'mc' || it.t === 'lis') {
      const ok = +k === it.a; $$('.opt', host).forEach(b => { b.disabled = true; if (+b.dataset.k === it.a) b.classList.add('right'); else if (+b.dataset.k === +k) b.classList.add('wrongp'); });
      if (it.t === 'lis') { it.x = it.x || ('You heard: ' + it.say); }
      grade(it, ok ? 'ok' : 'bad', it.o[it.a], it.o[k]);
    } else if (it.t === 'fill' || it.t === 'tr') {
      const g = inp().value; if (!g.trim()) { inp().focus(); return; }
      inp().disabled = true; grade(it, judge(g, it.a), it.a[0], g);
    } else if (it.t === 'ord') {
      const g = it._ans.map(k => it._toks[k].w).join(' ');
      const kind = norm(g) === norm(it.a.replace(/[.?!]$/, '')) ? 'ok' : 'bad'; grade(it, kind, it.a, g);
    }
  }
  function next() { st.i++; render(); }
  function finish() {
    st.done = true; bumpStreak();
    const pct = totalScored ? Math.round(st.score / totalScored * 100) : 100;
    if (opts.key) { const sc = sget('scores', []); sc.push({ k: opts.key, s: st.score, t: totalScored, p: pct, d: todayISO(), sk: opts.skill || 'grammar', day: opts.day || null }); sset('scores', sc.slice(-500)); }
    const pass = pct >= 80;
    host.innerHTML = `<div class="quiz result"><p class="eyebrow">${esc(opts.title || 'Result')}</p><div class="row"><span class="big">${pct}%</span><span class="tag ${pass ? 'ok' : 'warn'}">${st.score}/${totalScored} · ${pass ? 'Passed 80% · पास' : 'Below 80% · ८०% भन्दा कम'}</span></div>
    ${st.wrong.length ? `<h3>Check these · यी हेर्नुहोस्</h3>${st.wrong.map(w => `<div class="tri"><div class="tx"><span class="t-en small">${esc(w.it.t === 'tr' ? w.it.q : w.it.t === 'lis' ? '🔊 ' + w.it.say : w.it.t === 'ord' ? w.it.en : String(w.it.q || '').replace(/<[^>]+>/g, ''))}</span><span><span class="wrong">${esc(w.given || '–')}</span> → <span class="right">${esc(w.right)}</span></span></div>${sayBtn(w.right)}</div>`).join('')}<p class="small muted" style="margin-top:8px">These went to your mistake notebook and to flashcard box 1.</p>` : '<p>No mistakes. Erinomaista! · उत्कृष्ट!</p>'}
    <div class="row" style="margin-top:12px">${!pass && st.wrong.length ? '<button type="button" class="btn pri" data-act="repair">20-min repair · मर्मत अभ्यास</button>' : ''}<button type="button" class="btn" data-act="again">Try again · फेरि</button>${opts.back ? '<button type="button" class="btn ghost" data-act="back">Done · सकियो</button>' : ''}</div></div>`;
    opts.onDone && opts.onDone(st.score, totalScored, pct);
  }
  host.onclick = e => {
    const sb = e.target.closest('[data-say]'); if (sb) { speak(sb.dataset.say, !!sb.dataset.slow); return; }
    const b = e.target.closest('button'); if (!b) return;
    const it = items[st.i];
    if (b.classList.contains('opt')) return check(b.dataset.k);
    if (b.dataset.key) { const i = inp(); if (i) { const p = i.selectionStart ?? i.value.length; i.value = i.value.slice(0, p) + b.dataset.key + i.value.slice(i.selectionEnd ?? p); i.focus(); i.setSelectionRange(p + 1, p + 1); } return; }
    if (b.classList.contains('tok') && !st.checked) { if (b.classList.contains('used')) return; b.classList.add('used'); it._ans.push(+b.dataset.t); $('#ordans', host).innerHTML = it._ans.map(k => `<span class="tok">${esc(it._toks[k].w)}</span>`).join(''); return; }
    const a = b.dataset.act;
    if (a === 'undo' && !st.checked) { const k = it._ans.pop(); if (k != null) { $(`.tok[data-t="${k}"]`, host).classList.remove('used'); $('#ordans', host).innerHTML = it._ans.map(k => `<span class="tok">${esc(it._toks[k].w)}</span>`).join(''); } }
    if (a === 'check') check();
    if (a === 'next') next();
    if (a === 'model') { $('#model', host).hidden = false; speak(it.model); }
    if (a === 'again') { st.i = 0; st.score = 0; st.total = 0; st.wrong = []; items.forEach(x => { delete x._ans; }); if (opts.regen) { const fresh = opts.regen().map(toItem); items.splice(0, items.length, ...fresh); } render(); }
    if (a === 'repair') { const tags = uniq(st.wrong.map(w => w.it.tag)); go('practice'); setTimeout(() => startRepair(tags), 50); }
    if (a === 'back') opts.back();
  };
  render();
  return st;
}

// ===== generators for step 9 and the daily check =====
const VT1 = () => VERBS_LIST.filter(v => v.vt === 1);
let VERBS_LIST = [];
const GEN = {
  pairs(n = 8) { return pick(LEN_PAIRS.filter(p => p[0] !== 'mies'), n).map(p => { const two = Math.random() < .5; return { t: 'lis', say: two ? p[3] : p[0], o: [p[0] + ' (' + p[1] + ')', p[3] + ' (' + p[4] + ')'], a: two ? 1 : 0, tag: 'ls', x: `${p[0]} = ${p[1]} · ${p[3]} = ${p[4]}. A double letter is held twice as long, like Nepali पक्का.`, xn: `${p[0]} = ${p[2]} · ${p[3]} = ${p[5]}` }; }); },
  alpha(n = 6) { return pick(ALPHA.filter(a => a[0].length === 1 && !'qwzå'.includes(a[0])), n).map(a => { const wrong = pick(ALPHA.filter(x => x[0] !== a[0]), 2).map(x => x[1]); const o = shuffle([a[1], ...wrong]); return { t: 'mc', q: `How do you say the letter <b>${a[0].toUpperCase()}</b>?`, o, a: o.indexOf(a[1]), tag: 'sp', x: `${a[0].toUpperCase()} = ${a[1]}.`, xn: 'फिनिस अक्षरको नाम।' }; }); },
  vh(n = 8) {
    const W = [['talo', 'ssa'], ['koulu', 'ssa'], ['kirjasto', 'ssa'], ['Espoo', 'ssa'], ['auto', 'ssa'], ['metsä', 'ssä'], ['kylä', 'ssä'], ['työ', 'ssä'], ['Kemi', 'ssä'], ['tie', 'llä'], ['yliopisto', 'ssa'], ['pöydä', 'llä'], ['Pori', 'ssa']];
    const V = [['puhut', 'ko'], ['asut', 'ko'], ['olet', 'ko'], ['ymmärrät', 'kö'], ['tiedät', 'kö'], ['syöt', 'kö'], ['näet', 'kö'], ['osaat', 'ko']];
    const fixPori = ([w, e]) => w === 'Pori' ? [w, 'ssa'] : [w, e];
    const a = pick(W, Math.ceil(n / 2)).map(fixPori).map(([w, e]) => { const o = e.endsWith('ä') ? [w + e.replace('ä', 'a'), w + e] : [w + e, w + e.replace('a', 'ä')]; const right = w + e; const sh = shuffle(o); return { t: 'mc', q: `${w} + -ssa/-ssä (-lla/-llä) →`, o: sh, a: sh.indexOf(right), tag: 'vh', x: backV(w) ? `${w} has a, o or u → back ending.` : `${w} has only front or neutral vowels → front ending.`, xn: 'शब्दको स्वरअनुसार प्रत्यय।' }; });
    const b = pick(V, Math.floor(n / 2)).map(([w, e]) => { const right = w + e; const sh = shuffle([w + 'ko', w + 'kö']); return { t: 'mc', q: `${w} + -ko / -kö → ?`, o: sh, a: sh.indexOf(right), tag: 'vh', x: e === 'ko' ? 'a, o or u in the word → -ko.' : 'ä, ö, y (or only e, i) → -kö.', xn: e === 'ko' ? 'a/o/u → -ko।' : 'ä/ö/y → -kö।' }; });
    return shuffle([...a, ...b]);
  },
  olla(n = 8) { return Array.from({ length: n }, () => { const p = rnd(0, 5); return Math.random() < .5 ? { t: 'fill', q: `${PRON[p]} ___ (olla)`, a: [OLLA[p]], tag: 've', x: `${PRON[p]} → ${OLLA[p]}.`, xn: `${PRON[p]} → ${OLLA[p]}।` } : (() => { const o = shuffle(uniq([OLLA[p], ...pick(OLLA.filter(x => x !== OLLA[p]), 2)])); return { t: 'mc', q: `${PRON[p].replace(/^./, c => c.toUpperCase())} ___ kotona.`, o, a: o.indexOf(OLLA[p]), tag: 've', x: `${PRON[p]} → ${OLLA[p]}.`, xn: `${PRON[p]} → ${OLLA[p]}।` }; })(); }); },
  num20(n = 8) { return Array.from({ length: n }, () => { const k = rnd(0, 20); return Math.random() < .5 ? { t: 'lis', say: numFi(k), o: shuffle(uniq([String(k), String((k + rnd(1, 5)) % 21), String((k + rnd(6, 12)) % 21)])), a: -1, tag: 'wc', _n: String(k) } : { t: 'fill', q: `${k} = ___ (write the word)`, a: [numFi(k)], tag: 'sp', x: `${k} = ${numFi(k)}.`, xn: 'संख्या शब्दमा।' }; }).map(fixLis); },
  num100(n = 8) { return Array.from({ length: n }, () => { const k = rnd(20, 100); return Math.random() < .6 ? { t: 'lis', say: numFi(k), o: shuffle(uniq([String(k), String(k % 10 * 10 + Math.floor(k / 10)), String(Math.min(100, k + 10))])), a: -1, tag: 'wc', _n: String(k) } : { t: 'fill', q: `${k} = ___ (one word)`, a: [numFi(k)], tag: 'sp', x: `${k} = ${numFi(k)}. Tens + ones in one word.`, xn: 'दहाइ र एकाइ एउटै शब्दमा।' }; }).map(fixLis); },
  price(n = 8) { const P = [50, 120, 180, 200, 220, 250, 290, 320, 350, 390, 450, 490, 600, 750, 990, 1250, 1590]; return pick(P, n).map(c => { const others = pick(P.filter(x => x !== c), 2); const o = shuffle([c, ...others]).map(priceStr); return Math.random() < .6 ? { t: 'lis', say: priceFi(c), o, a: o.indexOf(priceStr(c)), tag: 'wc', x: `${priceStr(c)} = ${priceFi(c)}.` } : (() => { const ow = shuffle([c, ...others]); return { t: 'mc', q: `${priceStr(c)} =`, o: ow.map(priceFi), a: ow.indexOf(c), tag: 'part', x: `${priceStr(c)} = ${priceFi(c)}. After 2+ use euroa / senttiä.`, xn: '२ वा बढीपछि euroa / senttiä।' }; })(); }); },
  kpt(n = 10) { const all = KPT_TYPES.flatMap(t => t[5].map(e => [...e, t[0]])); return pick(all, n).map(e => ({ t: 'fill', q: `${e[0]} + ${e[1]} = ___ (${e[3]})`, a: [e[2]], tag: 'kpt', x: `${e[5]}: ${e[0]} → ${e[2]}.`, xn: `${e[4]}।` })); },
  country(n = 8) {
    const C = [['Suomi', 'Suomesta', 'suomalainen', 'suomea', 'Finland', 'Finnish'], ['Nepal', 'Nepalista', 'nepalilainen', 'nepalia', 'Nepal', 'Nepali'], ['Intia', 'Intiasta', 'intialainen', 'hindiä', 'India', 'Hindi'], ['Ruotsi', 'Ruotsista', 'ruotsalainen', 'ruotsia', 'Sweden', 'Swedish'], ['Kiina', 'Kiinasta', 'kiinalainen', 'kiinaa', 'China', 'Chinese'], ['Viro', 'Virosta', 'virolainen', 'viroa', 'Estonia', 'Estonian'], ['Saksa', 'Saksasta', 'saksalainen', 'saksaa', 'Germany', 'German'], ['Englanti', 'Englannista', 'englantilainen', 'englantia', 'England', 'English']];
    return Array.from({ length: n }, (_, i) => { const c = C[rnd(0, C.length - 1)]; const k = i % 3; if (k === 0) return { t: 'fill', q: `Olen kotoisin ___ (from ${c[4]}).`, a: [c[1]], tag: 'case', x: `From ${c[4]} = ${c[1]}.`, xn: '-sta/-stä = बाट।' }; if (k === 1) return { t: 'fill', q: `Hän on ___ (a person from ${c[4]}).`, a: [c[2]], tag: 'wc', x: `${c[2]}, small letter.`, xn: 'राष्ट्रियता सानो अक्षरबाट।' }; return { t: 'fill', q: `Puhun ___ (${c[5]}).`, a: [c[3]], tag: 'part', x: `puhua + ${c[3]}.`, xn: 'भाषा: -a/-ä।' }; });
  },
  vt1(n = 10) { return Array.from({ length: n }, () => { const v = pick(VT1(), 1)[0]; const p = rnd(0, 5); const weak = v.k && [0, 1, 3, 4].includes(p); return { t: 'fill', q: `${PRON[p]} ___ (${v.fi})`, a: [v.vf[p]], tag: weak ? 'kpt' : 've', x: `${v.fi} → ${PRON[p]} ${v.vf[p]}.${weak ? ' Weak form here (' + v.k + ').' : ''}`, xn: `${v.ne} → ${PRON[p]} ${v.vf[p]}।` }; }); },
  neg(n = 10) { return Array.from({ length: n }, () => { const v = pick(VERBS_LIST.filter(v => v.vt <= 2 || v.fi === 'olla'), 1)[0]; const p = rnd(0, 5); const ans = NEG[p] + ' ' + v.vf[0].slice(0, -1); return { t: 'fill', q: `Make it negative: ${PRON[p]} ${v.vf[p]} → ${PRON[p]} ___`, a: [ans], tag: 've', x: `${PRON[p]} → ${NEG[p]} + ${v.vf[0].slice(0, -1)} (minä form without -n).`, xn: `${NEG[p]} + क्रिया (अन्त्य बिना)।` }; }); },
  ko(n = 8) { return Array.from({ length: n }, () => { const v = pick(VERBS_LIST.filter(v => v.vt <= 3), 1)[0]; const p = Math.random() < .6 ? 1 : 2; const f = v.vf[p]; const ans = f + koKo(v.fi); return { t: 'fill', q: `Make a question: ${PRON[p]} ${f} → ___ ${PRON[p]}?`, a: [ans, ans + ' ' + PRON[p]], tag: 'vh', x: `Verb first + -${koKo(v.fi)}: ${ans} ${PRON[p]}?`, xn: `क्रिया अगाडि + -${koKo(v.fi)}।` }; }); },
  qw(n = 8) {
    const Q = [['Espoossa.', 'Missä'], ['Nepalista.', 'Mistä'], ['Kauppaan.', 'Mihin'], ['Huomenna.', 'Milloin'], ['Koska asun Suomessa.', 'Miksi'], ['Bussilla.', 'Miten'], ['Kaksi euroa.', 'Paljonko'], ['Hän on opettaja Mari.', 'Kuka'], ['Se on sanakirja.', 'Mikä'], ['Luen kirjaa.', 'Mitä'], ['Annan.', 'Kenen'], ['Kylmä ja tuulinen.', 'Millainen'], ['Turusta.', 'Mistä'], ['Kirjastoon.', 'Mihin'], ['Kello kahdeksan.', 'Milloin'], ['Kotona.', 'Missä']];
    return pick(Q, n).map(([ans, w]) => { const o = shuffle(uniq([w, ...pick(['Missä', 'Mistä', 'Mihin', 'Milloin', 'Miksi', 'Miten', 'Paljonko', 'Kuka', 'Mikä', 'Mitä'].filter(x => x !== w), 2)])); return { t: 'mc', q: `Answer: <b>${ans}</b> Which question word?`, o, a: o.indexOf(w), tag: 'wc', x: `${ans} answers ${w}?`, xn: 'जवाफको अन्त्य हेर्नुहोस्।' }; });
  },
  time(n = 6) { return Array.from({ length: n }, () => { const h = rnd(1, 12), m = [0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55][rnd(0, 11)]; const right = h + '.' + pad(m); const others = uniq([right, (m === 30 ? HOUR_NEXT(h) : h) + '.' + pad(m === 30 ? 30 : (m + 30) % 60), (h % 12 + 1) + '.' + pad(m)]); const o = shuffle(others); return { t: 'lis', say: clockFi(h, m), o, a: o.indexOf(right), tag: 'wc', x: `${clockFi(h, m)} = ${right}. puoli neljä = 3.30 (half towards four).` }; }); }
};
function fixLis(it) { if (it.t === 'lis' && it.a === -1) { if (!it.o.includes(it._n)) it.o[0] = it._n; it.o = shuffle(it.o); it.a = it.o.indexOf(it._n); it.x = `You heard ${it.say} = ${it._n}.`; } return it; }
function wordItems(words, n = 6) {
  const pool = words.filter(w => w.en && !/[.!?]$/.test(w.fi));
  return pick(pool, n).map((w, i) => {
    const others = pick(WORDS.filter(x => x.g === w.g && x.id !== w.id && x.en !== w.en), 2);
    if (i % 2 === 0) { const o = shuffle([w.en, ...others.map(x => x.en)]); return { t: 'mc', q: `<b>${esc(w.fi)}</b> ${sayBtn(w.fi)} means`, o, a: o.indexOf(w.en), tag: 'wc', x: `${w.fi} = ${w.en}.`, xn: `${w.fi} = ${w.ne}।` }; }
    const o = shuffle([w.fi, ...others.map(x => x.fi)]); return { t: 'mc', q: `Which word means <b>${esc(w.en)}</b> · <span class="ne">${esc(w.ne)}</span>?`, o, a: o.indexOf(w.fi), tag: 'wc', x: `${w.en} = ${w.fi}.`, xn: `${w.ne} = ${w.fi}।` };
  });
}
// full step-9 set for a lesson: hand-written items + generated ones (30–50)
function lessonSet(L) { const hand = L.s9.map(toItem); const gs = (L.gen || []).filter(g => GEN[g]); const per = gs.length ? Math.max(8, Math.ceil((36 - hand.length) / gs.length)) : 0; const gen = gs.flatMap(g => GEN[g](per)); const all = [...hand, ...gen]; const says = all.filter(x => x.t === 'say'); return [...shuffle(all.filter(x => x.t !== 'say')).sort((a, b) => order(a) - order(b)), ...says]; }
const order = it => ({ lis: 0, mc: 1, fill: 2, ord: 3, tr: 4 })[it.t] ?? 5; // recognise → choose → fill → build → translate → say
