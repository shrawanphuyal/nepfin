// ===== Lauseet · sentence lab: build, ask, grow, talk (6 Nov) =====
const SB_TABS = [['frame', 'Perusta', 'The frame', 'आधार'], ['endings', 'Päätteet', 'Endings', 'प्रत्यय'], ['build', 'Rakentaja', 'Builder', 'वाक्य बनाउने'], ['ask', 'Kysy', 'Questions', 'प्रश्न'], ['grow', 'Laajenna', 'Grow a sentence', 'वाक्य बढाउने'], ['talk', 'Keskustele', 'Conversation', 'कुराकानी'], ['drill', 'Harjoittele', 'Drill', 'अभ्यास']];
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const roleChip = (fi, role, note) => `<span class="rchip r${role}" title="${esc(note || '')}"><b>${esc(fi)}</b><small>${esc((SB_ROLE[role] || ['', ''])[0])}</small></span>`;
const sbN = k => SB_NOUNS[k];
const isCityIn = n => n.t === 'in' || n.t === 'city' || n.t === 'food' || n.t === 'thing';
function sbForm(k, where) { // where: at | to | from
  const n = sbN(k);
  if (where === 'at') return n.at || (isCityIn(n) && n.f[2] ? n.f[2] : n.f[5]);
  if (where === 'to') return n.to || (isCityIn(n) && n.f[4] ? n.f[4] : n.f[7]);
  return n.from || (isCityIn(n) && n.f[3] ? n.f[3] : n.f[6]);
}
function sbFormNote(k, form, where) {
  const n = sbN(k); const inside = isCityIn(n) && n.f[2];
  const lab = { at: inside ? 'in: -ssa/-ssä · missä?' : 'at, on: -lla/-llä · missä?', to: inside ? 'into: -Vn · mihin?' : 'to: -lle · mihin?', from: inside ? 'out of: -sta/-stä · mistä?' : 'from: -lta/-ltä · mistä?' }[where];
  return `${k} → ${form} · ${n.at && form === n[where] ? 'special form' : lab}${stemNote(k, form)}`;
}
const stemNote = (k, form) => form.toLowerCase().startsWith(k.toLowerCase().slice(0, Math.max(2, k.length - 1))) ? '' : ' · the stem changes (k-p-t or word type)';
const enPlace = (n, where) => where === 'at' ? (n.enat || ((n.t === 'city' || n.t === 'city-on') ? 'in ' : n.t === 'in' ? 'in ' : 'at ') + n.en) : where === 'to' ? (n.ento || 'to ' + n.en) : (n.enfrom || 'from ' + n.en);

