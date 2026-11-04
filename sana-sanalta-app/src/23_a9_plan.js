// ================= TODAY + 30-DAY PLAN =================
const lvlKey=l=>l==='A1.1'?'in':l==='A1.2'?'out':'par';
function curDay(){return Math.min(30,Math.max(1,sget('curDay',1)))}
function dayState(d){return sget('pd:'+d,{})}
function dayDone(d){return Object.values(dayState(d)).filter(Boolean).length>=5}
const exName=id=>EXSETS[id]?EXSETS[id][0]:id;
function dayBlocks(d){const P=PLAN30[d-1];const [lvl,title,goal,learn,deck,story,place,ex,w,speak]=P;const S=STORIES.find(s=>s.id===story),PL=PLACES.find(p=>p.id===place),W=WRITING.find(x=>x[0]===w);
  const prevSame=d>1&&PLAN30[d-2][5]===story;const cat=deck.startsWith('n:')?deck.slice(2):null;
  return [
   [BLOCKS[0],`Flashcards, weakest cards first. Then say yesterday's 5 new words aloud.`,`<button class="btn sm pri" data-go="cards" data-deck="review">Review deck</button>`],
   [BLOCKS[1],`<b>${esc(learn[2])}</b>. Read it, say every example aloud, then make 3 sentences of your own.`,`${DAY_GRAMMAR[d]?`<button class="btn sm pri" data-go="grammar" data-topic="${DAY_GRAMMAR[d]}">Grammar lesson</button>`:''}<button class="btn sm ${DAY_GRAMMAR[d]?'ghost':'pri'}" data-go="${learn[0]}" data-anchor="${learn[1]}">${DAY_GRAMMAR[d]?'Reference':'Open the lesson'}</button>`],
   [BLOCKS[2],`Deck: <b>${esc(deckLabel(deck))}</b>. First Finnish → meaning, then meaning → Finnish.`,`<button class="btn sm pri" data-go="cards" data-deck="${deck}">Flashcards</button>${cat&&NOUNS[cat]?`<button class="btn sm ghost" data-go="vocab" data-cat="${cat}">Word list</button>`:''}`],
   [BLOCKS[3],S?(prevSame?`Story <b>${esc(S.fi)}</b> again: do the <b>dictation</b> and answer the questions.`:`New story: <b>${S.e} ${esc(S.fi)}</b>. Listen twice, read it aloud, shadow it.`):'',`<button class="btn sm pri" data-go="stories" data-story="${story}">Open story</button><button class="btn sm ghost" data-go="practice" data-ex="dict" data-story="${story}">Dictation</button>`],
   [BLOCKS[4],`Dialogue: <b>${PL?PL.e+' '+esc(PL.en):''}</b>. Listen, shadow, then 🎭 play your role. ${esc(speak)}`,`<button class="btn sm pri" data-go="places" data-place="${place}">Open dialogue</button><button class="btn sm ghost" data-go="questions" data-anchor="qa">30 questions</button>`],
   [BLOCKS[5],`Exercise: <b>${esc(exName(ex))}</b> (aim for 8/10). Writing: <b>${W?esc(W[3]):''}</b>.`,`<button class="btn sm pri" data-go="practice" data-ex="${ex}">Exercise</button><button class="btn sm ghost" data-go="writing" data-w="${w}">Writing task</button>`]
  ]}
