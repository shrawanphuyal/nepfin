// ================= EXAM TAB =================
const EXAM_DAY='2026-11-25';
function daysTo(iso){const t=new Date(iso+'T00:00:00');const n=new Date();n.setHours(0,0,0,0);return Math.round((t-n)/864e5)}
// exam track: calendar day → plan days and exam sets
const EXAM_TRACK=[
['2026-11-02',[1,2]],['2026-11-03',[3]],['2026-11-04',[4]],['2026-11-05',[5,6]],['2026-11-06',[7]],['2026-11-07',[8]],['2026-11-08',[9,10]],
['2026-11-09',[11]],['2026-11-10',[12]],['2026-11-11',[13]],['2026-11-12',[14]],['2026-11-13',[15]],['2026-11-14',[16,17]],['2026-11-15',[18,19]],
['2026-11-16',[20,21]],['2026-11-17',[22,23]],['2026-11-18',[24]],['2026-11-19',[25]],['2026-11-20',[26,27]],['2026-11-21',[28,29]],
['2026-11-22',[30],['e1']],['2026-11-23',[],['e2','e3']],['2026-11-24',[],['e4','e5']],['2026-11-25',[],[],'exam'],['2026-11-26',[],[],'exam']];
const DAY_GRAMMAR={1:'sounds',2:'olla',4:'vtypes',5:'order',7:'local',8:'time',9:'vtypes',11:'partitive',12:'partitive',13:'have',14:'genitive',15:'kpt',16:'adj',17:'plural',18:'time',19:'puhe',21:'chains',22:'imper',23:'object',24:'past',25:'past',26:'likes',27:'illative',28:'poss',29:'work'};
function trackToday(){const k=todayKey();return EXAM_TRACK.find(t=>t[0]===k)||null}
const fmtDate=iso=>new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
function examBanner(){
  const left=daysTo(EXAM_DAY);if(left<-1)return '';const t=trackToday();
  if(left<=0)return `<div class="examban"><div class="eb-big">${left===0?'📝 Exam day 1 today':'📝 Exam day 2 today'}</div><div>Do only a 20-minute warm-up: say your introduction aloud, read one story, and go. Onnea kokeeseen! <span class="ne t-ne">परीक्षाको शुभकामना!</span></div></div>`;
  let todo='';
  if(t){const parts=[];if(t[1].length)parts.push(t[1].map(d=>`<button class="btn sm pri" data-tday="${d}">Plan day ${d}</button>`).join(''));if(t[2]&&t[2].length)parts.push(t[2].map(s=>`<button class="btn sm ok" data-go="exam" data-set="${s}">Exam set ${s.slice(1)}</button>`).join(''));
    todo=`<div class="row" style="margin-top:8px">${parts.join('')}</div><div class="mut" style="font-size:.88rem;margin-top:6px">${t[1].length>1?'Two plan days today: about 3–4 hours. Do the grammar and exercises of both; the story and dialogue of one is enough.':t[2]&&t[2].length?'Mock exam day: do every part under time, then check your weak points.':'One plan day: about 2 hours.'}</div>`}
  return `<div class="examban"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><div class="eyebrow" style="margin:0">Exam track · ${t?fmtDate(t[0]):'today'}</div><div class="eb-big">${left} day${left===1?'':'s'} to your exam (25–26 Nov)</div></div><button class="btn sm ghost" data-go="plan" data-anchor="track">See the whole track</button></div>${todo}</div>`;
}
function trackTable(){
  return `<div class="tbl"><table><thead><tr><th>Date</th><th>Do these</th><th>Topics</th></tr></thead><tbody>${EXAM_TRACK.map(([d,days,sets,ex])=>{const isT=d===todayKey();
    const what=ex?'<b>📝 Exam</b>':[...days.map(n=>`<button class="linkbtn" data-tday="${n}">Day ${n}</button>`),...(sets||[]).map(s=>`<button class="linkbtn" data-go="exam" data-set="${s}">Exam set ${s.slice(1)}</button>`)].join(' + ');
    const topics=ex?'Warm-up only':days.map(n=>esc(PLAN30[n-1][1])).join(' · ')+((sets&&sets.length)?(days.length?' · ':'')+'Mock exam: reading, listening, writing, speaking':'');
    return `<tr class="${isT?'trtoday':''}"><td class="mono" style="white-space:nowrap">${fmtDate(d)}${isT?' ◀':''}</td><td style="white-space:nowrap">${what}</td><td>${topics}</td></tr>`}).join('')}</tbody></table></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tday]');if(!b)return;e.preventDefault();sset('curDay',+b.dataset.tday);showTab('today')});

// ---------- speech with different voices for speakers ----------
let LP={on:false};
function stopLines(){LP.on=false;hush();$$('.exline.speaking').forEach(x=>x.classList.remove('speaking'))}
function playLines(lines,box,done){
  stopLines();if(!TTS.ok){done&&done();return}LP={on:true};let i=0;
  const step=()=>{if(!LP.on)return;if(i>=lines.length){LP.on=false;done&&done();return}
    const [who,fi]=lines[i];const el=box&&box.querySelectorAll('.exline')[i];$$('.exline.speaking').forEach(x=>x.classList.remove('speaking'));if(el)el.classList.add('speaking');
    try{const u=new SpeechSynthesisUtterance(fi);u.lang='fi-FI';if(TTS.voice)u.voice=TTS.voice;u.rate=$('#optSlow')&&$('#optSlow').checked?0.65:0.88;u.pitch=who==='A'?1.25:who==='B'?0.8:1;
      let f=false;const nx=()=>{if(f)return;f=true;i++;setTimeout(step,550)};u.onend=nx;u.onerror=nx;speechSynthesis.speak(u)}catch(e){i++;step()}};
  step();
}

// ---------- Claude writing feedback (optional capability) ----------
let SAMPLE=null;
(async()=>{try{const c=window.claude;if(c&&c.use){SAMPLE=await c.use('sample');if(SAMPLE)$$('.claude-fb').forEach(b=>b.hidden=false)}}catch(e){}})();
function fbFormat(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^#+\s*(.+)$/gm,'<b>$1</b>').replace(/\n/g,'<br>')}
async function claudeFeedback(task,text,out,btn){
  if(!SAMPLE||!text.trim())return;btn.disabled=true;out.hidden=false;out.innerHTML='<span class="mut">Claude is reading your text…</span>';
  const prompt=`You are a kind, precise Finnish teacher. The student's first language is Nepali and they read English. Level: A1 beginner, preparing for an A1.3 exam.
Task: ${task}
Student's text:
"""${text.slice(0,2500)}"""
Reply in English, short and clear, in this order:
1. **Corrected text**: the whole text corrected, keeping their meaning and simple A1 Finnish.
2. **Mistakes**: up to 6 lines, each "wrong → right: short reason" (name the rule, e.g. partitive after numbers, verb ending, -ssa/-sta, KPT).
3. **Score**: task completion /3 and language /3.
4. **Tip**: one practical tip in Nepali (one sentence).
Maximum 230 words. If the text is not Finnish, say so kindly.`;
  try{const r=await SAMPLE(prompt,{onText:({text:t})=>{out.innerHTML=fbFormat(t)}});out.innerHTML=fbFormat(r.text);countActivity()}
  catch(e){out.innerHTML=`<span class="mut">${e&&e.code==='rate_limited'?'Too many requests. Wait a minute and try again.':e&&e.code==='not_granted'?'Claude feedback was not allowed for this page.':'Claude feedback is not available right now. Compare with the model answer instead.'}</span>`}
  finally{btn.disabled=false}
}
const fbButton=id=>`<button class="btn sm ghost claude-fb" data-fb="${id}" ${SAMPLE?'':'hidden'}>✨ Check my text with Claude</button>`;

// ---------- exam UI ----------
const EXP={set:sget('exset','e1'),part:sget('expart','read')};
const PARTS=[['read','📖','Lukeminen','Reading','पढाइ'],['listen','🎧','Kuunteleminen','Listening','सुनाइ'],['write','✍️','Kirjoittaminen','Writing','लेखाइ'],['speak','🗣️','Puhuminen','Speaking','बोलाइ']];
const exKey=(s,p)=>'exr:'+s+':'+p;
function exSummary(id){const E=EXAMS.find(x=>x.id===id);const r=sget(exKey(id,'read'),null),l=sget(exKey(id,'listen'),null);
  const w=E.write.filter((_,i)=>(sget('exw:'+id+':'+i,'').trim().match(/\S+/g)||[]).length>=15).length;
  const s=E.speak.reduce((a,t,ti)=>a+t.items.filter((_,ii)=>sget('exs:'+id+':'+ti+':'+ii,0)).length,0);const sn=E.speak.reduce((a,t)=>a+t.items.length,0);
  return {r,l,w,wn:E.write.length,s,sn}}
function qBlock(q,gi,qi){return `<div class="eq" data-g="${gi}" data-q="${qi}"><div class="eqq"><b class="mono">${qi+1}.</b> <span class="fi">${esc(q[0])}</span> ${spk(q[0])}<div class="t-en mut" style="font-size:.9rem">${esc(q[1])}</div><div class="ne t-ne" style="font-size:.9rem">${esc(q[2])}</div></div><div class="eopts">${q[3].map((o,oi)=>`<button class="eopt" data-o="${oi}">${'ABC'[oi]}) ${esc(o)}</button>`).join('')}</div></div>`}
function renderRL(E,part){
  const groups=E[part];let qn=0;const isL=part==='listen';
  const html=groups.map((g,gi)=>{const qs=g.q.map(q=>qBlock(q,gi,qn++)).join('');
    const body=isL?`<div class="row" style="gap:8px"><button class="btn pri sm" data-play="${gi}">▶ Play</button><span class="mut mono" style="font-size:.8rem" data-pc="${gi}">played 0×</span><button class="btn ghost sm" data-tr="${gi}">Show transcript</button></div>
      <div class="extext" data-trbox="${gi}" hidden>${g.l.map(l=>`<div class="exline"><span class="mono mut">${l[0]==='N'?'🎙':l[0]}</span> <div><span class="fi">${esc(l[1])}</span><div class="t-en mut" style="font-size:.88rem">${esc(l[2])}</div><div class="ne t-ne" style="font-size:.88rem">${esc(l[3])}</div></div></div>`).join('')}</div>`
      :`<div class="extext">${g.t.map(l=>`<div class="exline"><span class="fi" style="font-weight:500">${esc(l[0])}</span><div class="extr" hidden><div class="t-en mut" style="font-size:.88rem">${esc(l[1])}</div><div class="ne t-ne" style="font-size:.88rem">${esc(l[2])}</div></div></div>`).join('')}</div><div class="row" style="margin-top:8px"><button class="btn ghost sm" data-rtr="${gi}">Show translation</button><button class="btn ghost sm" data-rsay="${gi}">🔈 Read aloud</button></div>`;
    return `<div class="card exgroup" data-gg="${gi}"><div class="row" style="gap:8px"><span style="font-size:1.6rem">${g.k}</span><div><b>${esc(g.h[0])}</b> <span class="mut t-en">· ${esc(g.h[1])}</span> <span class="ne t-ne">· ${esc(g.h[2])}</span></div></div>${body}<div class="stack" style="gap:10px;margin-top:12px">${qs}</div></div>`}).join('');
  const prev=sget(exKey(E.id,part),null);
  $('#exView').innerHTML=`<p class="lede" style="margin:4px 0 12px">${isL?'Read the questions first. Press Play and listen. You may play each clip twice (like the real exam). Answer, then press <b>Check answers</b> at the bottom.':'Read the questions first, then the text. Answer every question, then press <b>Check answers</b> at the bottom. Translations are hidden until you need them.'}</p>
   <div class="stack">${html}</div><div class="row" style="margin-top:14px"><button class="btn ok" id="exCheck">Check answers</button><button class="btn ghost" id="exReset">Start again</button><span class="mut" id="exRes">${prev?`Best so far: ${prev.s} / ${prev.n}`:''}</span></div>`;
  const V=$('#exView');const plays={};
  V.addEventListener('click',e=>{
    const o=e.target.closest('.eopt');if(o&&!V.classList.contains('checked')){const box=o.closest('.eopts');$$('.eopt',box).forEach(b=>b.classList.toggle('sel',b===o));return}
    const p=e.target.closest('[data-play]');if(p){const gi=+p.dataset.play;if(LP.on){stopLines();p.textContent='▶ Play';return}plays[gi]=(plays[gi]||0)+1;V.querySelector(`[data-pc="${gi}"]`).textContent='played '+plays[gi]+'×'+(plays[gi]>2?' (exam: max 2)':'');
      $$('[data-play]',V).forEach(b=>b.textContent='▶ Play');p.textContent='■ Stop';playLines(groups[gi].l,V.querySelector(`[data-trbox="${gi}"]`),()=>{p.textContent='▶ Play again'});return}
    const t=e.target.closest('[data-tr]');if(t){const b=V.querySelector(`[data-trbox="${t.dataset.tr}"]`);b.hidden=!b.hidden;t.textContent=b.hidden?'Show transcript':'Hide transcript';return}
    const rt=e.target.closest('[data-rtr]');if(rt){const g=rt.closest('.exgroup');const hid=g.querySelector('.extr').hidden;$$('.extr',g).forEach(x=>x.hidden=!hid);rt.textContent=hid?'Hide translation':'Show translation';return}
    const rs=e.target.closest('[data-rsay]');if(rs){const g=groups[+rs.dataset.rsay];playLines(g.t.map(l=>['N',l[0]]),rs.closest('.exgroup'),null);return}
  });
  $('#exCheck').onclick=()=>{stopLines();let s=0,n=0;$$('.eq',V).forEach(q=>{const g=groups[+q.dataset.g];const qi=+q.dataset.q;let k=0;const flat=[];groups.forEach(gg=>gg.q.forEach(x=>flat.push(x)));const Q=flat[qi];n++;
      const sel=q.querySelector('.eopt.sel');$$('.eopt',q).forEach((b,oi)=>{b.classList.toggle('right',oi===Q[4]);b.classList.toggle('wrong',b===sel&&oi!==Q[4])});if(sel&&+sel.dataset.o===Q[4])s++});
    V.classList.add('checked');const best=sget(exKey(E.id,part),null);if(!best||s>best.s)sset(exKey(E.id,part),{s,n});
    $('#exRes').innerHTML=`<b>${s} / ${n}</b> ${s/n>=.8?'· Erinomaista! 🎉':s/n>=.6?'· Hyvä! You would pass.':'· Read the transcript / translation and try again.'}`;
    if(isL)$$('[data-trbox]',V).forEach(b=>b.hidden=false);else $$('.extr',V).forEach(x=>x.hidden=false);countActivity();markDay();renderExTiles()};
  $('#exReset').onclick=()=>renderExPart();
}
function renderWrite(E){
  $('#exView').innerHTML=`<p class="lede" style="margin:4px 0 12px">Write every task by hand-typing it, without looking at the model. Then tick the checklist, compare with the model answer${SAMPLE?' or ask Claude for corrections':''}. Your text is saved in this browser.</p>
  <div class="stack">${E.write.map((w,i)=>{const key='exw:'+E.id+':'+i;const id='exw'+i;
   const field=w.k==='form'?`<div class="formgrid">${w.fields.map((f,fi)=>`<label class="grp-label" for="${id}f${fi}">${esc(f)}</label><input id="${id}f${fi}" type="text" data-wform="${i}" data-fi="${fi}" value="${esc(sget(key+':'+fi,''))}">`).join('')}</div>`
     :`<div class="grp-label">Sentence starters (tap to add)</div><div class="chips" data-frames="${i}">${w.frames.map(f=>`<button class="chip" data-frame="${esc(f)}">${esc(f)}</button>`).join('')}</div><textarea id="${id}" rows="8" data-wtext="${i}" placeholder="Kirjoita tähän suomeksi…">${esc(sget(key,''))}</textarea>${fiKeys(id)}
       <div class="row" style="justify-content:space-between;margin-top:6px"><span class="mut mono" style="font-size:.85rem" data-wc="${i}"></span><span class="row" style="gap:6px"><button class="btn ghost sm" data-wsay="${i}">🔈 Read my text</button>${fbButton(i)}</span></div><div class="fbout" data-fbout="${i}" hidden></div>`;
   return `<div class="card"><div class="row" style="gap:8px"><span class="tag k-${w.k==='text'?'par':w.k==='form'?'nom':'out'}">Task ${i+1}</span><b>${esc(w.h[0])}</b><span class="mut t-en">· ${esc(w.h[1])}</span>${w.words?`<span class="mono mut" style="font-size:.8rem">${w.words} words</span>`:''}</div>
    <p style="margin:8px 0 2px" class="fi">${esc(w.task[0])}</p><div class="t-en" style="font-size:.92rem">${esc(w.task[1])}</div><div class="ne t-ne" style="font-size:.92rem">${esc(w.task[2])}</div>
    <div style="margin-top:10px">${field}</div>
    <details style="margin-top:10px"><summary>Checklist before you finish</summary><div class="db">${['Every point of the task is answered.','Every sentence has a verb with the right ending.','Partitive after numbers, "not" and amounts (kaksi kahvia, ei ole autoa).','Places: -ssa / -sta / -Vn or -lla / -lta / -lle.','Greeting at the start, name at the end (in messages).'].map((c,ci)=>`<label class="cando"><input type="checkbox" data-wck="${i}-${ci}" ${sget('exwc:'+E.id+':'+i+':'+ci,false)?'checked':''}> ${esc(c)}</label>`).join('')}</div></details>
    <details style="margin-top:8px"><summary>Show the model answer</summary><div class="db">${lineHTML(w.model[0],w.model[1])}</div></details></div>`}).join('')}</div>`;
  const V=$('#exView');
  const wc=ta=>{const i=ta.dataset.wtext;const n=(ta.value.trim().match(/\S+/g)||[]).length;V.querySelector(`[data-wc="${i}"]`).textContent=n+' words';sset('exw:'+E.id+':'+i,ta.value)};
  $$('[data-wtext]',V).forEach(ta=>{wc(ta);ta.addEventListener('input',()=>{wc(ta);renderExTiles()})});
  $$('[data-wform]',V).forEach(inp=>inp.addEventListener('input',()=>{const i=inp.dataset.wform;sset('exw:'+E.id+':'+i+':'+inp.dataset.fi,inp.value);const all=E.write[i].fields.map((_,fi)=>sget('exw:'+E.id+':'+i+':'+fi,'')).join(' ');sset('exw:'+E.id+':'+i,all);renderExTiles()}));
  V.addEventListener('click',e=>{const f=e.target.closest('[data-frame]');if(f){const i=f.closest('[data-frames]').dataset.frames;const ta=V.querySelector(`[data-wtext="${i}"]`);ta.value=(ta.value&&!/\s$/.test(ta.value)?ta.value+' ':ta.value)+f.dataset.frame.replace(/…/g,'')+' ';ta.focus();wc(ta);return}
    const s=e.target.closest('[data-wsay]');if(s){const ta=V.querySelector(`[data-wtext="${s.dataset.wsay}"]`);if(ta.value.trim())sayNow(ta.value);return}
    const fb=e.target.closest('[data-fb]');if(fb){const i=+fb.dataset.fb;const w=E.write[i];claudeFeedback(w.task[1]+' ('+(w.words||'')+' words)',V.querySelector(`[data-wtext="${i}"]`).value,V.querySelector(`[data-fbout="${i}"]`),fb)}});
  V.addEventListener('change',e=>{const c=e.target.closest('[data-wck]');if(c){const [i,ci]=c.dataset.wck.split('-');sset('exwc:'+E.id+':'+i+':'+ci,c.checked)}});
}
let TMR=null;
function stopTimer(){if(TMR){clearInterval(TMR.iv);if(TMR.el)TMR.el.innerHTML='';TMR=null}}
function runTimer(el,prep,time){stopTimer();let phase=prep>0?'prep':'speak',left=phase==='prep'?prep:time,total=left;
  const draw=()=>{el.innerHTML=`<div class="tmr ${phase}"><div class="row" style="justify-content:space-between"><b>${phase==='prep'?'⏳ Think':'🗣️ Speak now!'}</b><span class="mono">${left}s</span></div><div class="tbar"><i style="width:${(1-left/total)*100}%"></i></div></div>`};
  TMR={el,iv:setInterval(()=>{left--;if(left<0){if(phase==='prep'){phase='speak';left=total=time;try{navigator.vibrate&&navigator.vibrate(150)}catch(e){}}else{stopTimer();el.innerHTML='<div class="tmr done"><b>⏰ Time! Now check the model answer and rate yourself.</b></div>';return}}draw()},1000)};draw()}
function renderSpeak(E){
  $('#exView').innerHTML=`<p class="lede" style="margin:4px 0 12px">Press <b>Start</b>: first you get thinking time, then speaking time. Speak <b>out loud</b> in full sentences until the time ends. Then open the model answer, listen to it, and rate yourself honestly.</p>
  <div class="stack">${E.speak.map((t,ti)=>`<div class="card"><div class="row" style="gap:8px"><span class="tag k-${t.k==='qa'?'gen':t.k==='situ'?'out':t.k==='pic'?'ess':'par'}">Task ${ti+1}</span><b>${esc(t.h[0])}</b><span class="mut t-en">· ${esc(t.h[1])}</span><span class="ne t-ne">· ${esc(t.h[2])}</span><span class="mono mut" style="font-size:.8rem">${t.prep}s think · ${t.time}s speak</span></div>
   ${t.pic?`<div class="expic" aria-hidden="true">${esc(t.pic)}</div>`:''}
   <div class="stack" style="gap:10px;margin-top:10px">${t.items.map((it,ii)=>{const r=sget('exs:'+E.id+':'+ti+':'+ii,0);return `<div class="spitem"><div class="row" style="gap:8px;flex-wrap:nowrap">${spk(it[0])}<div style="min-width:0"><div class="fi">${esc(it[0])}</div><div class="t-en mut" style="font-size:.9rem">${esc(it[1])}</div><div class="ne t-ne" style="font-size:.9rem">${esc(it[2])}</div></div></div>
     <div class="row" style="margin-top:8px"><button class="btn sm pri" data-start="${ti}-${ii}">▶ Start</button><button class="btn sm ghost" data-stop>Stop</button></div><div data-tmr="${ti}-${ii}"></div>
     <details style="margin-top:6px"><summary>Model answer</summary><div class="db">${lineHTML(it[3],it[4])}</div></details>
     <div class="row rate" style="margin-top:6px;gap:6px"><span class="mut" style="font-size:.85rem">How did it go?</span>${[['1','😟 Hard'],['2','🙂 OK'],['3','😎 Easy']].map(([v,l])=>`<button class="chip" data-rate="${ti}-${ii}-${v}" aria-pressed="${String(r===+v)}">${l}</button>`).join('')}</div></div>`}).join('')}</div></div>`).join('')}</div>`;
  const V=$('#exView');
  V.addEventListener('click',e=>{const s=e.target.closest('[data-start]');if(s){const [ti,ii]=s.dataset.start.split('-').map(Number);const t=E.speak[ti];hush();say(t.items[ii][0]);runTimer(V.querySelector(`[data-tmr="${ti}-${ii}"]`),t.prep,t.time);return}
    if(e.target.closest('[data-stop]')){stopTimer();return}
    const r=e.target.closest('[data-rate]');if(r){const [ti,ii,v]=r.dataset.rate.split('-');sset('exs:'+E.id+':'+ti+':'+ii,+v);$$(`[data-rate^="${ti}-${ii}-"]`,V).forEach(b=>b.setAttribute('aria-pressed',String(b===r)));countActivity();renderExTiles()}});
}
function renderExTiles(){const el=$('#exTiles');if(!el)return;
  el.innerHTML=EXAMS.map((E,i)=>{const s=exSummary(E.id);return `<button class="ptile extile" data-set="${E.id}" aria-pressed="${E.id===EXP.set}"><span class="row" style="justify-content:space-between"><span class="pe">${E.e}</span>${tag('Set '+(i+1),'nom')}</span><span class="pf">${esc(E.fi)}</span><span class="pn">${esc(E.en)}</span>
    <span class="exsc"><span>📖 ${s.r?s.r.s+'/'+s.r.n:'–'}</span><span>🎧 ${s.l?s.l.s+'/'+s.l.n:'–'}</span><span>✍️ ${s.w}/${s.wn}</span><span>🗣️ ${s.s}/${s.sn}</span></span></button>`}).join('')}
function renderExPart(){stopLines();stopTimer();const E=EXAMS.find(x=>x.id===EXP.set)||EXAMS[0];
  $$('#exParts [data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===EXP.part)));
  $('#exHead').innerHTML=`<div class="row" style="gap:10px"><span style="font-size:2rem">${E.e}</span><div><b style="font-size:1.15rem">${esc(E.fi)}</b> ${tag(E.lvl,'par')}<div class="mut"><span class="t-en">${esc(E.en)}</span> <span class="ne t-ne">· ${esc(E.ne)}</span></div></div></div>`;
  if(EXP.part==='read'||EXP.part==='listen')renderRL(E,EXP.part);else if(EXP.part==='write')renderWrite(E);else renderSpeak(E)}
function openExam(set,part){if(set)EXP.set=set;if(part)EXP.part=part;sset('exset',EXP.set);sset('expart',EXP.part);renderExTiles();renderExPart()}
RENDER.exam=()=>{
  const left=daysTo(EXAM_DAY);
  $('#p-exam').innerHTML=`<p class="eyebrow">Koe · Exam practice</p><h2>Five mock exams: read, listen, write, speak</h2>
  <p class="lede">Each set has the four parts of an A1 exam. ${left>0?`Your exam is in <b>${left} days</b> (25–26 November). The exam track puts set 1 on 22 Nov, sets 2–3 on 23 Nov and sets 4–5 on 24 Nov, but you can try them earlier.`:'Do one set per day and repeat the parts where your score is lowest.'} Listening uses your device's Finnish voice, with a higher and a lower voice for the two speakers.</p>
  <div class="grid">${EXAM_TIPS.map(t=>`<div class="card"><div class="row" style="gap:8px"><span style="font-size:1.4rem">${t[0]}</span><b>${t[1]}</b></div><p style="margin:6px 0 0;font-size:.93rem">${esc(t[2])}</p><p class="ne t-ne" style="margin:4px 0 0;font-size:.9rem">${esc(t[3])}</p></div>`).join('')}</div>
  <div class="note voice-note warn" hidden style="margin:14px 0 0"></div>
  <h3>Choose a set</h3><div class="places" id="exTiles"></div>
  <div class="chips" id="exParts">${PARTS.map(p=>`<button class="chip" data-part="${p[0]}">${p[1]} ${p[2]} <span class="cnt">${p[3]}</span></button>`).join('')}</div>
  <div class="out"><div id="exHead"></div><div id="exView"></div></div>`;
  voiceNote();
  $('#exTiles').addEventListener('click',e=>{const b=e.target.closest('[data-set]');if(b)openExam(b.dataset.set)});
  $('#exParts').addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(b)openExam(null,b.dataset.part)});
  openExam();
};
