// ===== Learn: lessons, grammar library, words, k-p-t, dialogues, puhekieli, reading =====
const STEP_NAMES = [['Selitys englanniksi', 'The rule in English'], ['नेपालीमा व्याख्या', 'The rule in Nepali'], ['Sääntö', 'The rule as a table'], ['Vertailu nepaliin', 'Compared with Nepali'], ['Vertailu englantiin', 'Compared with English'], ['Missä käännös ei toimi', 'Where translation fails'], ['Esimerkit', 'Examples'], ['Tyypilliset virheet', 'Typical errors'], ['Harjoitukset', 'Exercises']];
R.lesson = (m, id) => {
  const L = lessonById(id); if (!L) { m.innerHTML = `<div class="note">This lesson was not found. <a href="#glib">Open the grammar library</a>.</div>`; return; }
  let step = Math.min(8, sget('lstep', {})[id] || 0);
  const seen = new Set(sget('lseen', {})[id] || []);
  m.innerHTML = crumbs(['glib', 'Kielioppi'], ['day-' + L.day, 'Day ' + L.day]) + `<div class="row">${srcTag(L.src)}<span class="tag">${L.mod}</span><span class="tag">Day ${L.day}</span></div><h1 style="margin-top:6px">${esc(L.fi)}</h1><p class="lede"><span class="t-en">${esc(L.en)}</span> · <span class="t-ne">${esc(L.ne)}</span></p><div class="lesson"><nav class="steps" aria-label="Steps"></nav><div><div class="scard" id="sc"></div><div class="snav"><button type="button" class="btn ghost" data-p>← Back</button><button type="button" class="btn pri" data-n>Next →</button></div></div></div>`;
  const nav = $('.steps', m), sc = $('#sc', m);
  function draw() {
    seen.add(step); const ss = sget('lseen', {}); ss[id] = [...seen]; sset('lseen', ss); const ls = sget('lstep', {}); ls[id] = step; sset('lstep', ls);
    nav.innerHTML = STEP_NAMES.map((s, i) => `<button type="button" class="step${seen.has(i) ? ' seen' : ''}" data-s="${i}" ${i === step ? 'aria-current="step"' : ''}><i>${i + 1}</i>${esc(i === 1 ? 'The rule in ' + hlName() : s[1])}</button>`).join('');
    const H = `<p class="eyebrow">Step ${step + 1}/9 · ${esc(STEP_NAMES[step][0])}</p><h2>${esc(step === 1 ? 'The rule in ' + hlName() : STEP_NAMES[step][1])}</h2>`;
    let b = '';
    if (step === 0) b = `<ul>${L.s1.map(s => `<li style="margin-bottom:6px">${md(s)}</li>`).join('')}</ul>`;
    if (step === 1) b = `<p class="ne" style="font-size:1.08rem;line-height:1.75">${esc(L.s2)}</p>`;
    if (step === 2) b = `<h3>${esc(L.rule.h)}</h3><div class="tbl"><table><thead><tr>${L.rule.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${L.rule.rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${L.rule.note ? `<div class="note" style="margin-top:10px">${md(L.rule.note)}</div>` : ''}`;
    if (step === 3) b = `<p>${md(L.s4[0])}</p><p class="ne">${esc(L.s4[1])}</p>`;
    if (step === 4) b = `<p>${md(L.s5)}</p>`;
    if (step === 5) b = L.s6.map(x => `<div class="errrow"><span class="fi">${md(x[0])}</span><span class="t-en">${md(x[1])}</span><span class="t-ne">${esc(x[2])}</span></div>`).join('');
    if (step === 6) b = `<div class="row" style="margin-bottom:8px"><button type="button" class="chip" data-pall>▶ Play all</button><button type="button" class="chip" data-hide aria-pressed="false">Hide translations</button></div><div data-ex>${L.s7.map(e => tri(e[0], e[1], e[2]) + (CAP.sample ? `<div style="margin:-4px 0 6px 46px"><button type="button" class="btn sm ghost" data-explain="${esc(e[0])}">✨ Explain this</button><div class="fbout small note" hidden></div></div>` : '')).join('')}</div>`;
    if (step === 7) b = L.s8.map(x => `<div class="errrow"><span><span class="wrong">${esc(x[0])}</span> → <span class="right">${esc(x[1])}</span> ${sayBtn(x[1].split(' / ')[0])}</span><span class="t-en">${esc(x[2])}</span><span class="t-ne">${esc(x[3])}</span></div>`).join('');
    if (step === 8) b = `<p class="small muted">Recognise → choose → fill in → build a sentence → translate → say it aloud. Answers stay hidden until you try.</p><div id="lq"></div>`;
    sc.innerHTML = H + b;
    $('[data-p]', m).disabled = step === 0; $('[data-n]', m).hidden = step === 8;
    if (step === 8) { const set = lessonSet(L); runQuiz($('#lq', sc), set, { title: L.fi, key: 'lesson:' + L.id, day: L.day, example: () => pick(L.s7, 1)[0], regen: () => lessonSet(L), onDone: (s, t, p) => { if (p >= 80) { const d = sget('ldone', {}); d[L.id] = 1; sset('ldone', d); } } }); }
    const pa = $('[data-pall]', sc); if (pa) pa.onclick = () => playAll($('[data-ex]', sc), 900);
    const hd = $('[data-hide]', sc); if (hd) hd.onclick = () => { const on = hd.getAttribute('aria-pressed') !== 'true'; hd.setAttribute('aria-pressed', on); $('[data-ex]', sc).classList.toggle('hide-en', on); $('[data-ex]', sc).classList.toggle('hide-ne', on); };
    $$('[data-explain]', sc).forEach(btn => btn.onclick = () => askClaude(`Explain this Finnish A1 sentence word by word for a ${hlName()} speaker who knows English: "${btn.dataset.explain}". Give each word's meaning and form in English and in ${hlWrite()}. Max 8 short lines. Plain text.`, btn.nextElementSibling));
  }
  m.onclick = e => { const s = e.target.closest('[data-s]'); if (s) { step = +s.dataset.s; draw(); sc.scrollIntoView({ block: 'start' }); } if (e.target.closest('[data-p]')) { step = Math.max(0, step - 1); draw(); } if (e.target.closest('[data-n]')) { step = Math.min(8, step + 1); draw(); window.scrollTo(0, sc.offsetTop - 80); } };
  // swipe between step cards on the phone
  let x0 = null; sc.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true }); sc.addEventListener('touchend', e => { if (x0 == null || step === 8) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 70) { step = Math.max(0, Math.min(8, step + (dx < 0 ? 1 : -1))); draw(); } x0 = null; });
  draw();
};

