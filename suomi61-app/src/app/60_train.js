// ===== Practise, tests, homework, progress, mistakes, settings =====
// R.cards is in 70_chapters.js
function startRepair(tags) {
  const host = $('#prac'); if (!host) return;
  const T = new Set(tags);
  const fromMist = sget('mist', []).filter(x => T.has(x.tag)).slice(0, 10).map(x => ({ t: 'fill', q: x.p, a: [x.a], tag: x.tag, x: x.x, xn: x.xn }));
  const genFor = { ve: ['olla', 'vt1', 'neg'], vt: ['vt1'], kpt: ['kpt'], case: ['country'], part: ['price', 'country'], vh: ['vh', 'ko'], aa: ['vh'], ls: ['pairs'], wo: [], wc: ['qw'], sp: ['alpha', 'num100'] };
  const gens = uniq([...T].flatMap(t => genFor[t] || []));
  const lessonItems = LESSONS.flatMap(L => L.s9.map(toItem)).filter(it => T.has(it.tag));
  const items = shuffle([...fromMist, ...pick(lessonItems, 8), ...gens.flatMap(g => GEN[g](4))]).slice(0, 20);
  host.scrollIntoView({ block: 'start' });
  runQuiz(host, items.length ? items : mixedSet(todayDay(), 15), { title: 'Repair · मर्मत: ' + [...T].map(t => TAGS[t] ? TAGS[t][0] : t).join(', '), key: 'repair', skill: 'grammar' });
}
R.practice = m => {
  const tags = topTags(5);
  m.innerHTML = crumbs(['train', 'Harjoittele']) + `<h1>Harjoittele · Practice centre</h1><p class="lede">By grammar point, by skill or by your own error tags. · व्याकरण, सीप वा आफ्नै गल्तीअनुसार।</p>
  <div id="prac"></div>
  <h2>By grammar point</h2><div class="grid">${LESSONS.map(L => `<button type="button" class="tile" data-l="${L.id}"><b>${esc(L.fi)}</b><span class="t-en">${esc(L.en)}</span><span class="small muted">${L.s9.length} + generated · ${L.mod}</span></button>`).join('')}</div>
  <h2>By skill</h2><div class="grid sm">${[['pairs', 'Long / short sounds', 'listening'], ['num100', 'Numbers by ear', 'listening'], ['price', 'Prices', 'listening'], ['time', 'Clock times', 'listening'], ['kpt', 'k-p-t forms', 'grammar'], ['vt1', 'Verb type 1', 'grammar'], ['neg', 'Negative sentence', 'grammar'], ['ko', '-ko/-kö questions', 'grammar'], ['country', 'Countries & languages', 'vocab'], ['qw', 'Question words', 'grammar'], ['olla', 'olla', 'grammar'], ['vh', 'Vowel harmony', 'grammar']].map(g => `<button type="button" class="tile" data-gen="${g[0]}" data-sk="${g[2]}"><b>${esc(g[1])}</b><span class="small muted">${g[2]}</span></button>`).join('')}</div>
  <h2>By your errors</h2>${tags.length ? `<div class="row">${tags.map(([k, c]) => `<span class="tag bad">${esc(TAGS[k] ? TAGS[k][0] : k)} · ${c}</span>`).join('')}</div><div class="row" style="margin-top:8px"><button type="button" class="btn pri" data-rep>Practise my top errors</button><a class="btn" href="#mistakes">Mistake notebook</a></div>` : '<p class="empty">No errors yet. Your wrong answers will appear here with their tags.</p>'}
  <h2>Random mix</h2><button type="button" class="btn" data-mix>20 random questions · M0–M2</button>`;
  m.onclick = e => {
    const host = $('#prac', m);
    const l = e.target.closest('[data-l]'); if (l) { const L = lessonById(l.dataset.l); host.scrollIntoView({ block: 'start' }); runQuiz(host, lessonSet(L), { title: L.fi, key: 'lesson:' + L.id, example: () => pick(L.s7, 1)[0], regen: () => lessonSet(L) }); }
    const g = e.target.closest('[data-gen]'); if (g) { host.scrollIntoView({ block: 'start' }); runQuiz(host, GEN[g.dataset.gen](12), { title: $('b', g).textContent, key: 'gen:' + g.dataset.gen, skill: g.dataset.sk, regen: () => GEN[g.dataset.gen](12) }); }
    if (e.target.closest('[data-rep]')) startRepair(tags.map(t => t[0]));
    if (e.target.closest('[data-mix]')) { host.scrollIntoView({ block: 'start' }); runQuiz(host, shuffle(LESSONS.flatMap(L => lessonSet(L))).filter(x => x.t !== 'say').slice(0, 20), { title: 'Random mix', key: 'mix' }); }
  };
};