RENDER.today=()=>{
  const d=curDay(),P=PLAN30[d-1],st=dayState(d);const all=allCards();const known=all.filter(c=>box(c.id)>=3).length;const doneDays=PLAN30.filter((_,i)=>dayDone(i+1)).length;
  const pool=Object.values(NOUNS).flatMap(c=>c.items.filter(i=>i[4]));const now=new Date();const doy=Math.floor((now-new Date(now.getFullYear(),0,0))/864e5);const w=pool[(doy*7)%pool.length];
  const blocks=dayBlocks(d);
  $('#p-today').innerHTML=(typeof hwBanner==='function'?hwBanner():'')+examBanner()+`<div class="hero">
   <div class="stack" style="gap:10px;min-width:0"><p class="eyebrow">Päivä ${d} / 30 · ${tag(P[0],lvlKey(P[0]))}</p><h2>${esc(P[1])}</h2>
    <p class="lede" style="margin:0"><b>Today's goal:</b> ${esc(P[2])}<br>About 2 hours in 6 blocks. Tick each block when you finish it. Want more? Repeat the exercises at the end.</p>
    <div class="row" style="gap:22px;margin-top:4px">
     <div><div class="stat">${doneDays}<span class="mut" style="font-size:1rem"> / 30</span></div><div class="mut" style="font-size:.85rem">days completed</div></div>
     <div><div class="stat">${known}<span class="mut" style="font-size:1rem"> / ${all.length}</span></div><div class="mut" style="font-size:.85rem">cards you know</div></div>
     <div><div class="stat">${streakCount()}</div><div class="mut" style="font-size:.85rem">days in a row</div></div></div>
    <div class="dayprog">${PLAN30.map((p,i)=>`<button class="dp k-soft-${lvlKey(p[0])} ${dayDone(i+1)?'done':''} ${i+1===d?'cur':''}" data-day="${i+1}" title="Day ${i+1}: ${esc(p[1])}">${i+1}</button>`).join('')}</div>
   </div>
   <div class="wotd"><p class="eyebrow">Päivän sana · Word of the day</p><div class="e">${w[0]}</div><div class="row"><div class="f">${esc(w[1])}</div>${spk(w[1])}</div><div><span class="t-en">${esc(w[2])}</span> · <span class="ne t-ne">${esc(w[3])}</span></div>${PUHE[w[1]]?`<div>🗣 ${esc(PUHE[w[1]])}</div>`:''}<div style="margin-top:8px;font-weight:600">${esc(w[4])}</div><div style="opacity:.85;font-size:.9rem"><span class="t-en">${esc(w[5])}</span> <span class="ne t-ne">${esc(w[6])}</span></div></div>
  </div>
  <div class="note voice-note warn" hidden style="margin:14px 0"></div>
  <h3>Today's 2 hours</h3>
  <div class="plan">${blocks.map(([b,desc,btns],k)=>`<div class="task ${st['b'+k]?'done':''}"><input type="checkbox" id="tb${k}" data-block="${k}" ${st['b'+k]?'checked':''} aria-label="${esc(b[1])} done"><div style="min-width:0"><label for="tb${k}" class="tt">${b[0]} ${esc(b[1])} <span class="mut mono" style="font-weight:500;font-size:.8rem">${b[2]} min</span></label><div class="td">${desc}</div></div><div class="row" style="gap:6px;justify-content:flex-end">${btns}</div></div>`).join('')}</div>
  <div class="row" style="margin-top:14px"><button class="btn ghost" id="dPrev" ${d===1?'disabled':''}>← Day ${d-1||1}</button><button class="btn ok" id="dNext">${d<30?'Go to day '+(d+1)+' →':'Plan finished 🎉'}</button></div>
  <h3>Extra time? (optional, +30–60 min)</h3>
  <div class="grid">${[['🔁','Repeat today\'s exercise with new questions','practice','ex',P[7]],['🧩','Word order with sentences from all stories','practice','ex','order'],['🎧','Dictation: random sentences','practice','ex','dict'],['🔤','Spell 10 words from memory','practice','ex','spell'],['🗣️','Spoken Finnish sentence pairs','puhe','anchor','psent'],['❓','Answer the 30 questions aloud','questions','anchor','qa']].map(x=>`<button class="card extra" data-go="${x[2]}" data-${x[3]}="${x[4]}"><span style="font-size:1.4rem">${x[0]}</span><span>${esc(x[1])}</span></button>`).join('')}</div>
  <h3>Nine golden rules</h3>
  <div class="grid wide">${RULES.map(r=>`<div class="card rule"><h4>${esc(r[0])}</h4><p style="margin:0">${esc(r[1])}</p></div>`).join('')}</div>`;
  voiceNote();
  $$('#p-today [data-block]').forEach(cb=>cb.addEventListener('change',()=>{const s=dayState(d);s['b'+cb.dataset.block]=cb.checked;sset('pd:'+d,s);cb.closest('.task').classList.toggle('done',cb.checked);if(Object.values(s).filter(Boolean).length>=3)markDay();
    const dp=$(`#p-today [data-day="${d}"]`);if(dp)dp.classList.toggle('done',dayDone(d))}));
  $('#dPrev').onclick=()=>{sset('curDay',Math.max(1,d-1));RENDER.today();window.scrollTo(0,0)};
  $('#dNext').onclick=()=>{if(d<30){sset('curDay',d+1);RENDER.today();window.scrollTo(0,0)}};
  $('#p-today .dayprog').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(b){sset('curDay',+b.dataset.day);RENDER.today()}});
};
RENDER.plan=()=>{
  $('#p-plan').innerHTML=`<p class="eyebrow">30 päivää · 30-day plan</p><h2>From zero to A1.3 in 30 days, 2 hours a day</h2>
  <p class="lede">Ten days per level. Each day has the same six blocks, so it becomes a habit. Every day reuses earlier words, and every second day repeats a story as dictation, because repetition is what makes words stay.</p>
  <div class="tbl"><table><thead><tr><th>Block</th><th>Minutes</th><th>What you do</th></tr></thead><tbody>${BLOCKS.map(b=>`<tr><td><b>${b[0]} ${esc(b[1])}</b></td><td class="mono">${b[2]}</td><td>${esc(b[3])}</td></tr>`).join('')}<tr><td><b>Total</b></td><td class="mono">120</td><td class="mut">Optional extra: repeat exercises, dictation, spelling.</td></tr></tbody></table></div>
  ${H3('track','Your exam track: 2 → 26 November','par')}
  <p class="lede">Your exam is on 25–26 November, so the 30 plan days fit into 20 calendar days: on some days you do two plan days (3–4 hours). Mock exams fill 22–24 November. Today's row is marked ◀.</p>
  ${trackTable()}
  ${LEVELS.map((L,li)=>`${H3('lv'+li,L[0]+' · '+L[1]+' <span class="mut" style="font-weight:500">('+L[2]+')</span>',lvlKey(L[0]))}
   <div class="daygrid">${PLAN30.slice(li*10,li*10+10).map((p,k)=>{const n=li*10+k+1;return `<button class="daycard k-soft-${lvlKey(p[0])} ${dayDone(n)?'done':''}" data-day="${n}"><span class="mono mut">Day ${n}${dayDone(n)?' ✓':''}</span><b>${esc(p[1])}</b><span class="mut" style="font-size:.85rem">${esc(p[2])}</span></button>`}).join('')}</div>
   <div class="card" style="margin-top:10px"><div class="grp-label">Can-do checklist ${L[0]}</div>${L[3].map((c,ci)=>`<label class="cando"><input type="checkbox" data-cd="${li}-${ci}" ${sget('cd:'+li+'-'+ci,false)?'checked':''}> ${esc(c)}</label>`).join('')}</div>`).join('')}`;
  $('#p-plan').addEventListener('click',e=>{const b=e.target.closest('.daycard[data-day]');if(b){sset('curDay',+b.dataset.day);showTab('today')}});
  $('#p-plan').addEventListener('change',e=>{const c=e.target.closest('[data-cd]');if(c)sset('cd:'+c.dataset.cd,c.checked)});
};

