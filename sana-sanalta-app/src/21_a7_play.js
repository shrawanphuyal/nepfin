// ================= LINE PLAYER (listen / shadow / my role) =================
const PL={on:false,i:0,nodes:[],mode:'listen',role:'B',btn:null};
function stopPlayer(){if(!PL.on)return;PL.on=false;hush();$$('.ln.speaking,.ln.yourturn').forEach(l=>l.classList.remove('speaking','yourturn'));if(PL.btn)PL.btn.textContent=PL.btn.dataset.label;PL.btn=null}
function startPlayer(nodes,mode,btn){if(PL.on){const same=PL.btn===btn;stopPlayer();if(same)return}
  if(!nodes.length)return;PL.on=true;PL.i=0;PL.nodes=nodes;PL.mode=mode;PL.btn=btn;if(btn){btn.dataset.label=btn.dataset.label||btn.textContent;btn.textContent='■ Stop'}hush();setTimeout(plStep,120)}
function plStep(){if(!PL.on)return;$$('.ln.speaking,.ln.yourturn').forEach(l=>l.classList.remove('speaking','yourturn'));
  if(PL.i>=PL.nodes.length){stopPlayer();markDay();return}
  const ln=PL.nodes[PL.i],fi=ln.dataset.fi,words=fi.split(/\s+/).length;
  try{ln.scrollIntoView({block:'center',behavior:reduceMotion()?'auto':'smooth'})}catch(e){}
  const next=d=>setTimeout(()=>{PL.i++;plStep()},d);
  if(PL.mode==='role'&&ln.dataset.role===PL.role){ln.classList.add('yourturn');
    setTimeout(()=>{if(!PL.on)return;ln.classList.remove('yourturn');ln.classList.add('speaking','rev');say(fi,()=>next(500))},1400+words*750);return}
  ln.classList.add('speaking');
  say(fi,()=>{if(PL.mode==='shadow'){ln.classList.remove('speaking');ln.classList.add('yourturn');next(1200+words*650)}else next(450)});
}
function lnHTML(fi,en,ne,sp,who,role,n){
  return `<div class="ln ${role||''}" data-fi="${esc(fi)}" data-role="${role||''}">${who?`<div class="who">${esc(who)}</div>`:''}<div class="bub">${spk(fi)}<div class="txt"><div class="lfi">${esc(fi)}</div>${sp&&sp!==fi?`<div class="lsp t-sp">🗣 ${esc(sp)}</div>`:''}<div class="len t-en">${esc(en)}</div><div class="lne t-ne">${esc(ne)}</div></div>${n!=null?`<span class="num">${n}</span>`:''}</div></div>`}