R.qlab = m => {
  m.innerHTML = crumbs(['train', 'Harjoittele']) + `<h1>Kysymykset · Question lab</h1><p class="lede">Asking is the skill you use most. Question words, -ko/-kö questions, polite requests and ${QA_BANK.length} exam-style questions with voice. · प्रश्न प्रयोगशाला।</p>
  <div class="row" style="margin-bottom:10px"><button type="button" class="btn pri" data-ex>Exam questions: hear → answer aloud → compare</button><button type="button" class="btn" data-qw>Question-word drill</button></div><div id="qx"></div>
  <h2>Question words</h2>${QGROUPS.map(g => `<details class="blk"><summary><span class="bn">${g.icon}</span><span class="bt"><b>${esc(g.en)}</b> <span class="t-ne">${esc(g.ne)}</span><span class="t-en small"> · ${md(g.logic)}</span></span><span class="bm">${g.items.length}</span></summary><div class="bd">${g.items.map(it => `<div class="card"><div class="row"><b>${esc(it[0])}</b><span class="t-en">${esc(it[1])}</span><span class="t-ne">${esc(it[2])}</span><span class="small muted">${esc(it[3])}</span></div>${it[4].map(x => tri(x[0] + ' – ' + x[1], x[2], x[3])).join('')}${it[5] ? `<p class="small muted" style="margin:4px 0 0">${esc(it[5])}</p>` : ''}</div>`).join('')}</div></details>`).join('')}
  <h2>Yes/no: statement → question</h2><div class="card">${KO_EX.map(k => tri(k[1], k[0] + ' → ' + k[1] + ' · ' + k[2], '')).join('')}<p class="small" style="margin-top:8px">Answer with the verb: Puhutko suomea? – Puhun. / En puhu. Nepali works the same way: बोल्छौ? – बोल्छु।</p></div>
  <h2>Polite requests</h2><div class="card">${POLITE.map(p => tri(p[0], p[1] + (p[3] ? ' · ' + p[3] : ''), p[2])).join('')}</div>
  <h2>Exam questions with model answers</h2><div class="card">${QA_BANK.map(q => `<div class="tri">${sayBtn(q[0])}<div class="tx"><span class="fi">${esc(q[0])}</span><span class="t-en">${esc(q[1])}</span><span class="t-ne">${esc(q[2])}</span><details><summary class="small">Model</summary><span>${esc(q[3])}</span> <span class="t-en small">${esc(q[4])}</span></details></div></div>`).join('')}</div>`;
  $('[data-ex]', m).onclick = () => runQuiz($('#qx', m), pick(QA_BANK, 8).map(q => ({ t: 'say', q: '🔊 ' + q[0] + ' · ' + q[1], qn: q[2], model: q[3] })), { title: 'Exam questions', key: 'qlab', skill: 'speaking' });
  $('[data-qw]', m).onclick = () => runQuiz($('#qx', m), GEN.qw(10), { title: 'Question words', key: 'gen:qw', regen: () => GEN.qw(10) });
  $$('[data-ex], [data-qw]', m).forEach(b => b.addEventListener('click', () => setTimeout(() => { const q = $('.quiz', m); if (q) { const it = q.querySelector('.qp'); if (it && it.textContent.includes('🔊')) speak(it.textContent.split('🔊 ')[1].split(' · ')[0]); } }, 100)));
};