// build one sentence from the builder state → {fi, en, tokens:[[fi, role, note]]}
function sbBuild(st) {
  const V = SB_VERBS[st.v]; const [sfi, p, sen] = SB_SUBJ[st.s]; const isPron = st.s < 6;
  const neg = st.mode === 'neg', yn = st.mode === 'yn', wh = st.mode === 'wh';
  const T = V.notime ? SB_TIME[0] : (SB_TIME[st.t] || SB_TIME[0]), M = V.manner ? (SB_MANNER[st.m] || SB_MANNER[0]) : SB_MANNER[0];
  const list = V.list || [];
  const key = list[Math.min(st.c, list.length - 1)];
  let comp = [], compEn = '', whFi = '', whEn = '', whTail = '';
  // complement
  if (V.comp === 'at' || V.comp === 'to' || V.comp === 'from') {
    const f = sbForm(key, V.comp); comp = [[f, 'P', sbFormNote(key, f, V.comp)]]; compEn = enPlace(sbN(key), V.comp);
    whFi = { at: 'Missä', to: 'Mihin', from: 'Mistä' }[V.comp]; whEn = 'Where'; whTail = V.comp === 'from' ? ' from' : '';
  } else if (V.comp === 'obj') {
    const n = sbN(key); const whole = V.obj === 'mixed' && n.t === 'thing';
    const f = whole && !neg ? n.f[0] : n.f[1];
    comp = [[f, 'O', `${key} → ${f} · ${whole ? (neg ? 'partitive after a negative (the whole object -n becomes -a/-ta)' : 'whole object: -n (the whole thing)') : V.v === 'odottaa' ? 'partitive: odottaa always takes it' : 'partitive: some, an amount'}${stemNote(key, f)}`]];
    compEn = n.en; whFi = n.t === 'person' ? 'Ketä' : 'Mitä'; whEn = n.t === 'person' ? 'Who' : 'What';
  } else if (V.comp === 'lang') {
    const L = SB_LANGS[Math.min(st.c, SB_LANGS.length - 1)]; comp = [[L[0], 'O', `${L[0]} · a language after puhua takes the partitive -a/-ä`]]; compEn = L[1]; whFi = 'Mitä kieltä'; whEn = 'What language';
  } else if (V.comp === 'all') {
    const n = sbN(key); const f = n.f[7]; comp = [[f, 'P', `${key} → ${f} · to whom: -lle · kenelle?${stemNote(key, f)}`]]; compEn = n.en; whFi = 'Kenelle'; whEn = 'Who';
  } else if (V.comp === 'obj2') {
    const n = sbN(key); const f = neg ? n.f[1] : n.f[0]; const pk = V.to[Math.min(st.c2 || 0, V.to.length - 1)]; const pn = sbN(pk);
    comp = [[f, 'O', `${key} → ${f} · ${neg ? 'partitive after a negative' : 'whole object: -n'}${stemNote(key, f)}`], [pn.f[7], 'P', `${pk} → ${pn.f[7]} · to whom: -lle · kenelle?${stemNote(pk, pn.f[7])}`]];
    compEn = n.en + ' to ' + pn.en; whFi = 'Kenelle'; whEn = 'Who'; whTail = ' to';
  } else if (V.comp === 'ela') {
    const n = sbN(key); const f = n.f[3]; comp = [[f, 'O', `${key} → ${f} · pitää always takes -sta/-stä · mistä?${stemNote(key, f)}`]]; compEn = n.t === 'thing' ? 'the ' + n.en.replace(/^(a|the) /, '') : n.en; whFi = 'Mistä'; whEn = 'What';
  } else if (V.comp === 'have') {
    const n = sbN(key); const f = neg ? n.f[1] : key; comp = [[f, 'O', neg ? `${key} → ${f} · ei ole + partitive` : `${key} · basic form after on`]]; compEn = n.en; whFi = 'Mitä'; whEn = 'What';
  }
  const timeTok = T[0] ? [[T[0], 'T', 'time: ' + T[1]]] : [], manTok = M[0] ? [[M[0], 'M', 'how: ' + M[1] + (M[2] ? ' · ' + M[2] : '')]] : [];
  const timeEn = T[0] ? ' ' + T[1] : '', manEn = M[0] ? ' ' + M[1] : '';
  // English helpers
  const s3 = p === 2; const be = p === 0 ? 'am' : s3 ? 'is' : 'are'; const doo = s3 ? 'does' : 'do';
  const enS = p === 0 || !isPron ? sen : sen.toLowerCase(); const enSubj = sen === 'he / she' ? 'he / she' : sen;
  const v3 = SB_EN3[V.en] || (V.en + 's');
  let tokens = [], en = '';
  if (V.comp === 'have') {
    const hs = SB_HAVE_SUBJ[st.s];
    const hsTok = [hs, 'S', `${sfi} → ${hs} · -lla/-llä + on = has`];
    if (st.mode === 'stmt') { tokens = [[cap(hs), 'S', hsTok[2]], ['on', 'V', 'on = is (here: has)'], ...comp, ...timeTok]; en = `${cap(enSubj)} ${s3 ? 'has' : 'have'} ${compEn}${timeEn}.`; }
    if (neg) { tokens = [[cap(hs), 'S', hsTok[2]], ['ei ole', 'V', 'ei ole = is not (always ei with on)'], ...comp, ...timeTok]; en = `${cap(enSubj)} ${s3 ? "doesn't" : "don't"} have ${compEn}${timeEn}.`; }
    if (yn) { tokens = [['Onko', 'Q', 'on + -ko: a yes/no question'], hsTok, ...comp, ...timeTok]; en = `${cap(doo)} ${enS} have ${compEn}${timeEn}?`; }
    if (wh) { if (st.wh === 'S') { tokens = [['Kenellä', 'Q', 'kuka → kenellä: who has?'], ['on', 'V', ''], ...comp]; en = `Who has ${compEn}?`; } else { tokens = [['Mitä', 'Q', 'what?'], [hs, 'S', hsTok[2]], ['on', 'V', '']]; en = `What ${doo} ${enS} have?`; } }
  } else {
    const vf = V.f[p], stem = V.f[0].slice(0, -1);
    const vNote = `${V.v} → ${vf} · ${PRON[p]} form (${['-n', '-t', 'long vowel', '-mme', '-tte', '-vat/-vät'][p]})${stemNote(V.v, vf) && V.v !== 'olla' ? ' · stem changes' : ''}`;
    const subjTok = [sfi, 'S', isPron ? `${sfi} = ${sen}` : `${sfi}: a name works like hän${p === 5 ? ' (two people = he)' : ''}`];
    const drop = st.drop && isPron && [0, 1, 3, 4].includes(p) && (st.mode === 'stmt' || neg);
    const beVerb = V.v === 'olla';
    if (st.mode === 'stmt') { tokens = [...(drop ? [] : [subjTok]), [vf, 'V', vNote], ...comp, ...manTok, ...timeTok]; en = `${cap(enSubj)} ${beVerb ? be : s3 ? v3 : V.en} ${compEn}${manEn}${timeEn}.`; }
    if (neg) { tokens = [...(drop ? [] : [subjTok]), [NEG[p], 'V', `${NEG[p]} = not (${PRON[p]} form)`], [stem, 'V', `${stem} = ${V.v} without the person ending`], ...comp, ...manTok, ...timeTok]; en = beVerb ? `${cap(enSubj)} ${be} not ${compEn}${manEn}${timeEn}.` : `${cap(enSubj)} ${s3 ? "doesn't" : "don't"} ${V.en} ${compEn}${manEn}${timeEn}.`; }
    if (yn) { const q = vf + koKo(V.v); tokens = [[q, 'Q', `${vf} + -${koKo(V.v)}: verb first + -ko/-kö = a yes/no question`], subjTok, ...comp, ...manTok, ...timeTok]; en = beVerb ? `${cap(be)} ${enS} ${compEn}${manEn}${timeEn}?` : `${cap(doo)} ${enS} ${V.en} ${compEn}${manEn}${timeEn}?`; }
    if (wh) {
      const slot = st.wh;
      if (slot === 'S') { tokens = [['Kuka', 'Q', 'who? (the verb takes the hän form)'], [V.f[2], 'V', `${V.v} → ${V.f[2]} · hän form after kuka`], ...comp, ...manTok, ...timeTok]; en = `Who ${beVerb ? 'is' : v3} ${compEn}${manEn}${timeEn}?`; }
      else {
        const qw = slot === 'T' ? ['Milloin', 'When', ''] : slot === 'M' ? ['Miten', 'How', ''] : [whFi, whEn, whTail];
        const rest = [...(slot === 'C' ? (V.comp === 'obj2' ? comp.slice(0, 1) : []) : comp), ...(slot === 'M' ? [] : manTok), ...(slot === 'T' ? [] : timeTok)];
        const objEn = slot === 'C' ? (V.comp === 'obj2' ? ' ' + sbN(key).en : '') : ' ' + compEn;
        const tailEn = objEn + qw[2] + (slot === 'M' ? '' : manEn) + (slot === 'T' ? '' : timeEn);
        tokens = [[qw[0], 'Q', 'question word first: its ending matches the answer'], subjTok, [vf, 'V', vNote], ...rest];
        en = beVerb ? `${qw[1]} ${be} ${enS}${tailEn}?` : `${qw[1]} ${doo} ${enS} ${V.en}${tailEn}?`;
      }
    }
  }
  if (tokens.length) tokens[0] = [cap(tokens[0][0]), tokens[0][1], tokens[0][2]];
  const fi = tokens.map(t => t[0]).join(' ') + (yn || wh ? '?' : '.');
  return { fi, en: en.replace(/\s+/g, ' ').replace(' ?', '?').replace(' .', '.'), tokens };
}
function sbRandom(mode) { const v = rnd(0, SB_VERBS.length - 1); const V = SB_VERBS[v]; const n = V.comp === 'lang' ? SB_LANGS.length : (V.list || [1]).length; return { s: rnd(0, 7), v, c: rnd(0, n - 1), c2: rnd(0, 4), t: V.notime ? 0 : rnd(0, SB_TIME.length - 1), m: V.manner ? rnd(0, SB_MANNER.length - 1) : 0, mode: mode || 'stmt', wh: 'C', drop: false }; }

