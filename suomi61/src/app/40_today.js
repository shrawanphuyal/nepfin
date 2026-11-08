// ===== Today, course map, a day and its 9 blocks =====
const modNum = n => { const m = /^M(\d+)/.exec(calOf(n)[0]); return m ? +m[1] : null; };
let DAYWORDS = null;
function dayWords(n) {
  if (!DAYWORDS) {
    DAYWORDS = {};
    for (let d = 1; d <= 61; d++) DAYWORDS[d] = WORDS.filter(w => w.d === d);
    const byMod = {};
    for (let d = 11; d <= 61; d++) { const m = modNum(d); if (m != null && !kindOf(d).match(/stage|mock|exam|final/)) (byMod[m] = byMod[m] || []).push(d); }
    for (const m in byMod) { const ws = WORDS.filter(w => !w.d && w.m === +m); const days = byMod[m]; const per = Math.max(15, Math.min(25, Math.ceil(ws.length / days.length))); days.forEach((d, i) => { DAYWORDS[d] = ws.slice(i * per, i * per + per); }); }
  }
  return DAYWORDS[n] || [];
}
const lessonIds = n => (calOf(n)[4] || '').split(',').filter(x => /^L\d/.test(x));
const refId = n => { const g = (calOf(n)[4] || '').split(',').find(x => x.startsWith('g:')); return g ? g.slice(2) : null; };
const lessonById = id => LESSONS.find(l => l.id === id);
const refById = id => GRAMMAR.find(g => g.id === id);
const rot = (arr, n, k = 0) => arr[(n + k) % arr.length];

R.today = m => {
  const n = todayDay(); const t = todayISO(); const before = t < START_ISO, after = t > END_ISO;
  const toExam = diffDays(t, EXAM_ISO), toEnd = diffDays(t, END_ISO);
  const due = dueIds().length;
  const tags = topTags(3);
  const hw = allHomework().filter(h => !h.done && h.due >= addDays(t, -3)).slice(0, 3);
  const cu = catchUps().slice(0, 2);
  m.innerHTML = `
  <div class="hero">
    <div class="daycard"><p class="eyebrow">${before ? 'Starts 1 Nov' : after ? 'Course finished' : 'Päivä ' + n + '/61'} · ${fmtDay(n)}</p><h1>${esc(calOf(n)[1])}</h1><p>${esc(calOf(n)[0])} · Day task: ${esc(calOf(n)[2])}</p>
      <div class="row" style="margin-top:8px"><a class="btn sm" style="background:var(--surface);color:var(--ink)" href="#day-${n}">Open the day plan · दिनको योजना</a></div></div>
    <div class="stats">
      <div class="stat"><b>${toExam >= 0 ? toExam : '✓'}</b><span>${toExam >= 0 ? 'days to the class exam (25.11.)' : 'class exam done'}</span></div>
      <div class="stat"><b>${Math.max(0, toEnd)}</b><span>days to 31 Dec (A1.3)</span></div>
      <div class="stat"><b>🔥 ${streakNow()}</b><span>days in a row</span></div>
      <a class="stat" href="#cards" style="text-decoration:none;color:inherit"><b>${due}</b><span>cards due · ${introPool().length ? introPool().length + ' new waiting' : 'deck up to date'}</span></a>
    </div>
  </div>
  ${cu.length ? `<div class="parth"><h2>Catch-up · छुटेको</h2><span class="muted small">+20 min a day, never more than 2</span></div><div class="grid">${cu.map(d => `<a class="tile" href="#day-${d}" style="background:var(--almost-soft);border-color:transparent"><b>Day ${d} · ${fmtDay(d)}</b><span class="muted">${esc(calOf(d)[1])}</span><span class="small">${Math.round(dayProgress(d) * 100)}% done</span></a>`).join('')}</div>` : ''}
  ${hw.length ? `<div class="parth"><h2>Homework due · गृहकार्य</h2></div><div class="stack">${hw.map(h => `<a class="tile" href="#hw"><b>${esc(h.title)}</b><span class="muted">Due ${esc(h.due)}${h.note ? ' · ' + esc(h.note) : ''}</span></a>`).join('')}</div><p class="small muted">Homework beats the plan for that day.</p>` : ''}
  ${tags.length ? `<div class="parth"><h2>Your top errors · मुख्य गल्ती</h2></div><div class="row">${tags.map(([k, c]) => `<span class="tag bad">${esc(TAGS[k] ? TAGS[k][0] : k)} · ${c}</span>`).join('')}<button type="button" class="btn sm" id="practTop">Practise these · अभ्यास</button></div>` : ''}
  <div id="dayplan"></div>`;
  dayPlan($('#dayplan', m), n);
  const pt = $('#practTop', m); if (pt) pt.onclick = () => { go('practice'); setTimeout(() => startRepair(tags.map(x => x[0])), 50); };
};

