// ================= PRACTICE ENGINE =================
const EX={id:null,items:[],i:0,score:0,miss:[],opts:{},checked:false};
const blank=s=>esc(s).replace('___','<span class="blank">____</span>');
function fillItems(id,all){const b=FILL[id];return (all?shuffle(b.items):pick(b.items,10)).map(it=>({p:`<div class="qprompt">${blank(it[0])}</div><div class="mut">(${esc(it[2])}) · <span class="t-en">${esc(it[3])}</span></div>`,a:it[1].split('|'),say:it[0].replace('___',it[1].split('|')[0]),x:''}))}
function transformItems(id,all){const b=TRANSFORM[id];return (all?shuffle(b.items):pick(b.items,10)).map(it=>{const qw=id==='qw';return {p:qw?`<div class="qprompt">${blank(it[0])}</div><div class="mut t-en">${esc(it[2])}</div>`:`<div class="qprompt">${esc(it[0])}</div><div class="mut">→ ${esc(b.d)}</div>`,a:it[1].split('|'),say:qw?it[0].replace('___',it[1].split('|')[0]).split(' – ')[0]:it[1].split('|')[0],x:`<span class="t-en">${esc(it[2])}</span>`}})}
function translItems(all){return (all?shuffle(TRANSL):pick(TRANSL,10)).map(t=>({p:`<div class="qprompt">${esc(t[0])}</div><div class="ne">${esc(t[1])}</div>`,a:t[2].split('|'),say:t[2].split('|')[0],x:t[2].split('|').length>1?'Also correct: '+t[2].split('|').slice(1).map(esc).join(' · '):''}))}
function verbItems(){const out=[];for(let k=0;k<10;k++){const v=VERBS[rnd(0,VERBS.length-1)],i=rnd(0,5);const r=Math.random();
  if(r<.25){out.push({p:`<div class="qprompt"><span class="mut">${PRN[i]}</span> + ${esc(v.fi)} <span class="tag k-ne">not</span></div><div class="mut t-en">${esc(v.en)}</div>`,a:[NEG[i]+' '+v.f[0].slice(0,-1)],say:PRN[i]+' '+NEG[i]+' '+v.f[0].slice(0,-1),x:'"Not" takes the ending; the verb loses it.'})}
  else if(r<.45&&PAST[v.fi]){const pf=pastForms(v);out.push({p:`<div class="qprompt"><span class="mut">${PRN[i]}</span> + ${esc(v.fi)} <span class="tag k-verb">past</span></div><div class="mut t-en">${esc(v.en)}</div>`,a:[pf.pos[i]],say:PRN[i]+' '+pf.pos[i],x:''})}
  else out.push({p:`<div class="qprompt"><span class="mut">${PRN[i]}</span> + ${esc(v.fi)}</div><div class="mut t-en">${esc(v.en)}</div>`,a:[v.f[i]],say:PRN[i]+' '+v.f[i],x:v.k?'KPT: '+esc(v.k):''})}return out}
