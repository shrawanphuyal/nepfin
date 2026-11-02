// ================= VOCABULARY TAB =================
const VOCAB_GROUPS=[['Basics',['greetings','numbers','days','months','time','colours']],['World',['weather','nature','places','directions','transport','animals']],['People & life',['people','jobs','feelings','body','home','food','things','clothes']],['Describe',['adjectives','opposites']]];
let WF={cat:sget('wcat','greetings'),q:''};
function wordCard(it){const sp=PUHE[it[1]];return `<div class="card wc"><div class="top"><div class="emo">${it[0]}</div><div class="w"><div class="row" style="gap:8px;flex-wrap:nowrap"><span class="wfi">${esc(it[1])}</span>${spk(it[1])}</div><div class="wen"><span class="t-en">${esc(it[2])}</span> <span class="ne t-ne">${esc(it[3])}</span></div>${sp?`<div class="lsp t-sp">🗣 ${esc(sp)}</div>`:''}</div></div>${it[4]?`<div class="ex"><div class="row" style="gap:6px;flex-wrap:nowrap">${spk(it[4])}<div style="min-width:0"><span class="fi">${esc(it[4])}</span>${it[5]?`<div class="t-en mut">${esc(it[5])}</div>`:''}${it[6]?`<div class="ne t-ne">${esc(it[6])}</div>`:''}</div></div></div>`:''}</div>`}
function renderWordGrid(){
  const g=$('#wGrid');if(!g)return;const q=WF.q.trim().toLowerCase();
  $$('#wChips [data-wc]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wc===WF.cat)));
  const cats=q?Object.keys(NOUNS):[WF.cat];sset('wcat',WF.cat);
  $('#wStudy').dataset.deck='n:'+WF.cat;$('#wStudy').textContent='Flashcards: '+NOUNS[WF.cat].en;
  let html='';
  for(const c of cats){const items=NOUNS[c].items.filter(it=>!q||it.slice(1,4).join(' ').toLowerCase().includes(q));if(!items.length)continue;
    html+=`<div class="grp-label" style="margin-top:14px">${NOUNS[c].fi} · ${NOUNS[c].en} · <span class="ne">${NOUNS[c].ne}</span> · ${items.length}</div><div class="grid">${items.map(wordCard).join('')}</div>`}
  g.innerHTML=html||'<p class="mut">No word matches that search.</p>';
}
RENDER.vocab=()=>{
  const total=Object.values(NOUNS).reduce((a,c)=>a+c.items.length,0);
  $('#p-vocab').innerHTML=`<p class="eyebrow">Sanasto · Vocabulary</p><h2>${total} words, sorted into sections</h2>
  <p class="lede">Pick a section, learn it, then turn it into flashcards. Most words come with a sentence where the word does something. Green 🗣 lines show how people say it in everyday speech.</p>
  <div class="row" style="margin-bottom:12px"><input type="search" id="wSearch" placeholder="Search in Finnish, English or Nepali" aria-label="Search words"><button class="btn pri sm" id="wStudy" data-go="cards" data-deck="n:greetings">Flashcards</button><button class="btn ghost sm" data-go="practice" data-ex="spell">Spelling practice</button></div>
  <div id="wChips">${VOCAB_GROUPS.map(([g,cs])=>`<div class="grp-label">${g}</div><div class="chips">${cs.map(k=>`<button class="chip" data-wc="${k}">${NOUNS[k].en} <span class="cnt">${NOUNS[k].items.length}</span></button>`).join('')}</div>`).join('')}</div>
  <div id="wGrid"></div>
  ${H3('hooks','Memory hooks from Nepali','ne')}
  <p class="lede">Sound-alikes are only memory tricks; the meanings are not related. The ones marked <span class="tag k-out">real relative</span> really share an ancient root with Sanskrit and Nepali.</p>
  <div class="grid">${HOOKS.map(h=>`<div class="card"><div class="row" style="justify-content:space-between"><div class="row" style="gap:8px"><span class="wfi fi" style="font-family:var(--font-display);font-size:1.2rem">${esc(h[0])}</span>${spk(h[0])}</div>${h[4]?tag('real relative','out'):''}</div><div class="t-en" style="font-weight:600">${esc(h[1])}</div><div class="mut" style="font-size:.9rem">sounds like <span class="ne">${esc(h[2])}</span></div><p style="margin:6px 0 0;font-size:.92rem">${esc(h[3])}</p></div>`).join('')}</div>
  ${H3('families','Word families: learn one, get five','gen')}
  <div class="grid">${FAMILIES.map(f=>`<div class="card"><h4 class="mono" style="font-size:.95rem">${esc(f[0])}</h4><div class="stack" style="gap:4px">${f[1].map(w=>`<div class="row" style="gap:8px;flex-wrap:nowrap">${spk(w[0])}<span class="fi">${esc(w[0])}</span><span class="mut t-en" style="font-size:.9rem">${esc(w[1])}</span></div>`).join('')}</div></div>`).join('')}</div>`;
  $('#wChips').addEventListener('click',e=>{const b=e.target.closest('[data-wc]');if(b){WF.cat=b.dataset.wc;WF.q='';$('#wSearch').value='';renderWordGrid()}});
  $('#wSearch').addEventListener('input',e=>{WF.q=e.target.value;renderWordGrid()});
  renderWordGrid();
};

// ================= NUMBERS =================
const ONES=['nolla','yksi','kaksi','kolme','neljä','viisi','kuusi','seitsemän','kahdeksan','yhdeksän'];
const SP1=['nolla','yks','kaks','kolme','neljä','viis','kuus','seittemän','kaheksan','yheksän'];
const SPT={2:'kakskyt',3:'kolkyt',4:'nelkyt',5:'viiskyt',6:'kuuskyt',7:'seitkyt',8:'kasikyt',9:'ysikyt'};
function numFi(n){n=+n;if(n<10)return ONES[n];if(n===10)return 'kymmenen';if(n<20)return ONES[n-10]+'toista';
  if(n<100){const t=Math.floor(n/10),u=n%10;return ONES[t]+'kymmentä'+(u?ONES[u]:'')}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return (h===1?'sata':ONES[h]+'sataa')+(r?numFi(r):'')}
  if(n<10000){const t=Math.floor(n/1000),r=n%1000;return (t===1?'tuhat':ONES[t]+'tuhatta')+(r?numFi(r):'')}return String(n)}
