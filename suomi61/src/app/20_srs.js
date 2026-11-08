// ===== spaced repetition: 5 Leitner boxes (section 10.3) =====
const GAPS = [0, 1, 2, 4, 8, 16];
const cards = () => sget('cards', {});
function cardSet(id, box) { const c = cards(); c[id] = { b: box, due: addDays(todayISO(), box === 1 ? 0 : GAPS[box]) }; if (box === 1 && c[id]) c[id].due = todayISO(); sset('cards', c); }
function cardAnswer(id, right) { const c = cards(); const cur = c[id] || { b: 1 }; const b = right ? Math.min(5, cur.b + 1) : 1; c[id] = { b, due: addDays(todayISO(), right ? GAPS[b] : 1) }; sset('cards', c); }
const cramDay = () => { const n = dayOfISO(todayISO()); return n === 23 || n === 24 || (n >= 57 && n <= 61); };
function dueIds() { const c = cards(); const t = todayISO(); const cram = cramDay(); return Object.keys(c).filter(id => c[id].due <= t || (cram && c[id].b <= 3)).sort((a, b) => c[a].due < c[b].due ? -1 : 1); }
const newToday = () => sget('new:' + todayISO(), 0);
// words of days already reached that are not in the deck yet
function introPool() { const c = cards(); const t = todayDay(); return WORDS.filter(w => w.d && w.d <= t && !c['w:' + w.id]).sort((a, b) => a.d - b.d); }
function introduce(words) { const c = cards(); let n = newToday(); const room = Math.max(0, 20 - n); const add = words.filter(w => !c['w:' + w.id]).slice(0, room); add.forEach(w => { c['w:' + w.id] = { b: 1, due: todayISO() }; }); sset('cards', c); sset('new:' + todayISO(), n + add.length); return add.length; }
const wordById = id => WORDS.find(w => w.id === id);
function cardFace(id) {
  if (id.startsWith('w:')) { const w = wordById(id.slice(2)); if (!w) return null; return { e: w.e, fi: w.fi, en: w.en, ne: w.ne, x: w.x, sp: w.sp, k: w.k, f: w.f, vf: w.vf }; }
  if (id.startsWith('t:')) { const c = sget('mycards', {})[id]; if (!c) return null; return { e: '🌐', fi: c.fi, en: c.en, ne: c.ne }; }
  if (id.startsWith('m:')) { const m = sget('mist', []).find(x => 'm:' + x.id === id); if (!m) return null; return { e: '✏️', fi: m.a, en: m.p, ne: m.xn || '', mist: true, x: m.x ? [m.a, m.x, m.xn || ''] : null }; }
  return null;
}
// a review session (used by block 1 and the Kortit screen)
function runCards(host, opts = {}) {
  // opts.ids: study a fixed deck (a chapter or a word list) instead of today's due cards
  const fresh = () => opts.ids ? shuffle(opts.ids).filter(id => cardFace(id)) : dueIds().filter(id => cardFace(id)).slice(0, 120);
  let ids = fresh();
  const state = { i: 0, flip: false, right: 0, n: ids.length };
  function boxesHTML() { const c = cards(); const cnt = [0, 0, 0, 0, 0, 0]; Object.values(c).forEach(x => cnt[x.b]++); return `<div class="boxes">${[1, 2, 3, 4, 5].map(b => `<div><b>${cnt[b]}</b><span>Box ${b} · ${b === 1 ? 'daily' : GAPS[b] + ' days'}</span></div>`).join('')}</div>`; }
  function render() {
    if (!ids.length && opts.ids) { host.innerHTML = '<div class="note">This deck is empty. · यो डेकमा कार्ड छैन।</div>'; return; }
    if (!ids.length) {
      const pool = introPool();
      host.innerHTML = `${boxesHTML()}<div class="note">No cards are due right now. · अहिले दोहोर्‍याउने कार्ड छैन।</div>${pool.length ? `<div class="row" style="margin-top:12px"><button type="button" class="btn pri" data-a="intro">Add ${Math.min(pool.length, Math.max(0, 20 - newToday()))} new words · नयाँ शब्द थप्नुहोस्</button><span class="muted small">${newToday()}/20 new today</span></div>` : ''}`;
      return;
    }
    if (state.i >= ids.length) { host.innerHTML = `${boxesHTML()}<div class="note ok"><b>Done for now.</b> ${state.right}/${state.n} right. · अहिलेलाई सकियो।</div><div class="row" style="margin-top:12px"><button type="button" class="btn" data-a="more">${opts.ids ? 'Go through the deck again · फेरि' : 'Check for more · थप'}</button></div>`; opts.onDone && opts.onDone(); return; }
    const f = cardFace(ids[state.i]);
    const dir = SET.cardDir === 'en' && !f.mist ? 'en' : 'fi';
    const front = dir === 'fi' ? `<div class="e">${f.e || ''}</div><div class="w">${esc(f.fi)}</div>${f.mist ? `<div class="muted small">Your mistake: ${esc(f.en)}</div>` : ''}<div class="muted small">Tap to turn · पल्टाउन थिच्नुहोस्</div>`
      : `<div class="e">${f.e || ''}</div><div class="m t-en">${esc(f.en)}</div><div class="m t-ne">${esc(f.ne)}</div><div class="muted small">Say it in Finnish, then tap.</div>`;
    const back = `<div class="e">${f.e || ''}</div><div class="w">${esc(f.fi)}</div>${f.sp ? `<div class="t-sp small">🗣 ${esc(f.sp)}</div>` : ''}<div class="m t-en">${esc(f.en)}</div><div class="m t-ne">${esc(f.ne)}</div>${f.k ? `<div class="small">k-p-t: <b>${esc(f.k)}</b></div>` : ''}${f.f ? `<div class="small muted">${esc(f.f.gen)} · ${esc(f.f.par)} · ${esc(f.f.ill)}</div>` : ''}${f.vf ? `<div class="small muted">minä ${esc(f.vf[0])} · hän ${esc(f.vf[2])}</div>` : ''}${f.x && f.x[0] && !f.mist ? `<div class="small" style="margin-top:6px"><b>${esc(f.x[0])}</b><br><span class="t-en">${esc(f.x[1])}</span> <span class="t-ne">${esc(f.x[2])}</span></div>` : ''}${f.mist && f.x ? `<div class="small t-en">${esc(f.x[1])}</div>` : ''}`;
    host.innerHTML = `<div class="qhead"><span>${opts.title ? esc(opts.title) + ' · ' : ''}Card ${state.i + 1}/${ids.length}</span><span class="num">✓ ${state.right}</span></div><div class="bar ok" style="margin-bottom:10px"><i style="width:${Math.round(state.i / ids.length * 100)}%"></i></div>
      <div class="fc" data-a="flip" role="button" tabindex="0" aria-label="Turn the card">${state.flip ? back : front}</div>
      <div class="fcctl">${sayBtn(f.fi)}${sayBtn(f.fi, 1)}${state.flip ? `<button type="button" class="btn" data-a="no">✗ Again · फेरि</button><button type="button" class="btn ok" data-a="yes">✓ I knew it · आयो</button>` : `<button type="button" class="btn pri" data-a="flip">Turn · पल्टाउनुहोस्</button>`}</div>`;
    if (state.flip || dir === 'fi') { if (SET.autoSay) speak(f.fi); }
  }
  host.onclick = e => {
    const s = e.target.closest('[data-say]'); if (s) { e.stopPropagation(); speak(s.dataset.say, !!s.dataset.slow); return; }
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'flip') { state.flip = !state.flip; if (state.flip) speak(cardFace(ids[state.i]).fi); render(); }
    if (a === 'yes' || a === 'no') { cardAnswer(ids[state.i], a === 'yes'); if (a === 'yes') state.right++; else ids.push(ids[state.i]); state.i++; state.flip = false; bumpStreak(); render(); }
    if (a === 'intro') { introduce(introPool()); ids = dueIds().filter(id => cardFace(id)); state.i = 0; state.n = ids.length; render(); }
    if (a === 'more') { ids = fresh(); state.i = 0; state.right = 0; state.n = ids.length; render(); }
  };
  host.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { const fc = e.target.closest('.fc'); if (fc) { e.preventDefault(); fc.click(); } } };
  render();
}
