// ================= FLASHCARDS =================
function hlEnd(f,i){let m=null;
  if(i===0)m=f.match(/n$/);else if(i===1)m=f.match(/t$/);else if(i===3)m=f.match(/mme$/);else if(i===4)m=f.match(/tte$/);else if(i===5)m=f.match(/v[aä]t$/);
  else if(f.length>2&&f.slice(-1)===f.slice(-2,-1)&&/[aeiouyäö]/.test(f.slice(-1)))m=[f.slice(-1)];
  if(!m)return esc(f);const k=f.length-m[0].length;return esc(f.slice(0,k))+'<span class="hl">'+esc(m[0])+'</span>'}
const PRN=['minä','sinä','hän','me','te','he'];
const isKpt=v=>!!v.k&&v.k.includes('→');
function verbMini(v){return `<div class="forms">${[0,3,1,4,2,5].map(i=>`<div><span class="mut">${PRN[i]}</span> <b class="fi">${hlEnd(v.f[i],i)}</b></div>`).join('')}</div>`+(v.k?`<div class="hint">${tag(esc(v.k),'ess')}</div>`:'')}

function nounCards(cat){return NOUNS[cat].items.map(it=>({id:'n|'+cat+'|'+it[1]+'|'+it[2],e:it[0],fi:it[1],en:it[2],ne:it[3],xf:it[4],xe:it[5],xn:it[6],sp:PUHE[it[1]]}))}
function verbCard(v){const p=PAST[v.fi];return {id:'v|'+v.fi,e:v.e,fi:v.fi,en:v.en,ne:v.ne,xf:v.x[0],xe:v.x[1],xn:v.x[2],v,note:p?'Past: minä '+p[0]+', hän '+p[1]:''}}
function qCard(q){return {id:'q|'+q[1],e:q[0],fi:q[1]+'?',en:q[2],ne:q[3],xf:q[5]+' – '+q[8],xe:q[6]+' – '+q[9],xn:q[7]+' – '+q[10]}}
function pCard(p){return {id:'p|'+p[1],e:p[0],fi:p[1],en:p[2],ne:p[3],note:p[4]}}
function caseCard(c){return {id:'c|'+c[0],e:'🧱',fi:c[0],en:c[1]+': '+c[3],ne:c[4],xf:c[5][0][0],xe:c[5][0][1],xn:c[5][0][2],note:c[2]!=='—'?'Question: '+c[2]:''}}
function sufCard(s){return {id:'s|'+s[0],e:'🧩',fi:s[0],en:s[1],ne:s[2],xf:s[3].slice(0,2).map(x=>x[0]+' → '+x[2]).join(' · '),xe:s[3].slice(0,2).map(x=>x[1]+' → '+x[3]).join(' · ')}}
function deckCards(id){
  const [t,k]=id.split(':');
  if(t==='n')return NOUNS[k]?nounCards(k):[];
  if(t==='nu')return nounCards('numbers');
  if(t==='v'){let vs=VERBS;if(k==='kpt')vs=VERBS.filter(isKpt);else if(k==='4')vs=VERBS.filter(v=>v.t>=4);else if(k!=='all')vs=VERBS.filter(v=>v.t===+k);return vs.map(verbCard)}
  if(t==='q')return QUESTIONS.map(qCard);
  if(t==='c')return CASES.map(caseCard);
  if(t==='s')return SUFFIXES.map(sufCard);
  if(t==='p')return PHRASES[k]?PHRASES[k].items.map(pCard):[];
  if(t==='pt')return THREE.map(r=>({id:'pt|'+r[0],e:'🧱',fi:r[0],en:r[4],ne:r[5],back:`<div class="forms3"><div><span class="mut">genitive</span><b>${r[1]}</b></div><div><span class="mut">partitive</span><b>${r[2]}</b></div><div><span class="mut">illative</span><b>${r[3]}</b></div></div>`,say2:r[0]+', '+r[1]+', '+r[2],ask:'Say: genitive, partitive, illative'}));
  if(t==='pp')return POSTPOS.map(p=>({id:'pp|'+p[1],e:p[0],fi:p[1],en:p[2],ne:p[3],xf:p[4],xe:p[5]}));
  if(t==='pa')return VERBS.filter(v=>PAST[v.fi]).map(v=>{const p=PAST[v.fi];return {id:'pa|'+v.fi,e:v.e,fi:v.fi,en:v.en,ne:v.ne,back:`<div class="forms3"><div><span class="mut">minä</span><b>${p[0]}</b></div><div><span class="mut">hän</span><b>${p[1]}</b></div><div><span class="mut">en …</span><b>${p[2]}</b></div></div>`,say2:'minä '+p[0]+', hän '+p[1]+', en '+p[2],ask:'Say the past: minä …, hän …, en …'}});
  if(t==='sp')return PUHE_SENT.map(s=>({id:'sp|'+s[0],e:'🗣️',fi:s[0],en:s[2],ne:s[3],sp:s[1],ask:'How do people say it?'}));
  if(t==='im')return IMPER.map(r=>({id:'im|'+r[0],e:'👉',fi:r[1],en:r[4],ne:r[5],note:'Negative: '+r[2]+' · Polite plural: '+r[3]}));
  if(t==='rk')return REKTIO.map(r=>({id:'rk|'+r[0],e:'🔗',fi:r[0]+' + '+r[1],en:r[2],ne:'',xf:r[3],xe:r[4],xn:r[5]}));
  return allCards();
}
function allCards(){if(!allCards.c)allCards.c=[...Object.keys(NOUNS).flatMap(nounCards),...VERBS.map(verbCard),...QUESTIONS.map(qCard),...Object.keys(PHRASES).flatMap(k=>PHRASES[k].items.map(pCard))];return allCards.c}
const DECK_GROUPS=[
  ['Basics',[['n:greetings','Greetings'],['n:numbers','Numbers'],['n:days','Days'],['n:months','Months'],['n:time','Time words'],['n:colours','Colours']]],
  ['World',[['n:weather','Weather'],['n:nature','Nature'],['n:places','Places'],['n:directions','Directions'],['n:transport','Transport'],['n:animals','Animals']]],
  ['People & life',[['n:people','People'],['n:jobs','Jobs'],['n:feelings','Feelings'],['n:body','Body & health'],['n:home','Home'],['n:food','Food'],['n:things','Things'],['n:clothes','Clothes']]],
  ['Describe',[['n:adjectives','Adjectives'],['n:opposites','Opposites']]],
  ['Verbs',[['v:all','All verbs'],['v:1','Type 1'],['v:2','Type 2'],['v:3','Type 3'],['v:4','Types 4–6'],['v:kpt','KPT verbs'],['pa:all','Past tense'],['im:all','Commands']]],
  ['Grammar',[['pt:all','Gen · part · ill'],['pp:all','Place words'],['rk:all','Verb + case'],['q:all','Question words'],['c:all','Endings'],['s:all','Word-building']]],
  ['Phrases & speech',[...Object.keys(PHRASES).map(k=>['p:'+k,PHRASES[k].en]),['sp:all','Spoken Finnish']]],
  ['Review',[['review','Mixed review, weakest first']]]
];
function deckLabel(id){if(id==='nu:small')return 'Numbers';for(const g of DECK_GROUPS)for(const [i,l] of g[1])if(i===id)return l;return id}
const masteredIn=id=>deckCards(id).filter(c=>box(c.id)>=3).length;
const FC={deck:sget('deck','n:greetings'),dir:sget('dir','fi'),pic:sget('pic',true),auto:sget('auto',false),q:[],done:0,total:0,flipped:false};
function startDeck(id){
  if(id==='nu:small')id='n:numbers';
  FC.deck=id;sset('deck',id);
  const cards=shuffle(deckCards(id)).sort((a,b)=>box(a.id)-box(b.id)).slice(0,id==='review'?25:30);
  FC.q=cards;FC.total=cards.length;FC.done=0;FC.flipped=false;renderDeckPick();showCard();
}
function renderDeckPick(){const el=$('#deckPick');if(!el)return;
  el.innerHTML=DECK_GROUPS.map(([g,items])=>`<div class="grp-label">${g}</div><div class="chips">${items.map(([id,l])=>`<button class="chip" data-deck="${id}" aria-pressed="${FC.deck===id}">${esc(l)} <span class="cnt">${masteredIn(id)}/${deckCards(id).length}</span></button>`).join('')}</div>`).join('')}