function dayPlan(host, n) {
  const st = blockState(n); const bl = blocksOf(n); const short = isShort(n);
  const part = p => bl.filter(b => b.part === p);
  const blk = b => `<details class="blk${st[b.id] ? ' done' : ''}" data-b="${b.id}"><summary><span class="bn">${st[b.id] ? '✓' : b.n}</span><span class="bt"><b>${b.fi}</b><span class="t-en">${b.en}</span> <span class="t-ne small">· ${b.ne}</span></span><span class="bm">${b.id === 'words' && !short ? '10 + 15 min' : b.min + ' min'}</span></summary><div class="bd"></div></details>`;
  const am = part('am'), pm = part('pm');
  host.innerHTML = `${short ? `<div class="note warn" style="margin-top:16px">${kindOf(n) === 'exam' ? 'Class exam day: a 30-minute warm-up only. No new material. Onnea kokeeseen! · परीक्षाका लागि शुभकामना!' : 'Light day: 90 minutes, blocks 1, 3, 6 and 9 only.'}</div>` : ''}
  ${am.length ? `<div class="parth"><h2>Aamu · Morning</h2><span class="muted small">${short ? am.reduce((s, b) => s + b.min, 0) : 95} min · on the bus or before class</span></div><div class="stack">${am.map(blk).join('')}</div>` : ''}
  ${pm.length ? `<div class="parth"><h2>Ilta · Evening</h2><span class="muted small">${short ? pm.reduce((s, b) => s + b.min, 0) : 115} min · new words: 10 min in the morning, 15 in the evening</span></div><div class="stack">${pm.map(blk).join('')}</div>` : ''}
  <p class="small muted" style="margin-top:12px">Extra time (up to 30 min): more <a href="#cards">flashcards</a>, a <a href="#read">story</a>, the <a href="#qlab">question lab</a> or <a href="#practice">random practice</a>.</p>`;
  $$('details.blk', host).forEach(d => d.addEventListener('toggle', () => { if (d.open && !d.dataset.r) { d.dataset.r = 1; blockBody($('.bd', d), n, d.dataset.b, () => markBlock(d, n, true)); } }));
}
function markBlock(d, n, v) { setBlock(n, d.dataset.b, v); d.classList.toggle('done', v); $('.bn', d).textContent = v ? '✓' : BLOCKS.find(b => b.id === d.dataset.b).n; const btn = $('[data-done]', d); if (btn) btn.textContent = v ? '✓ Done · सकियो (undo)' : 'Mark done · सकियो'; if (v && dayDone(n)) toast('Day ' + n + ' complete! Hienoa! · दिन पूरा भयो!'); }

function blockBody(host, n, id, done) {
  const b = BLOCKS.find(x => x.id === id);
  const isDone = !!blockState(n)[id];
  host.innerHTML = timerHTML(n, b) + '<div class="bx"></div>' + `<div class="row" style="margin-top:14px"><button type="button" class="btn ${isDone ? '' : 'ok'}" data-done>${isDone ? '✓ Done · सकियो (undo)' : 'Mark done · सकियो'}</button></div>`;
  bindTimer($('.timer', host), b.min);
  const bx = $('.bx', host);
  $('[data-done]', host).onclick = () => { const d = host.closest('details'); markBlock(d, n, !blockState(n)[id]); };
  (BLOCK_RENDER[id] || (() => { }))(bx, n, done);
}

