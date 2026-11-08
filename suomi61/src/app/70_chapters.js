// ===== Kappaleet · chapter-wise course (6 Nov) =====
const CH_PARTS = [
  ['overview', 'Yleiskuva', 'Overview', 'सारांश'], ['words', 'Sanasto', 'Words', 'शब्द'], ['grammar', 'Kielioppi', 'Grammar', 'व्याकरण'],
  ['read', 'Lukeminen', 'Reading', 'पढाइ'], ['listen', 'Kuuntelu', 'Listening', 'सुनाइ'], ['speak', 'Puhuminen', 'Speaking', 'बोलाइ'],
  ['write', 'Kirjoittaminen', 'Writing', 'लेखाइ'], ['puhe', 'Puhekieli', 'Spoken Finnish', 'बोलचाल'], ['test', 'Testi', 'Chapter test', 'परीक्षा']];
const chById = id => CHAPTERS.find(c => c.id === id);
const chWords = ch => WORDS.filter(w => w.ch === ch.n);
const chRange = ch => fmtDay(ch.days[0]) + ' – ' + fmtDay(ch.days[1]);
const chItems = () => sget('chi', {});
function markItem(ch, part, key, score) { const o = chItems(); const k = ch.id + ':' + part + ':' + key; o[k] = Math.max(o[k] || 0, score == null ? 100 : score); sset('chi', o); bumpStreak(); }
const itemDone = (ch, part, key) => (chItems()[ch.id + ':' + part + ':' + key] || 0) >= 60;
const bestKey = k => { const s = sget('scores', []).filter(x => x.k === k); return s.length ? Math.max(...s.map(x => x.p)) : null; };