function wireLines(box){box.addEventListener('click',e=>{const f=e.target.closest('.lfi');if(f&&box.classList.contains('test-fi'))f.closest('.ln').classList.toggle('rev')})}
const playBar=(id,role)=>`<div class="row playbar"><button class="btn pri sm" data-play="listen" data-for="${id}">▶ Listen to all</button><button class="btn ghost sm" data-play="shadow" data-for="${id}">🔁 Shadow (repeat after)</button>${role?`<button class="btn ghost sm" data-play="role" data-for="${id}">🎭 Play my role</button>`:''}<label class="tog"><input type="checkbox" data-hide="${id}"> Test me: hide the Finnish</label></div>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-play]');if(!b)return;e.preventDefault();const box=document.getElementById(b.dataset.for);if(!box)return;startPlayer($$('.ln',box),b.dataset.play,b)});
document.addEventListener('change',e=>{const c=e.target.closest('[data-hide]');if(!c)return;const box=document.getElementById(c.dataset.hide);if(box){box.classList.toggle('test-fi',c.checked);$$('.ln',box).forEach(l=>l.classList.remove('rev'))}});

// ================= STORIES =================
let curStory=sget('story','s1');
function storyDone(id){return sget('sd:'+id,{})}
function markStory(id,k){const s=storyDone(id);s[k]=true;sset('sd:'+id,s);const t=$(`#storyTiles [data-st="${id}"] .sdone`);if(t)t.textContent=storyBadges(id)}
const storyBadges=id=>{const s=storyDone(id);return ['read','listen','dict','q','write'].filter(k=>s[k]).length+'/5'};
function openStory(id){stopPlayer();const s=STORIES.find(x=>x.id===id)||STORIES[0];curStory=s.id;sset('story',s.id);
  $$('#storyTiles [data-st]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.st===s.id)));
  const wkey='sw:'+s.id;
  $('#storyView').innerHTML=`<div class="row" style="gap:14px;align-items:flex-start"><div style="font-size:3rem;line-height:1">${s.e}</div><div style="min-width:0"><div class="row" style="gap:8px">${tag(s.lvl,s.lvl==='A1.1'?'in':s.lvl==='A1.2'?'out':'par')}<span class="mut mono" style="font-size:.8rem">${s.lines.length} sentences</span></div><h3 style="margin:4px 0 0">${esc(s.fi)}</h3><div><span class="t-en">${esc(s.en)}</span> · <span class="ne t-ne">${esc(s.ne)}</span></div></div></div>
  <div class="steps" style="margin-top:14px">${[['1','Listen','Press ▶ and just listen, eyes on the text.'],['2','Read aloud','Read every line aloud. Tap 🔈 for any line.'],['3','Shadow','🔁 repeat each line right after the voice.'],['4','Dictation','Hear it, type it. Builds spelling.'],['5','Questions + write','Answer, then write your own version.']].map(x=>`<div class="step"><div class="eyebrow">Step ${x[0]}</div><b>${x[1]}</b><div class="mut" style="font-size:.85rem">${x[2]}</div></div>`).join('')}</div>
  ${playBar('stLines')}
  <div class="dlg" id="stLines">${s.lines.map((l,i)=>lnHTML(l[0],l[1],l[2],l[3],null,'',i+1)).join('')}</div>
  <div class="row" style="margin-top:12px"><button class="btn ghost sm" id="stRead">✓ I read it aloud</button><button class="btn pri sm" data-go="practice" data-ex="dict" data-story="${s.id}">✍ Dictation of this story</button><button class="btn ghost sm" data-go="practice" data-ex="order" data-story="${s.id}">🧩 Word order</button></div>
  <h3>Key words</h3><div class="grid tight">${s.words.map(w=>`<div class="card" style="padding:10px 12px">${lineHTML(w[0],w[1],w[2])}</div>`).join('')}</div>
  <h3>Questions: answer in a full sentence</h3><div class="stack" id="stQ">${s.q.map((q,i)=>`<div class="card"><div class="row" style="gap:6px">${spk(q[0])}<b class="fi">${esc(q[0])}</b></div><div class="row" style="margin-top:6px"><input type="text" id="sq${i}" placeholder="Vastaa suomeksi…" style="flex:1;min-width:0;max-width:none">${fiKeys('sq'+i)}<button class="btn ghost sm" data-sq="${i}">Show answer</button></div><div id="sqa${i}"></div></div>`).join('')}</div>
  <h3>Retell it (speaking)</h3><div class="note"><span class="lbl">Say the story with only these hints</span><ol class="retell">${s.lines.map(l=>`<li><span class="fi">${esc(l[0].split(' ').slice(0,2).join(' '))}</span> …</li>`).join('')}</ol></div>
  <h3>Write</h3><div class="card"><p style="margin:0 0 8px"><b>${esc(s.write)}</b></p><textarea id="stW" placeholder="Kirjoita tähän…">${esc(sget(wkey,''))}</textarea>${fiKeys('stW')}<div class="mut" id="stWc" style="font-size:.85rem"></div></div>`;
  wireLines($('#stLines'));
  $('#stRead').onclick=()=>{markStory(s.id,'read');$('#stRead').textContent='✓ Done';countActivity()};
  $$('[data-play]',$('#storyView')).forEach(b=>b.addEventListener('click',()=>markStory(s.id,'listen')));
  $('#stQ').addEventListener('click',e=>{const b=e.target.closest('[data-sq]');if(!b)return;const i=+b.dataset.sq,q=s.q[i],v=$('#sq'+i).value;const r=v?checkAns(v,[q[1]]):null;
    $('#sqa'+i).innerHTML=`<div class="note ${r&&r.ok?'ok':''}" style="margin-top:8px">${r?`<span class="lbl">${r.ok?'Oikein!':'Compare'}</span>`:''}<div class="row" style="gap:6px">${spk(q[1])}<span class="fi">${esc(q[1])}</span></div>${r&&!r.ok?`<div class="mut" style="font-size:.85rem">Your answer can be right in other words too. Check the ending and the verb.</div>`:''}</div>`;markStory(s.id,'q');countActivity()});
  const wc=()=>{const n=($('#stW').value.trim().match(/\S+/g)||[]).length;$('#stWc').textContent=n+' words';sset(wkey,$('#stW').value);if(n>=20)markStory(s.id,'write')};$('#stW').addEventListener('input',wc);wc();
}
RENDER.stories=()=>{
  $('#p-stories').innerHTML=`<p class="eyebrow">Tarinat · Stories</p><h2>15 stories in simple Finnish</h2>
  <p class="lede">Each story uses words from this course and grows with you: A1.1 present tense, A1.2 partitive and past, A1.3 everything. Do all five steps: listen, read aloud, shadow, dictation, questions and writing. Green 🗣 lines show how the same sentence sounds in speech.</p>
  <div class="places" id="storyTiles">${STORIES.map((s,i)=>`<button class="ptile" data-st="${s.id}" aria-pressed="false"><span class="row" style="justify-content:space-between"><span class="pe">${s.e}</span>${tag(s.lvl,s.lvl==='A1.1'?'in':s.lvl==='A1.2'?'out':'par')}</span><span class="pf">${i+1}. ${esc(s.fi)}</span><span class="pn">${esc(s.en)}</span><span class="pn sdone mono">${storyBadges(s.id)}</span></button>`).join('')}</div>
  <div id="storyView"></div>`;
  $('#storyTiles').addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(b){openStory(b.dataset.st);$('#storyView').scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})}});
  openStory(curStory);
};