const BLOCK_RENDER = {
  review(bx, n, done) {
    const prev = n > 1 ? n - 1 : null; const L = prev && lessonById(lessonIds(prev)[0]);
    const ys = L ? L.s7.slice(0, 5) : (prev && refById(refId(prev)) ? refExamples(refById(refId(prev))).slice(0, 5) : ARKI[0].lines.slice(0, 5));
    bx.innerHTML = `<p class="small muted">Flashcards due today, then 5 sentences from yesterday: read, listen, repeat.</p><div id="rc"></div><h3>5 sentences from ${prev ? 'day ' + prev : 'the start'}</h3><div class="card">${ys.map(s => tri(s[0], s[1], s[2])).join('')}</div>`;
    if (introPool().length && newToday() < 20 && n <= todayDay()) introduce(dayWords(n).length ? dayWords(n) : introPool());
    runCards($('#rc', bx), { onDone: done });
  },
  grammar(bx, n, done) {
    const ls = lessonIds(n).map(lessonById).filter(Boolean); const ref = refById(refId(n)); const k = kindOf(n);
    let h = '';
    if (DAYS[n] && DAYS[n].hw) h += `<div class="note" style="margin-bottom:10px"><b>Core topic: k-p-t.</b> Use the <a href="#kpt">k-p-t trainer</a> with its practice sets after the lesson. · मुख्य विषय: k-p-t।</div>`;
    if (ls.length) h += `<p class="small muted">Work through the 9 steps, then the exercises (30–50 questions).</p><div class="grid">${ls.map(L => `<a class="tile" href="#lesson-${L.id}"><span class="row">${srcTag(L.src)}<span class="tag">${L.mod}</span>${sget('ldone', {})[L.id] ? '<span class="tag ok">✓ done</span>' : ''}</span><b>${esc(L.fi)}</b><span class="t-en">${esc(L.en)}</span><span class="t-ne small">${esc(L.ne)}</span></a>`).join('')}</div>`;
    if (ref) h += `<p class="small muted">Today's grammar from the reference library. The full 9-step lesson for this module comes with the next portal update.</p><div class="grid"><a class="tile" href="#gref-${ref.id}"><span class="row"><span class="tag src">[Lisä]</span><span class="tag">${esc(calOf(n)[0])}</span></span><b>${esc(ref.fi)}</b><span class="t-en">${esc(ref.en)}</span><span class="t-ne small">${esc(ref.ne)}</span></a><button type="button" class="tile" data-mix><b>Mixed practice</b><span class="muted">20 questions on this module's forms</span></button></div>`;
    if (k === 'stage' && n === 8) h += `<div class="grid"><a class="tile" href="#test-a10"><b>Stage test A1.0</b><span class="muted">4 skills · 90 min · pass mark 80%</span></a></div>`;
    else if (k === 'stage') h += `<p class="small muted">Stage test day. Take practice exam ${n === 22 ? 2 : n === 42 ? 3 : 5} as your stage test.</p><div class="grid"><a class="tile" href="#exam-${n === 22 ? 'e2' : n === 42 ? 'e3' : 'e5'}"><b>Practice exam ${n === 22 ? 2 : n === 42 ? 3 : 5}</b><span class="muted">Reading, listening, writing, speaking</span></a></div>`;
    if (k === 'mock') h += `<div class="grid"><a class="tile" href="#exam-${n === 23 ? 'e1' : 'e2'}"><b>Mock exam ${n === 23 ? 'A' : 'B'}</b><span class="muted">90 min · like the class exam</span></a></div>`;
    if (k === 'final') h += `<div class="grid"><a class="tile" href="#exam-${n === 60 ? 'e4' : 'e5'}"><b>Final mock, part ${n - 59}</b><span class="muted">Everything so far</span></a><a class="tile" href="#progress"><b>Level report</b><span class="muted">Your score per skill</span></a></div>`;
    if (!h) h = `<p class="small muted">Review day: mixed practice of everything so far.</p><div class="grid"><button type="button" class="tile" data-mix><b>Mixed practice</b><span class="muted">20 questions</span></button><a class="tile" href="#practice"><b>Practice centre</b><span class="muted">Choose a grammar point</span></a></div>`;
    bx.innerHTML = h;
    const mx = $('[data-mix]', bx); if (mx) mx.onclick = () => { bx.innerHTML = '<div id="q"></div>'; runQuiz($('#q', bx), mixedSet(n, 20), { title: 'Mixed practice', key: 'mix:' + n, day: n, onDone: done }); };
  },
  words(bx, n, done) {
    const ws = dayWords(n);
    if (!ws.length) { bx.innerHTML = `<p>No new words today: review with flashcards. · आज नयाँ शब्द छैन।</p><a class="btn" href="#cards">Flashcards</a>`; return; }
    bx.innerHTML = `<p class="small muted">${ws.length} words for day ${n}. Listen to each word and its example, then add them to your flashcards and play the match game.</p><div class="row" style="margin-bottom:10px"><button type="button" class="btn pri" data-add>Add to flashcards (${ws.length})</button><button type="button" class="btn" data-match>Match game · मिलाउनुहोस्</button></div><div class="wl">${ws.map(wordCard).join('')}</div>`;
    $('[data-add]', bx).onclick = e => { const k = introduce(ws); e.target.textContent = k ? `Added ${k} ✓` : (newToday() >= 20 ? 'Daily limit of 20 new cards reached' : 'Already in your deck ✓'); };
    $('[data-match]', bx).onclick = () => { bx.innerHTML = '<div id="q"></div>'; runQuiz($('#q', bx), wordItems(ws, Math.min(10, ws.length)), { title: 'Sanasto · Words', key: 'words:' + n, skill: 'vocab', day: n, onDone: done }); };
  },
  listen(bx, n, done) {
    const L = DAYS[n] && DAYS[n].lis;
    const drillGen = { 1: 'pairs', 2: 'pairs', 3: 'num20', 4: 'kpt', 5: 'num100', 6: 'num100', 7: 'num20', 8: 'num100', 9: 'qw', 10: 'price' }[n] || rot(['num100', 'price', 'time'], n);
    const drillName = { pairs: 'Long or short sound?', num20: 'Numbers 0–20', num100: 'Numbers 20–100', price: 'Prices', time: 'Clock times', kpt: 'k-p-t forms', qw: 'Which question word?' }[drillGen];
    bx.innerHTML = `<p class="small muted">Routine: read the questions → listen at normal speed → answer → listen again (slow is fine) → check → read the transcript → shadow 3 lines.</p><h3>1 · ${drillName}</h3><div id="ld"></div><h3>2 · Listening text</h3><div id="lt"></div>`;
    let drill = GEN[drillGen](8);
    if (drillGen === 'kpt') drill = drill.map(it => ({ t: 'lis', say: it.a[0], o: shuffle([it.a[0], it.q.split(' + ')[0]]), a: -1, _n: it.a[0], tag: 'kpt' })).map(fixLis);
    if (drillGen === 'qw') drill = pick(QA_BANK, 6).map(q => { const w = q[0].split(' ')[0].replace(/[?,]/g, ''); const o = shuffle(uniq([q[3], ...pick(QA_BANK.filter(x => x !== q), 2).map(x => x[3])])); return { t: 'lis', say: q[0], o, a: o.indexOf(q[3]), tag: 'wc', x: `${q[0]} – ${q[3]}` }; });
    runQuiz($('#ld', bx), drill, { title: drillName, key: 'lis:' + n, skill: 'listening', day: n });
    const lt = $('#lt', bx);
    if (L && L.dlg) { const D = DIALOGUES.find(d => d.id === L.dlg); listenText(lt, { h: [D.fi, D.en, D.ne], lines: D.lines.map(l => [l[0], l[1], l[3], l[4]]), q: D.q }, n, done); }
    else if (L) listenText(lt, L, n, done);
    else { const ex = EXAMS[(n - 11) % EXAMS.length]; const t = ex.listen[Math.floor((n - 11) / EXAMS.length) % ex.listen.length]; listenText(lt, { h: t.h, lines: t.l, q: t.q.map(q => ['mc', q[0], q[1], q[3], q[4]]) }, n, done); }
  },
  read(bx, n, done) {
    const R1 = DAYS[n] && DAYS[n].read;
    if (R1) return readText(bx, R1, n, done);
    if (n % 2) { const s = STORIES[(n - 11) % STORIES.length]; return readText(bx, { h: [s.fi, s.en, s.ne], src: 'Lisä', lines: s.lines, open: s.q }, n, done); }
    const ex = EXAMS[(n - 12) / 2 % EXAMS.length | 0]; const t = ex.read[Math.floor(n / 10) % ex.read.length];
    readText(bx, { h: t.h, src: 'Lisä', lines: t.t, q: t.q.map(q => ['mc', q[0], q[1], q[3], q[4]]) }, n, done);
  },
  speak(bx, n, done) {
    const L = lessonById(lessonIds(n)[0]); const ref = refById(refId(n));
    const shadow = L ? L.s7.slice(0, 10) : ref ? refExamples(ref).slice(0, 10) : ARKI[n % ARKI.length].lines.slice(0, 10);
    const qa = [0, 1, 2].map(k => QA_BANK[(n * 3 + k) % QA_BANK.length]);
    const T = DAYS[n] && DAYS[n].talk;
    const dl = DIALOGUES.find(d => d.day === n);
    const place = PLACES[n % PLACES.length];
    bx.innerHTML = `<h3>1 · Shadowing · छाया अभ्यास (10)</h3><p class="small muted">Play a line, speak with the voice, then say it alone. Slow speed is fine at first.</p><div class="card" data-shadow>${shadow.map(s => tri(s[0], s[1], s[2])).join('')}</div><div class="row" style="margin-top:8px"><button type="button" class="btn sm" data-pall>▶ Play all with pauses</button></div>
    <h3>2 · Question and answer · प्रश्नोत्तर</h3><div class="stack">${qa.map((q, i) => `<div class="card">${tri(q[0], q[1], q[2])}<details style="margin-top:6px"><summary class="small">Show a model answer · नमूना</summary>${tri(q[3], q[4], '')}</details></div>`).join('')}</div>
    <h3>3 · Role-play · भूमिका अभिनय</h3><div class="grid">${dl ? `<a class="tile" href="#dlg-${dl.id}"><b>Dialogue ${dl.n}: ${esc(dl.fi)}</b><span class="muted">${esc(dl.en)} · speak one part</span></a>` : ''}<a class="tile" href="#place-${place.id}"><b>${esc(place.fi)}</b><span class="muted">${esc(place.en)} [Lisä]</span></a></div>
    <h3>4 · Talk for 1 minute · १ मिनेट बोल्नुहोस्</h3><div class="card"><b>${esc(T ? T.h[0] : calOf(n)[2])}</b> <span class="t-en">· ${esc(T ? T.h[1] : '')}</span>${T ? `<ul class="small">${T.help.map(x => `<li>${esc(x)}</li>`).join('')}</ul><details><summary class="small">Show a model · नमूना</summary>${tri(T.model, '', '')}</details>` : `<p class="small muted">Use 5 helper questions: Kuka? Mitä? Missä? Milloin? Miksi?</p>`}${recorderHTML('talk' + n)}${speakChecklist('talk' + n)}</div>`;
    bindRecorders(bx);
    $('[data-pall]', bx).onclick = () => playAll($('[data-shadow]', bx), 2200);
  },
  write(bx, n, done) {
    const W = DAYS[n] && DAYS[n].write;
    if (W) return writingTask(bx, 'd' + n, W);
    const o = WRITING[(n - 11) % WRITING.length];
    writingTask(bx, 'd' + n, { h: [calOf(n)[2], 'Today\'s writing task', 'आजको लेखन'], task: [o[2] + ' · ' + calOf(n)[2], o[5], ''], points: o[6], words: [], check: ['Verb endings match the person.', 'Partitive after numbers 2+.', 'Days and months with a small letter.'], model: o[7], modelEn: o[8] });
  },
  puhe(bx, n, done) {
    const list = DAYS[n] ? DAYS[n].puhe.map(i => PUHE_PAIRS[i]) : [0, 1, 2, 3, 4].map(k => { const s = PUHE_SENT[((n - 11) * 5 + k) % PUHE_SENT.length]; return [s[0], s[1], s[2], s[3]]; });
    bx.innerHTML = `<p class="small muted">Understand the spoken form; write and speak in tests in standard Finnish. Helsinki-region forms.</p><div class="card">${list.map(p => `<div class="tri">${sayBtn(p[1])}<div class="tx"><span class="t-sp" style="font-weight:700">🗣 ${esc(p[1])}</span><span class="fi">📖 ${esc(p[0])}</span><span class="t-en">${esc(p[2])}</span><span class="t-ne">${esc(p[3])}</span></div></div>`).join('')}</div><div class="row" style="margin-top:10px"><button type="button" class="btn" data-g>Game: hear spoken → choose standard</button></div><div id="pg"></div>`;
    $('[data-g]', bx).onclick = () => runQuiz($('#pg', bx), puheGame(list), { title: 'Puhekieli', key: 'puhe:' + n, skill: 'listening', day: n, onDone: done });
  },
  check(bx, n, done) {
    bx.innerHTML = `<p class="small muted">10 mixed questions on today's content. Pass mark 80%.</p><button type="button" class="btn pri" data-go>Start the daily check · सुरु</button><div id="dc"></div>`;
    $('[data-go]', bx).onclick = () => { runQuiz($('#dc', bx), dailyCheck(n), { title: 'Päivän testi · Day ' + n, key: 'check:' + n, skill: 'mixed', day: n, regen: () => dailyCheck(n), onDone: (s, t, p) => { if (p >= 80) done(); } }); };
  }
};
function refExamples(g) { return g.blocks.filter(b => b.t === 'ex').flatMap(b => b.items).map(x => [x[0], x[1], x[2]]); }
function mixedSet(n, k) {
  const m = modNum(n) || 2; const gens = m <= 2 ? ['olla', 'vt1', 'neg', 'ko', 'kpt', 'num100'] : m <= 5 ? ['vt1', 'neg', 'kpt', 'time', 'price', 'country'] : ['kpt', 'vt1', 'neg', 'time', 'price', 'qw'];
  const ref = refById(refId(n)); const chk = ref ? ref.blocks.filter(b => b.t === 'check').flatMap(b => b.items).map(x => ({ t: 'fill', q: x[0], a: [x[1].split(' (')[0]], tag: 'wc', x: x[1] })) : [];
  return shuffle([...pick(chk, 6), ...gens.flatMap(g => GEN[g](4)), ...wordItems(dayWords(n).length ? dayWords(n) : WORDS.filter(w => w.m === m), 4)]).slice(0, k);
}
function dailyCheck(n) {
  const ls = lessonIds(n).map(lessonById).filter(Boolean);
  const pool = ls.flatMap(L => lessonSet(L)).filter(x => x.t !== 'say');
  const words = dayWords(n).length ? dayWords(n) : WORDS.filter(w => w.d && w.d <= Math.min(n, 10));
  const a = pool.length ? pick(pool, 6) : mixedSet(n, 6);
  return shuffle([...a, ...wordItems(words, 4)]).slice(0, 10);
}
function puheGame(list) { return list.map(p => { const others = pick(PUHE_PAIRS.filter(x => x[0] !== p[0]), 2).map(x => x[0]); const o = shuffle([p[0], ...others]); return { t: 'lis', say: p[1], o, a: o.indexOf(p[0]), tag: 'wc', x: `🗣 ${p[1]} = ${p[0]}`, xn: p[3] }; }); }
const wordCard = w => `<div class="wc"><span class="e" aria-hidden="true">${w.e || ''}</span><div class="tx"><div class="row" style="gap:6px"><span class="w">${esc(w.fi)}</span>${sayBtn(w.fi)}</div><div class="t-en small">${esc(w.en)}</div><div class="t-ne small">${esc(w.ne)}</div>${w.sp ? `<div class="t-sp small">🗣 ${esc(w.sp)}</div>` : ''}${w.k ? `<div class="small">k-p-t: <b>${esc(w.k)}</b></div>` : ''}${w.f ? `<div class="small muted">${esc(w.f.gen)} · ${esc(w.f.par)} · ${esc(w.f.ill)}</div>` : ''}${w.vf ? `<div class="small muted">type ${w.vt} · minä ${esc(w.vf[0])} · hän ${esc(w.vf[2])}</div>` : ''}${w.pc ? `<div class="small muted">${w.pc === 'in' ? 'inner cases: -ssa, -sta, -an' : 'outer cases: -lla, -lta, -lle'}</div>` : ''}${w.x && w.x[0] ? `<div class="ex">${sayBtn(w.x[0])} <b>${esc(w.x[0])}</b><br><span class="t-en">${esc(w.x[1])}</span> <span class="t-ne">${esc(w.x[2])}</span></div>` : ''}</div></div>`;
function playAll(box, gap) {
  const lines = $$('.tri', box); let i = 0; let stop = false;
  const next = () => { lines.forEach(l => l.classList.remove('hl')); if (stop || i >= lines.length) return; const l = lines[i++]; l.classList.add('hl'); l.scrollIntoView({ block: 'nearest' }); speak($('[data-say]', l).dataset.say, false, () => setTimeout(next, gap)); };
  next(); const h = () => { stop = true; document.removeEventListener('click', h, true); }; setTimeout(() => document.addEventListener('click', h, true), 50);
}
function readText(bx, T, n, done) {
  const qs = (T.q || []).map(q => q[0] === 'tf' ? { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: ['Totta · True', 'Väärin · False'], a: q[3] ? 0 : 1, tag: 'wc' } : { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: q[3], a: q[4], tag: 'wc' });
  bx.innerHTML = `<p class="small muted">Look at the title → guess the topic → read once without help → answer → tap words to hear them → read aloud.</p><div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(T.h[0])}</h3>${T.src ? srcTag(T.src) : ''}</div><p class="t-en small" style="margin:2px 0 8px">${esc(T.h[1])} · <span class="t-ne">${esc(T.h[2] || '')}</span></p><div class="row" style="margin-bottom:6px"><button type="button" class="chip" data-hide aria-pressed="false">Hide translations · अनुवाद लुकाउनुहोस्</button><button type="button" class="chip" data-pall>▶ Listen to the text</button></div><div data-lines>${T.lines.map(l => tri(l[0], l[1], l[2], { sp: l[3] })).join('')}</div></div>
  ${qs.length ? '<h3>Questions · प्रश्न</h3><div id="rq"></div>' : ''}${T.open ? `<h3>Answer in Finnish · फिनिसमा जवाफ</h3><div class="stack">${T.open.map(q => `<div class="card">${tri(q[0], '', '')}<details><summary class="small">Model answer</summary>${tri(q[1], '', '')}</details></div>`).join('')}</div>` : ''}`;
  const hideBtn = $('[data-hide]', bx); hideBtn.onclick = () => { const on = hideBtn.getAttribute('aria-pressed') !== 'true'; hideBtn.setAttribute('aria-pressed', on); $('[data-lines]', bx).classList.toggle('hide-en', on); $('[data-lines]', bx).classList.toggle('hide-ne', on); };
  $('[data-pall]', bx).onclick = () => playAll($('[data-lines]', bx), 700);
  if (qs.length) runQuiz($('#rq', bx), qs, { title: 'Lukeminen', key: 'read:' + (n || T.h[0]), skill: 'reading', day: n, onDone: (s, t, p) => { if (p >= 60 && done) done(); } });
}
function listenText(host, T, n, done) {
  const qs = (T.q || []).map(q => q[0] === 'tf' ? { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: ['Totta · True', 'Väärin · False'], a: q[3] ? 0 : 1, tag: 'wc' } : { t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: q[3], a: q[4], tag: 'wc' });
  host.innerHTML = `<div class="card"><b>${esc(T.h[0])}</b> <span class="t-en small">· ${esc(T.h[1])}</span><p class="small muted" style="margin:6px 0">Read the questions first. Then listen.</p><ol class="small">${qs.map(q => `<li>${q.q}</li>`).join('')}</ol><div class="row"><button type="button" class="btn pri sm" data-l="1">▶ Listen</button><button type="button" class="btn sm" data-l="slow">▶ Slow</button><button type="button" class="btn sm ghost" data-tr>Show the transcript</button></div><div data-tx hidden style="margin-top:8px">${T.lines.map(l => l.length === 4 && l[0].length <= 2 ? tri(l[1], l[2], l[3], { who: l[0] }) : tri(l[0], l[1], l[2])).join('')}</div></div><div id="lq" style="margin-top:10px"></div>`;
  const text = T.lines.map(l => l.length === 4 && l[0].length <= 2 ? l[1] : l[0]);
  const playSeq = slow => { let i = 0; const nx = () => { if (i < text.length) speak(text[i++], slow, () => setTimeout(nx, 500)); }; nx(); };
  $('[data-l="1"]', host).onclick = () => playSeq(false); $('[data-l="slow"]', host).onclick = () => playSeq(true);
  $('[data-tr]', host).onclick = () => { $('[data-tx]', host).hidden = false; };
  runQuiz($('#lq', host), qs, { title: 'Kuuntelu', key: 'listen:' + (n || T.h[0]), skill: 'listening', day: n, onDone: (s, t, p) => { if (p >= 60 && done) done(); } });
}