// resolve a content pointer into something the chapter page can list and open
function srcItem(s, ch, part) {
  const key = s.t + (s.id || s.d || '') + (s.e ? s.e + s.i : '');
  if (s.t === 'long') { const L = LONG[ch.id]; return { key, h: L.h, tag: part === 'listen' ? 'Story · listen first' : 'Long story', src: 'SM1-linjattu', open: (h, d) => renderLong(h, L, d, part === 'listen') }; }
  if (s.t === 'story') { const S = STORIES.find(x => x.id === s.id); return S && { key, h: [S.fi, S.en, S.ne], tag: 'Story · ' + S.lvl, src: 'Lisä', open: (h, d) => readText(h, { h: [S.fi, S.en, S.ne], src: 'Lisä', lines: S.lines, open: S.q }, null, d) }; }
  if (s.t === 'day') {
    const D = DAYS[s.d]; if (!D) return null;
    if (part === 'read') return { key, h: D.read.h, tag: 'Day ' + s.d + ' text', src: D.read.src, open: (h, d) => readText(h, D.read, s.d, d) };
    if (part === 'write') return { key: 'd' + s.d, h: D.write.h, tag: 'Day ' + s.d, src: 'SM1-linjattu', wid: 'd' + s.d, W: D.write };
    if (part === 'listen') { if (D.lis.dlg) return srcItem({ t: 'dlg', id: D.lis.dlg }, ch, part); return { key, h: D.lis.h, tag: 'Day ' + s.d + ' listening', src: 'Lisä', open: (h, d) => listenText(h, D.lis, s.d, d) }; }
  }
  if (s.t === 'dlg') { const D = DIALOGUES.find(x => x.id === s.id); return D && { key, h: [D.fi, D.en, D.ne], tag: 'Dialogue ' + D.n, src: D.src, dlg: D.id, open: (h, d) => { listenText(h, { h: [D.fi, D.en, D.ne], lines: D.lines.map(l => [l[0], l[1], l[3], l[4]]), q: D.q }, null, d); h.insertAdjacentHTML('beforeend', `<div class="row" style="margin-top:10px"><a class="btn" href="#dlg-${D.id}">🎭 Role-play, key phrases and spoken version</a></div>`); } }; }
  if (s.t === 'place') { const P = PLACES.find(x => x.id === s.id); return P && { key, h: [P.fi, P.en, P.ne], tag: 'Situation', src: 'Lisä', href: '#place-' + P.id, e: P.e }; }
  if (s.t === 'exr') { const T = EXAMS.find(e => e.id === s.e).read[s.i]; return { key, h: T.h, tag: 'Exam-style text', src: 'Lisä', open: (h, d) => readText(h, { h: T.h, src: 'Lisä', lines: T.t, q: T.q.map(q => ['mc', q[0], q[1], q[3], q[4]]) }, null, d) }; }
  if (s.t === 'exl') { const T = EXAMS.find(e => e.id === s.e).listen[s.i]; return { key, h: T.h, tag: 'Exam-style listening', src: 'Lisä', open: (h, d) => listenText(h, { h: T.h, lines: T.l, q: T.q.map(q => ['mc', q[0], q[1], q[3], q[4]]) }, null, d) }; }
  if (s.t === 'w') { const o = WRITING.find(w => w[0] === s.id); return o && { key: o[0], h: [o[2], o[3], ''], tag: 'Writing · ' + o[4], src: 'Lisä', wid: o[0], W: { h: [o[2], o[3], ''], task: [o[5], '', ''], points: o[6], words: [], check: ['Verb endings match the person.', 'Partitive after numbers 2+.', 'Capital letters only for names.'], model: o[7], modelEn: o[8] } }; }
  if (s.t === 'cw') { const W = CH_WRITE[s.id]; return W && { key: 'c' + s.id, h: W.h, tag: 'Chapter task', src: 'SM1-linjattu', wid: 'c' + s.id, W }; }
  return null;
}
const partItems = (ch, part) => {
  let list = part === 'read' ? ch.read : part === 'listen' ? [...ch.listen, { t: 'long' }] : part === 'write' ? ch.write : [];
  return list.map(s => srcItem(s, ch, part)).filter(Boolean);
};
function partProgress(ch, part) {
  if (part === 'words') { const c = cards(); const ws = chWords(ch); return ws.length ? ws.filter(w => c['w:' + w.id] && c['w:' + w.id].b >= 3).length / ws.length : 0; }
  if (part === 'grammar') { const ld = sget('ldone', {}); const all = [...ch.core.map(id => !!ld[id]), ...ch.ref.map(id => itemDone(ch, 'grammar', id))]; return all.length ? all.filter(Boolean).length / all.length : 0; }
  if (part === 'write') { const it = partItems(ch, 'write'); return it.length ? it.filter(i => (sget('w:' + i.wid, '') || '').trim().length > 20).length / it.length : 0; }
  if (part === 'read' || part === 'listen') { const it = partItems(ch, part); return it.length ? it.filter(i => itemDone(ch, part, i.key)).length / it.length : 0; }
  if (part === 'speak') { const keys = ['qa', 'talk', 'shadow', 'roles']; return keys.filter(k => itemDone(ch, 'speak', k)).length / keys.length; }
  if (part === 'puhe') return itemDone(ch, 'puhe', 'game') ? 1 : 0;
  if (part === 'test') { const b = bestKey('chtest:' + ch.id); return b == null ? 0 : Math.min(1, b / 80); }
  return 0;
}
const chProgress = ch => { const ps = CH_PARTS.slice(1).map(p => partProgress(ch, p[0])); return ps.reduce((a, b) => a + b, 0) / ps.length; };
const ring = (p, size = 44, color) => { const r = size / 2 - 4, c = 2 * Math.PI * r; return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${Math.round(p * 100)}% done"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="4"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color || 'var(--ok)'}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(p * c).toFixed(1)} ${c.toFixed(1)}" ${p <= 0 ? 'opacity="0"' : ''} transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="${size / 3.6}" font-weight="800" fill="var(--ink)">${Math.round(p * 100)}</text></svg>`; };

// ===== the hub =====
R.chapters = m => {
  const cur = chOfDay(todayDay());
  m.innerHTML = `<p class="eyebrow">Suomen mestari 1 · Oma suomi 1</p><h1>Kappaleet · Chapters</h1><p class="lede">Ten chapters in book order. Every chapter has the same parts: words, grammar, a long story, listening, speaking, writing, spoken Finnish and a chapter test. · हरेक अध्यायमा शब्द, व्याकरण, कथा, सुनाइ, बोलाइ, लेखाइ र परीक्षा छ।</p>
  <div class="chgrid">${CHAPTERS.map(ch => { const p = chProgress(ch); const isCur = ch === cur; return `<a class="chcard${isCur ? ' cur' : ''}" href="#ch-${ch.id}" style="--chc:${ch.color}"><span class="chnum">${ch.n}</span><span class="chtx"><span class="row" style="gap:6px">${isCur ? '<span class="tag src">Now · अहिले</span>' : ''}<span class="tag">${ch.mod}</span><span class="small muted">${chRange(ch)}</span></span><b>${esc(ch.fi)}</b><span class="t-en small">${esc(ch.en)}</span><span class="t-ne small">${esc(ch.ne)}</span><span class="small muted">${chWords(ch).length} words · ${LONG[ch.id] ? 'long story' : ''} · ${ch.listen.length + 1} listening</span></span>${ring(p, 48, ch.color)}</a>`; }).join('')}</div>
  <a class="lausebig" href="#lause"><span class="chnum">Aa</span><span class="tx"><span class="eyebrow" style="margin:0">New · Sentence lab</span><b>Lauseet: build, ask, talk</b><span class="small">SVO, all the endings (-ssa -sta -lla -lta -lle -n -t, partitive), questions, and how a conversation grows. · वाक्य बनाउने र प्रश्न सोध्ने</span></span><span class="go">→</span></a>
  <h2>Library · सबै सामग्री</h2><div class="grid sm">${[['lause', 'Lauseet', 'Sentence lab: build & ask'], ['glib', 'Kielioppi', 'Grammar library'], ['words', 'Sanasto', 'All ' + WORDS.length + ' words'], ['kpt', 'k-p-t', 'Core skill: consonant gradation'], ['arki', 'Arjessa', 'Dialogues & daily life'], ['puhe', 'Puhekieli', 'Spoken Finnish'], ['read', 'Lue ja kuuntele', 'All texts'], ['map', 'Kurssi', '61-day course map'], ['kaannos', 'Kääntäjä', 'Translator']].map(t => `<a class="tile" href="#${t[0]}"><b>${t[1]}</b><span class="muted">${t[2]}</span></a>`).join('')}</div>`;
};
R.learn = R.chapters;

// ===== one chapter =====
R.ch = (m, arg) => {
  const [cid, part0] = String(arg || 'k1').split('-');
  const ch = chById(cid) || CHAPTERS[0];
  const part = CH_PARTS.find(p => p[0] === part0) ? part0 : 'overview';
  sset('lastch', ch.id + '-' + part);
  const prev = CHAPTERS[ch.n - 2], next = CHAPTERS[ch.n];
  m.innerHTML = crumbs(['chapters', 'Kappaleet']) + `<header class="chband" style="--chc:${ch.color}"><span class="chnum big">${ch.n}</span><div style="min-width:0"><p class="eyebrow" style="color:inherit;opacity:.85">${esc(ch.sm1)} · ${ch.mod} · ${chRange(ch)}</p><h1 style="color:inherit;margin:0">${esc(ch.fi)}</h1><p style="margin:2px 0 0;opacity:.92">${esc(ch.en)} · <span style="font-family:var(--font-ne)">${esc(ch.ne)}</span></p></div>${ring(chProgress(ch), 52, '#fff')}</header>
  <nav class="ctabs" aria-label="Chapter parts">${CH_PARTS.map(p => { const pr = p[0] === 'overview' ? null : partProgress(ch, p[0]); return `<a href="#ch-${ch.id}-${p[0]}" ${p[0] === part ? 'aria-current="page"' : ''}><span>${p[1]}</span><small>${p[2]}</small>${pr != null ? `<i class="pbar"><i style="width:${Math.round(pr * 100)}%"></i></i>` : ''}</a>`; }).join('')}</nav>
  <section id="chb" class="chbody"></section>
  <div class="row" style="justify-content:space-between;margin-top:22px">${prev ? `<a class="btn ghost" href="#ch-${prev.id}">← ${prev.n} · ${esc(prev.fi)}</a>` : '<span></span>'}${next ? `<a class="btn ghost" href="#ch-${next.id}">${next.n} · ${esc(next.fi)} →</a>` : ''}</div>`;
  CH_TAB[part]($('#chb', m), ch);
  if (part !== 'overview') { const t = $('.ctabs a[aria-current]', m); t && t.scrollIntoView({ inline: 'center', block: 'nearest' }); }
};

// a list of items with one open below it
function itemPicker(host, ch, part, items, opts = {}) {
  if (!items.length) { host.innerHTML = '<p class="empty">Nothing here yet.</p>'; return; }
  const last = sget('chopen', {})[ch.id + part];
  host.innerHTML = `<div class="ilist">${items.map((it, i) => { const done = it.wid ? (sget('w:' + it.wid, '') || '').trim().length > 20 : itemDone(ch, part, it.key); return `${it.href ? `<a class="ipick" href="${it.href}"` : `<button type="button" class="ipick" data-i="${i}"`}><span class="ic">${done ? '✓' : (it.e || (i + 1))}</span><span class="tx"><b>${esc(it.h[0])}</b><span class="small muted">${esc(it.tag)}${it.src ? ' · ' + (it.src === 'Lisä' ? '[Lisä]' : '[SM1-linjattu]') : ''}</span></span>${it.href ? '<span class="small muted">→</span></a>' : '</button>'}`; }).join('')}</div><div id="iopen" class="iopen"></div>`;
  const open = i => {
    const it = items[i]; const box = $('#iopen', host);
    $$('.ipick', host).forEach(b => b.toggleAttribute('aria-pressed', +b.dataset.i === i));
    const o = sget('chopen', {}); o[ch.id + part] = i; sset('chopen', o);
    box.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:8px"><h2 style="margin:0">${esc(it.h[0])}</h2>${!it.wid ? `<button type="button" class="btn sm ${itemDone(ch, part, it.key) ? '' : 'ok'}" data-mk>${itemDone(ch, part, it.key) ? '✓ Done' : 'Mark as done · सकियो'}</button>` : ''}</div><div id="ibody"></div>`;
    const done = (s, t, p) => { markItem(ch, part, it.key, p == null ? 100 : p); refreshTabs(); };
    if (it.W) writingTask($('#ibody', box), it.wid, it.W); else it.open($('#ibody', box), done);
    const mk = $('[data-mk]', box); if (mk) mk.onclick = () => { markItem(ch, part, it.key, 100); mk.textContent = '✓ Done'; mk.classList.remove('ok'); refreshTabs(); const b = $(`.ipick[data-i="${i}"] .ic`, host); if (b) b.textContent = '✓'; };
    if (!opts.noScroll) box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  $$('button.ipick', host).forEach(b => b.onclick = () => open(+b.dataset.i));
  const first = last != null && items[last] && !items[last].href ? last : items.findIndex(x => !x.href);
  if (first >= 0) { opts.noScroll = true; open(first); opts.noScroll = false; }
}
function refreshTabs() { const ch = chById((location.hash.split('-')[1]) || ''); if (!ch) return; $$('.ctabs a').forEach(a => { const p = a.getAttribute('href').split('-')[2]; const bar = $('.pbar i', a); if (bar && p) bar.style.width = Math.round(partProgress(ch, p) * 100) + '%'; }); }