// ================= PLACES =================
let curPlace=sget('place','grocery');
function openPlace(id){stopPlayer();const p=PLACES.find(x=>x.id===id)||PLACES[0];curPlace=p.id;sset('place',p.id);
  $$('#placeTiles [data-pl]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pl===p.id)));
  const extra=PLACE_SPOKEN[p.id];
  $('#placeView').innerHTML=`<div class="row" style="gap:14px;align-items:flex-start"><div style="font-size:3rem;line-height:1">${p.e}</div><div style="min-width:0"><h3 style="margin:0">${p.fi}</h3><div><span class="t-en">${p.en}</span> · <span class="ne t-ne">${p.ne}</span></div>
   <div class="mut" style="font-size:.9rem;margin-top:4px">${Object.entries(p.roles).map(([k,r])=>`<b>${r[0]}</b> = <span class="t-en">${r[1]}</span> <span class="ne t-ne">${r[2]}</span>`).join(' · ')} · ${p.lines.length} lines</div></div></div>
   ${playBar('dlg',true)}
   <div class="dlg" id="dlg">${p.lines.map((l,i)=>lnHTML(l[1],l[2],l[3],l[4],p.roles[l[0]][0],l[0],i+1)).join('')}</div>
   ${extra?`<h3>How you will hear it (puhekieli)</h3><div class="stack" style="gap:8px">${extra.map(x=>`<div class="pair2"><div class="li">${spk(x[0])}<div class="lt"><div class="lfi">${esc(x[0])}</div></div></div><div class="sp-side"><div class="row" style="gap:6px;flex-wrap:nowrap">${spk(x[1])}<b class="sp-c">${esc(x[1])}</b></div></div></div>`).join('')}</div>`:''}
   <h3>Key words here</h3><div class="grid tight">${p.words.map(w=>`<div class="card" style="padding:10px 12px">${lineHTML(w[0],w[1],w[2])}</div>`).join('')}</div>
   <div class="note ok" style="margin-top:14px"><span class="lbl">Good to know</span>${esc(p.tip)}</div>`;
  wireLines($('#dlg'));
}
RENDER.places=()=>{
  $('#p-places').innerHTML=`<p class="eyebrow">Paikat · Places</p><h2>Conversations in ${PLACES.length} places</h2>
  <p class="lede">What really gets said in each place. Three ways to practise: <b>▶ Listen</b>, <b>🔁 Shadow</b> (repeat each line right after the voice) and <b>🎭 Play my role</b> (the app speaks the other person and waits for you to say your blue lines). Turn on "hide the Finnish" to test yourself.</p>
  <div class="places" id="placeTiles">${PLACES.map(p=>`<button class="ptile" data-pl="${p.id}" aria-pressed="false"><span class="pe">${p.e}</span><span class="pf">${p.fi}</span><span class="pn">${p.en}</span>${p.lines.some(l=>l[4])?'<span class="pn sp-c">🗣 with spoken</span>':''}</button>`).join('')}</div>
  <div id="placeView"></div>`;
  $('#placeTiles').addEventListener('click',e=>{const b=e.target.closest('[data-pl]');if(b){openPlace(b.dataset.pl);$('#placeView').scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})}});
  openPlace(curPlace);
};