function numSp(n){n=+n;if(n<10)return SP1[n];if(n===10)return 'kymmenen';if(n<20)return SP1[n-10]+'toist';
  if(n<100){const t=Math.floor(n/10),u=n%10;return SPT[t]+(u?SP1[u]:'')}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return (h===1?'sata':SP1[h]+'sataa')+(r?numSp(r):'')}
  if(n<10000){const t=Math.floor(n/1000),r=n%1000;return (t===1?'tuhat':SP1[t]+'tuhatta')+(r?numSp(r):'')}return String(n)}
const ORD1=['','ensimmäinen','toinen','kolmas','neljäs','viides','kuudes','seitsemäs','kahdeksas','yhdeksäs','kymmenes','yhdestoista','kahdestoista','kolmastoista','neljästoista','viidestoista','kuudestoista','seitsemästoista','kahdeksastoista','yhdeksästoista','kahdeskymmenes'];
function ordFi(d){if(d<=20)return ORD1[d];const base=d<30?'kahdeskymmenes':'kolmaskymmenes';return base+(d%10?ORD1[d%10]:'')}
const HLTA=['','yhdeltä','kahdelta','kolmelta','neljältä','viideltä','kuudelta','seitsemältä','kahdeksalta','yhdeksältä','kymmeneltä','yhdeltätoista','kahdeltatoista'];
const YLI={5:'viisi',10:'kymmenen',15:'varttia',20:'kaksikymmentä',25:'kaksikymmentäviisi'};
const VAILLE={5:'viittä',10:'kymmentä',15:'varttia',20:'kahtakymmentä',25:'kahtakymmentäviittä'};
const YLI_SP={5:'viis',10:'kymmenen',15:'varttii',20:'kakskyt',25:'kakskytviis'};
const VAILLE_SP={5:'viittä',10:'kymmentä',15:'varttii',20:'kahtakymmentä',25:'kahtakymmentäviittä'};
function clockFi(h24,m){const h=h24%12||12,nx=h%12+1;let w,sp,lta;
  if(m===0){w='kello '+numFi(h);sp='kello '+numSp(h);lta=HLTA[h]}
  else if(m===30){w='puoli '+numFi(nx);sp='puol '+numSp(nx);lta='puoli '+HLTA[nx]}
  else if(m<30){w=YLI[m]+' yli '+numFi(h);sp=YLI_SP[m]+' yli '+numSp(h);lta=w}
  else{w=VAILLE[60-m]+' vaille '+numFi(nx);sp=VAILLE_SP[60-m]+' vaille '+numSp(nx);lta=w}
  const dig=numFi(h24)+(m?' '+(m<10?'nolla '+numFi(m):numFi(m)):'');
  return {w,sp,lta,dig,txt:String(h24).padStart(2,'0')+':'+String(m).padStart(2,'0')}}