// reference lessons from the earlier course (old GRAMMAR blocks)
function refBlock(b) {
  if (b.t === 'table') return `<h3>${esc(b.h)}</h3><div class="tbl"><table><thead><tr>${b.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (b.t === 'rule') return `<div class="card"><h3 style="margin-top:0">${esc(b.h)}</h3><p>${md(b.en)}</p>${b.ne ? `<p class="t-ne">${esc(b.ne)}</p>` : ''}</div>`;
  if (b.t === 'ex') return `<h3>${esc(b.h)}</h3><div class="card">${b.items.map(x => tri(x[0], x[1], x[2])).join('')}</div>`;
  if (b.t === 'tricks') return `<div class="note warn"><b>${esc(b.h)}</b><ul>${b.items.map(x => `<li>${md(x[0])} <span class="t-ne">${esc(x[1] || '')}</span></li>`).join('')}</ul></div>`;
  if (b.t === 'steps') return `<h3>${esc(b.h)}</h3><ol>${b.items.map(x => `<li>${md(x[0])} <span class="t-ne small">${esc(x[1] || '')}</span></li>`).join('')}</ol>`;
  if (b.t === 'cards') return `<h3>${esc(b.h)}</h3><div class="grid">${b.items.map(x => `<div class="card"><b>${md(x[0])}</b><p class="small">${md(x[1])}</p><p class="small t-ne">${esc(x[2] || '')}</p>${x[3] ? `<p class="small">${x[3].map(md).join(' · ')}</p>` : ''}</div>`).join('')}</div>`;
  if (b.t === 'check') return `<h3>${esc(b.h)}</h3><div class="card">${b.items.map(x => `<details style="padding:4px 0"><summary>${md(x[0])}</summary><p class="right" style="margin:4px 0 0">${md(x[1])}</p></details>`).join('')}</div>`;
  if (b.t === 'forms') return `<h3>${esc(b.h)}</h3><div class="tbl"><table><thead><tr><th>Word</th><th>Genitive</th><th>Partitive</th><th>Into</th><th>Plural</th></tr></thead><tbody>${FORMS40.slice(0, b.n || 20).map(r => `<tr><td><b>${esc(r[0])}</b> <span class="t-en small">${esc(r[6])}</span></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join('')}</tbody></table></div>`;
  return '';
}
R.gref = (m, id) => {
  const g = refById(id); if (!g) { m.innerHTML = `<div class="note">Not found. <a href="#glib">Grammar library</a></div>`; return; }
  const days = CAL.map((c, i) => c[4] === 'g:' + id ? i + 1 : 0).filter(Boolean);
  m.innerHTML = crumbs(['glib', 'Kielioppi']) + `<div class="row"><span class="tag src">[Lisä]</span><span class="tag">${esc(g.lvl)}</span>${days.length ? `<span class="tag">Days ${days.join(', ')}</span>` : ''}</div><h1 style="margin-top:6px">${esc(g.fi)}</h1><p class="lede"><span class="t-en">${esc(g.en)}</span> · <span class="t-ne">${esc(g.ne)}</span></p><p>${md(g.intro[0])}</p><p class="t-ne">${esc(g.intro[1])}</p>${g.blocks.map(refBlock).join('')}<div class="row" style="margin-top:16px"><button type="button" class="btn pri" data-q>Practise this · अभ्यास</button></div><div id="gq"></div>`;
  $('[data-q]', m).onclick = () => { const it = g.blocks.filter(b => b.t === 'check').flatMap(b => b.items).map(x => ({ t: 'fill', q: x[0].replace(/\[\[|\]\]|\*\*/g, ''), a: [x[1].split(' (')[0].replace(/\[\[|\]\]|\*\*/g, '')], tag: 'wc', x: x[1].replace(/\[\[|\]\]|\*\*/g, '') })); runQuiz($('#gq', m), [...it, ...GEN.kpt(4), ...GEN.vt1(4)].slice(0, 16), { title: g.fi, key: 'gref:' + id }); };
};
R.glib = m => {
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Kielioppi · Grammar</h1><p class="lede">9-step lessons for days 1–10, reference lessons for the later modules, and the core tables. · व्याकरण पुस्तकालय।</p><input type="search" id="gs" placeholder="Search: olla, partitive, k-p-t …" aria-label="Search grammar">
  <h2>9-step lessons · M0–M2</h2><div class="grid" data-list>${LESSONS.map(L => `<a class="tile" href="#lesson-${L.id}" data-s="${esc((L.fi + ' ' + L.en).toLowerCase())}"><span class="row">${srcTag(L.src)}<span class="tag">${L.mod}</span>${sget('ldone', {})[L.id] ? '<span class="tag ok">✓</span>' : ''}</span><b>${esc(L.fi)}</b><span class="t-en">${esc(L.en)}</span></a>`).join('')}</div>
  <h2>Reference lessons · M3–M10</h2><div class="grid" data-list>${GRAMMAR.map(g => `<a class="tile" href="#gref-${g.id}" data-s="${esc((g.fi + ' ' + g.en).toLowerCase())}"><span class="row"><span class="tag src">[Lisä]</span><span class="tag">${esc(g.lvl)}</span></span><b>${esc(g.fi)}</b><span class="t-en">${esc(g.en)}</span></a>`).join('')}</div>
  <h2>Verb types 1–6</h2><div class="tbl"><table><thead><tr><th>Type</th><th>Ends in</th><th>Stem rule</th><th>Example</th></tr></thead><tbody>${[['1', 'vowel + a/ä', 'drop -a/-ä', 'puhua → puhun, puhuu'], ['2', '-da/-dä', 'drop -da/-dä', 'syödä → syön, syö'], ['3', '-la, -na, -ra, -sta', 'drop 2 letters, add -e-', 'tulla → tulen, tulee'], ['4', '-ata, -ota, -uta …', 'drop -ta, add -a-', 'haluta → haluan, haluaa'], ['5', '-ita/-itä', 'drop -a, add -tse-', 'tarvita → tarvitsen'], ['6 [Lisä]', '-eta/-etä', 'drop -ta, add -ne-', 'vanheta → vanhenen']].map(r => `<tr>${r.map((c, i) => `<td>${i === 3 ? md('[[' + c.split(' → ')[0] + ']] → ' + c.split(' → ')[1]) : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="small muted">Person endings: -n, -t, (vowel), -mme, -tte, -vat/-vät · Negative: en, et, ei, emme, ette, eivät + the stem.</p>
  <h2>Verb conjugator · ${VERBS_LIST.length} verbs</h2><select id="vsel" aria-label="Choose a verb">${VERBS_LIST.map((v, i) => `<option value="${i}">${esc(v.fi)} · ${esc(v.en)} (type ${v.vt})</option>`).join('')}</select><div id="vout" style="margin-top:10px"></div>
  <h2>The cases · विभक्ति</h2><p class="small">Finnish endings work like Nepali postpositions, but they are glued to the word: talossa = घरमा, talosta = घरबाट, Pekalle = पेक्कालाई.</p><div class="tbl"><table><thead><tr><th>Case</th><th>Question</th><th>Ending</th><th>Example</th><th>English</th><th>नेपाली</th></tr></thead><tbody>${[['Nominatiivi', 'kuka? mikä?', '–', 'talo', 'a house', 'घर'], ['Genetiivi', 'kenen? minkä?', '-n', 'talon', 'of the house', 'घरको'], ['Partitiivi', 'ketä? mitä?', '-a, -ta, -tta', 'taloa', 'some / not / part', '–'], ['Inessiivi', 'missä?', '-ssa/-ssä', 'talossa', 'in the house', 'घरमा'], ['Elatiivi', 'mistä?', '-sta/-stä', 'talosta', 'out of the house', 'घरबाट'], ['Illatiivi', 'mihin?', '-Vn, -hVn, -seen', 'taloon', 'into the house', 'घरभित्र'], ['Adessiivi', 'missä?', '-lla/-llä', 'pöydällä', 'on the table', 'टेबलमा'], ['Ablatiivi', 'mistä?', '-lta/-ltä', 'pöydältä', 'off the table', 'टेबलबाट'], ['Allatiivi', 'mihin? kenelle?', '-lle', 'Pekalle', 'to Pekka', 'पेक्कालाई']].map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td><mark class="end">${esc(r[2])}</mark></td><td>${md('[[' + r[3] + ']]')}</td><td class="t-en">${esc(r[4])}</td><td class="t-ne">${esc(r[5])}</td></tr>`).join('')}</tbody></table></div>`;
  const vs = $('#vsel', m), vo = $('#vout', m);
  const showV = () => { const v = VERBS_LIST[+vs.value]; vo.innerHTML = `<div class="tbl"><table><thead><tr><th></th><th>Yes</th><th>No</th><th>Question</th><th>Spoken</th></tr></thead><tbody>${PRON.map((p, i) => `<tr><td>${p}</td><td>${md('[[' + p + ' ' + v.vf[i] + ']]')}</td><td>${esc(p + ' ' + NEG[i] + ' ' + v.vf[0].slice(0, -1))}</td><td>${esc(v.vf[i] + koKo(v.fi) + ' ' + p + '?')}</td><td class="t-sp">${esc((SPOKEN_VERBS[v.fi] || [])[i] || '')}</td></tr>`).join('')}</tbody></table></div>${v.x ? tri(v.x[0], v.x[1], v.x[2]) : ''}${v.k ? `<p class="small">k-p-t: ${esc(v.k)}</p>` : ''}`; };
  vs.onchange = showV; vs.value = String(Math.max(0, VERBS_LIST.findIndex(v => v.fi === 'puhua'))); showV();
  $('#gs', m).oninput = e => { const q = e.target.value.toLowerCase(); $$('[data-list] .tile', m).forEach(t => { t.hidden = q && !t.dataset.s.includes(q); }); };
};

// word library: R.words and R.kpt are in 70_chapters.js
const GROUP_NAMES = ['', 'Greetings and polite phrases', 'Numbers, amounts, money', 'Time', 'Countries, languages, nationalities', 'People and family', 'Body and health', 'Appearance and character', 'Colours and shapes', 'Home, rooms, furniture', 'Food and drink', 'Shopping', 'Clothes', 'Town and places', 'Transport and travel', 'Weather and nature', 'University and studying', 'Work and jobs', 'Free time and hobbies', 'Feelings', 'Phone, technology, things', 'Offices: Kela, bank, housing', 'Common verbs', 'Common adjectives', 'Small words', 'Positions: where?', 'Holidays and festivals'];

// dialogues and daily life
R.arki = m => {
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Arjessa · Dialogues & daily life</h1><p class="lede">Core dialogues with role-play, more situations, and ready sentences for each place. · संवाद र दैनिक वाक्य।</p>
  <h2>Core dialogues</h2><div class="grid">${DIALOGUES.map(d => `<a class="tile" href="#dlg-${d.id}"><span class="row">${srcTag(d.src)}<span class="tag">${d.mod}</span></span><b>${d.n} · ${esc(d.fi)}</b><span class="t-en">${esc(d.en)}</span><span class="small muted">${esc(d.place)}</span></a>`).join('')}</div>
  <h2>More situations [Lisä]</h2><div class="grid sm">${PLACES.map(p => `<a class="tile" href="#place-${p.id}"><b>${p.e} ${esc(p.fi)}</b><span class="t-en">${esc(p.en)}</span></a>`).join('')}</div>
  <h2>Arki: sentences by place · ${ARKI.reduce((s, a) => s + a.lines.length, 0)}</h2>${ARKI.map(a => `<details class="blk"><summary><span class="bn">${a.e}</span><span class="bt"><b>${esc(a.fi)}</b><span class="t-en">${esc(a.en)}</span> <span class="t-ne small">· ${esc(a.ne)}</span></span><span class="bm">${a.lines.length}</span></summary><div class="bd"><p class="small muted">${esc(a.tip || '')}</p><div class="row" style="margin-bottom:6px"><button type="button" class="chip" data-pall>▶ Play all</button><button type="button" class="chip" data-blur aria-pressed="false">Test me: hide Finnish</button></div><div data-lines>${a.lines.map(l => tri(l[0], l[1], l[2], { sp: l[3] })).join('')}</div></div></details>`).join('')}`;
  m.onclick = e => { const p = e.target.closest('[data-pall]'); if (p) playAll($('[data-lines]', p.closest('.bd')), 900); const b = e.target.closest('[data-blur]'); if (b) { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.closest('.bd').classList.toggle('blur', on); } };
};
function dialogueView(m, D, lines, roles, extra) {
  let mode = 'kirja';
  const draw = () => { $('#dl', m).innerHTML = lines.map((l, i) => `<div class="tri" data-i="${i}">${sayBtn(mode === 'puhe' && l.sp ? l.sp : l.fi)}<div class="tx"><span class="who">${esc(roles[l.who] ? roles[l.who][0] : l.who)}</span><span class="fi tfi">${esc(mode === 'puhe' && l.sp ? l.sp : l.fi)}</span>${mode === 'kirja' && l.sp ? `<span class="t-sp small">🗣 ${esc(l.sp)}</span>` : ''}<span class="t-en">${esc(l.en)}</span><span class="t-ne">${esc(l.ne)}</span></div></div>`).join(''); };
  m.innerHTML += `<div class="row" style="margin:10px 0"><button type="button" class="chip" data-m="kirja" aria-pressed="true">📖 Kirjakieli</button><button type="button" class="chip" data-m="puhe" aria-pressed="false">🗣 Puhekieli</button><button type="button" class="chip" data-play>▶ Listen to all</button>${Object.keys(roles).map(r => `<button type="button" class="chip" data-role="${r}">🎭 I am ${esc(roles[r][0])}</button>`).join('')}</div><p class="small muted" id="rp" hidden></p><div class="card" id="dl"></div>${extra || ''}`;
  draw();
  m.onclick = e => {
    const md2 = e.target.closest('[data-m]'); if (md2) { mode = md2.dataset.m; $$('[data-m]', m).forEach(b => b.setAttribute('aria-pressed', b === md2)); draw(); }
    if (e.target.closest('[data-play]')) playAll($('#dl', m), 400);
    const r = e.target.closest('[data-role]'); if (r) rolePlay(r.dataset.role);
  };
  function rolePlay(role) {
    const rows = $$('#dl .tri', m); let i = 0; const rp = $('#rp', m); rp.hidden = false;
    const step = () => { rows.forEach(x => x.classList.remove('hl')); if (i >= lines.length) { rp.textContent = 'Role-play finished. Try the other part, or change it (see below). · सकियो।'; return; } const l = lines[i]; const row = rows[i]; row.classList.add('hl'); row.scrollIntoView({ block: 'nearest' }); i++;
      if (l.who === role) { rp.textContent = `Your turn · तपाईंको पालो: say “${l.fi}”, then wait.`; $('.tfi', row).style.filter = 'blur(5px)'; setTimeout(() => { $('.tfi', row).style.filter = ''; step(); }, Math.max(3500, l.fi.length * 120)); }
      else { rp.textContent = 'Listen… · सुन्नुहोस्'; speak(mode === 'puhe' && l.sp ? l.sp : l.fi, false, () => setTimeout(step, 400)); } };
    step();
  }
}
R.dlg = (m, id) => {
  const D = DIALOGUES.find(d => d.id === id); if (!D) { m.innerHTML = '<div class="note">Dialogue not found. <a href="#arki">Arjessa</a></div>'; return; }
  m.innerHTML = crumbs(['arki', 'Arjessa'], ['day-' + D.day, 'Day ' + D.day]) + `<div class="row">${srcTag(D.src)}<span class="tag">${D.mod}</span></div><h1 style="margin-top:6px">${D.n} · ${esc(D.fi)}</h1><p class="lede"><span class="t-en">${esc(D.en)}</span> · <span class="t-ne">${esc(D.ne)}</span> · ${esc(D.place)}</p>`;
  const lines = D.lines.map(l => ({ who: l[0], fi: l[1], sp: l[2], en: l[3], ne: l[4] }));
  const extra = `<h2>Key phrases · मुख्य वाक्यांश</h2><div class="card">${D.key.map(k => tri(k[0], k[1], k[2])).join('')}</div><h2>Grammar in this dialogue</h2><ul>${D.grammar.map(g => `<li>${esc(g)}</li>`).join('')}</ul><h2>Questions · प्रश्न</h2><div id="dq"></div><h2>Change it · बदल्नुहोस्</h2><div class="note">${esc(D.change)}</div>${recorderHTML('dlg' + D.id)}`;
  dialogueView(m, D, lines, D.roles, extra);
  runQuiz($('#dq', m), D.q.map(q => ({ t: 'mc', q: `${q[1]} <span class="t-en">· ${q[2]}</span>`, o: q[3], a: q[4], tag: 'wc' })), { title: D.fi, key: 'dlg:' + D.id, skill: 'listening' });
  bindRecorders(m);
};
R.place = (m, id) => {
  const P = PLACES.find(p => p.id === id); if (!P) { m.innerHTML = '<div class="note">Not found. <a href="#arki">Arjessa</a></div>'; return; }
  m.innerHTML = crumbs(['arki', 'Arjessa']) + `<span class="tag src">[Lisä]</span><h1 style="margin-top:6px">${P.e} ${esc(P.fi)}</h1><p class="lede"><span class="t-en">${esc(P.en)}</span> · <span class="t-ne">${esc(P.ne)}</span></p>`;
  const lines = P.lines.map(l => ({ who: l[0], fi: l[1], sp: l[4] || '', en: l[2], ne: l[3] }));
  dialogueView(m, P, lines, P.roles, `${P.words ? `<h2>Words</h2><div class="card">${P.words.map(w => tri(w[0], w[1], w[2])).join('')}</div>` : ''}${P.tip ? `<div class="note" style="margin-top:12px">💡 ${esc(P.tip)}</div>` : ''}`);
};

R.puhe = m => {
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Puhekieli · Spoken Finnish</h1><p class="lede">Understand everyday spoken Finnish; write and speak in tests in standard Finnish. Forms from the Helsinki region. · बोलचालको फिनिस।</p><div class="row" style="margin-bottom:12px"><button type="button" class="btn pri" data-g>Game: hear spoken → choose standard</button></div><div id="pg"></div>
  <h2>The main changes</h2><div class="tbl"><table><thead><tr><th>Change</th><th>Written</th><th>Spoken</th><th>Note</th></tr></thead><tbody>${PUHE_RULES.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td class="t-sp">${esc(r[2])}</td><td class="small">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
  <h2>${PUHE_PAIRS.length + PUHE_SENT.length} pairs</h2><input type="search" id="pq" placeholder="Search" aria-label="Search pairs"><div class="card" id="pl" style="margin-top:8px"></div>`;
  const all = [...PUHE_PAIRS, ...PUHE_SENT.map(s => [s[0], s[1], s[2], s[3]])];
  const draw = q => { $('#pl', m).innerHTML = all.filter(p => !q || p.join(' ').toLowerCase().includes(q)).map(p => `<div class="tri">${sayBtn(p[1])}<div class="tx"><span class="t-sp" style="font-weight:700">🗣 ${esc(p[1])}</span><span class="fi">📖 ${esc(p[0])}</span><span class="t-en">${esc(p[2])}</span><span class="t-ne">${esc(p[3])}</span></div></div>`).join(''); };
  draw(''); $('#pq', m).oninput = e => draw(e.target.value.toLowerCase());
  $('[data-g]', m).onclick = () => runQuiz($('#pg', m), puheGame(pick(PUHE_PAIRS, 10)), { title: 'Puhekieli', key: 'puhe:game', skill: 'listening' });
};

R.read = m => {
  m.innerHTML = crumbs(['learn', 'Opi']) + `<h1>Lue ja kuuntele · Read & listen</h1><p class="lede">Texts for days 1–10, longer stories, and the listening texts. · पढ्ने र सुन्ने।</p>
  <h2>Day texts · M0–M2</h2><div class="grid">${Object.entries(DAYS).map(([d, D]) => `<a class="tile" href="#dread-${d}"><span class="row">${srcTag(D.read.src)}<span class="tag">Day ${d}</span></span><b>${esc(D.read.h[0])}</b><span class="t-en">${esc(D.read.h[1])}</span></a>`).join('')}</div>
  <h2>Stories [Lisä]</h2><div class="grid">${STORIES.map(s => `<a class="tile" href="#story-${s.id}"><span class="row"><span class="tag">${esc(s.lvl)}</span></span><b>${s.e} ${esc(s.fi)}</b><span class="t-en">${esc(s.en)}</span></a>`).join('')}</div>`;
};
R.dread = (m, d) => { const D = DAYS[d]; if (!D) { m.innerHTML = '<div class="note">Not found. <a href="#read">Read & listen</a></div>'; return; } m.innerHTML = crumbs(['read', 'Lue ja kuuntele']) + `<p class="eyebrow">Day ${d}</p><h1>${esc(D.read.h[0])}</h1><div id="rt"></div>`; readText($('#rt', m), D.read, +d); };
R.story = (m, id) => {
  const s = STORIES.find(x => x.id === id); if (!s) { m.innerHTML = '<div class="note">Not found. <a href="#read">Read & listen</a></div>'; return; }
  m.innerHTML = crumbs(['read', 'Lue ja kuuntele']) + `<span class="tag">${esc(s.lvl)}</span><h1 style="margin-top:6px">${s.e} ${esc(s.fi)}</h1><div id="rt"></div>${s.words ? `<h2>Words</h2><div class="card">${s.words.map(w => tri(w[0], w[1], w[2])).join('')}</div>` : ''}${s.write ? `<h2>Write</h2><div class="note">${esc(s.write)}</div>` : ''}`;
  readText($('#rt', m), { h: [s.fi, s.en, s.ne], src: 'Lisä', lines: s.lines, open: s.q });
};