R.lause = (m, arg) => {
  const tab = SB_TABS.find(t => t[0] === arg) ? arg : 'frame';
  m.innerHTML = crumbs(['chapters', 'Kappaleet']) + `<header class="chband" style="--chc:#3B4A9E"><span class="chnum big">Aa</span><div style="min-width:0"><p class="eyebrow" style="color:inherit;opacity:.85">Speak words → then sentences → then a conversation</p><h1 style="color:inherit;margin:0">Lauseet · Sentence lab</h1><p style="margin:2px 0 0;opacity:.92">Build Finnish sentences, ask questions and keep a conversation going · <span style="font-family:var(--font-ne)">वाक्य बनाउने, प्रश्न सोध्ने, कुराकानी</span></p></div></header>
  <nav class="ctabs" aria-label="Sentence lab parts">${SB_TABS.map(t => `<a href="#lause-${t[0]}" ${t[0] === tab ? 'aria-current="page"' : ''}><span>${t[1]}</span><small>${t[2]}</small></a>`).join('')}</nav><section id="sbb"></section>`;
  SB_TAB[tab]($('#sbb', m));
  const a = $('.ctabs a[aria-current]', m); a && a.scrollIntoView({ inline: 'center', block: 'nearest' });
};
const sayRow = s => `${sayBtn(s)}${sayBtn(s, 1)}`;
const SB_TAB = {
  frame(h) {
    h.innerHTML = `<div class="note"><b>The idea in one line:</b> a Finnish sentence is a row of slots: <b>who</b> + <b>does</b> + <b>what / where / when</b>. Every word does a job, and <b>its ending shows the job</b>. Learn the slots and the endings, and you can say new things without translating. · फिनिस वाक्यमा हरेक शब्दको काम हुन्छ, र त्यसको अन्त्यले काम देखाउँछ।</div>
    <h2>Same idea, three languages</h2><div class="cmp3">
      <div class="card"><p class="eyebrow">English · S V O</p><div class="chiprow">${roleChip('I', 'S')}${roleChip('drink', 'V')}${roleChip('coffee', 'O')}</div></div>
      <div class="card"><p class="eyebrow">Suomi · S V O</p><div class="chiprow">${roleChip('Minä', 'S')}${roleChip('juon', 'V')}${roleChip('kahvia', 'O')}</div><div class="row" style="margin-top:6px">${sayRow('Minä juon kahvia.')}</div></div>
      <div class="card"><p class="eyebrow">नेपाली · S O V</p><div class="chiprow">${roleChip('म', 'S')}${roleChip('कफी', 'O')}${roleChip('पिउँछु', 'V')}</div></div></div>
    <p class="small">Finnish order is like English (the verb comes early). Like Nepali, the verb ending shows the person (juon ≈ पिउँछु), so <b>minä</b> can be left out: <b>Juon kahvia.</b> · नेपालीजस्तै क्रियाको अन्त्यले पुरुष देखाउँछ।</p>
    <h2>Two things change in every sentence</h2><div class="grid"><div class="card"><h3 style="margin-top:0">1 · The verb matches the person</h3><div class="tbl"><table><tbody>${PRON.map((p, i) => `<tr><td>${p}</td><td>${md('[[' + ['puhun', 'puhut', 'puhuu', 'puhumme', 'puhutte', 'puhuvat'][i] + ']]')}</td><td><mark class="end">${['-n', '-t', 'long vowel', '-mme', '-tte', '-vat'][i]}</mark></td></tr>`).join('')}</tbody></table></div></div>
      <div class="card"><h3 style="margin-top:0">2 · The noun shows its job</h3>${[['kauppa', 'the word itself', 'S'], ['kauppaan', 'into (mihin?)', 'P'], ['kaupassa', 'in (missä?)', 'P'], ['kaupasta', 'out of (mistä?)', 'P'], ['kaupan', 'of (kenen?)', 'G'], ['kauppaa', 'some / not (mitä?)', 'O']].map(x => `<div class="tri">${sayBtn(x[0])}<div class="tx"><span>${roleChip(x[0], x[2])}</span><span class="t-en small">${x[1]}</span></div></div>`).join('')}<a class="btn sm" href="#lause-endings">All endings →</a></div></div>
    <h2>The slots · वाक्यका खाना</h2><div class="grid sm">${[['S', 'Minä, Ram, kissa', 'nominative (basic form)'], ['V', 'juon, menen, en mene', 'person ending'], ['O', 'kahvia, kirjan, suomea', 'partitive / -n / basic'], ['P', 'kaupassa, asemalle, Mikolle', '-ssa -sta -Vn -lla -lta -lle'], ['T', 'aamulla, maanantaina, nyt', '-lla, -na, a time word'], ['M', 'bussilla, hitaasti', '-lla, -sti'], ['R', 'ja, mutta, koska, että', 'links two parts'], ['Q', 'Missä? Menetkö?', 'question word or -ko/-kö']].map(s => `<div class="card"><div class="chiprow">${roleChip(s[1].split(',')[0], s[0])}</div><p class="small" style="margin:6px 0 0"><b>${SB_ROLE[s[0]][0]}</b> · ${SB_ROLE[s[0]][2]} · <span class="t-ne">${SB_ROLE[s[0]][1]}</span><br>${esc(s[1])}<br><span class="muted">${esc(s[2])}</span></p></div>`).join('')}</div>
    <h2>Order can move, the meaning stays</h2><div class="card">${[['Minä juon kahvia aamulla.', 'normal order'], ['Aamulla juon kahvia.', 'time first → the verb comes second'], ['Kahvia juon aamulla, en teetä.', 'the object first = emphasis']].map(x => tri(x[0], x[1], '')).join('')}<p class="small" style="margin:8px 0 0">The endings carry the meaning, so word order is freer than in English. Keep it simple: <b>Subject + Verb + the rest</b>, or <b>Time + Verb + the rest</b>.</p></div>
    <h2>-n and -t have more than one job</h2><div class="grid"><div class="card"><h3 style="margin-top:0">-n</h3><ul class="small"><li><b>puhun</b>: I speak (minä verb ending)</li><li><b>Mikon</b>: Mikko's (genitive)</li><li><b>Ostan kirjan</b>: I buy the book (whole object)</li><li><b>kauppaan</b>: into the shop (long vowel + n)</li></ul><p class="small t-ne">-n का चार काम: म (क्रिया), को, पूरै वस्तु, भित्र जाने।</p></div><div class="card"><h3 style="margin-top:0">-t</h3><ul class="small"><li><b>puhut</b>: you speak (sinä verb ending)</li><li><b>kirjat</b>: the books (plural)</li><li><b>teetä, vettä</b>: partitive -tä/-ttä has a t too</li></ul><p class="small t-ne">-t का काम: तिमी (क्रिया), बहुवचन।</p></div><div class="card"><h3 style="margin-top:0">Basic forms</h3><p class="small"><b>Nominative</b> = the noun as in the dictionary: kauppa, Mikko.<br><b>Infinitive</b> = the verb as in the dictionary: juoda, mennä, puhua. Use it after <b>haluan, voin, osaan, pitää</b>: <span class="fiw" data-say="Haluan juoda teetä.">Haluan juoda teetä.</span> (like Nepali -नु: पिउनु)</p></div></div>
    <h2>One word, many jobs</h2><div class="chips">${Object.keys(SB_JOBS).map((k, i) => `<button type="button" class="chip" data-job="${k}" aria-pressed="${i === 0}">${k}</button>`).join('')}</div><div class="card" data-jobs></div>
    <h2>The verb decides the ending · क्रियाले प्रत्यय तय गर्छ</h2><div class="tbl"><table><thead><tr><th>Verbs</th><th>Need</th><th>Example</th><th>नेपाली</th></tr></thead><tbody>${SB_VERBCASE.map(r => `<tr><td><b>${esc(r[0])}</b></td><td><mark class="end">${esc(r[1])}</mark></td><td>${md('[[' + r[2] + ']]')}<br><span class="t-en small">${esc(r[3])}</span></td><td class="t-ne small">${esc(r[4])}</td></tr>`).join('')}</tbody></table></div>
    <h2>Pronouns in the forms you use most</h2><div class="tbl"><table><thead><tr><th>Who</th><th>-n (my)</th><th>-a (part.)</th><th>-lla (has)</th><th>-lta (from)</th><th>-lle (to)</th></tr></thead><tbody>${SB_PRON.map(r => `<tr>${r.slice(0, 6).map((c, i) => `<td>${i ? md('[[' + c + ']]') : `<b>${c}</b> <span class="t-en small">${r[6]}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const drawJob = k => { $('[data-jobs]', h).innerHTML = SB_JOBS[k].map(x => `<div class="tri">${sayBtn(x[0])}<div class="tx"><span class="fi">${esc(x[0]).replace(esc(x[3]), `<mark class="end">${esc(x[3])}</mark>`)}</span><span class="t-en">${esc(x[1])} · <b>${esc(x[4])}</b></span><span class="t-ne">${esc(x[2])}</span></div></div>`).join(''); };
    $$('[data-job]', h).forEach(b => b.onclick = () => { $$('[data-job]', h).forEach(x => x.setAttribute('aria-pressed', x === b)); drawJob(b.dataset.job); });
    drawJob(Object.keys(SB_JOBS)[0]);
  },
  endings(h) {
    const groups = [['Places inside', 'in'], ['Open places', 'on'], ['Cities and countries', 'city'], ['People', 'person'], ['Food and drink', 'food'], ['Things', 'thing']];
    const sel = sget('sbnoun', 'kauppa');
    h.innerHTML = `<div class="ends6">${[['-ssa', 'in', 'missä?', 'मा'], ['-sta', 'out of', 'mistä?', 'बाट'], ['-Vn', 'into', 'mihin?', 'भित्र'], ['-lla', 'on, at, has', 'missä? kenellä?', 'मा / सँग'], ['-lta', 'off, from', 'mistä? keneltä?', 'बाट'], ['-lle', 'onto, to', 'mihin? kenelle?', 'लाई / तिर']].map((e, i) => `<div class="end6 ${i < 3 ? 'in' : 'on'}"><span class="ic">${['●', '●→', '→●', '▬', '▬→', '→▬'][i]}</span><b>${e[0]}</b><span class="small">${e[1]}</span><span class="small muted">${e[2]}</span><span class="t-ne small">${e[3]}</span></div>`).join('')}</div>
    <p class="small muted">Top row: inside a place (a shop, a city). Bottom row: on a surface or an open place (a station, a square), and people (Mikolla on = Mikko has). Plus <b>-n</b> (of), <b>partitive</b> (some, not) and <b>-t</b> (plural).</p>
    <h2>Choose a word · शब्द छान्नुहोस्</h2>${groups.map(g => `<span class="grp-label">${g[0]}</span><div class="chips">${Object.entries(SB_NOUNS).filter(([k, n]) => (n.t === g[1]) || (g[1] === 'city' && n.t === 'city-on')).map(([k, n]) => `<button type="button" class="chip" data-n="${esc(k)}" aria-pressed="${k === sel}">${n.e} ${esc(k)}</button>`).join('')}</div>`).join('')}
    <div data-tab style="margin-top:10px"></div>`;
    const draw = k => {
      const n = sbN(k); sset('sbnoun', k);
      $$('[data-n]', h).forEach(b => b.setAttribute('aria-pressed', b.dataset.n === k));
      const rows = SB_CASES.map(c => { const form = c.i < 0 ? k : n.f[c.i]; const ex = form ? sbExample(k, n, c.k, form) : null; return `<div class="wr er${form ? '' : ' na'}"><span><mark class="end">${esc(c.end)}</mark><br><span class="small muted">${esc(c.q)}</span></span><span class="wf"><b>${form ? esc(form) : '—'}</b><span class="small muted">${esc(c.name)}</span></span><span class="small wcol">${esc(c.en)}<br><span class="t-ne">${esc(c.ne)}</span></span><span class="small">${ex ? `${md('[[' + ex[0] + ']]')}<br><span class="t-en">${esc(ex[1])}</span>` : form ? '' : '<span class="muted">not used with this word</span>'}</span><span>${form ? sayBtn(ex ? ex[0] : form) : ''}</span></div>`; }).join('');
      $('[data-tab]', h).innerHTML = `<div class="card"><div class="row"><span style="font-size:2rem">${n.e}</span><div><b style="font-size:1.3rem">${esc(k)}</b> ${sayBtn(k)}<br><span class="t-en">${esc(n.en)}</span> · <span class="t-ne">${esc(n.ne)}</span></div></div>${n.at ? `<p class="note small" style="margin-top:8px">Special forms: <b>${n.at}</b> (${n.enat}), <b>${n.from}</b> (${n.enfrom}), <b>${n.to}</b> (${n.ento}).</p>` : ''}${n.t === 'city-on' ? '<p class="note small" style="margin-top:8px">This city takes the -lla endings: Tampereella, Vantaalla.</p>' : ''}</div><div class="wrows erows" style="margin-top:10px"><div class="wr er wh"><span>Ending</span><span>Form</span><span>Meaning</span><span>Example</span><span></span></div>${rows}</div><div class="row" style="margin-top:10px"><button type="button" class="btn pri" data-q>Quiz this word · 8</button></div><div data-qb style="margin-top:10px"></div>`;
      $('[data-q]', h).onclick = () => runQuiz($('[data-qb]', h), endingQuiz(k, 8), { title: k, key: 'sb:end', skill: 'grammar' });
    };
    $$('[data-n]', h).forEach(b => b.onclick = () => draw(b.dataset.n));
    draw(SB_NOUNS[sel] ? sel : 'kauppa');
  },
  build(h) {
    const st = Object.assign({ s: 0, v: 2, c: 0, c2: 0, t: 3, m: 1, mode: 'stmt', wh: 'C', drop: false }, sget('sbst', {}));
    if (!SB_VERBS[st.v]) st.v = 2;
    const opt = (arr, cur) => arr.map((x, i) => `<option value="${i}" ${i === +cur ? 'selected' : ''}>${x}</option>`).join('');
    const draw = () => {
      const V = SB_VERBS[st.v]; const clist = V.comp === 'lang' ? SB_LANGS.map(l => l[0] + ' · ' + l[1]) : (V.list || []).map(k => sbN(k).e + ' ' + k + ' · ' + sbN(k).en);
      if (st.c >= clist.length) st.c = 0;
      const whOpts = [['C', V.comp === 'have' ? 'what? (Mitä?)' : 'the ' + ({ at: 'place (Missä?)', to: 'place (Mihin?)', from: 'place (Mistä?)', obj: 'object (Mitä?)', lang: 'language (Mitä kieltä?)', all: 'person (Kenelle?)', obj2: 'person (Kenelle?)', ela: 'thing (Mistä?)' }[V.comp])], ['S', 'who? (Kuka?)'], ...(!V.notime && st.t ? [['T', 'when? (Milloin?)']] : []), ...(V.manner && st.m ? [['M', 'how? (Miten?)']] : [])];
      if (!whOpts.find(w => w[0] === st.wh)) st.wh = 'C';
      const out = sbBuild(st); sset('sbst', st);
      h.innerHTML = `<p class="small muted">Choose the parts. The app puts every word in the right form and shows why. Say the sentence aloud, then change one part and say it again. · भाग छान्नुहोस्, वाक्य ठूलो स्वरमा भन्नुहोस्।</p>
      <div class="sbgrid">
        <label><span class="rl rS">Who · को</span><select data-k="s">${opt(SB_SUBJ.map(x => x[0] + ' · ' + x[2]), st.s)}</select></label>
        <label><span class="rl rV">Verb · क्रिया</span><select data-k="v">${opt(SB_VERBS.map(x => (x.v === '(have)' ? 'minulla on' : x.v) + ' · ' + (x.en === 'have' ? 'have' : 'to ' + x.en)), st.v)}</select></label>
        <label><span class="rl r${['at', 'to', 'from', 'all'].includes(V.comp) ? 'P' : 'O'}">${({ at: 'Where · कहाँ', to: 'Where to · कहाँ (जाने)', from: 'Where from · कहाँबाट', all: 'To whom · कसलाई', ela: 'What · के', have: 'What · के', lang: 'Language · भाषा', obj: 'What · के', obj2: 'What · के' })[V.comp]}</span><select data-k="c">${opt(clist, st.c)}</select></label>
        ${V.comp === 'obj2' ? `<label><span class="rl rP">To whom · कसलाई</span><select data-k="c2">${opt(V.to.map(k => sbN(k).e + ' ' + k), st.c2)}</select></label>` : ''}
        ${V.manner ? `<label><span class="rl rM">How · कसरी</span><select data-k="m">${opt(SB_MANNER.map(x => x[0] ? x[0] + ' · ' + x[1] : '—'), st.m)}</select></label>` : ''}
        ${V.notime ? '' : `<label><span class="rl rT">When · कहिले</span><select data-k="t">${opt(SB_TIME.map(x => x[0] ? x[0] + ' · ' + x[1] : '—'), st.t)}</select></label>`}
      </div>
      <div class="row" style="margin:10px 0"><div class="seg" role="group" aria-label="Sentence type">${[['stmt', 'Statement'], ['neg', 'Negative · होइन'], ['yn', 'Yes/no question'], ['wh', 'Ask about …']].map(x => `<button type="button" data-mode="${x[0]}" aria-pressed="${st.mode === x[0]}">${x[1]}</button>`).join('')}</div>${st.mode === 'wh' ? `<select data-k="wh" style="width:auto" aria-label="Ask about">${whOpts.map(w => `<option value="${w[0]}" ${w[0] === st.wh ? 'selected' : ''}>${w[1]}</option>`).join('')}</select>` : ''}<label class="small row" style="gap:6px"><input type="checkbox" data-drop ${st.drop ? 'checked' : ''}> Leave out minä / sinä / me / te</label></div>
      <div class="sbout card"><div class="chiprow big">${out.tokens.map(t => roleChip(t[0], t[1], t[2])).join('')}<span class="punct">${st.mode === 'yn' || st.mode === 'wh' ? '?' : '.'}</span></div><p class="t-en" style="margin:8px 0 0">${esc(out.en)}</p><div class="row" style="margin-top:10px">${sayBtn(out.fi)}${sayBtn(out.fi, 1)}<button type="button" class="btn sm" data-rand>🎲 Random</button><button type="button" class="btn sm ghost" data-save>☆ Save</button></div></div>
      <h3>What each word does · हरेक शब्दको काम</h3><div class="card">${out.tokens.map(t => `<div class="why"><span class="rchip r${t[1]} sm"><b>${esc(t[0])}</b></span><span class="small">${esc(t[2] || SB_ROLE[t[1]][0])}</span></div>`).join('')}</div>
      ${st.mode === 'neg' ? '<div class="note small" style="margin-top:10px"><b>Negative rule:</b> en, et, ei … + the verb without its ending. A whole object (-n) becomes partitive: Ostan kirjan → En osta kirjaa. Minulla on auto → Minulla ei ole autoa.</div>' : ''}${st.mode === 'wh' ? '<div class="note small" style="margin-top:10px"><b>Question rule:</b> the question word comes first, then the subject and the verb: Missä sinä asut? (or just Missä asut?) The ending of the question word matches the answer: Mihin? – kauppaan. Missä? – kaupassa. Mistä? – kaupasta.</div>' : ''}
      <h3>My sentences · मेरा वाक्य</h3><div data-my></div>`;
      const my = sget('mysent', []);
      $('[data-my]', h).innerHTML = my.length ? `<div class="card">${my.map((s, i) => `<div class="tri">${sayBtn(s[0])}<div class="tx"><span class="fi">${esc(s[0])}</span><span class="t-en">${esc(s[1])}</span></div><button type="button" class="btn sm ghost" data-del="${i}" aria-label="Remove">✕</button></div>`).join('')}</div><div class="row" style="margin-top:8px"><button type="button" class="btn sm" data-playmy>▶ Play all</button></div>` : '<p class="empty">Save sentences you want to practise. They stay on this device.</p>';
      $$('select[data-k]', h).forEach(s => s.onchange = () => { const k = s.dataset.k; st[k] = k === 'wh' ? s.value : +s.value; if (k === 'v') { st.c = 0; st.c2 = 0; } draw(); setTimeout(() => speak(sbBuild(st).fi), 50); });
      $$('[data-mode]', h).forEach(b => b.onclick = () => { st.mode = b.dataset.mode; draw(); speak(sbBuild(st).fi); });
      $('[data-drop]', h).onchange = e => { st.drop = e.target.checked; draw(); };
      $('[data-rand]', h).onclick = () => { Object.assign(st, sbRandom(st.mode)); draw(); speak(sbBuild(st).fi); };
      $('[data-save]', h).onclick = e => { const l = sget('mysent', []); if (!l.find(x => x[0] === out.fi)) { l.unshift([out.fi, out.en]); sset('mysent', l.slice(0, 100)); } draw(); };
      $$('[data-del]', h).forEach(b => b.onclick = () => { const l = sget('mysent', []); l.splice(+b.dataset.del, 1); sset('mysent', l); draw(); });
      const pm = $('[data-playmy]', h); if (pm) pm.onclick = () => playAll($('[data-my] .card', h), 1800);
    };
    draw();
  },
  ask(h) {
    h.innerHTML = `<div class="note"><b>Any sentence gives you many questions.</b> Tap a coloured part: it turns into a question word, and the ending of the question word matches the ending of the answer. Ask, then answer. · हरेक भागबाट प्रश्न बन्छ।</div>
    ${SB_QSENT.map((q, qi) => `<div class="card qs" data-qs="${qi}" style="margin-top:12px"><div class="chiprow">${qsChips(q)}</div><p class="t-en small" style="margin:6px 0">${esc(q.en)}</p><div class="row">${sayRow(q.fi)}<button type="button" class="btn sm" data-yn="${qi}">Yes/no question</button></div><div class="qsout" data-out></div></div>`).join('')}
    <h2>Question word ↔ ending in the answer</h2><div class="tbl"><table><thead><tr><th>Ask</th><th>Answer ends in</th><th>Example</th><th>Meaning</th></tr></thead><tbody>${SB_QMATCH.map(r => `<tr><td><b>${md('[[' + r[0] + ']]')}</b></td><td><mark class="end">${esc(r[1])}</mark></td><td>${esc(r[2])}</td><td class="t-en small">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <h2>Make any question in 3 steps</h2><div class="steps4">${[['1', 'Yes/no: put the verb first and add -ko/-kö.', 'Puhut suomea → Puhutko suomea?'], ['2', 'Open question: put the question word first, then who and the verb.', 'Missä sinä asut?'], ['3', 'Answer with the same ending, then ask back.', 'Espoossa. Entä sinä?']].map(s => `<div class="card"><span class="bn">${s[0]}</span><p style="margin:6px 0 2px">${esc(s[1])}</p><p class="fi small" style="margin:0">${esc(s[2])} ${sayBtn(s[2])}</p></div>`).join('')}</div>
    <h2>Practise: which question word?</h2><button type="button" class="btn pri" data-qd>10 questions</button><div data-qdb style="margin-top:10px"></div>`;
    $$('[data-qs]', h).forEach(card => {
      const q = SB_QSENT[+card.dataset.qs]; const out = $('[data-out]', card);
      $$('[data-slot]', card).forEach(b => b.onclick = () => { const s = q.slots[+b.dataset.slot]; $$('[data-slot]', card).forEach(x => x.classList.toggle('on', x === b)); out.innerHTML = `<div class="tri">${sayBtn(s[2])}<div class="tx"><span class="fi">❓ ${esc(s[2])}</span><span class="t-en small">${esc(s[4])}</span></div></div><div class="tri">${sayBtn(s[3])}<div class="tx"><span class="fi">💬 ${esc(s[3])}</span></div></div>`; speak(s[2]); });
      $('[data-yn]', card).onclick = () => { out.innerHTML = `<div class="tri">${sayBtn(q.yn[0])}<div class="tx"><span class="fi">❓ ${esc(q.yn[0])}</span><span class="t-en small">${esc(q.yn[2])}</span></div></div><div class="tri">${sayBtn(q.yn[1])}<div class="tx"><span class="fi">💬 ${esc(q.yn[1])}</span></div></div>`; speak(q.yn[0]); };
    });
    $('[data-qd]', h).onclick = () => runQuiz($('[data-qdb]', h), whDrill(10), { title: 'Question words', key: 'sb:ask', skill: 'grammar', regen: () => whDrill(10) });
  },
  grow(h) {
    const cur = sget('sbladder', SB_LADDERS[0].id);
    h.innerHTML = `<div class="note"><b>Speak words, then sentences.</b> Each ladder starts with one word and adds one thing per step: a verb, a time, a place, a reason, and finally a question back. Say every step aloud before you look at the next. · एउटा शब्दबाट सुरु गरेर वाक्य बढाउनुहोस्।</div>
    <div class="chips" style="margin-top:12px">${SB_LADDERS.map(l => `<button type="button" class="chip" data-l="${l.id}" aria-pressed="${l.id === cur}">${esc(l.h[0])} <span class="small muted">${esc(l.h[1])}</span></button>`).join('')}</div><div data-lad></div>`;
    const draw = id => {
      const L = SB_LADDERS.find(x => x.id === id) || SB_LADDERS[0]; sset('sbladder', L.id);
      $$('[data-l]', h).forEach(b => b.setAttribute('aria-pressed', b.dataset.l === L.id));
      $('[data-lad]', h).innerHTML = `<div class="row" style="margin:6px 0 10px"><button type="button" class="btn pri" data-go>▶ Speak along: hear → your turn → next</button><button type="button" class="btn sm ghost" data-hide aria-pressed="false">Hide translations</button></div><p class="small muted" data-st></p>
      <ol class="ladder">${L.steps.map((s, i) => `<li data-i="${i}"><span class="lv">${i + 1}</span><div class="tx"><span class="lfi">${esc(s[0])}</span><span class="t-en">${esc(s[1])}</span><span class="t-ne">${esc(s[2])}</span><span class="add">${esc(s[3])}</span></div><span class="row" style="gap:4px">${sayRow(s[0])}</span></li>`).join('')}</ol>
      <h3>Understand what you say · बुझेर बोल्नुहोस्</h3><div class="card"><div class="chiprow">${L.gloss.map(g => roleChip(g[0], g[3], g[1])).join('')}</div><div style="margin-top:10px">${L.gloss.map(g => `<div class="why"><span class="rchip r${g[3]} sm"><b>${esc(g[0])}</b></span><span class="small">${g[1] ? esc(g[1]) + ' · ' : ''}<span class="t-en">${esc(g[2])}</span></span></div>`).join('')}</div></div>
      <h3>Your turn: build your own ladder</h3><p class="small">Take one word you need this week. Add a verb, then a time, then a place, then <b>koska …</b>, then ask back. Use the <a href="#lause-build">builder</a> to check the endings.</p>${recorderHTML('ladder' + L.id)}`;
      bindRecorders(h);
      const hd = $('[data-hide]', h); hd.onclick = () => { const on = hd.getAttribute('aria-pressed') !== 'true'; hd.setAttribute('aria-pressed', on); $('.ladder', h).classList.toggle('hide-en', on); $('.ladder', h).classList.toggle('hide-ne', on); };
      $('[data-go]', h).onclick = () => speakAlong($$('.ladder li', h), L.steps.map(s => s[0]), $('[data-st]', h));
    };
    $$('[data-l]', h).forEach(b => b.onclick = () => draw(b.dataset.l));
    draw(cur);
  },
  talk(h) {
    h.innerHTML = `<div class="rule3">${[['1', 'Vastaa', 'Answer', 'जवाफ दिनुहोस्', 'Asun Espoossa.'], ['2', 'Lisää', 'Add one detail', 'एउटा कुरा थप्नुहोस्', 'lähellä asemaa'], ['3', 'Kysy takaisin', 'Ask back', 'फर्केर सोध्नुहोस्', 'Entä sinä?']].map(r => `<div class="card"><span class="bn">${r[0]}</span><b style="display:block;margin-top:6px">${r[1]}</b><span class="t-en small">${r[2]}</span> <span class="t-ne small">· ${r[3]}</span><p class="fi small" style="margin:4px 0 0">${esc(r[4])}</p></div>`).join('')}</div>
    <p class="small">A short answer ends the talk. An answer with one detail and a question back gives the other person something to say, and you hear more Finnish. This is how your speaking grows: each new sentence pattern becomes a new question you can ask. · छोटो जवाफले कुरा रोकिन्छ; थप विवरण र प्रश्नले कुराकानी अघि बढ्छ।</p>
    <div class="cmp2"><div class="card"><p class="eyebrow">Short answers · छोटो जवाफ</p>${SB_SHORT.map(l => tri(l[1], l[2], '', { who: l[0] })).join('')}</div><div class="card"><p class="eyebrow">Growing answers · बढ्दो जवाफ</p>${SB_GROW.map(l => `<div class="tri">${sayBtn(l[1])}<div class="tx"><span class="who">${l[0]}${l[3] ? ' · ' + esc(l[3]) : ''}</span><span class="fi tfi">${esc(l[1])}</span><span class="t-en">${esc(l[2])}</span></div></div>`).join('')}</div></div>
    <h2>Words that keep a conversation going</h2><div class="grid sm">${SB_KEEP.map(k => `<button type="button" class="tile" data-say="${esc(k[0])}"><b>${esc(k[0])}</b><span class="t-en small">${esc(k[1])}</span><span class="t-ne small">${esc(k[2])}</span></button>`).join('')}</div>
    <h2>Practise: one question, three levels</h2><p class="small muted">Hear the question. Answer aloud at level 3 (answer + detail + question back). Then open the levels and compare. · प्रश्न सुन्नुहोस्, तह ३ मा जवाफ दिनुहोस्।</p>
    <div class="chips">${SB_CONV.map((c, i) => `<button type="button" class="chip" data-c="${i}">${esc(c[0])}</button>`).join('')}</div><div data-cv></div>
    <h2>Conversation run · कुराकानी अभ्यास</h2><p class="small muted">6 questions in a row. Answer each aloud, then see a level-3 model.</p><button type="button" class="btn pri" data-run>Start</button><div data-runb style="margin-top:10px"></div>${recorderHTML('sbtalk')}`;
    bindRecorders(h);
    const open = i => {
      const c = SB_CONV[i]; $$('[data-c]', h).forEach(b => b.setAttribute('aria-pressed', +b.dataset.c === i));
      $('[data-cv]', h).innerHTML = `<div class="card"><div class="tri">${sayRow(c[0])}<div class="tx"><span class="fi" style="font-size:1.15rem">${esc(c[0])}</span><span class="t-en">${esc(c[1])}</span><span class="t-ne">${esc(c[2])}</span></div></div>${c[3].map((a, k) => `<details class="lvl"${k === 0 ? '' : ''}><summary><span class="tag ${['', 'warn', 'ok'][k]}">Level ${k + 1}</span> ${['one word: the talk stops', 'a full sentence', 'answer + detail + ask back'][k]}</summary>${tri(a, '', '')}</details>`).join('')}<p class="small" style="margin:10px 0 4px"><b>Follow-up questions they may ask you:</b></p>${c[4].map(f => tri(f, '', '')).join('')}</div>`;
      speak(c[0]);
    };
    $$('[data-c]', h).forEach(b => b.onclick = () => open(+b.dataset.c));
    $('[data-run]', h).onclick = () => { runQuiz($('[data-runb]', h), pick(SB_CONV, 6).map(c => ({ t: 'say', q: c[0] + ' · ' + c[1], qn: c[2], model: c[3][2] })), { title: 'Conversation', key: 'sb:talk', skill: 'speaking' }); setTimeout(() => { const q = $('[data-runb] .qp', h); if (q) speak(q.textContent.replace('🗣 Say it aloud · ', '').split(' · ')[0]); }, 150); };
  },
  drill(h) {
    h.innerHTML = `<p class="small muted">20 mixed questions: endings, questions, negatives, word order and translation. Wrong answers go to your mistake notebook. · मिश्रित अभ्यास।</p><button type="button" class="btn pri" data-d>Start the drill · सुरु</button><div data-db style="margin-top:12px"></div>`;
    $('[data-d]', h).onclick = () => runQuiz($('[data-db]', h), sbDrill(), { title: 'Sentence drill', key: 'sb:drill', skill: 'grammar', regen: sbDrill });
  }
};
function qsChips(q) {
  // the sentence with each slot as a tappable chip; other words plain
  let rest = q.fi.replace(/[.?]$/, ''); const parts = [];
  q.slots.forEach((s, i) => { const at = rest.indexOf(s[0]); if (at < 0) return; if (at > 0) parts.push(esc(rest.slice(0, at))); parts.push(`<button type="button" class="rchip r${s[1]} tap" data-slot="${i}"><b>${esc(s[0])}</b><small>${esc(SB_ROLE[s[1]][2])}</small></button>`); rest = rest.slice(at + s[0].length); });
  if (rest.trim()) parts.push(esc(rest));
  return parts.join(' ') + '.';
}
function sbExample(k, n, ck, form) {
  const drinks = ['kahvi', 'tee', 'vesi', 'maito', 'mehu'], transport = ['bussi', 'juna', 'auto', 'pyörä'];
  const place = n.t === 'in' || n.t === 'on' || n.t === 'city' || n.t === 'city-on', person = n.t === 'person';
  const en = n.en, enB = en.replace(/^(a|the) /, '');
  const C = cap(form);
  switch (ck) {
    case 'nom': return [`Tämä on ${form}.`, `This is ${en}.`];
    case 'gen': return person ? [`Tämä on ${form} puhelin.`, `This is ${enB}'s phone.`] : (n.t === 'city' || n.t === 'city-on') ? [`${C} keskusta on kaunis.`, `The centre of ${en} is beautiful.`] : place ? [`${C} ovi on auki.`, `The door of ${en} is open.`] : n.t === 'food' ? [`${C} hinta on kaksi euroa.`, `The price of ${enB} is two euros.`] : [`${C} väri on sininen.`, `The colour of ${en} is blue.`];
    case 'part': return person ? [`Odotan ${form}.`, `I am waiting for ${en}.`] : (n.t === 'city' || n.t === 'city-on') ? [`Rakastan ${form}.`, `I love ${en}.`] : place ? [`En löydä ${form}.`, `I can't find ${en}.`] : n.t === 'food' ? (drinks.includes(k) ? [`Juon ${form}.`, `I drink ${enB}.`] : [`Syön ${form}.`, `I eat ${enB}.`]) : [`Minulla ei ole ${form}.`, `I don't have ${en}.`];
    case 'ine': return k === 'koti' ? ['Olen kotona.', 'I am at home. (kodissa = inside the home)'] : k === 'työ' ? ['Olen töissä.', 'I am at work.'] : (place || k === 'lääkäri') ? [`Olen ${form}.`, `I am ${k === 'lääkäri' ? "at the doctor's" : 'in ' + en}.`] : [`Mitä ${form} on?`, `What is in ${en}?`];
    case 'ela': return k === 'koti' ? ['Lähden kotoa.', 'I leave home.'] : k === 'työ' ? ['Tulen töistä.', 'I come from work.'] : (place || k === 'lääkäri') ? [`Tulen ${form}.`, `I come from ${k === 'lääkäri' ? "the doctor's" : en}.`] : [`Pidän ${form}.`, `I like ${enB}.`];
    case 'ill': return k === 'työ' ? ['Menen töihin.', 'I go to work.'] : (place || k === 'lääkäri') ? [`Menen ${form}.`, `I go ${k === 'koti' ? 'home' : 'to ' + (k === 'lääkäri' ? "the doctor's" : en)}.`] : [`Laitan sen ${form}.`, `I put it into ${en}.`];
    case 'ade': return (n.t === 'on' || n.t === 'city-on') ? [`Olen ${form}.`, `I am at ${en}.`] : n.t === 'in' ? [`Tavataan ${form}!`, `Let's meet at ${en}!`] : person ? [`${C} on auto.`, `${cap(enB)} has a car.`] : transport.includes(k) ? [`Menen ${form}.`, `I go by ${enB}.`] : k === 'pöytä' ? ['Kirja on pöydällä.', 'The book is on the table.'] : k === 'puhelin' ? ['Soitan puhelimella.', 'I call with the phone.'] : ['koira', 'kissa'].includes(k) ? [`${C} on nälkä.`, `The ${enB} is hungry.`] : null;
    case 'abl': return (n.t === 'on' || n.t === 'city-on') ? [`Tulen ${form}.`, `I come from ${en}.`] : person ? [`Kysyn ${form}.`, `I ask ${en}.`] : n.t === 'in' ? [`Haen sinut ${form}.`, `I'll pick you up from ${en}.`] : k === 'pöytä' ? ['Otan kirjan pöydältä.', 'I take the book from the table.'] : null;
    case 'all': return (n.t === 'on' || n.t === 'city-on') ? [`Menen ${form}.`, `I go to ${en}.`] : person ? [`Soitan ${form}.`, `I call ${en}.`] : n.t === 'in' ? [`Tule ${form}!`, `Come to ${en}!`] : k === 'pöytä' ? ['Laitan kirjan pöydälle.', 'I put the book on the table.'] : ['koira', 'kissa'].includes(k) ? [`Annan ruokaa ${form}.`, `I give food to the ${enB}.`] : null;
    case 'pl': return [`Missä ${form} ovat?`, `Where are the ${enB}s?`];
  }
  return null;
}
function endingQuiz(k, n) {
  const N = sbN(k); const avail = SB_CASES.filter(c => c.i >= 0 && N.f[c.i]);
  return pick(avail, Math.min(n, avail.length)).map(c => { const right = N.f[c.i]; const others = uniq(pick(avail.filter(x => x !== c), 3).map(x => N.f[x.i]).filter(x => x !== right)).slice(0, 2); const o = shuffle([right, ...others]); const ex = sbExample(k, N, c.k, right); return { t: 'mc', q: `<b>${esc(k)}</b> → ${esc(c.name)} <span class="muted">(${esc(c.q)}, ${esc(c.end)})</span>`, o, a: o.indexOf(right), tag: 'case', x: `${k} → ${right}. ${ex ? ex[0] + ' – ' + ex[1] : ''}`, xn: c.ne }; });
}
function whDrill(n) { return Array.from({ length: n }, () => { const st = sbRandom('wh'); const V = SB_VERBS[st.v]; st.wh = 'C'; const out = sbBuild(st); const ans = sbBuild(Object.assign({}, st, { mode: 'stmt' })); const qw = out.tokens[0][0]; const opts = shuffle(uniq([qw, ...pick(['Missä', 'Mistä', 'Mihin', 'Mitä', 'Kenelle', 'Milloin', 'Kuka', 'Mitä kieltä'].filter(x => x !== qw), 2)])); const compTok = ans.tokens.find(t => t[1] === 'P' || t[1] === 'O'); return { t: 'mc', q: `Answer: <b>${esc(compTok ? compTok[0] : '')}</b> · <span class="t-en">${esc(ans.en)}</span><br>Which question? ___ ${esc(out.fi.split(' ').slice(qw.split(' ').length).join(' '))}`, o: opts, a: opts.indexOf(qw), tag: 'wc', x: `${out.fi} – ${ans.fi}`, xn: 'प्रश्नवाचक शब्दको अन्त्य जवाफसँग मिल्छ।' }; }); }
function sbDrill() {
  const items = [];
  for (let i = 0; i < 8; i++) { const st = sbRandom('stmt'); st.s = rnd(0, 5); st.t = 0; st.m = 0; const V = SB_VERBS[st.v]; if (V.comp === 'lang') { i--; continue; } const out = sbBuild(st); const ci = out.tokens.findIndex(t => (t[1] === 'P' || t[1] === 'O') && t[2] && t[2].includes('→')); if (ci < 0) { i--; continue; } const tok = out.tokens[ci]; const base = tok[2].split(' → ')[0]; const shown = out.tokens.map((t, j) => j === ci ? '___' : t[0]).join(' ') + '.'; items.push({ t: 'fill', q: `${shown} (${base})`, a: [tok[0]], tag: 'case', x: tok[2] + ' · ' + out.en }); }
  items.push(...whDrill(4));
  for (let i = 0; i < 3; i++) { const st = sbRandom('stmt'); st.t = 0; st.m = 0; st.s = rnd(0, 5); const a = sbBuild(st), b = sbBuild(Object.assign({}, st, { mode: 'neg' })); items.push({ t: 'fill', q: `Make it negative: ${a.fi}`, a: [b.fi, b.fi.replace(/^(Minä|Sinä|Me|Te) /, '')].map(x => x.replace(/^./, c => c.toUpperCase())), tag: 've', x: b.fi + ' · ' + b.en, xn: 'en, et, ei … + क्रियाको मूल भाग।' }); }
  for (let i = 0; i < 3; i++) { const st = sbRandom('stmt'); st.s = rnd(0, 5); st.m = 0; const a = sbBuild(st); items.push({ t: 'tr', q: a.en, qn: '', a: [a.fi, a.fi.replace(/^(Minä|Sinä|Me|Te) (\S)/, (m, p, c) => c.toUpperCase())], tag: 'wo' }); }
  for (let i = 0; i < 2; i++) { const st = sbRandom('stmt'); st.drop = true; const a = sbBuild(st); items.push({ t: 'ord', a: a.fi, en: a.en, tag: 'wo' }); }
  return shuffle(items);
}
// hear a line → pause for you to say it → next
function speakAlong(rows, texts, status) {
  let i = 0, stop = false;
  const off = () => { stop = true; document.removeEventListener('click', off, true); rows.forEach(r => r.classList.remove('hl', 'you')); if (status) status.textContent = ''; };
  const step = () => {
    rows.forEach(r => r.classList.remove('hl', 'you'));
    if (stop || i >= texts.length) { if (status && !stop) status.textContent = 'Done. Now say the last line once more without the voice. · अब आफैं भन्नुहोस्।'; return; }
    const r = rows[i]; const t = texts[i]; r.classList.add('hl'); r.scrollIntoView({ block: 'nearest' });
    if (status) status.textContent = `Step ${i + 1}/${texts.length}: listen… · सुन्नुहोस्`;
    speak(t, false, () => { r.classList.add('you'); if (status) status.textContent = `Step ${i + 1}/${texts.length}: your turn, say it aloud · तपाईंको पालो`; setTimeout(() => { i++; step(); }, Math.max(2500, t.length * 110)); });
  };
  setTimeout(() => document.addEventListener('click', off, true), 50);
  step();
}