function showCard(){
  const st=$('#fcStage');if(!st)return;const c=FC.q[0];
  $('#fcProg i').style.width=(FC.total?FC.done/FC.total*100:0)+'%';
  $('#fcCount').textContent=`${deckLabel(FC.deck)} · ${FC.done} of ${FC.total} done`;
  if(!c){st.innerHTML=`<div class="fc"><div class="face"><div class="bigemo">🎉</div><div class="bigen">Valmis! Done.</div><p class="mut">${masteredIn(FC.deck)} of ${deckCards(FC.deck).length} cards in this deck are now known.</p><button class="btn pri" id="fcRestart">Study this deck again</button></div></div>`;
    $('#fcBtns').hidden=true;$('#fcRestart').onclick=()=>startDeck(FC.deck);markDay();return}
  $('#fcBtns').hidden=false;
  const pic=FC.pic?`<div class="bigemo">${c.e}</div>`:'';
  const fiBlock=`<div class="row" style="justify-content:center"><div class="bigfi">${esc(c.fi)}</div>${spk(c.fi)}</div>`;
  const meaning=`<div class="bigen t-en">${esc(c.en)}</div>${c.ne?`<div class="bigne t-ne">${esc(c.ne)}</div>`:''}`;
  const spoken=c.sp&&c.sp!==c.fi?`<div class="spk-chip">🗣 ${esc(c.sp)} ${spk(c.sp.split(' / ')[0])}</div>`:'';
  const ex=c.xf?`<div class="exb"><div class="row" style="justify-content:center;gap:6px"><span class="fi">${esc(c.xf)}</span>${spk(c.xf)}</div>${c.xe?`<div class="t-en mut">${esc(c.xe)}</div>`:''}${c.xn?`<div class="ne t-ne">${esc(c.xn)}</div>`:''}</div>`:'';
  const note=c.note?`<div class="hint">${esc(c.note)}</div>`:'';
  const forms=c.v?verbMini(c.v):'';const extra=c.back||'';
  const lvl=box(c.id);const lv=`<div class="hint">${lvl===0?'New or needs practice':lvl>=3?'Known · level '+lvl:'Learning · level '+lvl}</div>`;
  let front,back;
  if(c.back||c.ask){front=pic+fiBlock+`<div class="t-en mut">${esc(c.en)}</div>`+lv+`<div class="hint">${esc(c.ask||'Say it, then flip')}</div>`;back=`<div class="bigfi" style="font-size:1.35rem">${esc(c.fi)}</div>`+extra+spoken+meaning+(c.say2?`<div>${spk(c.say2)}</div>`:'')+ex+note}
  else if(FC.dir==='fi'){front=pic+fiBlock+lv+`<div class="hint">Say the meaning, then tap to check</div>`;back=`<div class="bigfi" style="font-size:1.35rem">${esc(c.fi)}</div>`+meaning+spoken+ex+forms+note}
  else{front=pic+`<div class="bigen">${esc(c.en)}</div>${c.ne?`<div class="bigne">${esc(c.ne)}</div>`:''}`+lv+`<div class="hint">Say it in Finnish, then tap to check</div>`;back=(FC.pic?`<div style="font-size:2.4rem;line-height:1">${c.e}</div>`:'')+fiBlock+spoken+ex+forms+note}
  st.innerHTML=`<div class="fc" id="fcCard" tabindex="0" role="button" aria-label="Flashcard. Press to flip."><div class="face front">${front}</div><div class="face back">${back}</div></div>`;
  FC.flipped=false;
  $('#fcCard').addEventListener('click',e=>{if(e.target.closest('button'))return;flip()});
  if(FC.auto&&FC.dir==='fi')sayNow(c.fi);
}
function flip(){const c=$('#fcCard');if(!c)return;FC.flipped=!FC.flipped;c.classList.toggle('flip',FC.flipped);
  if(FC.flipped&&FC.auto&&FC.q[0])sayNow(FC.q[0].say2||FC.q[0].fi)}