// writing tasks (block 7 and the Kirjoita screen)
function writingTask(host, id, W) {
  const saved = sget('w:' + id, '');
  host.innerHTML = `<div class="card"><b>${esc(W.h[0])}</b> <span class="t-en">· ${esc(W.h[1])}</span>${W.h[2] ? ` <span class="t-ne">· ${esc(W.h[2])}</span>` : ''}<p style="margin-top:8px"><b>${esc(W.task[0])}</b></p>${W.task[1] ? `<p class="t-en">${esc(W.task[1])}</p>` : ''}${W.task[2] ? `<p class="t-ne">${esc(W.task[2])}</p>` : ''}
  ${W.points && W.points.length ? `<p class="small" style="margin:0"><b>Include:</b> ${W.points.map(esc).join(' · ')}</p>` : ''}${W.words && W.words.length ? `<p class="small"><b>Word bank:</b> ${W.words.map(w => `<span class="fiw" data-say="${esc(w)}">${esc(w)}</span>`).join(', ')}</p>` : ''}</div>
  <textarea id="wt-${id}" aria-label="Your text" placeholder="Kirjoita tähän … · यहाँ लेख्नुहोस्" style="margin-top:10px">${esc(saved)}</textarea><div class="keys">${['ä', 'ö', 'å', 'Ä', 'Ö'].map(c => `<button type="button" class="key" data-k="${c}">${c}</button>`).join('')}<span class="small muted" style="margin-left:auto" data-wc></span></div>
  ${W.check ? `<div class="cando small">${W.check.map((c, i) => `<label><input type="checkbox" data-ck="w${id}:${i}" ${sget('ck', {})['w' + id + ':' + i] ? 'checked' : ''}><span>${esc(c)}</span></label>`).join('')}</div>` : ''}
  <div class="row" style="margin-top:10px"><button type="button" class="btn" data-model>Show the model answer · नमूना</button><button type="button" class="btn ghost" data-claude hidden>✨ Check my writing with Claude</button></div>
  <div data-mo hidden class="note" style="margin-top:10px">${tri(W.model, W.modelEn || '', '')}</div><div class="note small" data-fb hidden style="margin-top:10px"></div>`;
  const ta = $('textarea', host), wc = $('[data-wc]', host);
  const count = () => { const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; wc.textContent = n + ' words'; };
  ta.oninput = () => { sset('w:' + id, ta.value); count(); }; count();
  $$('[data-k]', host).forEach(b => b.onclick = () => { const p = ta.selectionStart; ta.value = ta.value.slice(0, p) + b.dataset.k + ta.value.slice(ta.selectionEnd); ta.focus(); ta.setSelectionRange(p + 1, p + 1); ta.oninput(); });
  $('[data-model]', host).onclick = () => { if (!ta.value.trim()) { toast('Write your own text first, then compare. · पहिले आफैं लेख्नुहोस्।'); ta.focus(); return; } $('[data-mo]', host).hidden = false; };
  const cb = $('[data-claude]', host); cb.hidden = !CAP.sample; cb.onclick = () => { if (!ta.value.trim()) { ta.focus(); return; } askClaude(FEEDBACK_PROMPT(ta.value), $('[data-fb]', host)); };
}
R.write = m => {
  m.innerHTML = crumbs(['train', 'Harjoittele']) + `<h1>Kirjoita · Writing</h1><p class="lede">Each task has the situation in three languages, a word bank, a checklist and a hidden model answer. Your texts are saved on this device. · लेखन।</p>
  <h2>Days 1–10</h2><div class="grid">${Object.entries(DAYS).map(([d, D]) => `<button type="button" class="tile" data-w="d${d}"><span class="tag">Day ${d}</span><b>${esc(D.write.h[0])}</b><span class="t-en">${esc(D.write.h[1])}</span>${sget('w:d' + d, '') ? '<span class="tag ok">✓ written</span>' : ''}</button>`).join('')}</div>
  <h2>More tasks [Lisä]</h2><div class="grid">${WRITING.map(w => `<button type="button" class="tile" data-w="${w[0]}"><span class="tag">${esc(w[4])}</span><b>${w[1]} ${esc(w[2])}</b><span class="t-en">${esc(w[3])}</span>${sget('w:' + w[0], '') ? '<span class="tag ok">✓ written</span>' : ''}</button>`).join('')}</div>
  <h2>Chat partner</h2><div class="card" data-claude hidden><p class="small">A short chat in simple A1 Finnish. Claude answers in at most 2 short sentences and asks you one question. Ask “Mitä tarkoittaa …?” for help. · सजिलो फिनिसमा कुराकानी।</p><div class="chat" id="chat"></div><div class="row" style="margin-top:8px"><input type="text" id="chin" placeholder="Kirjoita suomeksi …" aria-label="Your message" style="flex:1"><button type="button" class="btn pri" id="chgo">Send</button></div></div><p class="small muted" data-noclaude>The chat partner and Claude feedback work when this portal is opened as a Claude artifact. Without them, compare your text with the model answer and the checklist.</p><div id="wx"></div>`;
  m.onclick = e => { const b = e.target.closest('[data-w]'); if (!b) return; const id = b.dataset.w; const host = $('#wx', m); if (id[0] === 'd') writingTask(host, id, DAYS[id.slice(1)].write); else { const o = WRITING.find(w => w[0] === id); writingTask(host, id, { h: [o[2], o[3], ''], task: [o[5], '', ''], points: o[6], words: [], check: ['Verb endings match the person.', 'Partitive after numbers 2+.', 'Capital letters only for names.'], model: o[7], modelEn: o[8] }); } host.scrollIntoView({ block: 'start' }); };
  $$('[data-claude]', m).forEach(x => { x.hidden = !CAP.sample; }); $$('[data-noclaude]', m).forEach(x => { x.hidden = !!CAP.sample; });
  if (CAP.sample) {
    const hist = []; const box = $('#chat', m); const topic = calOf(todayDay())[1];
    const send = async () => { const i = $('#chin', m); const t = i.value.trim(); if (!t) return; i.value = ''; hist.push({ role: 'user', content: t }); box.insertAdjacentHTML('beforeend', `<div class="msg me">${esc(t)}</div>`); const out = document.createElement('div'); out.className = 'msg'; out.textContent = '…'; box.appendChild(out); box.scrollTop = box.scrollHeight;
      try { const r = await CAP.sample([{ role: 'user', content: `You are a friendly Finnish conversation partner for an A1 learner whose first language is ${hlName()} and who knows English. Today's topic: ${topic}. Rules: answer in very simple standard Finnish, at most 2 short sentences, then ask one simple question. If the learner writes in English or ${hlName()}, or asks “Mitä tarkoittaa”, help briefly in English and Nepali, then continue in Finnish. If the learner makes a mistake, show the right form in one short line first.` }, { role: 'assistant', content: 'Selvä. Aloitetaan!' }, ...hist], { onText: ({ text }) => { out.textContent = text; box.scrollTop = box.scrollHeight; }, cache: false }); out.textContent = r.text; hist.push({ role: 'assistant', content: r.text }); } catch (e) { out.textContent = 'The chat is not available right now.'; } };
    $('#chgo', m).onclick = send; $('#chin', m).onkeydown = e => { if (e.key === 'Enter') send(); };
    box.innerHTML = `<div class="msg">Hei! Mitä kuuluu? Mikä sinun nimesi on?</div>`;
  }
};