function priceFi(e,c){return (e===1?'yksi euro':numFi(e)+' euroa')+(c?' '+numFi(c)+' senttiä':'')}
function priceSp(e,c){return numSp(e)+(c?' '+numSp(c):' euroo')}
const NUMNOUN={1:'ykkönen',2:'kakkonen',3:'kolmonen',4:'nelonen',5:'vitonen',6:'kutonen',7:'seiska',8:'kasi',9:'ysi',10:'kymppi',100:'satanen / satku',1000:'tonni'};
function clockSVG(h,m){const a=(m/60)*360,b=((h%12)/12)*360+(m/60)*30;const hand=(deg,len,w)=>{const r=(deg-90)*Math.PI/180;return `<line x1="50" y1="50" x2="${(50+len*Math.cos(r)).toFixed(1)}" y2="${(50+len*Math.sin(r)).toFixed(1)}" stroke-width="${w}" stroke-linecap="round" class="hand"/>`};
  let ticks='';for(let i=0;i<12;i++){const r=(i*30-90)*Math.PI/180;ticks+=`<line x1="${(50+40*Math.cos(r)).toFixed(1)}" y1="${(50+40*Math.sin(r)).toFixed(1)}" x2="${(50+45*Math.cos(r)).toFixed(1)}" y2="${(50+45*Math.sin(r)).toFixed(1)}" class="tick"/>`}
  return `<svg viewBox="0 0 100 100" class="clock" aria-hidden="true"><circle cx="50" cy="50" r="47" class="face2"/>${ticks}${hand(b,26,5)}${hand(a,37,3)}<circle cx="50" cy="50" r="3" class="hub"/></svg>`}