function answer(ok){const c=FC.q.shift();if(!c)return;
  if(ok){setBox(c.id,Math.min(5,box(c.id)+1));FC.done++}else{setBox(c.id,0);FC.q.splice(Math.min(3,FC.q.length),0,c)}
  countActivity();renderDeckPick();showCard()}
RENDER.cards=()=>{
  $('#p-cards').innerHTML=`<p class="eyebrow">Kortit · Flashcards</p><h2>Flip, say it out loud, be honest</h2>
  <p class="lede">Pick a deck. Say the answer <b>out loud</b> before you flip. Press <b>Got it</b> only if you knew it without thinking; missed cards come back a few cards later. Your progress is saved in this browser.</p>
  <div id="deckPick"></div>
  <div class="row" style="margin:8px 0 18px"><div class="chips" style="margin:0" id="dirChips"><button class="chip" data-dir="fi">Finnish → meaning</button><button class="chip" data-dir="en">Meaning → Finnish</button></div>
  <label class="tog"><input type="checkbox" id="optPic"> Picture hint</label><label class="tog"><input type="checkbox" id="optAuto"> Play sound automatically</label></div>
  <div class="fc-wrap"><div class="progress" id="fcProg"><i></i></div><div class="mut mono" style="text-align:center;font-size:.78rem" id="fcCount"></div>
  <div class="fc-stage" id="fcStage"></div>
  <div class="fc-ctrl" id="fcBtns"><button class="btn again" id="fcAgain">Again <span class="kbd">←</span></button><button class="btn ghost" id="fcFlip">Flip <span class="kbd">Space</span></button><button class="btn ok" id="fcOk">Got it <span class="kbd">→</span></button></div></div>
  <div class="note" style="margin-top:24px"><span class="lbl">How to think</span>Don't translate letter by letter. See the picture, say the Finnish word, and put it in one tiny sentence: <span class="fi">koira</span> → <span class="fi">Minulla on koira.</span> <span class="t-en">(I have a dog.)</span> <span class="ne t-ne">(मसँग कुकुर छ।)</span></div>`;
  $('#deckPick').addEventListener('click',e=>{const b=e.target.closest('[data-deck]');if(b)startDeck(b.dataset.deck)});
  const setDir=()=>$$('#dirChips [data-dir]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dir===FC.dir)));
  $('#dirChips').addEventListener('click',e=>{const b=e.target.closest('[data-dir]');if(!b)return;FC.dir=b.dataset.dir;sset('dir',FC.dir);setDir();showCard()});
  setDir();
  const op=$('#optPic');op.checked=FC.pic;op.addEventListener('change',()=>{FC.pic=op.checked;sset('pic',FC.pic);showCard()});
  const oa=$('#optAuto');oa.checked=FC.auto;oa.addEventListener('change',()=>{FC.auto=oa.checked;sset('auto',FC.auto)});
  $('#fcAgain').onclick=()=>answer(false);$('#fcOk').onclick=()=>answer(true);$('#fcFlip').onclick=flip;
  startDeck(FC.deck);
};
document.addEventListener('keydown',e=>{
  const p=$('#p-cards');if(!p||p.hidden)return;if(e.target.closest('input,textarea,select'))return;
  if(e.key===' '||e.key==='Enter'){if(e.target.closest('button')&&e.target.id!=='fcCard')return;e.preventDefault();flip()}
  else if(e.key==='ArrowRight'){e.preventDefault();answer(true)}
  else if(e.key==='ArrowLeft'){e.preventDefault();answer(false)}
});
