// ================= CORE =================
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function sget(k,d){try{const v=localStorage.getItem('ss2:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}}
function sset(k,v){try{localStorage.setItem('ss2:'+k,JSON.stringify(v))}catch(e){}}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuffle(a).slice(0,n);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

const reduceMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const ICON='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const spk=t=>`<button type="button" class="say" data-say="${esc(t)}" aria-label="Listen: ${esc(t)}">${ICON}</button>`;
const tag=(txt,k)=>`<span class="tag k-${k||'fi'}">${txt}</span>`;
// one line of Finnish with its translations
function lineHTML(fi,en,ne,sp,extra){
  return `<div class="li">${spk(fi)}<div class="lt"><div class="lfi">${esc(fi)}</div>${sp&&sp!==fi?`<div class="lsp t-sp">🗣 ${esc(sp)}</div>`:''}${en?`<div class="len t-en">${esc(en)}</div>`:''}${ne?`<div class="lne t-ne">${esc(ne)}</div>`:''}${extra||''}</div></div>`;
}

// ---------- speech ----------
const TTS={ok:typeof window!=='undefined'&&'speechSynthesis' in window,voice:null,count:0};
function pickVoice(){try{const vs=speechSynthesis.getVoices();TTS.count=vs.length;TTS.voice=vs.find(v=>/^fi([-_]|$)/i.test(v.lang))||null;voiceNote()}catch(e){}}
function voiceNote(){$$('.voice-note').forEach(n=>{
  if(!TTS.ok){n.hidden=false;n.innerHTML='<span class="lbl">Sound</span>This browser cannot play speech, so the speaker buttons stay silent. Try Chrome, Edge or Safari.';return}
  n.hidden=!(TTS.count&&!TTS.voice);
  n.innerHTML='<span class="lbl">Sound</span>No Finnish voice was found on this device, so words may sound English. Add a Finnish voice in your device\'s speech settings (on Mac and iPhone it is called <b>Satu</b>), then reload.';})}
if(TTS.ok){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice)}catch(e){}}
function say(text,onend,rate){
  if(!TTS.ok){onend&&setTimeout(onend,300);return}
  try{const u=new SpeechSynthesisUtterance(String(text).replace(/[–—…]/g,', ').replace(/["“”]/g,'').replace(/(\d+)\.(\d\d)/g,'$1 $2'));
    u.lang='fi-FI';if(TTS.voice)u.voice=TTS.voice;u.rate=rate||($('#optSlow')&&$('#optSlow').checked?0.62:0.9);
    if(onend){let done=false;const f=()=>{if(!done){done=true;onend()}};u.onend=f;u.onerror=f}
    speechSynthesis.speak(u)}catch(e){onend&&onend()}
}
function hush(){try{speechSynthesis.cancel()}catch(e){}}
function sayNow(t){hush();say(t)}

// ---------- progress ----------
let BOX=sget('box',{});
const box=id=>BOX[id]||0;
function setBox(id,v){BOX[id]=v;sset('box',BOX)}
function todayKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function markDay(){const days=sget('days',[]);const k=todayKey();if(!days.includes(k)){days.push(k);sset('days',days.slice(-400))}updateStreak()}
function streakCount(){const days=new Set(sget('days',[]));let d=new Date(),n=0;if(!days.has(todayKey(d)))d.setDate(d.getDate()-1);while(days.has(todayKey(d))){n++;d.setDate(d.getDate()-1)}return n}
function updateStreak(){const n=streakCount();const el=$('#streak');if(el)el.textContent='🔥 '+n+(n===1?' day':' days')}
function countActivity(){const k='act:'+todayKey();const n=sget(k,0)+1;sset(k,n);if(n>=15)markDay()}

// ---------- answer checking ----------
function norm(s){return String(s||'').toLowerCase().replace(/[’`´]/g,"'").replace(/[.,!?;:"“”()]/g,' ').replace(/\s+/g,' ').trim().replace(/^kello /,'')}
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
function checkAns(input,answers){
  const n=norm(input);const list=answers.map(a=>[a,norm(a)]);
  for(const [a,na] of list)if(n===na)return {ok:true,best:a,d:0};
  let best=list[0],bd=1e9;for(const x of list){const d=lev(n,x[1]);if(d<bd){bd=d;best=x}}
  return {ok:false,best:best[0],d:bd,close:bd<=1&&best[1].length>3};
}
// highlight where the correct answer differs from what was typed
function diffHTML(input,target){
  const a=norm(input),t=String(target);const tn=t.toLowerCase();
  const m=a.length,n=tn.length;const D=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=0;i<=m;i++)D[i][0]=i;for(let j=0;j<=n;j++)D[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]===tn[j-1]?0:1));
  const mark=new Array(n).fill(false);let i=m,j=n;
  while(i>0&&j>0){if(a[i-1]===tn[j-1]&&D[i][j]===D[i-1][j-1]){i--;j--}else if(D[i][j]===D[i-1][j-1]+1){mark[j-1]=true;i--;j--}else if(D[i][j]===D[i][j-1]+1){mark[j-1]=true;j--}else i--}
  while(j>0){mark[j-1]=true;j--}
  return [...t].map((c,k)=>mark[k]&&/\S/.test(c)&&!/[.,!?]/.test(c)?`<span class="dbad">${esc(c)}</span>`:esc(c)).join('');
}
// ä ö keys under an input
const fiKeys=id=>`<span class="fikeys">${['ä','ö','Ä','Ö'].map(c=>`<button type="button" class="key" data-key="${c}" data-for="${id}">${c}</button>`).join('')}</span>`;
document.addEventListener('click',e=>{const k=e.target.closest('[data-key]');if(!k)return;e.preventDefault();const inp=document.getElementById(k.dataset.for);if(!inp)return;
  const s=inp.selectionStart??inp.value.length,en=inp.selectionEnd??s;inp.value=inp.value.slice(0,s)+k.dataset.key+inp.value.slice(en);inp.focus();try{inp.setSelectionRange(s+1,s+1)}catch(_){}inp.dispatchEvent(new Event('input',{bubbles:true}))});

// ---------- tabs ----------
const TABS=[
['today','Tänään','Today','☀️'],['plan','30 päivää','30-day plan','🗓️'],['grammar','Kielioppi','Grammar lessons','📘'],['cards','Kortit','Flashcards','🃏'],['vocab','Sanasto','Vocabulary','📚'],['numbers','Numerot','Numbers & time','🔢'],
['verbs','Verbit','Verbs','🏃'],['cases','Sijamuodot','Cases & endings','🧱'],['questions','Kysymykset','Questions lab','❓'],['puhe','Puhekieli','Spoken Finnish','🗣️'],
['stories','Tarinat','Stories','📖'],['places','Paikat','Places','🏪'],['practice','Harjoitukset','Exercises','✏️'],['writing','Kirjoitus','Writing','✍️'],['exam','Koe','Exam practice','📝'],['tips','Vinkit','Method & tips','💡']
];
const RENDER={};const rendered={};
function showTab(id){
  if(!TABS.some(t=>t[0]===id))id='today';
  hush();if(typeof stopPlayer==='function')stopPlayer();if(typeof stopLines==='function')stopLines();if(typeof stopTimer==='function')stopTimer();
  $$('.panel').forEach(p=>p.hidden=p.id!=='p-'+id);
  $$('.tab').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.tab===id)));
  if(id==='today'||id==='plan'){RENDER[id]();rendered[id]=true}else if(!rendered[id]){RENDER[id]();rendered[id]=true}
  sset('tab',id);try{history.replaceState(null,'','#'+id)}catch(e){}
  const t=$('#tab-'+id);if(t)try{t.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}
  window.scrollTo(0,0);
}
function go(target,ds){
  showTab(target);
  if(target==='cards'&&ds.deck)startDeck(ds.deck);
  if(target==='places'&&ds.place)openPlace(ds.place);
  if(target==='stories'&&ds.story)openStory(ds.story);
  if(target==='practice'&&ds.ex)startSet(ds.ex,{story:ds.story});
  if(target==='writing'&&ds.w)openWriting(ds.w);
  if(target==='exam'&&(ds.set||ds.part))openExam(ds.set,ds.part);
  if(target==='grammar'&&ds.topic)openTopic(ds.topic);
  if(target==='vocab'&&(ds.cat||NOUNS[ds.anchor])){WF.cat=ds.cat||ds.anchor;renderWordGrid();return}
  if(ds.anchor&&ds.anchor!=='top'){const a=document.getElementById(ds.anchor);if(a)setTimeout(()=>a.scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'}),40)}
}
// section heading with an anchor
const H3=(id,txt,k)=>`<h3 id="${id}"${k?` class="hk k-${k}"`:''}>${txt}</h3>`;
// jump menu for long tabs
const jumpNav=list=>`<nav class="jump" aria-label="On this page">${list.map(([id,l])=>`<a href="#${id}" data-jump="${id}">${l}</a>`).join('')}</nav>`;
document.addEventListener('click',e=>{const j=e.target.closest('[data-jump]');if(!j)return;e.preventDefault();const a=document.getElementById(j.dataset.jump);if(a)a.scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})});