RENDER.numbers=()=>{
  const d=new Date();
  const row=n=>`<tr><td class="mono"><b>${n}</b></td><td><span class="fi">${numFi(n)}</span> ${spk(numFi(n))}</td><td class="sp-c">${numSp(n)}</td><td class="mut">${NUMNOUN[n]||''}</td></tr>`;
  const ck=[[3,0],[3,5],[3,10],[3,15],[3,20],[3,30],[3,40],[3,45],[3,55]];
  $('#p-numbers').innerHTML=`<p class="eyebrow">Numerot · Numbers and time</p><h2>Numbers, money, dates and the clock</h2>
  <p class="lede">Numbers are everywhere: prices, buses, phone numbers, times. Learn the written form, the spoken form (green) and the "number nouns" people use for buses and money.</p>
  ${jumpNav([['n0','0–20'],['big','Big numbers'],['phone','Phone'],['money','Money'],['ord','Dates'],['clock','Clock'],['age','Age'],['npart','+ partitive']])}
  ${H3('n0','0–20: the base of everything','nom')}
  <div class="tbl"><table><thead><tr><th>#</th><th>Written</th><th class="sp-h">Spoken</th><th>Number noun</th></tr></thead><tbody>${[...Array(21).keys()].map(row).join('')}</tbody></table></div>
  <div class="grid wide" style="margin-top:12px">
   <div class="note"><span class="lbl">Trick for 11–19</span><b>-toista</b> = "of the second ten". yksitoista = one of the second (ten). Spoken it shrinks to <span class="sp-c">-toist</span>: ykstoist, kakstoist.</div>
   <div class="note"><span class="lbl">Number nouns</span>People call bus 9 <b>ysi</b>, a 10-euro note a <b>kymppi</b>, grade 8 a <b>kasi</b>. "Otan ysin" = I take bus 9. "Lainaatko vitosen?" = Can you lend me five euros?</div>
  </div>
  ${H3('big','Tens, hundreds, thousands','nom')}
  <div class="grid wide">
   <div class="tbl"><table><thead><tr><th>#</th><th>Written</th><th class="sp-h">Spoken</th></tr></thead><tbody>${[20,21,30,35,40,50,60,70,80,90,99,100,101,200,250,1000,2000,2026].map(n=>`<tr><td class="mono"><b>${n}</b></td><td><span class="fi">${numFi(n)}</span> ${spk(numFi(n))}</td><td class="sp-c">${numSp(n)}</td></tr>`).join('')}</tbody></table></div>
   <div class="stack">
    <div class="note"><span class="lbl">Rules</span><b>-kymmentä</b> = tens (kaksi + kymmentä = 20). <b>-sataa</b> = hundreds, <b>-tuhatta</b> = thousands. 1 is special: <b>sata</b> (100), <b>tuhat</b> (1000). Write the whole number as one word: 2026 = kaksituhattakaksikymmentäkuusi.</div>
    <div class="out"><label class="grp-label" for="numIn">Type any number 0–9999</label><div class="row"><input id="numIn" type="number" min="0" max="9999" value="2026" style="max-width:160px"><button class="btn ghost sm" id="numRnd">Random</button></div><div id="numOut" style="margin-top:10px"></div></div>
   </div>
  </div>
  ${H3('phone','Phone numbers','nom')}
  <div class="grid wide">
   <div class="card"><h4>Say it digit by digit, in small groups</h4><p class="fi" style="font-size:1.15rem;margin:6px 0">040 123 4567</p>${lineHTML('nolla neljä nolla, yksi kaksi kolme, neljä viisi kuusi seitsemän','zero four zero, one two three, four five six seven','शून्य चार शून्य, एक दुई तीन, चार पाँच छ सात','nolla nel nolla, yks kaks kolme, nel viis kuus seittemän')}</div>
   <div class="card"><h4>Useful phrases</h4>${lineHTML('Mikä sinun puhelinnumerosi on?','What is your phone number?','तिम्रो फोन नम्बर कति हो?','Mikä sun numero on?')}${lineHTML('Voitko toistaa numeron?','Can you repeat the number?','नम्बर फेरि भन्न सक्छौ?')}${lineHTML('Hätänumero on yksi yksi kaksi.','The emergency number is 112.','आपतकालीन नम्बर ११२ हो।')}</div>
  </div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="num">Practise: listen and write numbers</button></div>
  ${H3('money','Money and prices','nom')}
  <div class="grid wide">
   <div class="tbl"><table><thead><tr><th>Price</th><th>Written</th><th class="sp-h">Spoken</th></tr></thead><tbody>${[[1,0],[2,0],[3,50],[12,90],[0,99],[25,0],[4,5]].map(([e,c])=>{const w=e?priceFi(e,c):numFi(c)+' senttiä';return `<tr><td class="mono"><b>${e},${String(c).padStart(2,'0')} €</b></td><td><span class="fi">${w}</span> ${spk(w)}</td><td class="sp-c">${e?priceSp(e,c):numSp(c)+' senttii'}</td></tr>`}).join('')}</tbody></table></div>
   <div class="stack"><div class="note"><span class="lbl">Partitive again</span><b>yksi euro</b> but <b>kaksi euroa</b>, <b>viisi senttiä</b>. After every number except 1 the noun is partitive. In shops you will often hear only the numbers: "kolme viiskyt" = 3,50 €.</div>
   ${lineHTML('Paljonko tämä maksaa?','How much does this cost?','यो कति पर्छ?','Paljonks tää maksaa?')}${lineHTML('Se maksaa kolme euroa viisikymmentä.','It costs three euros fifty.','यो तीन युरो पचास पर्छ।','Kolme viiskyt.')}${lineHTML('Yhteensä kaksikymmentä euroa.','Twenty euros in total.','जम्मा बीस युरो।','Kakskyt euroo yhteensä.')}</div>
  </div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="price">Practise: prices by ear</button></div>
  ${H3('ord','Ordinal numbers and dates','ess')}
  <div class="tbl"><table><thead><tr><th>#</th><th>Ordinal</th><th>#</th><th>Ordinal</th><th>#</th><th>Ordinal</th></tr></thead><tbody>${[...Array(11).keys()].slice(1).map(i=>{const c=n=>n<=31?`<td class="mono"><b>${n}.</b></td><td><span class="fi">${ordFi(n)}</span></td>`:'<td></td><td></td>';return `<tr>${c(i)}${c(i+10)}${c(i+20)}</tr>`}).join('')}<tr><td></td><td></td><td></td><td></td><td class="mono"><b>31.</b></td><td><span class="fi">${ordFi(31)}</span></td></tr></tbody></table></div>
  <div class="grid wide" style="margin-top:12px">
   <div class="card"><h4>Today</h4>${lineHTML('Tänään on '+ordFi(d.getDate())+' '+FI_MONTHS[d.getMonth()]+'.','Today is the '+d.getDate()+'. of '+d.toLocaleDateString('en-GB',{month:'long'})+'.','आज '+d.getDate()+' तारिख हो।')}<p class="mut" style="font-size:.9rem;margin:6px 0 0">Written as ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} (day.month.year). The month is partitive: ${FI_MONTHS[d.getMonth()]}.</p></div>
   <div class="card"><h4>Useful</h4>${lineHTML('Monesko päivä tänään on?','What is the date today?','आज कति गते हो?','Monesko tänään on?')}${lineHTML('Syntymäpäiväni on viidestoista toukokuuta.','My birthday is on the 15th of May.','मेरो जन्मदिन मे १५ मा हो।')}${lineHTML('Asun toisessa kerroksessa.','I live on the second floor.','म दोस्रो तलामा बस्छु।','Mä asun tokassa.')}<p class="mut" style="font-size:.9rem;margin:6px 0 0">Spoken: <span class="sp-c">eka</span> (1st), <span class="sp-c">toka</span> (2nd).</p></div>
  </div>
  ${H3('clock','Telling the time','ess')}
  <div class="note warn" style="margin-bottom:12px"><span class="lbl">Careful: puoli</span><b>puoli neljä</b> = 3:30, not 4:30! Finnish counts <i>half-way to</i> the next hour. <span class="ne t-ne">नेपालीमा "साढे तीन" = ३:३०, तर फिनिसमा "puoli neljä" (आधा चार) = ३:३०। अर्को घण्टा सम्झनुहोस्।</span></div>
  <div class="grid tight">${ck.map(([h,m])=>{const c=clockFi(h,m);return `<div class="card ctime">${clockSVG(h,m)}<div class="mono"><b>${c.txt}</b></div><div class="row" style="gap:6px;flex-wrap:nowrap"><span class="fi">${c.w}</span>${spk(c.w)}</div><div class="sp-c">${c.sp}</div></div>`}).join('')}</div>
  <div class="grid wide" style="margin-top:12px">
   <div class="note"><span class="lbl">The words</span><b>yli</b> = past · <b>vaille</b> = to · <b>vartti</b> = quarter · <b>puoli</b> = half. After vaille the number is partitive: viittä vaille, kymmentä vaille.</div>
   <div class="note"><span class="lbl">At what time? → -lta</span>Monelta? → <b>kolmelta</b> (at 3), <b>puoli neljältä</b> (at 3:30), <b>kahdeksalta</b> (at 8). Timetables use 24 h: 14.30 = <i>neljätoista kolmekymmentä</i>.</div>
  </div>
  <div class="out" style="margin-top:12px"><div class="row" style="justify-content:space-between"><b>Random time</b><div class="row"><button class="btn ghost sm" id="ckNew">New time</button><button class="btn pri sm" id="ckShow">Show answer</button></div></div><div id="ckBox" style="margin-top:8px"></div></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="clock">Practise: clock times</button></div>
  ${H3('age','Age','nom')}
  <div class="grid wide"><div class="card">${lineHTML('Kuinka vanha olet?','How old are you?','तिमी कति वर्षको भयौ?','Kuinka vanha sä oot?')}${lineHTML('Olen kolmekymmentä vuotta vanha.','I am thirty years old.','म तीस वर्षको हुँ।','Mä oon kolkyt.')}${lineHTML('Olen 30-vuotias.','I am 30 (years old).','म ३० वर्षको हुँ।')}</div><div class="note"><span class="lbl">Two ways</span><b>… vuotta vanha</b> (… years old) or <b>…-vuotias</b> written together: kolmekymmentävuotias. Children: Poika on kuusivuotias.</div></div>
  ${H3('npart','Numbers + partitive: the golden rule','par')}
  <div class="grid">${[['yksi kahvi','one coffee'],['kaksi kahvia','two coffees'],['kolme lippua','three tickets'],['viisi euroa','five euros'],['kymmenen minuuttia','ten minutes'],['sata ihmistä','a hundred people']].map(x=>`<div class="card">${lineHTML(x[0],x[1])}</div>`).join('')}</div>`;
  const upd=()=>{const v=Math.max(0,Math.min(9999,parseInt($('#numIn').value||'0',10)||0));$('#numOut').innerHTML=`<div class="row"><div class="res" style="font-size:1.4rem">${numFi(v)}</div>${spk(numFi(v))}</div><div class="sp-c">🗣 ${numSp(v)}</div>`};
  $('#numIn').addEventListener('input',upd);$('#numRnd').onclick=()=>{$('#numIn').value=rnd(0,2100);upd();sayNow(numFi(+$('#numIn').value))};upd();
  let ck0=null;const newCk=()=>{ck0=[rnd(0,23),rnd(0,11)*5];$('#ckBox').innerHTML=`<div class="row">${clockSVG(ck0[0],ck0[1])}<div class="res mono">${clockFi(ck0[0],ck0[1]).txt}</div></div><p class="mut" style="margin:6px 0 0">Say it aloud first, then show the answer.</p>`};
  $('#ckNew').onclick=newCk;$('#ckShow').onclick=()=>{if(!ck0)return;const c=clockFi(ck0[0],ck0[1]);$('#ckBox').insertAdjacentHTML('beforeend',`<div class="note ok" style="margin-top:8px"><div class="row">${spk(c.w)}<b class="fi">${c.w}</b></div><div class="sp-c">🗣 ${c.sp}</div><div class="mut">At this time: <span class="fi">${c.lta}</span> · Timetable: <span class="fi">${c.dig}</span></div></div>`);sayNow(c.w)};newCk();
};