function spellItems(){const pool=Object.entries(NOUNS).filter(([k])=>k!=='numbers').flatMap(([k,c])=>c.items).filter(it=>!/[\/↔(]/.test(it[1]));
  return pick(pool,10).map(it=>({p:`<div style="font-size:3rem;line-height:1.1">${it[0]}</div><div class="qprompt" style="margin:4px 0">${esc(it[2])}</div><div class="ne">${esc(it[3])}</div>`,a:[it[1]],say:it[1],hint:it[1],x:it[4]?`<span class="fi">${esc(it[4])}</span> <span class="mut t-en">${esc(it[5])}</span>`:''}))}
function numItems(){const out=[];for(let k=0;k<4;k++){const n=Math.random()<.6?rnd(0,100):rnd(100,2100);out.push({p:`<div class="qprompt mono" style="font-size:2.4rem">${n}</div><div class="mut">Write it in Finnish words</div>`,a:[numFi(n),numSp(n)],say:numFi(n),x:`🗣 ${numSp(n)}`})}
  for(let k=0;k<4;k++){const n=Math.random()<.5?rnd(11,99):rnd(100,1999);out.push({p:'<div class="mut">Listen and write the number in digits</div>',audio:numFi(n),a:[String(n)],num:true,say:numFi(n),x:numFi(n)})}
  for(let k=0;k<2;k++){const d='04'+rnd(0,9)+String(rnd(1000000,9999999));const g=[d.slice(0,3),d.slice(3,6),d.slice(6)];out.push({p:'<div class="mut">Listen to the phone number and write the digits</div>',audio:g.map(x=>[...x].map(c=>ONES[+c]).join(' ')).join(', '),a:[d],num:true,say:'',x:g.join(' ')})}
  return shuffle(out)}
function priceItems(){const out=[];for(let k=0;k<10;k++){const e=rnd(1,49),c=rnd(0,19)*5;const val=e+c/100;const txt=e+','+String(c).padStart(2,'0');
  out.push({p:'<div class="mut">Listen and write the price (for example 3,50)</div>',audio:Math.random()<.7?priceFi(e,c):priceSp(e,c),a:[txt],price:val,say:'',x:`${txt} € = ${priceFi(e,c)} · 🗣 ${priceSp(e,c)}`})}return out}
function clockItems(){const out=[];for(let k=0;k<10;k++){const h=rnd(0,23),m=rnd(0,11)*5,c=clockFi(h,m);out.push({p:`<div class="row">${clockSVG(h,m)}<div class="qprompt mono">${c.txt}</div></div><div class="mut">Write the time in Finnish (12-hour way, e.g. "puoli kolme")</div>`,a:[c.w,c.sp,c.dig],say:c.w,x:`Also: ${c.dig} · At this time: ${c.lta}`})}return out}
function poolLines(story){if(story){const s=STORIES.find(x=>x.id===story);if(s)return s.lines.map(l=>l[0])}return [...STORIES.flatMap(s=>s.lines.map(l=>l[0])),...PLACES.flatMap(p=>p.lines.map(l=>l[1]))]}
function dictItems(story){const pool=poolLines(story).filter(l=>{const n=l.split(/\s+/).length;return n>=2&&n<=11});const lines=story?pool:pick(pool,10);
  return lines.map(l=>({p:'<div class="mut">Listen and write the sentence</div>',audio:l,a:[l],say:'',x:''}))}
function orderItems(story){const pool=poolLines(story).map(l=>l.replace(/["“”]/g,'')).filter(l=>{const n=l.split(/\s+/).length;return n>=3&&n<=9});const lines=story?pool:pick(pool,10);
  return lines.map(l=>{const clean=l.replace(/[.!?]+$/,'');const toks=clean.split(/\s+/);let sh=shuffle(toks);if(sh.join(' ')===toks.join(' '))sh=sh.reverse();return {type:'order',p:'<div class="mut">Tap the words in the right order</div>',tokens:sh,a:[clean],say:l,x:'Finnish word order is quite free; this checks the order used in the text.'}})}
function buildSet(id,opts){const s=EXSETS[id];const all=opts.all;
  if(!s)return [];if(s[1]==='fill')return fillItems(s[2],all);if(s[1]==='transform')return transformItems(s[2],all);if(s[1]==='transl')return translItems(all);
  if(id==='verbs')return verbItems();if(id==='spell')return spellItems();if(id==='num')return numItems();if(id==='price')return priceItems();if(id==='clock')return clockItems();
  if(id==='dict')return dictItems(opts.story);if(id==='order')return orderItems(opts.story);
  if(id==='mixed')return shuffle([...fillItems('par').slice(0,2),...fillItems('loc').slice(0,2),...transformItems('q').slice(0,2),...transformItems('qw').slice(0,2),...verbItems().slice(0,2),...translItems().slice(0,2)]);return []}
function startSet(id,opts={}){EX.id=id;EX.opts=opts;EX.items=buildSet(id,opts);EX.i=0;EX.score=0;EX.miss=[];
  $$('.extiles [data-ex]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ex===id)));renderEx();
  const r=$('#exRun');if(r)r.scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})}
function renderEx(){const box=$('#exRun');if(!box)return;const s=EXSETS[EX.id];const it=EX.items[EX.i];EX.checked=false;
  if(!it){const n=EX.items.length;const best=sget('best:'+EX.id,0);const pct=n?Math.round(EX.score/n*100):0;if(pct>best)sset('best:'+EX.id,pct);markDay();
    if(EX.opts.story&&EX.id==='dict')markStory(EX.opts.story,'dict');
    const msg=pct>=90?'Erinomaista! Excellent.':pct>=70?'Hyvä! Good work.':pct>=50?'Ihan hyvä. Keep going.':'Harjoitus tekee mestarin. Practice makes perfect.';
    box.innerHTML=`<div class="card"><p class="eyebrow">${esc(s[0])} · result</p><div class="qprompt">${EX.score} / ${n} · ${msg}</div><p class="mut">Your best: ${Math.max(best,pct)} %</p>
    ${EX.miss.length?`<h4>Look at these again (say each one 3 times)</h4><div class="stack" style="gap:6px">${EX.miss.map(m=>`<div class="row" style="gap:8px;flex-wrap:nowrap">${spk(m)}<span class="fi">${esc(m)}</span></div>`).join('')}</div>`:'<p>No mistakes. Try another set.</p>'}
    <div class="row" style="margin-top:16px"><button class="btn pri" id="exAgain">Again with new questions</button>${EXSETS[EX.id][1]==='fill'||EXSETS[EX.id][1]==='transform'||EX.id==='tr'?'<button class="btn ghost" id="exAll">Do all items</button>':''}</div></div>`;
    $('#exAgain').onclick=()=>startSet(EX.id,{story:EX.opts.story});const al=$('#exAll');if(al)al.onclick=()=>startSet(EX.id,{all:true});return}
  const head=`<div class="row" style="justify-content:space-between"><span class="eyebrow" style="margin:0">${esc(s[0])} · ${EX.i+1} / ${EX.items.length}</span><span class="mono mut" style="font-size:.8rem">score ${EX.score}</span></div><div class="progress" style="margin:6px 0 12px;max-width:none"><i style="width:${EX.i/EX.items.length*100}%"></i></div>`;
  const audio=it.audio?`<div class="row" style="margin:8px 0"><button class="btn pri" id="exPlay">▶ Play</button><button class="btn ghost sm" id="exSlow">🐢 Slow</button></div>`:'';
  if(it.type==='order'){EX.built=[];
    box.innerHTML=head+it.p+`<div class="orderans" id="ordAns" aria-live="polite"></div><div class="chips" id="ordTok">${it.tokens.map((t,k)=>`<button class="chip tokchip" data-tk="${k}">${esc(t)}</button>`).join('')}</div><div class="row"><button class="btn pri" id="exCheck">Check</button><button class="btn ghost sm" id="ordReset">Reset</button><button class="btn ghost sm" id="exShow">Show answer</button></div><div id="exFb"></div>`;
    const draw=()=>{$('#ordAns').innerHTML=EX.built.map((k,j)=>`<button class="chip tokchip on" data-back="${j}">${esc(it.tokens[k])}</button>`).join('')||'<span class="mut">Tap words below…</span>';$$('#ordTok [data-tk]').forEach(b=>b.disabled=EX.built.includes(+b.dataset.tk))};
    $('#ordTok').onclick=e=>{const b=e.target.closest('[data-tk]');if(!b||EX.checked)return;EX.built.push(+b.dataset.tk);draw()};
    $('#ordAns').onclick=e=>{const b=e.target.closest('[data-back]');if(!b||EX.checked)return;EX.built.splice(+b.dataset.back,1);draw()};
    $('#ordReset').onclick=()=>{if(EX.checked)return;EX.built=[];draw()};draw();
    $('#exCheck').onclick=()=>exCheck(EX.built.map(k=>it.tokens[k]).join(' '));$('#exShow').onclick=()=>exCheck(null);return}
  box.innerHTML=head+it.p+audio+`<div class="row" style="margin-top:10px;align-items:flex-start"><input type="text" id="exIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Kirjoita vastaus…" style="flex:1;min-width:0;max-width:none">${fiKeys('exIn')}</div>
   <div class="row" style="margin-top:10px"><button class="btn pri" id="exCheck">Check <span class="kbd">Enter</span></button>${it.hint?'<button class="btn ghost sm" id="exHint">Hint</button>':''}<button class="btn ghost sm" id="exShow">Show answer</button></div><div id="exFb"></div>`;
  const inp=$('#exIn');inp.focus({preventScroll:true});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(EX.checked)nextEx();else exCheck(inp.value)}});
  $('#exCheck').onclick=()=>EX.checked?nextEx():exCheck(inp.value);$('#exShow').onclick=()=>exCheck(null);
  if(it.hint)$('#exHint').onclick=()=>{$('#exFb').innerHTML=`<div class="note" style="margin-top:10px">Starts with <b>${esc(it.hint[0])}</b> · ${it.hint.length} letters</div>`};
  if(it.audio){$('#exPlay').onclick=()=>sayNow(it.audio);$('#exSlow').onclick=()=>{hush();say(it.audio,null,0.55)};setTimeout(()=>say(it.audio),250)}
}
function exCheck(val){if(EX.checked)return;const it=EX.items[EX.i];EX.checked=true;let ok=false,r=null;
  if(val!=null&&val.trim()){
    if(it.num){ok=val.replace(/\D/g,'')===it.a[0]}
    else if(it.price!=null){const v=parseFloat(val.replace(',','.').replace(/[^\d.]/g,''));ok=Math.abs(v-it.price)<0.001}
    else{r=checkAns(val,it.a);ok=r.ok}}
  if(ok)EX.score++;else EX.miss.push(it.a[0]);countActivity();
  const target=r?r.best:it.a[0];
  $('#exFb').innerHTML=`<div class="note ${ok?'ok':'warn'}" style="margin-top:12px"><span class="lbl">${ok?'Oikein! Correct':val==null||!val.trim()?'Answer':r&&r.close?'Melkein! One letter off':'Ei aivan. Not quite'}</span>
   <div class="row" style="gap:8px">${spk(it.say||target)}<b class="fi" style="font-size:1.1rem">${!ok&&val&&r?diffHTML(val,target):esc(target)}</b></div>
   ${!ok&&val&&r?`<div class="mut" style="font-size:.85rem">You wrote: ${esc(val)}</div>`:''}${it.x?`<div style="margin-top:6px;font-size:.92rem">${it.x}</div>`:''}</div>
   <div class="row" style="margin-top:10px"><button class="btn pri" id="exNext">${EX.i+1<EX.items.length?'Next':'See result'} <span class="kbd">Enter</span></button></div>`;
  if(it.say)say(it.say);$('#exNext').onclick=nextEx;$('#exNext').focus({preventScroll:true});
  const cb=$('#exCheck');if(cb){cb.innerHTML='Next';cb.onclick=nextEx}}
