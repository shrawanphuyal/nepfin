// ===== navigation, routing, shared components =====
const IC = {
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>',
  learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M9 7h6M9 11h6"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/></svg>',
  tests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6l1 3H8z"/><rect x="4" y="6" width="16" height="15" rx="2"/><path d="m8 13 2 2 5-5"/></svg>',
  me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
};
// all screens: [hash, Finnish name, English, group]
const SCREENS = [
  ['today', 'Tänään', 'Today', 'today'], ['chapters', 'Kappaleet', 'All chapters', 'learn'], ['map', 'Kurssi', 'Course map', 'learn'], ['glib', 'Kielioppi', 'Grammar', 'learn'], ['lause', 'Lauseet', 'Sentence lab', 'learn'], ['words', 'Sanasto', 'Words', 'learn'], ['kaannos', 'Kääntäjä', 'Translator', 'learn'],
  ['arki', 'Arjessa', 'Dialogues & daily life', 'learn'], ['puhe', 'Puhekieli', 'Spoken Finnish', 'learn'], ['read', 'Lue ja kuuntele', 'Read & listen', 'learn'], ['kpt', 'k-p-t', 'k-p-t trainer', 'learn'],
  ['cards', 'Kortit', 'Flashcards', 'train'], ['practice', 'Harjoittele', 'Practice centre', 'train'], ['qlab', 'Kysymykset', 'Question lab', 'train'], ['write', 'Kirjoita', 'Writing', 'train'],
  ['testit', 'Testit', 'Tests', 'tests'],
  ['hw', 'Kotitehtävät', 'Homework', 'me'], ['progress', 'Edistyminen', 'Progress', 'me'], ['mistakes', 'Virhevihko', 'Mistake notebook', 'me'], ['asetukset', 'Asetukset', 'Settings', 'me']
];
const GROUPS = [['today', 'Tänään', 'Today'], ['learn', 'Kappaleet', 'Chapters'], ['train', 'Harjoittele', 'Practise'], ['tests', 'Testit', 'Tests'], ['me', 'Minä', 'Me']];
const GROUP_HOME = { today: 'today', learn: 'chapters', train: 'train', tests: 'testit', me: 'me' };
const R = {}; // route → render function(main, arg)
let CUR = 'today';
function groupOf(route) { const base = route.split('-')[0]; const map = { day: 'today', ch: 'learn', lesson: 'learn', gref: 'learn', dlg: 'learn', place: 'learn', story: 'learn', dread: 'learn', test: 'tests', exam: 'tests', learn: 'learn', lause: 'learn', train: 'train', me: 'me' }; const s = SCREENS.find(x => x[0] === route); return s ? s[3] : (map[base] || 'today'); }
function shell() {
  const side = `<a class="brand" href="#today"><span class="flag" aria-hidden="true"></span><span><b>Suomi 61</b><small>A1.0 → A1.3 · 1.11.–31.12.</small></span></a>` +
    GROUPS.map(g => `<h6>${g[1]} · ${g[2]}</h6>` + (g[0] === 'learn' ? CHAPTERS.map(c => `<a href="#ch-${c.id}" data-r="ch-${c.id}" class="sch"><span class="chn" style="--chc:${c.color}">${c.n}</span><span class="st">${esc(c.fi)}</span></a>`).join('') + '<h6 style="margin-top:8px">Kirjasto · Library</h6>' : '') + SCREENS.filter(s => s[3] === g[0] && s[0] !== 'chapters').map(s => `<a href="#${s[0]}" data-r="${s[0]}">${esc(s[1])}<span class="e">${esc(s[2])}</span></a>`).join('')).join('');
  $('#side').innerHTML = side;
  $('#bottom').innerHTML = GROUPS.map(g => `<a href="#${GROUP_HOME[g[0]]}" data-g="${g[0]}">${IC[g[0]]}<span>${g[1]}</span></a>`).join('');
}
function go(route) { if (location.hash !== '#' + route) location.hash = route; else render(); }
function render() {
  let h = (location.hash || '#today').slice(1) || 'today';
  CUR = h;
  try { speechSynthesis && speechSynthesis.cancel(); } catch (e) { }
  stopTimers();
  const main = $('#main');
  const [route, ...rest] = h.split('-');
  const arg = rest.join('-');
  const fn = R[h] || R[route];
  main.innerHTML = ''; main.onclick = null; main.onchange = null; main.oninput = null; main.onkeydown = null;
  try { if (fn) fn(main, R[h] ? '' : arg); else R.today(main, ''); }
  catch (e) { console.error(e); main.innerHTML = `<div class="note warn"><b>Something went wrong on this screen.</b> Go back to <a href="#today">Today</a> and try again. · यो पृष्ठमा समस्या आयो। फेरि प्रयास गर्नुहोस्।</div>`; }
  $$('#side a[data-r]').forEach(a => { const r = a.dataset.r; if (r === h || ((r.startsWith('ch-') || r === 'lause') && (h === r || h.startsWith(r + '-')))) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const g = groupOf(h); $$('#bottom a').forEach(a => { if (a.dataset.g === g) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#streak').textContent = '🔥 ' + streakNow();
  window.scrollTo(0, 0);
}
const crumbs = (...c) => `<nav class="crumbs" aria-label="Back">${c.map(([h, t]) => h ? `<a href="#${h}">← ${esc(t)}</a>` : `<span class="muted">${esc(t)}</span>`).join('<span class="muted">/</span>')}</nav>`;
const hubTiles = grp => `<div class="grid">${SCREENS.filter(s => s[3] === grp).map(s => `<a class="tile" href="#${s[0]}"><b>${esc(s[1])}</b><span class="muted">${esc(s[2])}</span></a>`).join('')}</div>`;
R.learn = m => { m.innerHTML = `<h1>Opi · Learn</h1><p class="lede">The course map, grammar, words, dialogues, spoken Finnish and texts. · पाठ्यक्रम, व्याकरण, शब्द, संवाद।</p>${hubTiles('learn')}`; };
R.train = m => { m.innerHTML = `<h1>Harjoittele · Practise</h1><p class="lede">Flashcards, exercises by skill and by error, questions and writing. · अभ्यास।</p>${hubTiles('train')}`; };
R.me = m => { m.innerHTML = `<h1>Minä · Me</h1><p class="lede">Your class homework, progress, mistakes and settings. · गृहकार्य, प्रगति, गल्ती र सेटिङ।</p>${hubTiles('me')}`; };

// global click: play buttons and blurred lines
document.addEventListener('click', e => {
  const s = e.target.closest('[data-say]');
  if (s && !e.defaultPrevented && !s.closest('.quiz') && !s.closest('.fcwrap')) { speak(s.dataset.say, !!s.dataset.slow); }
  const bl = e.target.closest('.blur .tfi'); if (bl) bl.classList.add('rev');
});

// ===== timers for the 9 blocks =====
const TIMERS = [];
function stopTimers() { TIMERS.splice(0).forEach(t => clearInterval(t)); }
function timerHTML(n, b) { return `<div class="timer" data-timer="${n}:${b.id}"><button type="button" class="btn sm pri" data-t="go">▶ Start ${b.min} min</button><span class="clock" aria-live="off">${b.min}:00</span><div class="bar" style="flex:1;min-width:80px"><i></i></div></div>`; }
function bindTimer(el, min) {
  let left = min * 60, run = null, used = 0;
  const btn = $('[data-t]', el), clock = $('.clock', el), bar = $('.bar i', el);
  const show = () => { clock.textContent = Math.floor(left / 60) + ':' + pad(left % 60); bar.style.width = Math.round((1 - left / (min * 60)) * 100) + '%'; };
  btn.onclick = () => {
    if (run) { clearInterval(run); run = null; btn.textContent = '▶ Continue'; addMinutes(used / 60); used = 0; return; }
    btn.textContent = '❚❚ Pause';
    run = setInterval(() => { left = Math.max(0, left - 1); used++; show(); if (used >= 60) { addMinutes(1); used = 0; } if (!left) { clearInterval(run); run = null; btn.textContent = '✓ Time'; toast('Time is up for this block. · यो खण्डको समय सकियो।'); } }, 1000);
    TIMERS.push(run);
  };
  show();
}

// recorder: MediaRecorder + IndexedDB, hidden gracefully when the microphone is not available
const IDB = { db: null };
function idb() { return new Promise((res, rej) => { if (IDB.db) return res(IDB.db); try { const r = indexedDB.open('fi61db', 1); r.onupgradeneeded = () => { r.result.createObjectStore('rec'); r.result.createObjectStore('txt'); }; r.onsuccess = () => { IDB.db = r.result; res(r.result); }; r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
async function idbPut(store, key, val) { try { const db = await idb(); return new Promise(res => { const tx = db.transaction(store, 'readwrite'); tx.objectStore(store).put(val, key); tx.oncomplete = () => res(true); tx.onerror = () => res(false); }); } catch (e) { return false; } }
async function idbGet(store, key) { try { const db = await idb(); return new Promise(res => { const r = db.transaction(store).objectStore(store).get(key); r.onsuccess = () => res(r.result); r.onerror = () => res(null); }); } catch (e) { return null; } }
async function idbDel(store, key) { try { const db = await idb(); db.transaction(store, 'readwrite').objectStore(store).delete(key); } catch (e) { } }
function recorderHTML(key) { return `<div class="rec card" data-rec="${esc(key)}" style="margin-top:10px"><div class="row"><button type="button" class="btn sm" data-rc="rec">● Record · रेकर्ड</button><span class="muted small" data-rc="st">Recordings stay on this device.</span></div><div data-rc="play" class="row" style="margin-top:8px"></div></div>`; }
function bindRecorders(host) {
  $$('[data-rec]', host).forEach(async box => {
    const key = 'rec:' + box.dataset.rec; const st = $('[data-rc=st]', box), pl = $('[data-rc=play]', box), btn = $('[data-rc=rec]', box);
    const showSaved = async () => { const blob = await idbGet('rec', key); if (blob) { const url = URL.createObjectURL(blob); pl.innerHTML = `<audio controls src="${url}" style="max-width:100%"></audio><button type="button" class="btn sm ghost" data-rc="del">Delete</button>`; $('[data-rc=del]', pl).onclick = async () => { await idbDel('rec', key); pl.innerHTML = ''; }; } };
    showSaved();
    let mr = null, chunks = [];
    btn.onclick = async () => {
      if (mr && mr.state === 'recording') { mr.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) { st.textContent = 'Recording is not available here. Use the installed phone app, or speak aloud and compare with the model. · यहाँ रेकर्ड हुँदैन।'; return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mr = new MediaRecorder(stream); chunks = [];
        mr.ondataavailable = e => chunks.push(e.data);
        mr.onstop = async () => { stream.getTracks().forEach(t => t.stop()); const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' }); await idbPut('rec', key, blob); btn.textContent = '● Record again'; st.textContent = 'Saved. Listen back and tick the checklist. · सुरक्षित भयो।'; showSaved(); };
        mr.start(); btn.textContent = '■ Stop'; st.textContent = 'Recording… speak now. · बोल्नुहोस्।';
      } catch (e) { st.textContent = 'The microphone is not available here. Use the installed phone app to record, or speak aloud and compare with the model. · माइक्रोफोन उपलब्ध छैन।'; }
    };
  });
}
const SPEAK_CHECK = [['Long vowels clear (tuuli, not tuli)?', 'लामो स्वर स्पष्ट?'], ['Double consonants held (kukka)?', 'दोहोरो व्यञ्जन रोकेर?'], ['Stress on the first syllable?', 'पहिलो अक्षरमा जोड?'], ['At least 5 sentences?', 'कम्तीमा ५ वाक्य?']];
const speakChecklist = key => `<div class="cando small" style="margin-top:8px">${SPEAK_CHECK.map((c, i) => `<label><input type="checkbox" data-ck="${esc(key)}:${i}" ${sget('ck', {})[key + ':' + i] ? 'checked' : ''}><span>${esc(c[0])} <span class="t-ne">${esc(c[1])}</span></span></label>`).join('')}</div>`;
document.addEventListener('change', e => { const c = e.target.closest('[data-ck]'); if (c) { const o = sget('ck', {}); o[c.dataset.ck] = c.checked ? 1 : 0; sset('ck', o); } });

// Claude helpers (only inside a Claude artifact with the sample capability)
async function askClaude(prompt, out) {
  if (!CAP.sample) return;
  out.hidden = false; out.textContent = 'Thinking… · सोच्दैछ…';
  try { const r = await CAP.sample(prompt, { onText: ({ text }) => { out.innerHTML = esc(text).replace(/\n/g, '<br>'); }, modelTier: 'default' }); out.innerHTML = esc(r.text).replace(/\n/g, '<br>'); }
  catch (e) { out.textContent = e && e.code === 'rate_limited' ? 'Too many requests just now. Try again in a minute.' : 'Claude feedback is not available right now. Compare with the model answer instead.'; }
}
const FEEDBACK_PROMPT = t => `Correct this A1 Finnish text written by a learner whose first language is ${hlName()}. List each error, the right form and a one-line reason in English and in ${hlWrite()}. Then give a corrected version and a score out of 10 for content, grammar and vocabulary. Keep it short and kind. Use plain text, no markdown tables.\n\nText:\n${t}`;