R.map = m => {
  const t = dayOfISO(todayISO()); const cu = new Set(catchUps());
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Kurssi · Course map</h1><p class="lede">61 days, 4 stages, 4 tests and the class exam on 25–26 Nov. Tap a day to open its plan. · दिन छान्नुहोस्।</p>
  <div class="legend"><span><i style="background:var(--ok-soft)"></i>done</span><span><i style="outline:2px solid var(--accent)"></i>today</span><span><i style="background:var(--almost-soft)"></i>catch-up</span><span><i style="border:1px dashed var(--accent)"></i>test</span><span><i style="background:var(--accent)"></i>class exam</span></div>` +
    STAGES.map(s => `<section class="stage"><div class="parth"><h2>${s.id} · ${s.name}</h2><span class="muted small">${fmtDay(s.from)} – ${fmtDay(s.to)} · ${s.mods}</span></div><div class="days">${Array.from({ length: s.to - s.from + 1 }, (_, i) => s.from + i).map(d => { const k = kindOf(d); const cls = [dayDone(d) ? 'done' : '', d === t ? 'today' : '', cu.has(d) && !dayDone(d) ? 'catch' : '', (k === 'stage' || k === 'mock' || k === 'final' || k === 'week') ? 'test' : '', k === 'exam' ? 'exam' : ''].join(' '); return `<a class="dcell ${cls}" href="#day-${d}" title="${esc(calOf(d)[1])}"><b>${d}</b><span>${fmtFi(d)}</span><span>${esc(calOf(d)[0])}</span></a>`; }).join('')}</div></section>`).join('') +
    `<h2>Can-do checks · म के गर्न सक्छु</h2>` + Object.entries(CANDO).map(([mod, list]) => `<div class="card cando"><b>${mod}</b>${list.map((c, i) => `<label><input type="checkbox" data-cd="${mod}:${i}" ${sget('cando', {})[mod + ':' + i] ? 'checked' : ''}><span><b>${esc(c[0])}</b> <span class="t-en">– ${esc(c[1])}</span> <span class="t-ne">– ${esc(c[2])}</span></span></label>`).join('')}</div>`).join('');
  m.onchange = e => { const c = e.target.closest('[data-cd]'); if (c) { const o = sget('cando', {}); o[c.dataset.cd] = c.checked ? 1 : 0; sset('cando', o); } };
};
R.day = (m, arg) => {
  const n = Math.max(1, Math.min(61, +arg || 1)); const c = calOf(n);
  m.innerHTML = crumbs(['map', 'Kurssi'], ['today', 'Tänään']) + `<p class="eyebrow">Päivä ${n}/61 · ${fmtDay(n)} · ${esc(c[0])}</p><h1>${esc(c[1])}</h1><p class="lede">Day task · दिनको काम: <b>${esc(c[2])}</b></p><div class="row"><span class="tag">${Math.round(dayProgress(n) * 100)}% done</span>${n > 1 ? `<a class="btn sm ghost" href="#day-${n - 1}">← Day ${n - 1}</a>` : ''}${n < 61 ? `<a class="btn sm ghost" href="#day-${n + 1}">Day ${n + 1} →</a>` : ''}</div><div id="dp"></div>`;
  dayPlan($('#dp', m), n);
};