function nextEx(){EX.i++;renderEx()}
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const p=$('#p-practice');if(!p||p.hidden||!EX.checked)return;if(e.target.id==='exIn')return;if(e.target.closest('button'))return;e.preventDefault();nextEx()});
RENDER.practice=()=>{
  const groups=[['Grammar: fill the gap',['par','gen','ill','loc','rek','obj','past','imp']],['Build sentences',['neg','q','qw','tr','order','verbs']],['Listen and write',['dict','num','price','clock','spell']],['k-p-t and homework',['kpt','kptpl','hw5','hw6','hwpl','lenlisten']],['Review',['mixed']]];
  $('#p-practice').innerHTML=`<p class="eyebrow" id="top">Harjoitukset · Exercises</p><h2>Practice: type it, hear it, fix it</h2>
  <p class="lede">Every set has 10 questions (new ones each time). Type your answer, press Enter. Wrong letters are shown in red, and every answer is read aloud so you also train your ear. Use the ä and ö buttons if your keyboard has none.</p>
  <div class="note voice-note warn" hidden style="margin-bottom:12px"></div>
  ${groups.map(([g,ids])=>`<div class="grp-label">${g}</div><div class="extiles">${ids.map(id=>{const s=EXSETS[id];const b=sget('best:'+id,null);return `<button class="extile k-soft-${s[3]}" data-ex="${id}" aria-pressed="false"><b>${esc(s[0])}</b><span class="mut mono" style="font-size:.75rem">${b!=null?'best '+b+' %':'not done yet'}</span></button>`}).join('')}</div>`).join('')}
  <div class="out qbox" id="exRun" style="margin-top:18px;max-width:760px"><p class="mut" style="margin:0">Pick a set above to start.</p></div>`;
  $('#p-practice').addEventListener('click',e=>{const b=e.target.closest('.extile[data-ex]');if(b)startSet(b.dataset.ex)});
  voiceNote();
};