// the chapter's long story, read or listen-first
function renderLong(host, S, done, listenFirst) {
  host.innerHTML = `<div class="note small"><b>${listenFirst ? 'Listen first · पहिले सुन्नुहोस्' : 'Before you read · पढ्नुअघि'}:</b> <span class="t-en">${esc(S.pre[0])}</span> <span class="t-ne">${esc(S.pre[1])}</span></div>
  <div class="row" style="margin:10px 0"><button type="button" class="btn sm pri" data-play="1">▶ Listen</button><button type="button" class="btn sm" data-play="slow">▶ Slow</button><button type="button" class="chip" data-hide aria-pressed="${listenFirst}">Hide translations</button><button type="button" class="chip" data-blur aria-pressed="${listenFirst}">Hide the Finnish (tap a line to see it)</button></div>
  <article class="story${listenFirst ? ' blur hide-en hide-ne' : ''}" data-story><h3 style="margin-top:0">${esc(S.h[0])}</h3><p class="t-en small" style="margin-top:-4px">${esc(S.h[1])} · <span class="t-ne">${esc(S.h[2])}</span></p>${S.paras.map((p, i) => `<div class="para"><span class="pn">${i + 1}</span><div>${p.map(l => tri(l[0], l[1], l[2])).join('')}</div></div>`).join('')}</article>
  <h3>Questions · प्रश्न</h3><div id="lq"></div><h3>Answer in Finnish · फिनिसमा जवाफ</h3><div class="stack">${S.open.map(q => `<div class="card">${tri(q[0], '', '')}<details><summary class="small">Model answer · नमूना</summary>${tri(q[1], '', '')}</details></div>`).join('')}</div>`;
  const story = $('[data-story]', host);
  const lines = () => $$('.tri', story);
  let stop = false;
  const play = slow => { stop = false; const ls = lines(); let i = 0; const nx = () => { ls.forEach(l => l.classList.remove('hl')); if (stop || i >= ls.length) return; const l = ls[i++]; l.classList.add('hl'); l.scrollIntoView({ block: 'nearest' }); speak($('[data-say]', l).dataset.say, slow, () => setTimeout(nx, 350)); }; nx(); };
  $$('[data-play]', host).forEach(b => b.onclick = () => { stop = true; setTimeout(() => play(b.dataset.play === 'slow'), 60); });
  const tg = (btn, fn) => { btn.onclick = () => { const on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', on); fn(on); }; };
  tg($('[data-hide]', host), on => { story.classList.toggle('hide-en', on); story.classList.toggle('hide-ne', on); });
  tg($('[data-blur]', host), on => { story.classList.toggle('blur', on); if (!on) $$('.tfi.rev', story).forEach(x => x.classList.remove('rev')); });
  const qs = S.q.map(q => q[0] === 'tf' ? { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: ['Totta · True', 'Väärin · False'], a: q[3] ? 0 : 1, tag: 'wc' } : { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: q[3], a: q[4], tag: 'wc' });
  runQuiz($('#lq', host), qs, { title: S.h[0], key: 'long:' + S.h[0], skill: listenFirst ? 'listening' : 'reading', onDone: done });
}

// rows of words (the table view) and the card view
function wordRows(list) {
  const c = cards();
  return `<div class="wrows" role="table" aria-label="Words"><div class="wr wh" role="row"><span></span><span>Suomi</span><span>English</span><span>नेपाली</span><span>Forms · notes</span><span></span></div>${list.map(w => { const st = c['w:' + w.id]; const notes = [w.k ? 'k-p-t ' + w.k : '', w.f ? w.f.gen + ' · ' + w.f.par : '', w.vf ? 'type ' + w.vt + ': ' + w.vf[0] + ', ' + w.vf[2] : '', w.sp ? '🗣 ' + w.sp : ''].filter(Boolean).join(' · '); return `<div class="wr" role="row"><span class="we" aria-hidden="true">${w.e || ''}</span><span class="wf"><b>${esc(w.fi)}</b>${st ? `<i class="box b${st.b}" title="Flashcard box ${st.b}">${st.b}</i>` : ''}<span class="wsub"><span class="t-en">${esc(w.en)}</span> <span class="t-ne">${esc(w.ne)}</span></span></span><span class="t-en wcol">${esc(w.en)}</span><span class="t-ne wcol">${esc(w.ne)}</span><span class="small muted wcol">${esc(notes)}</span><span>${sayBtn(w.fi)}</span></div>`; }).join('')}</div>`;
}
function wordBrowser(host, base, opts = {}) {
  const st = Object.assign({ q: '', g: '', view: 'rows', lim: 80 }, opts.state || {});
  const groups = uniq(base.map(w => w.g)).sort((a, b) => a - b);
  host.innerHTML = `<div class="toolbar"><input type="search" data-q placeholder="Search in Finnish, English or नेपाली" value="${esc(st.q)}" aria-label="Search words"><div class="seg" role="group" aria-label="View"><button type="button" data-v="rows" aria-pressed="${st.view === 'rows'}">☰ Rows</button><button type="button" data-v="cards" aria-pressed="${st.view === 'cards'}">▦ Cards</button></div></div>
  <div class="chips" style="margin-top:8px"><button type="button" class="chip" data-g="" aria-pressed="${!st.g}">All</button>${groups.map(g => `<button type="button" class="chip" data-g="${g}" aria-pressed="${String(st.g) === String(g)}">${esc(GROUP_NAMES[g] || 'Other')}</button>`).join('')}</div>
  <div class="row" style="margin-bottom:10px"><span class="small muted" data-n></span><span style="flex:1"></span><button type="button" class="btn sm pri" data-fc>Study as flashcards</button><button type="button" class="btn sm" data-quiz>Quiz · 10</button><button type="button" class="btn sm ghost" data-add>Add all to my deck</button></div><div data-fcbox></div><div data-list></div><div class="row" style="margin-top:10px"><button type="button" class="btn" data-more hidden>Show more</button></div>`;
  const list = () => { const q = st.q.toLowerCase(); return base.filter(w => (!q || (w.fi + ' ' + w.en + ' ' + w.ne).toLowerCase().includes(q)) && (!st.g || w.g === +st.g)); };
  const draw = () => { const L = list(); $('[data-n]', host).textContent = L.length + ' words'; $('[data-list]', host).innerHTML = L.length ? (st.view === 'rows' ? wordRows(L.slice(0, st.lim)) : `<div class="wl">${L.slice(0, st.lim).map(wordCard).join('')}</div>`) : '<p class="empty">No words match. Try another search.</p>'; $('[data-more]', host).hidden = L.length <= st.lim; opts.save && opts.save(st); };
  $('[data-q]', host).oninput = e => { st.q = e.target.value; st.lim = 80; draw(); };
  $$('[data-v]', host).forEach(b => b.onclick = () => { st.view = b.dataset.v; $$('[data-v]', host).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  $$('[data-g]', host).forEach(b => b.onclick = () => { st.g = b.dataset.g; $$('[data-g]', host).forEach(x => x.setAttribute('aria-pressed', x === b)); st.lim = 80; draw(); });
  $('[data-more]', host).onclick = () => { st.lim += 120; draw(); };
  $('[data-fc]', host).onclick = () => { const L = list(); const box = $('[data-fcbox]', host); box.innerHTML = '<div class="card fcwrap" style="margin-bottom:12px"></div>'; runCards($('.fcwrap', box), { ids: L.slice(0, 80).map(w => 'w:' + w.id), title: opts.title || 'Words' }); box.scrollIntoView({ block: 'start' }); };
  $('[data-quiz]', host).onclick = () => { const box = $('[data-fcbox]', host); box.innerHTML = '<div class="card" style="margin-bottom:12px"><div class="qx"></div></div>'; runQuiz($('.qx', box), wordItems(list(), 10), { title: opts.title || 'Words', key: opts.key || 'words', skill: 'vocab', regen: () => wordItems(list(), 10) }); box.scrollIntoView({ block: 'start' }); };
  $('[data-add]', host).onclick = e => { const c = cards(); let n = 0; list().forEach(w => { if (!c['w:' + w.id]) { c['w:' + w.id] = { b: 1, due: todayISO() }; n++; } }); sset('cards', c); e.target.textContent = n ? `Added ${n} ✓` : 'All in your deck ✓'; draw(); };
  draw();
}

const CH_GEN = { k1: ['olla', 'num20', 'alpha', 'vh'], k2: ['vt1', 'neg', 'ko', 'kpt', 'qw', 'price', 'country'], k3: ['kpt', 'vt1'], k4: ['neg'], k5: ['time', 'vt1'], k6: ['kpt'], k7: ['kpt', 'price'], k8: ['price'], k9: ['qw'], k10: [] };
function chGrammarItems(ch, n) {
  const fromCore = ch.core.flatMap(id => lessonById(id).s9.map(toItem)).filter(x => x.t !== 'say');
  const fromRef = ch.ref.flatMap(id => { const g = refById(id); return g ? g.blocks.filter(b => b.t === 'check').flatMap(b => b.items).map(x => ({ t: 'fill', q: x[0].replace(/\[\[|\]\]|\*\*/g, ''), a: [x[1].split(' (')[0].replace(/\[\[|\]\]|\*\*/g, '')], tag: 'wc', x: x[1].replace(/\[\[|\]\]|\*\*/g, '') })) : []; });
  const gens = (CH_GEN[ch.id] || []).flatMap(g => GEN[g](3));
  return shuffle([...pick(fromCore, Math.ceil(n / 2)), ...pick(fromRef, Math.ceil(n / 3)), ...gens]).slice(0, n);
}
const chPuhe = ch => typeof ch.puhe === 'string' ? CH_PUHE[ch.puhe] : ch.puhe.map(i => PUHE_PAIRS[i]);

const CH_TAB = {
  overview(h, ch) {
    const parts = CH_PARTS.slice(1);
    const nextPart = parts.find(p => partProgress(ch, p[0]) < 1) || parts[parts.length - 1];
    const cando = ch.cando.flatMap(m => (CANDO[m] || []).map((c, i) => [m + ':' + i, c]));
    h.innerHTML = `<div class="ovgrid"><div class="stack"><div class="card"><h3 style="margin-top:0">In this chapter · यस अध्यायमा</h3><ul class="topics">${ch.topics.map(t => `<li><b>${esc(t[0])}</b> <span class="t-en">· ${esc(t[1])}</span> <span class="t-ne small">· ${esc(t[2])}</span></li>`).join('')}</ul><p class="small muted" style="margin:8px 0 0">📘 ${esc(ch.sm1)}<br>📗 ${esc(ch.oma)}</p></div>
      <div class="card"><h3 style="margin-top:0">Your parts · भागहरू</h3>${parts.map(p => { const pr = partProgress(ch, p[0]); return `<a class="prow" href="#ch-${ch.id}-${p[0]}"><span><b>${p[1]}</b> <span class="t-en small">${p[2]}</span></span><span class="bar ${pr >= 1 ? 'ok' : ''}"><i style="width:${Math.round(pr * 100)}%"></i></span><span class="num small">${Math.round(pr * 100)}%</span></a>`; }).join('')}<div class="row" style="margin-top:10px"><a class="btn pri" href="#ch-${ch.id}-${nextPart[0]}">Continue: ${nextPart[1]} →</a></div></div></div>
      <div class="stack"><div class="card"><h3 style="margin-top:0">Long story · लामो कथा</h3><p><b>${esc(LONG[ch.id].h[0])}</b><br><span class="t-en">${esc(LONG[ch.id].h[1])}</span></p><p class="small muted">${LONG[ch.id].paras.reduce((a, p) => a + p.length, 0)} sentences · ${LONG[ch.id].q.length} questions</p><a class="btn sm" href="#ch-${ch.id}-read">Read it</a></div>
      <div class="card cando"><h3 style="margin-top:0">I can … · म सक्छु</h3>${cando.map(([k, c]) => `<label><input type="checkbox" data-cd="${k}" ${sget('cando', {})[k] ? 'checked' : ''}><span><b>${esc(c[0])}</b> <span class="t-en">– ${esc(c[1])}</span> <span class="t-ne">– ${esc(c[2])}</span></span></label>`).join('')}</div></div></div>`;
    h.onchange = e => { const c = e.target.closest('[data-cd]'); if (c) { const o = sget('cando', {}); o[c.dataset.cd] = c.checked ? 1 : 0; sset('cando', o); } };
  },
  words(h, ch) {
    const ws = chWords(ch);
    h.innerHTML = `<p class="small muted">${ws.length} words for this chapter, with a picture, English, ${esc(hlName())} and forms. Study them as flashcards: right → next box, wrong → box 1. · यस अध्यायका ${ws.length} शब्द।</p><div data-wb></div>`;
    wordBrowser($('[data-wb]', h), ws, { title: 'Chapter ' + ch.n, key: 'chwords:' + ch.id, state: sget('chwf:' + ch.id, {}), save: s => sset('chwf:' + ch.id, { q: s.q, g: s.g, view: s.view }) });
  },
  grammar(h, ch) {
    const ld = sget('ldone', {});
    h.innerHTML = `${ch.core.length ? `<h3 style="margin-top:0">9-step lessons · ९ चरणका पाठ</h3><div class="grid">${ch.core.map(id => { const L = lessonById(id); return `<a class="tile" href="#lesson-${L.id}"><span class="row">${srcTag(L.src)}${ld[L.id] ? '<span class="tag ok">✓ passed</span>' : ''}</span><b>${esc(L.fi)}</b><span class="t-en">${esc(L.en)}</span><span class="t-ne small">${esc(L.ne)}</span></a>`; }).join('')}</div>` : ''}
    <h3${ch.core.length ? '' : ' style="margin-top:0"'}>Grammar lessons · व्याकरण</h3><div class="grid">${ch.ref.map(id => { const g = refById(id); return g ? `<a class="tile" href="#gref-${g.id}" data-ref="${g.id}"><span class="row"><span class="tag src">[Lisä]</span><span class="tag">${esc(g.lvl)}</span>${itemDone(ch, 'grammar', g.id) ? '<span class="tag ok">✓ opened</span>' : ''}</span><b>${esc(g.fi)}</b><span class="t-en">${esc(g.en)}</span></a>` : ''; }).join('')}</div>
    ${ch.kpt ? `<div class="corecard"><span class="tag ok">Core skill · मुख्य सीप</span><h3 style="margin:6px 0">k-p-t-vaihtelu · consonant gradation</h3><p class="small">${ch.n === 2 ? 'Introduced here: kauppa → kaupassa, katu → kadulla.' : ch.n === 3 ? 'In verbs: nukkua → nukun, tietää → tiedän, ymmärtää → ymmärrän.' : 'In nouns: kauppa → kaupassa, Helsinki → Helsingissä, matka → matkalla.'} You need it in every chapter. · यो हरेक अध्यायमा चाहिन्छ।</p><div class="row"><a class="btn sm pri" href="#kpt">Open the k-p-t trainer</a><button type="button" class="btn sm" data-kq>Quick drill · 12</button></div><div data-kqbox></div></div>` : ''}
    ${ch.n === 1 ? `<h3>Vowel pairs · diphthongs</h3><div class="grid sm">${HW_DIPH.map(d => `<div class="card"><b>${esc(d[0])}</b><div class="small">${d[1].map(w => `<span class="fiw" data-say="${esc(w[0])}">${esc(w[0])}</span> ${esc(w[1])}`).join(' · ')}</div></div>`).join('')}</div><div class="row" style="margin-top:10px"><button type="button" class="btn" data-len>Listening game: short or long?</button></div><div data-lenbox></div>` : ''}
    <h3>Practise this chapter's grammar</h3><button type="button" class="btn pri" data-gq>16 mixed questions</button><div data-gqbox style="margin-top:10px"></div>`;
    h.onclick = e => {
      const r = e.target.closest('[data-ref]'); if (r) markItem(ch, 'grammar', r.dataset.ref, 100);
      if (e.target.closest('[data-kq]')) runQuiz($('[data-kqbox]', h), GEN.kpt(12), { title: 'k-p-t', key: 'kpt:flip', skill: 'grammar' });
      if (e.target.closest('[data-len]')) runQuiz($('[data-lenbox]', h), GEN.pairs(10), { title: 'Short or long?', key: 'gen:pairs', skill: 'listening' });
      if (e.target.closest('[data-gq]')) runQuiz($('[data-gqbox]', h), chGrammarItems(ch, 16), { title: 'Grammar · chapter ' + ch.n, key: 'chgram:' + ch.id, skill: 'grammar', regen: () => chGrammarItems(ch, 16) });
    };
  },
  read(h, ch) { h.innerHTML = '<p class="small muted">Start with the long story. Then the shorter texts. Tap any Finnish word or line to hear it. · पहिले लामो कथा पढ्नुहोस्।</p><div data-ip></div>'; itemPicker($('[data-ip]', h), ch, 'read', partItems(ch, 'read')); },
  listen(h, ch) {
    h.innerHTML = `<p class="small muted">Routine: read the questions → listen → answer → listen again (slow is fine) → read the transcript → shadow 3 lines. · पहिले प्रश्न पढ्नुहोस्, अनि सुन्नुहोस्।</p><div data-ip></div><h3>Ear training · कान अभ्यास</h3><div class="row">${(CH_GEN[ch.id] || []).filter(g => ['pairs', 'num20', 'num100', 'price', 'time', 'qw'].includes(g)).concat(['num100', 'time']).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).map(g => `<button type="button" class="btn sm" data-ear="${g}">${{ num20: 'Numbers 0–20', num100: 'Numbers 20–100', price: 'Prices', time: 'Clock times', qw: 'Question words', pairs: 'Short or long?' }[g]}</button>`).join('')}</div><div data-earbox style="margin-top:10px"></div>`;
    itemPicker($('[data-ip]', h), ch, 'listen', partItems(ch, 'listen'));
    $$('[data-ear]', h).forEach(b => b.onclick = () => { const g = b.dataset.ear; const its = g === 'qw' ? pick(QA_BANK, 6).map(q => { const o = shuffle(uniq([q[3], ...pick(QA_BANK.filter(x => x !== q), 2).map(x => x[3])])); return { t: 'lis', say: q[0], o, a: o.indexOf(q[3]), tag: 'wc', x: q[0] + ' – ' + q[3] }; }) : GEN[g](8); runQuiz($('[data-earbox]', h), its, { title: b.textContent, key: 'gen:' + g, skill: 'listening' }); });
  },
  speak(h, ch) {
    const L = LONG[ch.id]; const shadow = L.paras.flatMap(p => p.slice(0, 2)).filter(l => l[0].length < 90).slice(0, 8);
    const sec = (k, title, body) => `<section class="card spk" data-sk="${k}"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${title}</h3><button type="button" class="btn sm ${itemDone(ch, 'speak', k) ? '' : 'ok'}" data-sdone="${k}">${itemDone(ch, 'speak', k) ? '✓ Done' : 'Mark as done'}</button></div>${body}</section>`;
    h.innerHTML = `<div class="stack"><a class="note small" href="#lause-talk" style="display:block;text-decoration:none"><b>Stuck after one word?</b> The <u>sentence lab</u> shows how to answer, add one detail and ask back, and builds any sentence with the right endings. · वाक्य प्रयोगशाला →</a>
    ${sec('qa', '1 · Questions and answers · प्रश्नोत्तर', `<p class="small muted">Hear the question, answer aloud, then compare with the model.</p><button type="button" class="btn sm pri" data-qa>▶ Start: hear → answer → compare</button><div data-qabox style="margin-top:8px"></div><div style="margin-top:8px">${ch.qa.map(q => `<div class="tri">${sayBtn(q[0])}<div class="tx"><span class="fi">${esc(q[0])}</span><span class="t-en">${esc(q[1])}</span><span class="t-ne">${esc(q[2])}</span><details><summary class="small">Model answer</summary><span>${esc(q[3])}</span> <span class="t-en small">${esc(q[4])}</span> ${sayBtn(q[3])}</details></div></div>`).join('')}</div>`)}
    ${sec('talk', '2 · Talk for 1 minute · १ मिनेट बोल्नुहोस्', `<p><b>${esc(ch.talk.h[0])}</b> <span class="t-en">· ${esc(ch.talk.h[1])}</span> <span class="t-ne">· ${esc(ch.talk.h[2])}</span></p><ul class="small">${ch.talk.help.map(x => `<li>${esc(x)}</li>`).join('')}</ul><details><summary class="small">Model · नमूना</summary>${tri(ch.talk.model, '', '')}</details>${recorderHTML('chtalk' + ch.id)}${speakChecklist('chtalk' + ch.id)}`)}
    ${sec('shadow', '3 · Shadowing from the story · छाया अभ्यास', `<p class="small muted">Play a line, speak with the voice, then say it alone.</p><div data-sh>${shadow.map(s => tri(s[0], s[1], s[2])).join('')}</div><div class="row" style="margin-top:8px"><button type="button" class="btn sm" data-pall>▶ Play all with pauses</button></div>`)}
    ${sec('roles', '4 · Role-play · भूमिका अभिनय', `<p class="small muted">Open a dialogue, choose “I am …”, and speak your lines when they light up.</p><div class="grid">${ch.roles.map(r => { const it = srcItem(r, ch, 'speak'); return it ? `<a class="tile" href="${it.href || '#dlg-' + it.dlg}"><b>${it.e ? it.e + ' ' : '🎭 '}${esc(it.h[0])}</b><span class="t-en">${esc(it.h[1])}</span></a>` : ''; }).join('')}${ch.arki.map(id => { const a = ARKI.find(x => x.id === id); return a ? `<a class="tile" href="#arki"><b>${a.e} ${esc(a.fi)}</b><span class="t-en">${esc(a.en)} · ${a.lines.length} ready sentences</span></a>` : ''; }).join('')}</div>`)}
    </div>`;
    bindRecorders(h);
    $('[data-pall]', h).onclick = () => playAll($('[data-sh]', h), 2200);
    $('[data-qa]', h).onclick = () => runQuiz($('[data-qabox]', h), ch.qa.map(q => ({ t: 'say', q: q[0] + ' · ' + q[1], qn: q[2], model: q[3] })), { title: 'Speaking · chapter ' + ch.n, key: 'chspeak:' + ch.id, skill: 'speaking', onDone: () => { markItem(ch, 'speak', 'qa'); } });
    $$('[data-qa]', h).forEach(b => b.addEventListener('click', () => setTimeout(() => speak(ch.qa[0][0]), 200)));
    $$('[data-sdone]', h).forEach(b => b.onclick = () => { markItem(ch, 'speak', b.dataset.sdone); b.textContent = '✓ Done'; b.classList.remove('ok'); refreshTabs(); });
  },
  write(h, ch) { h.innerHTML = '<p class="small muted">Write first, then open the model and the checklist. Your texts are saved on this device. · पहिले आफैं लेख्नुहोस्।</p><div data-ip></div>'; itemPicker($('[data-ip]', h), ch, 'write', partItems(ch, 'write')); },
  puhe(h, ch) {
    const list = chPuhe(ch);
    h.innerHTML = `<p class="small muted">Understand the spoken form; write and speak in tests in standard Finnish. Helsinki-region forms. · बोलचालको फिनिस बुझ्नुहोस्।</p><div class="wrows">${list.map(p => `<div class="wr pr"><span class="t-sp"><b>🗣 ${esc(p[1])}</b></span><span class="fi">📖 ${esc(p[0])}</span><span class="t-en">${esc(p[2])}</span><span class="t-ne">${esc(p[3])}</span><span>${sayBtn(p[1])}</span></div>`).join('')}</div><div class="row" style="margin-top:12px"><button type="button" class="btn pri" data-g>Game: hear spoken → choose standard</button><a class="btn ghost" href="#puhe">All spoken Finnish</a></div><div data-gbox style="margin-top:10px"></div>`;
    $('[data-g]', h).onclick = () => runQuiz($('[data-gbox]', h), puheGame(pick(list, Math.min(8, list.length))), { title: 'Puhekieli · chapter ' + ch.n, key: 'chpuhe:' + ch.id, skill: 'listening', onDone: (s, t, p) => { if (p >= 60) { markItem(ch, 'puhe', 'game', p); refreshTabs(); } } });
  },
  test(h, ch) {
    const b = bestKey('chtest:' + ch.id);
    h.innerHTML = `<div class="card"><h3 style="margin-top:0">Kappaletesti ${ch.n} · Chapter test</h3><p class="small">20 questions: words, grammar, the chapter story and listening. Pass mark 80%. ${b != null ? `<span class="tag ${b >= 80 ? 'ok' : 'warn'}">Best ${b}%</span>` : ''}</p><button type="button" class="btn pri" data-t>Start the test · सुरु</button></div><div data-tbox style="margin-top:12px"></div>`;
    $('[data-t]', h).onclick = () => runQuiz($('[data-tbox]', h), chapterTest(ch), { title: 'Chapter ' + ch.n + ' test', key: 'chtest:' + ch.id, skill: 'mixed', regen: () => chapterTest(ch), onDone: () => refreshTabs() });
  }
};
function chapterTest(ch) {
  const L = LONG[ch.id];
  const read = pick(L.q, 4).map(q => q[0] === 'tf' ? { t: 'mc', q: `📖 ${q[1]} <span class="t-en">· ${q[2]}</span>`, o: ['Totta · True', 'Väärin · False'], a: q[3] ? 0 : 1, tag: 'wc' } : { t: 'mc', q: `📖 ${q[1]} <span class="t-en">· ${q[2]}</span>`, o: q[3], a: q[4], tag: 'wc' });
  const lis = pick(ch.qa, 4).map(q => { const o = shuffle([q[3], ...pick(ch.qa.filter(x => x !== q), 2).map(x => x[3])]); return { t: 'lis', say: q[0], o, a: o.indexOf(q[3]), tag: 'wc', x: q[0] + ' – ' + q[3] }; });
  return [...wordItems(chWords(ch), 6), ...chGrammarItems(ch, 6).map(toItem), ...read, ...lis];
}

// ===== words library (all words, rows or cards, by chapter) =====
R.words = m => {
  const f = Object.assign({ ch: '' }, sget('wf2', {}));
  m.innerHTML = crumbs(['chapters', 'Kappaleet']) + `<h1>Sanasto · Words</h1><p class="lede">${WORDS.length} words with pictures, in rows or cards. Filter by chapter and topic, then study them as flashcards. · ${WORDS.length} शब्द, तस्बिरसहित। Not here? Use the <a href="#kaannos">translator</a>.</p><div class="chips"><button type="button" class="chip" data-c="" aria-pressed="${!f.ch}">All chapters</button>${CHAPTERS.map(c => `<button type="button" class="chip" data-c="${c.n}" aria-pressed="${String(f.ch) === String(c.n)}">${c.n} · ${esc(c.fi)} <span class="muted small">${chWords(c).length}</span></button>`).join('')}</div><div data-wb></div>`;
  const draw = () => wordBrowser($('[data-wb]', m), f.ch ? WORDS.filter(w => w.ch === +f.ch) : WORDS, { title: f.ch ? 'Chapter ' + f.ch : 'All words', key: 'words', state: sget('wf2s', {}), save: s => sset('wf2s', { q: s.q, view: s.view }) });
  $$('[data-c]', m).forEach(b => b.onclick = () => { f.ch = b.dataset.c; sset('wf2', f); $$('[data-c]', m).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  draw();
};

// ===== flashcards with deck choice =====
R.cards = m => {
  const deck = sget('deck', 'due');
  const decks = [['due', 'Due today', dueIds().length], ...CHAPTERS.map(c => ['ch' + c.n, c.n + ' · ' + c.fi, chWords(c).length]), ['mist', 'My mistakes', sget('mist', []).length]];
  m.innerHTML = crumbs(['train', 'Harjoittele']) + `<h1>Kortit · Flashcards</h1><p class="lede">“Due today” follows the 5 boxes (gaps 1, 2, 4, 8, 16 days; up to 20 new cards a day). A chapter deck lets you study one chapter's words any time. · दोहोर्‍याउने कार्ड।</p>
  <label class="small" for="dk"><b>Deck · डेक</b></label><select id="dk" style="margin:4px 0 10px">${decks.map(d => `<option value="${d[0]}" ${d[0] === deck ? 'selected' : ''}>${esc(d[1])} (${d[2]})</option>`).join('')}</select>
  <div class="row" style="margin-bottom:10px"><button type="button" class="chip" data-dir="fi" aria-pressed="${SET.cardDir !== 'en'}">Finnish → meaning</button><button type="button" class="chip" data-dir="en" aria-pressed="${SET.cardDir === 'en'}">Meaning → Finnish</button></div><div class="fcwrap" id="fcw"></div>`;
  const run = () => { const d = sget('deck', 'due'); if (d === 'due') runCards($('#fcw', m)); else if (d === 'mist') runCards($('#fcw', m), { ids: sget('mist', []).map(x => 'm:' + x.id), title: 'Mistakes' }); else { const c = CHAPTERS[+d.slice(2) - 1]; runCards($('#fcw', m), { ids: chWords(c).map(w => 'w:' + w.id), title: 'Chapter ' + c.n }); } };
  $('#dk', m).onchange = e => { sset('deck', e.target.value); run(); };
  m.addEventListener('click', e => { const d = e.target.closest('[data-dir]'); if (d) { SET.cardDir = d.dataset.dir; saveSet(); render(); } });
  run();
};

// ===== k-p-t: a core skill of the course =====
R.kpt = m => {
  const kp = r => ({ t: 'fill', q: `${r[0]} + ${r[1]} = ___ (${r[3]})`, a: [r[2]], tag: 'kpt', x: `${r[5] ? r[5] + ': ' : ''}${r[0]} → ${r[2]}`, xn: r[4] });
  const SETS = [['a', 'Set A · word + ending', HW5.length, () => HW5.map(kp)], ['b', 'Set B · word + ending', HW6.length, () => HW6.map(kp)], ['pl', 'Plural forms', HWPL.length, () => HWPL.map(r => ({ t: 'fill', q: `${r[0]} → plural ___ (${r[3]})`, a: [r[1]], tag: 'kpt', x: `${r[2]}: ${r[0]} → ${r[1]}`, xn: r[4] }))], ['tbl', 'The full pattern table', HW_BOOK.length + HW_BOOK_NONE.length, () => [...HW_BOOK.map(kp), ...HW_BOOK_NONE.map(r => ({ t: 'fill', q: `${r[0]} + ${r[1]} = ___ (${r[3]})`, a: [r[2]], tag: 'kpt', x: 'No change here (hk, sk, st, tk).', xn: r[4] }))]]];
  m.innerHTML = crumbs(['chapters', 'Kappaleet']) + `<p class="eyebrow">Core skill · मुख्य सीप</p><h1>k-p-t-vaihtelu</h1><p class="lede">Consonant gradation: k, p and t get weaker when an ending closes the syllable (kauppa → kaupassa). It is in chapters 2, 3 and 7 and in almost every sentence you write. · k-p-t परिवर्तन हरेक अध्यायमा चाहिन्छ।</p>
  <div class="steps4">${[['1', 'Find k, p or t in the last syllable.', 'अन्तिम अक्षरमा k, p वा t खोज्नुहोस्।'], ['2', 'Does the ending close the syllable? (-n, -t, -ssa, -lla, -lle …)', 'प्रत्ययले अक्षर बन्द गर्छ?'], ['3', 'Yes → weak: kk→k, pp→p, tt→t, k→–, p→v, t→d, nk→ng …', 'हो भने कमजोर।'], ['4', 'Strong stays with -a/-ä (kauppaa), “into” (kauppaan) and hän (nukkuu).', 'partitive, भित्र जाने र hän मा बलियो।']].map(s => `<div class="card"><span class="bn">${s[0]}</span><p style="margin:6px 0 2px">${esc(s[1])}</p><p class="t-ne small" style="margin:0">${esc(s[2])}</p></div>`).join('')}</div>
  <div class="row" style="margin:12px 0"><a class="btn" href="#lesson-L04">9-step lesson</a><a class="btn" href="#ch-k2-grammar">Chapter 2</a><a class="btn" href="#ch-k3-grammar">Chapter 3 · verbs</a><a class="btn" href="#ch-k7-grammar">Chapter 7 · nouns</a></div>
  <h2>Practice sets · अभ्यास</h2><div class="grid">${SETS.map(s => `<button type="button" class="tile" data-set="${s[0]}"><b>${esc(s[1])}</b><span class="muted">${s[2]} items · typed, with checking ${bestKey('kpt:' + s[0]) != null ? `· best ${bestKey('kpt:' + s[0])}%` : ''}</span></button>`).join('')}<button type="button" class="tile" data-set="flip"><b>Quick drill</b><span class="muted">12 random forms</span></button></div><div id="kq" style="margin-top:12px"></div>
  <h2>12 patterns · ${KPT_TYPES.reduce((s, t) => s + t[5].length, 0)} examples</h2>${KPT_TYPES.map(t => `<details class="blk"><summary><span class="bn" style="width:auto;padding:0 8px;border-radius:8px">${esc(t[1])}→${esc(t[2] || '–')}</span><span class="bt"><b>${esc(t[3])}</b><span class="t-ne small">${esc(t[4])}</span></span><span class="bm">${t[5].length}</span></summary><div class="bd">${t[5].map(e => `<div class="tri">${sayBtn(e[2])}<div class="tx"><span><span style="font-weight:800">${esc(e[0])}</span> + ${esc(e[1])} → <span class="fi" style="color:var(--accent)">${esc(e[2])}</span></span><span class="t-en small">${esc(e[3])}</span><span class="t-ne small">${esc(e[4])}</span></div></div>`).join('')}${t[6] && t[6].length ? `<p class="small" style="margin-top:8px">Verbs (minä weak / hän strong): ${t[6].map(v => `<b>${esc(v[0])}</b>: ${esc(v[1])} / ${esc(v[2])}`).join(' · ')}</p>` : ''}</div></details>`).join('')}
  <h2>Model sentences · नमूना वाक्य</h2><div class="card">${HW_EX16.map(x => `<div class="tri">${sayBtn(x[2])}<div class="tx"><span class="small muted">${esc(x[0])} + ${esc(x[1])}</span><span class="fi">${esc(x[2])}</span><span class="t-en">${esc(x[3])}</span><span class="t-ne">${esc(x[4])}</span><span class="small">${x[5]}</span></div></div>`).join('')}</div>
  <h2>At home: a short dialogue</h2><div class="card">${HW_EX18.map(x => tri(x[1], x[2], x[3], { who: x[0] })).join('')}</div>
  <h2>Special and no-change</h2>${KPT_SPECIAL.map(s => `<div class="card"><b>${esc(s[0])}</b>${s[1].map(e => `<div class="small">${esc(e[0])} + ${esc(e[1])} → <b>${esc(e[2])}</b> · ${esc(e[3])}</div>`).join('')}</div>`).join('')}${KPT_NONE.map(s => `<div class="card"><b>${esc(s[0])}</b> <span class="t-en">${esc(s[1])}</span> <span class="t-ne">${esc(s[2])}</span><div class="small">${s[3].map(e => esc(e[0] + ' → ' + e[2])).join(' · ')}</div></div>`).join('')}
  <h2>Weak endings · strong endings</h2><div class="grid"><div class="card"><b>Weak (closed syllable)</b>${KPT_WEAK.map(w => `<div class="small">${esc(w[0])} · ${esc(w[1])} · <b>${esc(w[2])}</b></div>`).join('')}</div><div class="card"><b>Strong</b>${KPT_STRONG.map(w => `<div class="small">${esc(w[0])} · ${esc(w[1])} · <b>${esc(w[2])}</b></div>`).join('')}</div></div>`;
  m.onclick = e => { const b = e.target.closest('[data-set]'); if (!b) return; const k = b.dataset.set; const s = SETS.find(x => x[0] === k); runQuiz($('#kq', m), k === 'flip' ? GEN.kpt(12) : s[3](), { title: k === 'flip' ? 'k-p-t' : s[1], key: k === 'flip' ? 'kpt:flip' : 'kpt:' + k, skill: 'grammar', regen: k === 'flip' ? () => GEN.kpt(12) : null }); $('#kq', m).scrollIntoView({ block: 'start' }); };
};

// ===== homework: only what you add from class =====
function allHomework() { const done = sget('hwdone', {}); return sget('hwlist', []).map(h => ({ ...h, done: !!done[h.id] })).sort((a, b) => a.due < b.due ? -1 : 1); }
R.hw = m => {
  m.innerHTML = crumbs(['me', 'Minä']) + `<h1>Kotitehtävät · Homework</h1><p class="lede">Add the homework your teacher gives in class. Items show on Today until you tick them. · कक्षाको गृहकार्य यहाँ थप्नुहोस्।</p>
  <div class="card"><b>Add homework · गृहकार्य थप्नुहोस्</b><div class="stack" style="margin-top:8px"><input type="text" id="ht" placeholder="What? e.g. Kappale 3, harjoitus 5" aria-label="Homework title"><div class="row"><input type="date" id="hd" value="${addDays(todayISO(), 1)}" aria-label="Due date" style="flex:1;min-width:150px"><select id="hc" aria-label="Chapter" style="flex:1;min-width:150px"><option value="">Chapter (optional)</option>${CHAPTERS.map(c => `<option value="${c.id}">${c.n} · ${esc(c.fi)}</option>`).join('')}</select><input type="text" id="hn" placeholder="Note (optional)" aria-label="Note" style="flex:2;min-width:160px"></div><button type="button" class="btn pri" id="hadd">Add</button></div></div>
  <h2>List</h2><div class="stack" id="hl"></div>`;
  const drawList = () => { $('#hl', m).innerHTML = allHomework().map(h => { const c = h.ch && chById(h.ch); return `<div class="card row" style="justify-content:space-between"><label class="row" style="gap:10px;cursor:pointer;flex:1;min-width:0"><input type="checkbox" data-hw="${esc(h.id)}" ${h.done ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--ok)"><span style="min-width:0"><b>${esc(h.title)}</b><br><span class="small muted">Due ${esc(h.due)}${h.note ? ' · ' + esc(h.note) : ''}</span></span></label>${c ? `<a class="btn sm ghost" href="#ch-${c.id}">Chapter ${c.n}</a>` : ''}<button type="button" class="btn sm ghost" data-hdel="${esc(h.id)}">Remove</button></div>`; }).join('') || '<p class="empty">No homework yet. Add what your teacher gives in class.</p>'; };
  drawList();
  $('#hadd', m).onclick = () => { const t = $('#ht', m).value.trim(); if (!t) { $('#ht', m).focus(); return; } const l = sget('hwlist', []); l.push({ id: 'h' + Date.now().toString(36), title: t, due: $('#hd', m).value || todayISO(), note: $('#hn', m).value.trim(), ch: $('#hc', m).value }); sset('hwlist', l); $('#ht', m).value = ''; $('#hn', m).value = ''; drawList(); toast('Added. It shows on Today. · थपियो।'); };
  m.onchange = e => { const c = e.target.closest('[data-hw]'); if (c) { const d = sget('hwdone', {}); d[c.dataset.hw] = c.checked ? 1 : 0; sset('hwdone', d); } };
  m.onclick = e => { const d = e.target.closest('[data-hdel]'); if (d) { sset('hwlist', sget('hwlist', []).filter(h => h.id !== d.dataset.hdel)); drawList(); } };
};

// ===== Today: show the current chapter =====
const _todayBase = R.today;
R.today = (m, a) => {
  _todayBase(m, a);
  const ch = chOfDay(todayDay()); const p = chProgress(ch); const hero = $('.hero', m);
  if (hero) hero.insertAdjacentHTML('afterend', `<a class="chnow" href="#ch-${ch.id}" style="--chc:${ch.color}"><span class="chnum">${ch.n}</span><span class="tx"><span class="eyebrow" style="margin:0">Current chapter · अहिलेको अध्याय</span><b>${esc(ch.fi)}</b><span class="t-en small">${esc(ch.en)} · ${chRange(ch)}</span></span>${ring(p, 46, ch.color)}</a><a class="lausebig sm" href="#lause-build"><span class="chnum">Aa</span><span class="tx"><b>Sentence lab · Lauseet</b><span class="small">Build one new sentence today, say it aloud, then ask a question with it.</span></span><span class="go">→</span></a>`);
};