// ===== tests =====
R.testit = m => {
  const sc = sget('scores', []);
  const checks = sc.filter(s => s.k.startsWith('check:'));
  m.innerHTML = `<h1>Testit · Tests</h1><p class="lede">Daily checks, stage tests, practice exams like the class exam, and your results. Pass mark 80%. · परीक्षा।</p>
  <h2>Stage tests</h2><div class="grid"><a class="tile" href="#test-a10"><span class="row"><span class="tag">8 Nov</span>${bestOf('stage:A1.0')}</span><b>Vaihetesti A1.0</b><span class="muted">Listening, reading, grammar, writing, speaking · 90 min</span></a><a class="tile" href="#exam-e2"><span class="tag">22 Nov</span><b>Stage test A1.1</b><span class="muted">Use practice exam 2</span></a><a class="tile" href="#exam-e3"><span class="tag">12 Dec</span><b>Stage test A1.2</b><span class="muted">Use practice exam 3</span></a></div>
  <h2>Practice exams · class-exam format</h2><div class="grid">${EXAMS.map((e, i) => `<a class="tile" href="#exam-${e.id}"><span class="row"><span class="tag">${['Mock A · 23 Nov', 'Mock B · 24 Nov', 'Stage A1.2', 'Final part 1', 'Final part 2'][i]}</span>${bestOf('exam:' + e.id)}</span><b>${e.e} ${esc(e.fi)}</b><span class="t-en">${esc(e.en)} · ${esc(e.lvl)}</span></a>`).join('')}</div>
  <h2>Daily checks</h2>${checks.length ? `<div class="tbl"><table><thead><tr><th>Date</th><th>Day</th><th>Score</th></tr></thead><tbody>${checks.slice(-15).reverse().map(c => `<tr><td class="num">${esc(c.d)}</td><td>${c.day || ''}</td><td><span class="tag ${c.p >= 80 ? 'ok' : 'warn'}">${c.s}/${c.t} · ${c.p}%</span></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">No daily checks yet. Each day ends with block 9: 10 questions.</p>'}
  <div class="row" style="margin-top:10px"><a class="btn pri" href="#day-${todayDay()}">Today's daily check</a></div>`;
};
function bestOf(k) { const s = sget('scores', []).filter(x => x.k === k); if (!s.length) return ''; const b = Math.max(...s.map(x => x.p)); return `<span class="tag ${b >= 80 ? 'ok' : 'warn'}">best ${b}%</span>`; }
R.test = (m, id) => {
  const T = STAGE_TESTS['A1.0']; if (id !== 'a10') { m.innerHTML = '<div class="note">Test not found. <a href="#testit">Tests</a></div>'; return; }
  m.innerHTML = crumbs(['testit', 'Testit']) + `<p class="eyebrow">Day ${T.day} · ${fmtDay(T.day)}</p><h1>${esc(T.title[0])}</h1><p class="lede"><span class="t-en">${esc(T.title[1])}</span> · <span class="t-ne">${esc(T.title[2])}</span> · ${T.min} min. Auto-scored parts need 80%. Writing and speaking use the 10-point rubric.</p><div class="row" style="margin-bottom:12px">${T.parts.map(p => `<button type="button" class="chip" data-p="${p.id}">${esc(p.fi)} · ${p.min} min ${bestOf('stage:A1.0:' + p.id)}</button>`).join('')}</div><div id="tp"></div>`;
  const host = $('#tp', m);
  const open = pid => {
    const p = T.parts.find(x => x.id === pid); $$('[data-p]', m).forEach(b => b.setAttribute('aria-pressed', b.dataset.p === pid));
    const tmr = timerHTML(0, { id: pid, min: p.min });
    if (p.items) { host.innerHTML = `${tmr}${p.text ? `<div class="card"><b>${esc(p.text.h[0])}</b> <span class="t-en small">${esc(p.text.h[1])}</span>${p.text.lines.map(l => tri(l[0], l[1], l[2])).join('')}</div>` : ''}<div id="tq" style="margin-top:10px"></div>`; bindTimer($('.timer', host), p.min); runQuiz($('#tq', host), p.items, { title: p.fi, key: 'stage:A1.0:' + pid, skill: pid === 'listen' ? 'listening' : pid === 'read' ? 'reading' : 'grammar', onDone: () => stageTotal() }); }
    if (p.task) { host.innerHTML = tmr + '<div id="tw"></div>' + rubricHTML('A1.0w'); bindTimer($('.timer', host), p.min); writingTask($('#tw', host), 'stageA10', p.task); bindRubric(host, 'A1.0w', 'stage:A1.0:write', 'writing'); }
    if (p.tasks) { host.innerHTML = tmr + p.tasks.map((t, i) => `<div class="card"><b>${esc(t[0])}</b> <span class="t-en">· ${esc(t[1])}</span> <span class="t-ne">· ${esc(t[2])}</span>${recorderHTML('stage' + i)}<details style="margin-top:6px"><summary class="small">Model answer</summary>${tri(t[3], '', '')}</details></div>`).join('') + rubricHTML('A1.0s'); bindTimer($('.timer', host), p.min); bindRecorders(host); bindRubric(host, 'A1.0s', 'stage:A1.0:speak', 'speaking'); }
  };
  m.onclick = e => { const b = e.target.closest('[data-p]'); if (b) open(b.dataset.p); };
  open('listen');
};
function stageTotal() { const s = sget('scores', []); const last = {}; s.filter(x => x.k.startsWith('stage:A1.0:')).forEach(x => { last[x.k] = x; }); const v = Object.values(last); if (v.length >= 3) { const p = Math.round(v.reduce((a, x) => a + x.p, 0) / v.length); const sc = sget('scores', []); sc.push({ k: 'stage:A1.0', s: p, t: 100, p, d: todayISO(), sk: 'mixed' }); sset('scores', sc); } }
const rubricHTML = key => `<div class="card" style="margin-top:12px"><b>Rubric · 10 points</b><p class="small muted">Compare with the model and score yourself honestly.</p>${RUBRIC.map((r, i) => `<div class="row" style="justify-content:space-between;padding:4px 0"><span>${esc(r[0])} <span class="muted small">(${r[2]})</span></span><select data-rb="${key}:${i}" aria-label="${esc(r[0])}" style="width:auto">${Array.from({ length: r[2] + 1 }, (_, k) => `<option value="${k}" ${(sget('rb', {})[key + ':' + i] || 0) === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`).join('')}<div class="row"><b data-rbt>0/10</b><button type="button" class="btn sm pri" data-rbs>Save score</button></div></div>`;
function bindRubric(host, key, scoreKey, skill) { const upd = () => { const o = sget('rb', {}); let t = 0; $$('[data-rb]', host).forEach(s => { o[s.dataset.rb] = +s.value; t += +s.value; }); sset('rb', o); $('[data-rbt]', host).textContent = t + '/10'; return t; }; $$('[data-rb]', host).forEach(s => s.onchange = upd); upd(); $('[data-rbs]', host).onclick = () => { const t = upd(); const sc = sget('scores', []); sc.push({ k: scoreKey, s: t, t: 10, p: t * 10, d: todayISO(), sk: skill }); sset('scores', sc); toast('Saved: ' + t + '/10'); stageTotal(); }; }
R.exam = (m, id) => {
  const E = EXAMS.find(e => e.id === id); if (!E) { m.innerHTML = '<div class="note">Exam not found. <a href="#testit">Tests</a></div>'; return; }
  const parts = [['read', 'Lukeminen', 'Reading', 20], ['listen', 'Kuuntelu', 'Listening', 20], ['write', 'Kirjoittaminen', 'Writing', 30], ['speak', 'Puhuminen', 'Speaking', 20]];
  m.innerHTML = crumbs(['testit', 'Testit']) + `<span class="tag src">[Lisä]</span><h1 style="margin-top:6px">${E.e} ${esc(E.fi)}</h1><p class="lede"><span class="t-en">${esc(E.en)}</span> · ${esc(E.lvl)} · 90 min like the class exam: reading 20, listening 20, writing 30, speaking 20.</p><div class="row" style="margin-bottom:12px">${parts.map(p => `<button type="button" class="chip" data-p="${p[0]}">${p[1]} · ${p[3]} min ${bestOf('exam:' + E.id + ':' + p[0])}</button>`).join('')}</div><div id="ep"></div>`;
  const host = $('#ep', m);
  const open = pid => {
    const p = parts.find(x => x[0] === pid); $$('[data-p]', m).forEach(b => b.setAttribute('aria-pressed', b.dataset.p === pid));
    host.innerHTML = timerHTML(0, { id: pid, min: p[3] }) + '<div id="eb"></div>'; bindTimer($('.timer', host), p[3]); const eb = $('#eb', host);
    if (pid === 'read') { eb.innerHTML = E.read.map((t, i) => `<div class="card"><b>${t.k} ${esc(t.h[0])}</b> <span class="t-en small">${esc(t.h[1])}</span>${t.t.map(l => tri(l[0], l[1], l[2])).join('')}</div>`).join('') + '<div id="eq" style="margin-top:12px"></div>'; runQuiz($('#eq', eb), E.read.flatMap(t => t.q.map(q => ({ t: 'mc', q: `${q[0]} <span class="t-en">· ${q[1]}</span>`, o: q[3], a: q[4], tag: 'wc' }))), { title: 'Lukeminen', key: 'exam:' + E.id + ':read', skill: 'reading' }); }
    if (pid === 'listen') { let k = 0; const step = () => { if (k >= E.listen.length) { eb.innerHTML = '<div class="note ok">Listening part done. · सुनाइ सकियो।</div>'; return; } const t = E.listen[k++]; eb.innerHTML = `<p class="small muted">Task ${k}/${E.listen.length}. Each text plays twice.</p><div id="lt"></div><div class="row" style="margin-top:10px"><button type="button" class="btn" data-nx>Next task →</button></div>`; listenText($('#lt', eb), { h: t.h, lines: t.l, q: t.q.map(q => ['mc', q[0], q[1], q[3], q[4]]) }, null); $('[data-nx]', eb).onclick = step; }; step(); }
    if (pid === 'write') { eb.innerHTML = E.write.map((w, i) => `<div id="ew${i}" style="margin-bottom:14px"></div>`).join('') + rubricHTML('ex' + E.id); E.write.forEach((w, i) => writingTask($('#ew' + i, eb), E.id + 'w' + i, { h: w.h, task: w.task, points: w.fields || w.frames || [], words: [], check: null, model: w.model[0], modelEn: w.model[1] })); bindRubric(eb, 'ex' + E.id, 'exam:' + E.id + ':write', 'writing'); }
    if (pid === 'speak') { eb.innerHTML = E.speak.map((s, i) => `<div class="card"><b>${esc(s.h[0])}</b> <span class="t-en">· ${esc(s.h[1])}</span> <span class="t-ne">· ${esc(s.h[2])}</span> <span class="tag">prepare ${s.prep}s · speak ${s.time}s</span>${s.pic ? `<div style="font-size:2.2rem;margin:6px 0">${s.pic}</div>` : ''}${s.items.map(it => `<div style="margin-top:8px">${tri(it[0], it[1], it[2])}<details><summary class="small">Model</summary>${tri(it[3], it[4] || '', '')}</details></div>`).join('')}${recorderHTML('ex' + E.id + i)}</div>`).join('') + rubricHTML('exs' + E.id); bindRecorders(eb); bindRubric(eb, 'exs' + E.id, 'exam:' + E.id + ':speak', 'speaking'); }
  };
  m.onclick = e => { const b = e.target.closest('[data-p]'); if (b) open(b.dataset.p); };
  open('read');
};

// homework list (allHomework, R.hw) is in 70_chapters.js
// ===== progress and level report =====
R.progress = m => {
  const sc = sget('scores', []); const c = cards();
  const skills = [['listening', 'Kuuntelu', 'Listening'], ['reading', 'Lukeminen', 'Reading'], ['writing', 'Kirjoittaminen', 'Writing'], ['speaking', 'Puhuminen', 'Speaking'], ['grammar', 'Rakenteet', 'Grammar'], ['vocab', 'Sanasto', 'Vocabulary']];
  const avg = sk => { const s = sc.filter(x => x.sk === sk).slice(-10); return s.length ? Math.round(s.reduce((a, x) => a + x.p, 0) / s.length) : null; };
  const learned = Object.entries(c).filter(([k, v]) => k.startsWith('w:') && v.b >= 3).length;
  const inDeck = Object.keys(c).filter(k => k.startsWith('w:')).length;
  const min = sget('min', {}); const days = Object.keys(min).sort().slice(-14);
  const maxMin = Math.max(210, ...days.map(d => min[d]));
  const tags = topTags(8); const maxT = Math.max(1, ...tags.map(t => t[1]));
  const doneDays = Array.from({ length: 61 }, (_, i) => i + 1).filter(dayDone).length;
  m.innerHTML = crumbs(['me', 'Minä']) + `<h1>Edistyminen · Progress</h1><p class="lede">Scores per skill (last 10 results), words learned, minutes, error tags and your estimated level. · प्रगति।</p>
  <div class="stats" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))"><div class="stat"><b>${doneDays}/61</b><span>days complete</span></div><div class="stat"><b>${learned}</b><span>words learned (box 3+)</span></div><div class="stat"><b>${inDeck}</b><span>words in your deck</span></div><div class="stat"><b>${Object.keys(sget('ldone', {})).length}/${LESSONS.length}</b><span>lessons passed</span></div></div>
  <h2>Level report · स्तर रिपोर्ट</h2><div class="card">${skills.map(s => { const a = avg(s[0]); return `<div class="hbar"><span>${s[1]}</span><div class="bar ${a != null && a >= 80 ? 'ok' : ''}"><i style="width:${a || 0}%"></i></div><span class="num">${a == null ? '–' : a + '%'}</span></div>`; }).join('')}<p class="small" style="margin-top:8px">${levelText(skills.map(s => avg(s[0])))}</p><p class="small muted">Estimated level only. This is an “A1.3 target”, not a certificate, a YKI result or a class grade.</p></div>
  <h2>Minutes per day</h2><div class="card">${days.length ? days.map(d => `<div class="hbar"><span class="num">${d.slice(5)}</span><div class="bar"><i style="width:${Math.round(min[d] / maxMin * 100)}%"></i></div><span class="num">${Math.round(min[d])}</span></div>`).join('') : '<p class="empty">Start a block timer to log your minutes.</p>'}</div>
  <h2>Error tags</h2><div class="card">${tags.length ? tags.map(([k, n]) => `<div class="hbar"><span>${esc(TAGS[k] ? TAGS[k][0] : k)}</span><div class="bar"><i style="width:${Math.round(n / maxT * 100)}%;background:var(--bad)"></i></div><span class="num">${n}</span></div>`).join('') : '<p class="empty">No errors logged yet.</p>'}</div>
  <h2>Modules</h2><div class="tbl"><table><thead><tr><th>Module</th><th>Days done</th><th>Lessons</th></tr></thead><tbody>${['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'].map(md2 => { const ds = CAL.map((c, i) => c[0].startsWith(md2) && (c[0] === md2 || c[0].startsWith(md2 + '–') || c[0].startsWith(md2 + ' ')) ? i + 1 : 0).filter(Boolean); const ls = LESSONS.filter(L => L.mod.startsWith(md2)); return `<tr><td>${md2}</td><td class="num">${ds.filter(dayDone).length}/${ds.length}</td><td class="num">${ls.length ? ls.filter(L => sget('ldone', {})[L.id]).length + '/' + ls.length : '–'}</td></tr>`; }).join('')}</tbody></table></div>`;
};
function levelText(a) { const vals = a.filter(x => x != null); if (!vals.length) return 'Do some daily checks and tests to see your level. · स्तर हेर्न परीक्षा दिनुहोस्।'; const low = ['Listening', 'Reading', 'Writing', 'Speaking', 'Grammar', 'Vocabulary'].filter((s, i) => a[i] != null && a[i] < 80); const stage = STAGES.find(s => todayDay() <= s.to) || STAGES[3]; return low.length ? `On track for ${stage.id} except: ${low.join(', ')} (below 80%). Practise these first. · यिनमा थप अभ्यास गर्नुहोस्।` : `${stage.id} target reached in every skill you have tested. Hienoa! · उत्कृष्ट!`; }

R.mistakes = m => {
  const L = sget('mist', []);
  m.innerHTML = crumbs(['me', 'Minä']) + `<h1>Virhevihko · Mistake notebook</h1><p class="lede">Every wrong answer lands here with its tag and becomes a flashcard in box 1. · गल्ती पुस्तिका।</p><div class="row" style="margin-bottom:10px"><button type="button" class="btn pri" data-rep ${L.length ? '' : 'disabled'}>Practise my top errors</button><button type="button" class="btn ghost" data-clr ${L.length ? '' : 'disabled'}>Clear the notebook</button></div><div id="prac"></div><div class="card">${L.length ? L.slice(0, 120).map(x => `<div class="tri">${sayBtn(x.a)}<div class="tx"><span class="small muted">${esc(x.d)} · <span class="tag bad">${esc(TAGS[x.tag] ? TAGS[x.tag][0] : x.tag)}</span></span><span class="small">${esc(x.p)}</span><span><span class="wrong">${esc(x.g || '–')}</span> → <span class="right">${esc(x.a)}</span></span>${x.x ? `<span class="t-en small">${esc(x.x)}</span>` : ''}</div></div>`).join('') : '<p class="empty">No mistakes yet.</p>'}</div>`;
  m.onclick = e => { if (e.target.closest('[data-rep]')) startRepair(topTags(3).map(t => t[0])); const c = e.target.closest('[data-clr]'); if (c) { if (c.dataset.sure) { sset('mist', []); sset('tags', {}); render(); } else { c.dataset.sure = 1; c.textContent = 'Tap again to clear everything'; } } };
};

// ===== settings, backup, voices, install =====
R.asetukset = m => {
  m.innerHTML = crumbs(['me', 'Minä']) + `<h1>Asetukset · Settings</h1>
  <h2>Kielet · Languages</h2>
  <div class="row"><span class="chip locked" aria-disabled="true">🔒 Suomi · Finnish</span><span class="chip locked" aria-disabled="true">🔒 English</span></div>
  <p class="small muted">Finnish and English are always part of the course.</p>
  <h3>My language · helper language</h3>
  <div class="langgrid" role="radiogroup" aria-label="Helper language">${Object.entries(HL_LANGS).map(([k, v], i) => `<button type="button" class="langopt" role="radio" data-hl="${k}" aria-checked="${SET.hl === k}"><span class="ln" lang="${k}" dir="auto">${esc(v.native)}</span><span class="small">${i + 1}. ${esc(v.en)}</span><span class="tag ${k === 'ne' ? 'ok' : 'src'}">${k === 'ne' ? 'Built in · offline' : 'Online'}</span></button>`).join('')}</div>
  <p class="small" style="margin-top:8px">${SET.hl === 'ne' ? 'Nepali is built into every lesson and works offline.' : `<b>${esc(hlName())}</b> is translated online the first time a screen opens, then saved on this device (${hlCount()} lines saved). ${CAP.sample ? 'Inside Claude, Claude translates.' : window.FI61_PWA ? 'In the phone app, MyMemory translates (free, with a daily limit; add your email under Translator to raise it).' : 'Open the phone app or use the course inside Claude to translate.'} Machine translation can be wrong: check important points with your teacher.`}</p>
  ${SET.hl !== 'ne' ? '<div class="row"><button type="button" class="btn sm ghost" id="hlclr">Delete saved translations</button><span class="small muted" id="hlmsg"></span></div>' : ''}
  <h3>Show while studying</h3><div class="row"><button type="button" class="chip" data-tg="en" aria-pressed="${SET.en}">English</button><button type="button" class="chip" data-tg="ne" aria-pressed="${SET.ne}"><span lang="${SET.hl}" dir="auto">${esc(HL().native)}</span></button></div><p class="small muted">Hide a language for a while to test yourself. Finnish is always shown.</p>
  <h2>Text size</h2><div class="row">${[['s', 'Small'], ['m', 'Normal'], ['l', 'Large']].map(s => `<button type="button" class="chip" data-size="${s[0]}" aria-pressed="${SET.size === s[0]}">${s[1]}</button>`).join('')}</div>
  <h2>Theme</h2><div class="row">${[['auto', 'Like my device'], ['light', 'Light'], ['dark', 'Dark']].map(s => `<button type="button" class="chip" data-th="${s[0]}" aria-pressed="${SET.theme === s[0]}">${s[1]}</button>`).join('')}</div>
  <h2>Voice</h2><div class="row">${[['1', 'Normal speed'], ['0.85', 'A bit slower'], ['0.75', 'Slow']].map(s => `<button type="button" class="chip" data-rate="${s[0]}" aria-pressed="${String(SET.rate) === s[0]}">${s[1]}</button>`).join('')}${sayBtn('Hei! Tämä on suomalainen ääni.')}</div><p class="small" id="vstat"></p>
  <details class="blk"><summary><span class="bn">🔊</span><span class="bt"><b>Install the Finnish voice</b><span class="t-ne small">फिनिस आवाज कसरी राख्ने</span></span><span></span></summary><div class="bd small"><p><b>Android:</b> Settings → Text-to-speech output → Google → Install voice data → Finnish (suomi).</p><p><b>iPhone:</b> Settings → Accessibility → Spoken content → Voices → Finnish.</p><p><b>Windows:</b> Settings → Time & language → Speech → Add voices → Finnish. Then restart the browser.</p></div></details>
  <h2>Translator · Kääntäjä</h2><div id="trset"></div>
  <h2>Start date and name</h2><div class="row"><label class="small" for="sd">I started on</label><input type="date" id="sd" value="${esc(SET.start)}" style="width:auto"><label class="small" for="sn">My name</label><input type="text" id="sn" value="${esc(SET.name)}" style="width:auto;flex:1;min-width:120px"></div><p class="small muted">Past days you have not finished become catch-up cards (at most 2 at a time).</p>
  <h2>Backup and restore · ब्याकअप</h2><p class="small">Your progress lives only on this device. Download a backup every Sunday and restore it on another device.</p><div class="row"><button type="button" class="btn pri" id="bk">Download backup</button><label class="btn" for="rf">Restore from file</label><input type="file" id="rf" accept="application/json,.json" hidden></div><textarea id="bkt" hidden readonly aria-label="Backup text" style="margin-top:10px;min-height:100px"></textarea><p class="small" id="bks"></p>
  <h2>Install on your phone</h2><p class="small">Open the portal from its GitHub Pages address in Chrome, then menu ⋮ → <b>Add to Home screen</b> (Android) or Share → <b>Add to Home Screen</b> (iPhone Safari). After the first visit it works offline.</p>
  <h2>About</h2><p class="small muted">Suomi 61 · Phase 1 (M0–M2 full content; later modules use reference lessons until the next updates). Items marked [SM1-linjattu] follow a chapter of Suomen mestari 1; [Lisä] is extra material. All texts are new. Level claims are “A1.3 target”, never a certificate.</p>`;
  trSettings($('#trset', m));
  const vs = $('#vstat', m); vs.textContent = !TTS.ok ? 'This browser has no speech. Use Chrome or Edge.' : TTS.voice ? `Finnish voice found: ${TTS.voice.name}` : 'No Finnish voice found yet. See below.';
  m.onclick = e => {
    if (e.target.closest('#trset')) return;
    const hl = e.target.closest('[data-hl]'); if (hl && hl.dataset.hl !== SET.hl) { SET.hl = hl.dataset.hl; saveSet(); applySet(); hlStart(); render(); toast(SET.hl === 'ne' ? 'Nepali selected · नेपाली छानियो' : HL().en + ' selected. Lines are translated online as you open screens.'); return; }
    if (e.target.closest('#hlclr')) { hlClear().then(() => { const x = $('#hlmsg', m); if (x) x.textContent = 'Deleted. They are translated again when needed.'; }); return; }
    const t = e.target.closest('[data-tg]'); if (t) { SET[t.dataset.tg] = !SET[t.dataset.tg]; saveSet(); applySet(); render(); }
    const s = e.target.closest('[data-size]'); if (s) { SET.size = s.dataset.size; saveSet(); applySet(); render(); }
    const th = e.target.closest('[data-th]'); if (th) { SET.theme = th.dataset.th; saveSet(); applySet(); render(); }
    const r = e.target.closest('[data-rate]'); if (r) { SET.rate = +r.dataset.rate; saveSet(); render(); }
  };
  $('#sd', m).onchange = e => { SET.start = e.target.value || SET.start; saveSet(); };
  $('#sn', m).onchange = e => { SET.name = e.target.value.trim() || 'Ram'; saveSet(); };
  $('#bk', m).onclick = async () => {
    const data = JSON.stringify({ app: 'suomi61', v: 1, date: todayISO(), keys: allKeys() });
    const name = 'suomi61-backup-' + todayISO() + '.json';
    sset('lastBackup', todayISO());
    if (CAP.downloads) { try { await CAP.downloads.save({ filename: name, data }); $('#bks', m).textContent = 'Backup saved.'; return; } catch (err) { } }
    if (!window.FI61_PWA) { const ta = $('#bkt', m); ta.hidden = false; ta.value = data; ta.select(); $('#bks', m).textContent = 'Copy this text and save it as a .json file. Restore loads that file.'; return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); $('#bks', m).textContent = 'Backup downloaded: ' + name;
  };
  $('#rf', m).onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { try { const o = JSON.parse(rd.result); if (o.app !== 'suomi61' || !o.keys) throw 0; Object.entries(o.keys).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch (er) { MEM[k.slice(PFX.length)] = JSON.parse(v); } }); $('#bks', m).textContent = 'Restored. Reloading…'; setTimeout(() => location.reload(), 600); } catch (er) { $('#bks', m).textContent = 'This file is not a Suomi 61 backup. Choose the .json file you downloaded from this screen.'; } }; rd.readAsText(f); };
};
function applySet() {
  const r = document.documentElement;
  if (SET.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', SET.theme);
  r.setAttribute('data-size', SET.size);
  document.body.classList.toggle('hide-en', !SET.en); document.body.classList.toggle('hide-ne', !SET.ne);
  const p = $('#langs'); if (p) p.innerHTML = `<button type="button" class="pill ${SET.en ? 'on' : ''}" data-q="en">EN</button><button type="button" class="pill ${SET.ne ? 'on' : ''}" data-q="ne" lang="${SET.hl}" style="font-family:var(--font-ne)" aria-label="Show ${esc(hlName())}" title="${esc(hlName())}">${esc(HL().short)}</button>`;
  const f = hlFont(); if (f) r.style.setProperty('--font-ne', f); else r.style.removeProperty('--font-ne');
  r.setAttribute('data-hlang', SET.hl);
}
