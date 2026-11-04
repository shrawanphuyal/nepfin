// ================= VERBS TAB =================
const BV=VERBS.filter(v=>v.b);
const SB={p:0,v:Math.max(0,BV.findIndex(v=>v.fi==='puhua')),neg:false,past:false};
const NEG_OBJ={kahvin:'kahvia',lahjan:'lahjaa',tarinan:'tarinaa',laulun:'laulua',sanan:'sanaa',opettajan:'opettajaa',meren:'merta',viestin:'viestiä',kakun:'kakkua',auton:'autoa',ystävän:'ystävää',keittiön:'keittiötä',kirjan:'kirjaa',tämän:'tätä',roskat:'roskia',kädet:'käsiä'};
const EN_PAST={be:'was',speak:'spoke',live:'lived',sleep:'slept',take:'took',read:'read',write:'wrote',learn:'learned',study:'studied',understand:'understood',know:'knew',give:'gave',tell:'told',leave:'left',wait:'waited',help:'helped',like:'liked','look for':'looked for',call:'called',forget:'forgot',buy:'bought',pay:'paid',ask:'asked',say:'said',watch:'watched',drive:'drove',love:'loved',remember:'remembered',travel:'travelled',dance:'danced',sing:'sang',sit:'sat',play:'played',make:'made',choose:'chose',change:'changed','do':'did',see:'saw',eat:'ate',drink:'drank',get:'got','go to':'went to',bring:'brought','take out':'took out',sell:'sold',swim:'swam',go:'went',come:'came',walk:'walked',think:'thought',listen:'listened',work:'worked',practise:'practised','get up':'got up',run:'ran',wash:'washed',want:'wanted',meet:'met',clean:'cleaned',order:'ordered','wake up':'woke up',answer:'answered',borrow:'borrowed'};
function en3(b){const [w,...r]=b.split(' ');const irr={be:'is',have:'has',do:'does',go:'goes'};const x=irr[w]||(/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':/(s|sh|ch|x|z|o)$/.test(w)?w+'es':w+'s');return [x,...r].join(' ')}
function enConj(b,i,neg,past){
  if(past){if(b==='be'){const f=[0,2].includes(i)?'was':'were';return neg?f+' not':f}return neg?"didn't "+b:(EN_PAST[b]||b+'ed')}
  if(b==='be'){const f=['am','are','is','are','are','are'][i];return neg?f+' not':f}if(neg)return (i===2?"doesn't ":"don't ")+b;return i===2?en3(b):b}
const EN_SUBJ=['I','You','He / she','We','You (all)','They'];
const NE_SUBJ=['म','तिमी','ऊ','हामी','तिमीहरू','उनीहरू'];
const NE_PAST=['एँ','यौ','यो','यौं','यौ','ए'];
function pastForms(v){const p=PAST[v.fi];if(!p)return null;const st=p[0].slice(0,-1),back=/vat$/.test(v.f[5]);
  const pl=p[2].replace(/[uy]t$/,'eet');
  return {pos:[p[0],st+'t',p[1],st+'mme',st+'tte',p[1]+(back?'vat':'vät')],neg:['en '+p[2],'et '+p[2],'ei '+p[2],'emme '+pl,'ette '+pl,'eivät '+pl]}}
function renderSB(){
  const v=BV[SB.v],i=SB.p,[enB,oFi0,oEn,oNe,ns,nn]=v.b;const pf=pastForms(v);
  const oFi=SB.neg&&NEG_OBJ[oFi0]?NEG_OBJ[oFi0]:oFi0;
  let fiVerb,fiPlain;
  if(SB.past&&pf){fiPlain=(SB.neg?pf.neg:pf.pos)[i];fiVerb=SB.neg?`<span class="hl">${NEG[i]}</span> ${esc(fiPlain.split(' ')[1])}`:esc(fiPlain)}
  else{fiPlain=SB.neg?NEG[i]+' '+v.f[0].slice(0,-1):v.f[i];fiVerb=SB.neg?`<span class="hl">${NEG[i]}</span> ${esc(v.f[0].slice(0,-1))}`:hlEnd(v.f[i],i)}
  const fiS=cap(PRON[i][0])+' '+fiPlain+(oFi?' '+oFi:'')+'.';
  const neV=SB.past?'(past)':(ns==='@'?(SB.neg?NE_CHHAINA:NE_CHHA)[i]:(SB.neg?nn+NE_NEG[i]:ns+NE_POS[i]));
  const spv=SPOKEN_VERBS[v.fi];
  $$('#sbP [data-p]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.p===i)));
  $('#sbNeg').setAttribute('aria-pressed',String(SB.neg));$('#sbPast').setAttribute('aria-pressed',String(SB.past));
  $('#sbOut').innerHTML=`<div class="eyebrow">${PRON[i][0]} + ${esc(v.fi)}${SB.neg?' + not':''}${SB.past?' + past':''}</div>
   <div class="row"><div class="res">${cap(PRON[i][0])} ${fiVerb}${oFi?' '+esc(oFi):''}.</div>${spk(fiS)}</div>
   ${spv&&!SB.past&&!SB.neg?`<div class="lsp t-sp">🗣 ${cap(spv[i])}${oFi?' '+esc(oFi):''}.</div>`:''}
   <div class="t-en" style="margin-top:8px;font-size:1.05rem">${EN_SUBJ[i]} ${enConj(enB,i,SB.neg,SB.past)}${oEn?' '+esc(oEn):''}.</div>
   ${SB.past?'':`<div class="ne t-ne" style="font-size:1.1rem">${NE_SUBJ[i]} ${oNe?esc(oNe)+' ':''}${neV}।</div>`}
   <div class="mut" style="font-size:.88rem;margin-top:10px">Word order: Finnish <b>who · does · what</b>; Nepali <b>who · what · does</b>. ${SB.neg?'"Not" (en, et, ei…) takes the person ending. Objects like "kahvin" become partitive: <span class="fi">en ota kahvia</span>.':'The <span class="hl">highlighted</span> ending tells you who, just like छु / छौ / छ.'}${v.k?' '+tag(esc(v.k),'ess'):''}</div>`;
}
let VF={t:'all',q:''};
function renderVerbList(){
  const q=VF.q.trim().toLowerCase();
  const list=VERBS.filter(v=>(VF.t==='all'||(VF.t==='kpt'?isKpt(v):VF.t==='56'?v.t>=5:v.t===+VF.t))&&(!q||(v.fi+' '+v.en+' '+v.ne).toLowerCase().includes(q)));
  $$('#vfChips [data-vt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vt===VF.t)));
  $('#vList').innerHTML=list.length?list.map(v=>{const pf=pastForms(v);const spv=SPOKEN_VERBS[v.fi];return `<details class="vrow"><summary><span class="ve">${v.e}</span><span class="vfi">${esc(v.fi)}</span>${spk(v.fi)}<span class="t-en">${esc(v.en)}</span><span class="ne t-ne">${esc(v.ne)}</span>${tag('Type '+v.t,'verb')}${v.k?tag(esc(v.k),'ess'):''}</summary>
   <div class="db"><div class="tbl"><table><thead><tr><th>Who</th><th>Now</th><th>Not</th>${pf?'<th>Past</th><th>Past, not</th>':''}${spv?'<th class="sp-h">Spoken</th>':''}</tr></thead><tbody>${PRON.map((p,i)=>`<tr><td class="mut">${p[0]}</td><td><b class="fi">${hlEnd(v.f[i],i)}</b></td><td class="fi">${NEG[i]} ${esc(v.f[0].slice(0,-1))}</td>${pf?`<td class="fi">${pf.pos[i]}</td><td class="fi">${pf.neg[i]}</td>`:''}${spv?`<td class="sp-c">${spv[i]}</td>`:''}</tr>`).join('')}</tbody></table></div>
   <div style="margin-top:10px">${lineHTML(v.x[0],v.x[1],v.x[2])}</div></div></details>`}).join(''):'<p class="mut">No verb matches that search.</p>';
}
function renderPastTable(){
  const v=VERBS.find(x=>x.fi===$('#pastSel').value)||VERBS[0];const pf=pastForms(v);const p=PAST[v.fi];
  $('#pastOut').innerHTML=`<div class="row" style="gap:8px"><span class="res" style="font-size:1.5rem">${v.e} ${esc(v.fi)}</span>${spk(v.fi)}<span class="t-en mut">${esc(v.en)}</span></div>
  <div class="tbl" style="margin-top:10px"><table><thead><tr><th>Who</th><th>Now</th><th>Past</th><th>Past, not</th></tr></thead><tbody>${PRON.map((r,i)=>`<tr><td class="mut">${r[0]}</td><td class="fi">${v.f[i]}</td><td><b class="fi">${pf.pos[i]}</b> ${spk(r[0]+' '+pf.pos[i])}</td><td class="fi">${pf.neg[i]}</td></tr>`).join('')}</tbody></table></div>
  <p class="mut" style="font-size:.9rem;margin:8px 0 0">The "not" form is the same for minä, sinä, hän: <b>${p[2]}</b>. For me, te, he it ends in <b>-neet</b>: ${pf.neg[3].split(' ')[1]}. Spoken: <span class="sp-c">mä ${p[0]}</span>, and "we" uses the passive past: <span class="sp-c">me mentiin, me oltiin, me syötiin</span>.</p>`;
}
RENDER.verbs=()=>{
  const pu=VERBS.find(v=>v.fi==='puhua');const neBol=['बोल्छु','बोल्छौ','बोल्छ','बोल्छौं','बोल्छौ','बोल्छन्'];const nuk=VERBS.find(v=>v.fi==='nukkua');
  $('#p-verbs').innerHTML=`<p class="eyebrow">Verbit · Verbs</p><h2>Verbs: the ending tells you who</h2>
  <p class="lede">Nepali changes बोल्छु / बोल्छौ / बोल्छ. Finnish changes the end of the verb the same way. Because the ending already says who, you can drop <span class="fi">minä</span> and <span class="fi">sinä</span>, just like dropping म in Nepali.</p>
  ${jumpNav([['persons','Persons'],['olla','olla'],['types','6 types'],['kpt','KPT'],['builder','Sentence builder'],['negative','Saying no'],['infinitive','Verb + verb'],['imperative','Commands'],['past','Past tense'],['spoken','Spoken verbs'],['vlist','All '+VERBS.length+' verbs']])}
  ${H3('persons','The six persons','verb')}
  <div class="tbl"><table><thead><tr><th>Person</th><th class="sp-h">Spoken</th><th>Finnish · puhua</th><th>Ending</th><th class="t-ne">Nepali · बोल्नु</th><th class="t-en">English</th></tr></thead><tbody>${PRON.map((p,i)=>`<tr><td><b class="fi">${p[0]}</b> ${spk(p[0]+' '+pu.f[i])}</td><td class="sp-c">${SPOKEN_VERBS.puhua[i]}</td><td class="fi"><b>${p[0]} ${hlEnd(pu.f[i],i)}</b></td><td class="mono">${p[4]}</td><td class="ne t-ne">${p[3]} <b>${neBol[i]}</b></td><td class="t-en">${p[2]} speak${i===2?'s':''}</td></tr>`).join('')}</tbody></table></div>
  <div class="grid wide" style="margin-top:12px"><div class="note"><span class="lbl">Memory trick: "n, t, –, mme, tte, vat"</span>Say it like a rhythm: <b>n – t – (double) – mme – tte – vat</b>. It is the same for almost every verb in Finnish.</div><div class="note"><span class="lbl">hän = he and she</span>Finnish has no he / she. Hän is everyone, like respectful उहाँ. In speech people say <span class="sp-c">se</span>, and <span class="sp-c">ne</span> for "they".</div></div>
  ${H3('olla','olla: the most important verb','verb')}
  <div class="tbl"><table><thead><tr><th>Who</th><th>Is / am / are</th><th>Not</th><th>Was</th><th class="sp-h">Spoken</th><th class="t-ne">Nepali</th></tr></thead><tbody>${PRON.map((p,i)=>{const o=VERBS[0];const pf=pastForms(o);return `<tr><td class="mut">${p[0]}</td><td><b class="fi">${o.f[i]}</b> ${spk(p[0]+' '+o.f[i])}</td><td class="fi">${NEG[i]} ole</td><td class="fi">${pf.pos[i]}</td><td class="sp-c">${SPOKEN_VERBS.olla[i]}</td><td class="ne t-ne">${NE_SUBJ[i]} ${NE_CHHA[i]}</td></tr>`}).join('')}</tbody></table></div>
  <div class="grid" style="margin-top:12px">${[['Olen nepalilainen.','I am Nepali.','म नेपाली हुँ।'],['Minulla on kaksi lasta.','I have two children.','मेरा दुई बच्चा छन्।'],['Täällä on kylmä.','It is cold here.','यहाँ चिसो छ।'],['Kirjasto on auki.','The library is open.','पुस्तकालय खुला छ।']].map(x=>`<div class="card">${lineHTML(...x)}</div>`).join('')}</div>
  ${H3('types','Six verb types: how to make the "minä" form','verb')}
  <p class="lede">Look at the end of the dictionary form. It tells you the type, and the type tells you where to cut and what to add. Then add the person endings.</p>
  <div class="tbl"><table><thead><tr><th>Type</th><th>Ends in</th><th>Make "minä"</th><th>Examples</th></tr></thead><tbody>
   <tr><td>${tag('1','verb')}</td><td class="mono">vowel + a / ä</td><td>remove a/ä, add <b>n</b></td><td class="fi">puhu|a → puhun · asu|a → asun · nukku|a → nukun</td></tr>
   <tr><td>${tag('2','verb')}</td><td class="mono">-da / -dä</td><td>remove da/dä, add <b>n</b></td><td class="fi">syö|dä → syön · juo|da → juon · (hän syö)</td></tr>
   <tr><td>${tag('3','verb')}</td><td class="mono">-la, -na, -ra, -sta</td><td>remove la/na/ta, add <b>en</b></td><td class="fi">tul|la → tulen · men|nä → menen · pes|tä → pesen</td></tr>
   <tr><td>${tag('4','verb')}</td><td class="mono">-ata, -ota, -uta, -ätä</td><td>remove ta/tä, add <b>a + n</b></td><td class="fi">halu|ta → haluan · tava|ta → tapaan</td></tr>
   <tr><td>${tag('5','verb')}</td><td class="mono">-ita / -itä</td><td>remove ta/tä, add <b>tsen</b></td><td class="fi">tarvi|ta → tarvitsen · vali|ta → valitsen</td></tr>
   <tr><td>${tag('6','verb')}</td><td class="mono">-eta / -etä</td><td>remove ta/tä, add <b>nen</b></td><td class="fi">vanhe|ta → vanhenen</td></tr></tbody></table></div>
  <div class="note" style="margin-top:12px"><span class="lbl">Fast way to learn</span>Learn one model verb per type: <b>puhua, syödä, tulla, haluta, tarvita</b>. Every new verb, ask: which model is it like? Then copy.</div>
  ${H3('kpt','KPT: strong and weak consonants','ess')}
  <p class="lede"><b>k, p, t</b> in the middle of a word switch between a strong and a weak (soft) form. English has a little of this: <i>knife → knives</i>. Finnish does it all the time: <span class="fi">leipä → leivän</span>.</p>
  <div class="note warn" style="margin-bottom:12px"><span class="lbl">नेपालीमा</span><span class="ne">नेपालीमा यस्तो नियम छैन, त्यसैले नयाँ नियम मानेर सिक्नुहोस्। अन्त्य थप्दा अक्षर बन्द भयो भने k, p, t नरम हुन्छन्: kk → k, pp → p, p → v, t → d।</span></div>
  <div class="grid wide">
   <div class="card"><div class="eyebrow">The one rule</div><h4>A closed syllable makes it soft</h4><p style="margin:0">If the ending makes the syllable end in a consonant, use the weak form.</p><div class="stack" style="gap:6px;margin-top:10px;font-family:var(--font-mono)"><div>kaup·pa <span class="mut">(strong pp)</span></div><div>kau·pa<span class="hl">s</span>·sa → <b class="fi">kaupassa</b> <span class="mut">(weak p)</span></div><div>kaup·paan → <b class="fi">kauppaan</b> <span class="mut">(strong)</span></div></div></div>
   <div class="card"><div class="eyebrow">Soft or strong?</div><h4>Which endings soften</h4><p style="margin:0"><b>Weak:</b> <span class="mono">-n, -t, -ssa, -sta, -lla, -lta, -lle, -ksi</span>; verbs with minä, sinä, me, te; all negatives.</p><p style="margin:8px 0 0"><b>Strong:</b> basic form, partitive <span class="mono">-a</span>, <span class="mono">-na</span>, illative <span class="mono">-Vn</span>, verbs with hän and he.</p></div>
   <div class="card k-soft-ess"><div class="eyebrow">Say this five times</div><h4 class="fi" style="font-size:1.2rem">Minä, sinä, me, te go soft.<br>Hän and he stay strong.</h4><div class="forms" style="margin-top:10px">${[0,3,1,4,2,5].map(i=>`<div><span class="mut">${PRN[i]}</span> <b class="fi">${nuk.f[i]}</b> ${i===2||i===5?tag('strong','ess'):tag('soft','in')}</div>`).join('')}</div></div>
  </div>
  <div class="tbl" style="margin-top:14px"><table><thead><tr><th>Strong</th><th>Weak</th><th>Noun example</th><th>Verb example</th></tr></thead><tbody>${KPT.map(r=>`<tr><td class="mono"><b>${r[0]}</b></td><td class="mono"><b>${r[1]}</b></td><td class="fi">${r[2]}</td><td class="fi">${r[3]}</td></tr>`).join('')}</tbody></table></div>
  <div class="grid wide" style="margin-top:12px"><div class="note"><span class="lbl">Reverse KPT (types 3 and 4)</span>Here the dictionary form is weak and the person forms are strong: <span class="fi">tavata → tapaan</span>, <span class="fi">ajatella → ajattelen</span>, <span class="fi">kuunnella → kuuntelen</span>, <span class="fi">pelätä → pelkään</span>.</div><div class="note warn"><span class="lbl">Why it matters</span><span class="fi">Tapaan sinut huomenna.</span> = I will meet you tomorrow.<br><span class="fi">Tapan sinut huomenna.</span> = I will kill you tomorrow! Hold your double letters.</div></div>
  <div class="row" style="margin-top:12px"><button class="btn pri sm" data-go="practice" data-ex="verbs">Practise verb forms</button><button class="btn ghost sm" data-go="cards" data-deck="v:kpt">KPT flashcards</button></div>
  ${H3('builder','Sentence builder: who does what','verb')}
  <div class="builder"><div class="stack" style="min-width:0">
     <div><div class="grp-label">1 · Who</div><div class="chips" id="sbP">${PRON.map((p,i)=>`<button class="chip" data-p="${i}">${p[0]} <span class="cnt">${p[2]}</span></button>`).join('')}</div></div>
     <div><div class="grp-label">2 · Does what</div><select id="sbV" aria-label="Verb">${BV.map((v,i)=>`<option value="${i}">${v.fi} · ${v.en}</option>`).join('')}</select></div>
     <div><div class="grp-label">3 · Options</div><div class="chips"><button class="chip" id="sbNeg" aria-pressed="false">Negative (not)</button><button class="chip" id="sbPast" aria-pressed="false">Past tense</button></div></div>
     <div class="row"><button class="btn ghost sm" id="sbRand">Random sentence</button></div>
   </div><div class="out" id="sbOut"></div></div>
  ${H3('negative','Saying no: "not" is a verb','ne')}
  <div class="grid wide"><div class="tbl"><table><thead><tr><th>Who</th><th>Not</th><th>Example</th><th class="t-ne">Nepali</th></tr></thead><tbody>${PRON.map((p,i)=>`<tr><td class="mut">${p[0]}</td><td><b class="fi">${NEG[i]}</b></td><td class="fi">${p[0]} ${NEG[i]} puhu</td><td class="ne t-ne">${NE_SUBJ[i]} बोल्${NE_NEG[i]}</td></tr>`).join('')}</tbody></table></div>
   <div class="stack"><div class="note"><span class="lbl">Recipe</span>1. Take the minä form: <b>puhun</b>. 2. Remove -n: <b>puhu</b>. 3. Put the right "not" in front: <b>en puhu, et puhu, ei puhu</b>. The main verb never changes.</div><div class="note warn"><span class="lbl">Don't forget</span>Negative sentences take the partitive: Minulla on auto → Minulla ei ole <b>autoa</b>. Juon kahvia → En juo kahvia.</div></div></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="neg">Practise: make it negative</button></div>
  ${H3('infinitive','Verb + verb: haluan, voin, osaan, täytyy','verb')}
  <p class="lede">The second verb stays in the dictionary form, exactly like English "I want <i>to eat</i>" and Nepali "म खान चाहन्छु".</p>
  <div class="grid wide">${INF_CHUNKS.map(c=>`<div class="card">${lineHTML(c[0],c[1],c[2])}</div>`).join('')}</div>
  <div class="note" style="margin-top:12px"><span class="lbl">täytyy and pitää</span>"Must" works like Nepali "मैले … पर्छ": the person is in the genitive. <span class="fi">Minun täytyy mennä</span> = मैले जानुपर्छ. Spoken: <span class="sp-c">Mun pitää mennä.</span></div>
  ${H3('imperative','Commands and polite requests','verb')}
  <div class="grid wide"><div class="note"><span class="lbl">Recipe</span>Command to one person = <b>minä form without -n</b>: puhun → <b>Puhu!</b>, tulen → <b>Tule!</b>. Don't: <b>Älä</b> + the same: <b>Älä mene!</b> To several people or politely: <b>-kaa / -kää</b>: Tulkaa! Istukaa!</div><div class="note"><span class="lbl">Softer</span>Finns often ask instead of commanding: <span class="fi">Voisitko avata ikkunan?</span> (Could you open the window?) See the Questions lab for polite forms.</div></div>
  <div class="tbl" style="margin-top:12px"><table><thead><tr><th>Verb</th><th>Do!</th><th>Don't!</th><th>Plural / polite</th><th class="t-en">English</th><th class="t-ne">Nepali</th></tr></thead><tbody>${IMPER.map(r=>`<tr><td class="mut">${r[0]}</td><td><b class="fi">${r[1]}</b> ${spk(r[1])}</td><td class="fi">${r[2]}</td><td class="fi">${r[3]}</td><td class="t-en">${r[4]}</td><td class="ne t-ne">${r[5]}</td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="imp">Practise commands</button></div>
  ${H3('past','Past tense (imperfekti): what did you do?','verb')}
  <div class="grid wide">${PAST_RULES.map((r,i)=>`<div class="card"><div class="eyebrow">Rule ${i+1}</div><h4>${esc(r[0])}</h4><p class="fi mono" style="margin:4px 0">${esc(r[1])}</p><p class="mut" style="margin:0;font-size:.92rem">${esc(r[2])}</p></div>`).join('')}</div>
  <div class="builder" style="margin-top:14px"><div class="stack"><div class="grp-label">Pick a verb</div><select id="pastSel" aria-label="Verb for past tense">${VERBS.map(v=>`<option value="${v.fi}">${v.fi} · ${v.en}</option>`).join('')}</select>
   <div class="note"><span class="lbl">"I didn't" (negative past)</span>en / et / ei + <b>-nut / -nyt</b>: en puhunut, en mennyt, en syönyt. Plural: emme / ette / eivät + <b>-neet</b>: emme menneet.</div>
   <div class="card"><div class="grp-label">Past time words</div>${PAST_TIME.map(t=>`<div class="row" style="gap:6px;flex-wrap:nowrap">${spk(t[0])}<span class="fi">${t[0]}</span> <span class="mut t-en">${t[1]}</span> <span class="ne t-ne">${t[2]}</span></div>`).join('')}</div></div>
   <div class="out" id="pastOut"></div></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="past">Practise the past tense</button><button class="btn ghost sm" data-go="cards" data-deck="pa:all">Past tense flashcards</button></div>
  ${H3('spoken','Spoken verbs (puhekieli)','sp')}
  <p class="lede">Two big changes: <b>me</b> uses the passive (<span class="sp-c">me mennään</span>) and <b>they</b> uses the he / she form (<span class="sp-c">ne menee</span>). A few short verbs shrink: <span class="sp-c">oon, tuun, meen</span>.</p>
  <div class="tbl"><table><thead><tr><th>Verb</th>${['mä','sä','se','me','te','ne'].map(x=>`<th class="sp-h">${x}</th>`).join('')}</tr></thead><tbody>${Object.entries(SPOKEN_VERBS).map(([k,f])=>`<tr><td class="fi"><b>${k}</b></td>${f.map(x=>`<td class="sp-c">${x.split(' ')[1]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  ${H3('vlist','All verbs','verb')}
  <div class="row" style="margin-bottom:10px"><input type="search" id="vSearch" placeholder="Search: eat, syödä, खानु" aria-label="Search verbs"></div>
  <div class="chips" id="vfChips">${[['all','All'],['1','Type 1'],['2','Type 2'],['3','Type 3'],['4','Type 4'],['56','Types 5–6'],['kpt','KPT only']].map(([k,l])=>`<button class="chip" data-vt="${k}">${l}</button>`).join('')}</div>
  <div class="stack" id="vList" style="gap:8px"></div>`;
  $('#sbP').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b){SB.p=+b.dataset.p;renderSB()}});
  const sel=$('#sbV');sel.value=SB.v;sel.addEventListener('change',()=>{SB.v=+sel.value;renderSB()});
  $('#sbNeg').addEventListener('click',()=>{SB.neg=!SB.neg;renderSB()});$('#sbPast').addEventListener('click',()=>{SB.past=!SB.past;renderSB()});
  $('#sbRand').addEventListener('click',()=>{SB.p=rnd(0,5);SB.v=rnd(0,BV.length-1);SB.neg=Math.random()<.3;SB.past=Math.random()<.3;sel.value=SB.v;renderSB()});
  renderSB();
  $('#pastSel').value='mennä';$('#pastSel').addEventListener('change',renderPastTable);renderPastTable();
  $('#vfChips').addEventListener('click',e=>{const b=e.target.closest('[data-vt]');if(b){VF.t=b.dataset.vt;renderVerbList()}});
  $('#vSearch').addEventListener('input',e=>{VF.q=e.target.value;renderVerbList()});
  renderVerbList();
};