// ================= WRITING =================
let curW=sget('wcur','w1');
function openWriting(id){const W=WRITING.find(x=>x[0]===id)||WRITING[0];curW=W[0];sset('wcur',W[0]);
  $$('#wTiles [data-wt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wt===W[0])));
  const key='wt:'+W[0];const isForm=W[0]==='w11';
  $('#wView').innerHTML=`<div class="row" style="gap:12px"><span style="font-size:2.4rem">${W[1]}</span><div><div class="row" style="gap:8px">${tag(W[4],lvlKey(W[4]))}</div><h3 style="margin:2px 0 0">${esc(W[2])}</h3><div class="mut">${esc(W[3])}</div></div></div>
  <p style="margin:12px 0"><b>Task:</b> ${esc(W[5])}</p>
  ${isForm?`<div class="formgrid">${W[6].map((f,i)=>`<label class="grp-label" for="wf${i}">${esc(f)}</label><input id="wf${i}" type="text" value="${esc(sget(key+':'+i,''))}" data-wf="${i}">`).join('')}</div><p class="mut" style="font-size:.85rem">English: ${esc(W[8])}</p>`:
  `<div class="grp-label">Sentence starters (tap to add)</div><div class="chips" id="wFrames">${W[6].map(f=>`<button class="chip" data-frame="${esc(f)}">${esc(f)}</button>`).join('')}</div>
  <textarea id="wText" rows="10" placeholder="Kirjoita tähän suomeksi…">${esc(sget(key,''))}</textarea>${fiKeys('wText')}
  <div class="row" style="justify-content:space-between;margin-top:6px"><span class="mut mono" id="wCount" style="font-size:.85rem"></span><span class="row" style="gap:6px"><button class="btn ghost sm" id="wSay">🔈 Read my text aloud</button>${fbButton('w')}</span></div><div class="fbout" id="wFb" hidden></div>
  <div class="note" style="margin-top:10px"><span class="lbl">Check yourself</span>1. Every sentence has a verb with the right ending (-n, -t…). 2. After numbers and "not": partitive. 3. Places: -ssa / -sta / -Vn. 4. Read it aloud twice.</div>`}
  <details style="margin-top:12px"><summary>Show the model text</summary><div class="db">${lineHTML(W[7],isForm?'':W[8])}</div></details>`;
  if(isForm){$$('#wView [data-wf]').forEach(inp=>inp.addEventListener('input',()=>sset(key+':'+inp.dataset.wf,inp.value)));return}
  const ta=$('#wText');const wc=()=>{const n=(ta.value.trim().match(/\S+/g)||[]).length;$('#wCount').textContent=n+' words';sset(key,ta.value);if(n>=30)markDay()};ta.addEventListener('input',wc);wc();
  $('#wFrames').onclick=e=>{const b=e.target.closest('[data-frame]');if(!b)return;ta.value=(ta.value&&!/\s$/.test(ta.value)?ta.value+' ':ta.value)+b.dataset.frame.replace(/…/g,'')+' ';ta.focus();wc()};
  $('#wSay').onclick=()=>{if(ta.value.trim())sayNow(ta.value)};
  const fb=$('#wView [data-fb]');if(fb)fb.onclick=()=>claudeFeedback(W[5],ta.value,$('#wFb'),fb);
}
RENDER.writing=()=>{
  $('#p-writing').innerHTML=`<p class="eyebrow">Kirjoitus · Writing</p><h2>Write a little every day</h2>
  <p class="lede">Writing makes words stick, because you have to remember every letter and every ending. Use the sentence starters, write your own text, read it aloud, then compare with the model. Everything you write is saved in this browser.</p>
  <div class="places" id="wTiles">${WRITING.map(W=>`<button class="ptile" data-wt="${W[0]}" aria-pressed="false"><span class="row" style="justify-content:space-between"><span class="pe">${W[1]}</span>${tag(W[4],lvlKey(W[4]))}</span><span class="pf">${esc(W[2])}</span><span class="pn">${esc(W[3])}</span></button>`).join('')}</div>
  <div class="out" id="wView"></div>`;
  $('#wTiles').addEventListener('click',e=>{const b=e.target.closest('[data-wt]');if(b)openWriting(b.dataset.wt)});
  openWriting(curW);
};

// ================= TIPS =================
const ALPHA=[['a','aa'],['b','bee'],['c','see'],['d','dee'],['e','ee'],['f','äf'],['g','gee'],['h','hoo'],['i','ii'],['j','jii'],['k','koo'],['l','äl'],['m','äm'],['n','än'],['o','oo'],['p','pee'],['q','kuu'],['r','är'],['s','äs'],['t','tee'],['u','uu'],['v','vee'],['w','kaksoisvee'],['x','äks'],['y','yy'],['z','tset'],['å','ruotsalainen oo'],['ä','ää'],['ö','öö']];
const METHOD=[
['🔁','Spaced repetition','See a word today, again in 2 days, again in a week. The flashcards do this for you: missed cards come back sooner.'],
['🗣️','Shadowing','Play a line and repeat it at the same time or right after. It trains your mouth and ear together. Use 🔁 in Stories and Places.'],
['🧱','Learn chunks, not single words','Learn "Minulla on…", "Saisinko…?", "Missä on…?" as one block. You will speak faster than by building every sentence.'],
['3️⃣','Three forms of every noun','talo – talon – taloa. The genitive is the master key for most other endings.'],
['🔗','Verbs with their ending','Learn "pitää + -sta", "soittaa + -lle" together. Never learn a verb alone.'],
['🏷️','Sticky notes at home','Label things: ovi, ikkuna, jääkaappi, peili. Say the word every time you touch it.'],
['🧠','Think in Finnish on the bus','Name what you see: bussi, pysäkki, lumi, ihmiset. Describe it: Bussi on täynnä. Ulkona sataa.'],
['✍️','Write by hand too','Write 10 new words three times in a notebook. Writing by hand helps memory even more than typing.'],
['😊','Speak with mistakes','Finns are happy when you try. Say "Puhun vähän suomea, puhutaanko suomea?" and keep going.']
];
RENDER.tips=()=>{
  $('#p-tips').innerHTML=`<p class="eyebrow">Vinkit · Method and tips</p><h2>How to learn so that it stays</h2>
  <p class="lede">You don't forget words because you are bad at languages. You forget them because you saw them only once. These habits fix that.</p>
  ${jumpNav([['method','9 habits'],['pron','Pronunciation'],['alpha','Alphabet'],['levels','A1 levels'],['res','Free resources']])}
  ${H3('method','Nine habits','fi')}
  <div class="grid wide">${METHOD.map(m=>`<div class="card"><div class="row" style="gap:8px"><span style="font-size:1.5rem">${m[0]}</span><h4 style="margin:0">${esc(m[1])}</h4></div><p style="margin:8px 0 0">${esc(m[2])}</p></div>`).join('')}</div>
  ${H3('pron','Pronunciation: say every letter','fi')}
  <p class="lede">Finnish is read exactly as written, like Devanagari. Stress is always on the first syllable. Double letters are longer, and that changes the meaning: tuli (fire) · tuuli (wind) · tapan (I kill) · tapaan (I meet).</p>
  <div class="tbl"><table><thead><tr><th>Letter</th><th>Sound</th><th>Example</th></tr></thead><tbody>${PRONUN.map(p=>`<tr><td class="mono"><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td class="fi">${esc(p[2])} ${p[0]!=='stress'?spk(p[2].split(' (')[0].split(' · ')[0]):''}</td></tr>`).join('')}</tbody></table></div>
  ${H3('alpha','The alphabet (to spell your name on the phone)','fi')}
  <div class="alpha">${ALPHA.map(a=>`<button class="abox" data-say="${a[1]}"><b>${a[0].toUpperCase()}</b><span>${a[1]}</span></button>`).join('')}</div>
  ${H3('levels','What A1.1, A1.2 and A1.3 mean','par')}
  <div class="grid wide">${LEVELS.map((L,li)=>`<div class="card k-soft-${lvlKey(L[0])}"><h4>${L[0]} · ${esc(L[1])}</h4>${L[3].map((c,ci)=>`<label class="cando"><input type="checkbox" data-cd="${li}-${ci}" ${sget('cd:'+li+'-'+ci,false)?'checked':''}> ${esc(c)}</label>`).join('')}</div>`).join('')}</div>
  ${H3('res','Free resources to use alongside','fi')}
  <div class="grid">${[['Yle Selkouutiset','News in easy Finnish, text and audio every day.','https://yle.fi/selkouutiset'],['Uuno','Free online Finnish course for beginners.','https://uuno.tamk.fi'],['Your library','Selkokirjat (easy books) and free language cafés (kielikahvila).','https://www.kirjastot.fi']].map(r=>`<a class="card reslink" href="${r[2]}" target="_blank" rel="noopener"><b>${esc(r[0])}</b><span class="mut">${esc(r[1])}</span><span class="mono" style="font-size:.8rem">${esc(r[2].replace('https://',''))}</span></a>`).join('')}</div>`;
  $('#p-tips').addEventListener('change',e=>{const c=e.target.closest('[data-cd]');if(c)sset('cd:'+c.dataset.cd,c.checked)});
};

// ================= INIT =================
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-say]');if(s){e.preventDefault();stopPlayer();sayNow(s.dataset.say);return}
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go,g.dataset)}
});
function applyToggles(){document.body.classList.toggle('hide-en',!$('#optEn').checked);document.body.classList.toggle('hide-ne',!$('#optNe').checked);document.body.classList.toggle('hide-sp',!$('#optSp').checked)}
function init(){
  $('#tabs').innerHTML=TABS.map(([id,f,e,ic])=>`<button class="tab" role="tab" id="tab-${id}" data-tab="${id}" aria-selected="false" aria-controls="p-${id}"><span class="tfi">${ic} ${f}</span><span class="ten">${e}</span></button>`).join('');
  $('#panels').innerHTML=TABS.map(([id])=>`<section class="panel" id="p-${id}" role="tabpanel" aria-labelledby="tab-${id}" hidden></section>`).join('');
  $('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)showTab(b.dataset.tab)});
  const o={optEn:'showEn',optNe:'showNe',optSp:'showSp',optSlow:'slow'};
  for(const [id,k] of Object.entries(o)){const el=$('#'+id);el.checked=sget(k,id!=='optSlow');el.addEventListener('change',()=>{sset(k,el.checked);applyToggles()})}
  applyToggles();updateStreak();
  const h=(location.hash||'').slice(1);showTab(TABS.some(t=>t[0]===h)?h:sget('tab','today'));
}
