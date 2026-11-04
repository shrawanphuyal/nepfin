// ================= GRAMMAR LESSONS TAB =================
// forms of common words: [nom, gen, part, ill, pl nom, pl part, en, ne]
const FORMS40=[
['talo','talon','taloa','taloon','talot','taloja','house','घर'],['auto','auton','autoa','autoon','autot','autoja','car','गाडी'],
['kirja','kirjan','kirjaa','kirjaan','kirjat','kirjoja','book','किताब'],['koulu','koulun','koulua','kouluun','koulut','kouluja','school','विद्यालय'],
['kauppa','kaupan','kauppaa','kauppaan','kaupat','kauppoja','shop','पसल'],['pöytä','pöydän','pöytää','pöytään','pöydät','pöytiä','table','टेबल'],
['katu','kadun','katua','katuun','kadut','katuja','street','सडक'],['päivä','päivän','päivää','päivään','päivät','päiviä','day','दिन'],
['koira','koiran','koiraa','koiraan','koirat','koiria','dog','कुकुर'],['kissa','kissan','kissaa','kissaan','kissat','kissoja','cat','बिरालो'],
['omena','omenan','omenaa','omenaan','omenat','omenoita','apple','स्याउ'],['kala','kalan','kalaa','kalaan','kalat','kaloja','fish','माछा'],
['leipä','leivän','leipää','leipään','leivät','leipiä','bread','रोटी'],['kahvi','kahvin','kahvia','kahviin','kahvit','kahveja','coffee','कफी'],
['bussi','bussin','bussia','bussiin','bussit','busseja','bus','बस'],['pankki','pankin','pankkia','pankkiin','pankit','pankkeja','bank','बैंक'],
['kaupunki','kaupungin','kaupunkia','kaupunkiin','kaupungit','kaupunkeja','city','शहर'],['tyttö','tytön','tyttöä','tyttöön','tytöt','tyttöjä','girl','केटी'],
['poika','pojan','poikaa','poikaan','pojat','poikia','boy, son','केटा'],['äiti','äidin','äitiä','äitiin','äidit','äitejä','mother','आमा'],
['ystävä','ystävän','ystävää','ystävään','ystävät','ystäviä','friend','साथी'],['kenkä','kengän','kenkää','kenkään','kengät','kenkiä','shoe','जुत्ता'],
['huone','huoneen','huonetta','huoneeseen','huoneet','huoneita','room','कोठा'],['perhe','perheen','perhettä','perheeseen','perheet','perheitä','family','परिवार'],
['kirje','kirjeen','kirjettä','kirjeeseen','kirjeet','kirjeitä','letter','चिठी'],['maa','maan','maata','maahan','maat','maita','country, land','देश'],
['tee','teen','teetä','teehen','teet','teitä','tea','चिया'],['työ','työn','työtä','työhön','työt','töitä','work','काम'],
['yö','yön','yötä','yöhön','yöt','öitä','night','रात'],['vesi','veden','vettä','veteen','vedet','vesiä','water','पानी'],
['käsi','käden','kättä','käteen','kädet','käsiä','hand','हात'],['lapsi','lapsen','lasta','lapseen','lapset','lapsia','child','बच्चा'],
['vuosi','vuoden','vuotta','vuoteen','vuodet','vuosia','year','वर्ष'],['uusi','uuden','uutta','uuteen','uudet','uusia','new','नयाँ'],
['nimi','nimen','nimeä','nimeen','nimet','nimiä','name','नाम'],['järvi','järven','järveä','järveen','järvet','järviä','lake','ताल'],
['kieli','kielen','kieltä','kieleen','kielet','kieliä','language','भाषा'],['nainen','naisen','naista','naiseen','naiset','naisia','woman','महिला'],
['ihminen','ihmisen','ihmistä','ihmiseen','ihmiset','ihmisiä','person','मानिस'],['puhelin','puhelimen','puhelinta','puhelimeen','puhelimet','puhelimia','phone','फोन'],
['avain','avaimen','avainta','avaimeen','avaimet','avaimia','key','साँचो'],['kysymys','kysymyksen','kysymystä','kysymykseen','kysymykset','kysymyksiä','question','प्रश्न'],
['mies','miehen','miestä','mieheen','miehet','miehiä','man','पुरुष'],['Suomi','Suomen','Suomea','Suomeen','','','Finland','फिनल्यान्ड'],
['Helsinki','Helsingin','Helsinkiä','Helsinkiin','','','Helsinki','हेल्सिंकी']];
const FORM_COL={gen:[1,'Genitive (-n)','gen'],part:[2,'Partitive','par'],ill:[3,'Illative (into)','in'],plnom:[4,'Plural (-t)','nom'],plpart:[5,'Plural partitive','par']};
const TOPIC_COLOR={part:'par',gen:'gen',loc:'in'};
// buttons under each lesson: [label, tab, data-key, value]
const TOPIC_LINKS={
sounds:[['Spelling practice','practice','ex','spell'],['Method & sounds','tips','anchor','pron']],
olla:[['olla table','verbs','anchor','olla'],['Practise verb forms','practice','ex','verbs']],
puhe:[['Spoken Finnish page','puhe'],['Flashcards: spoken pairs','cards','deck','sp:all']],
vtypes:[['All verbs','verbs','anchor','vlist'],['Practise verb forms','practice','ex','verbs'],['Flashcards: type 1','cards','deck','v:1']],
neg:[['Practise: make it negative','practice','ex','neg']],
kpt:[['KPT table','verbs','anchor','kpt'],['KPT flashcards','cards','deck','v:kpt']],
order:[['Questions lab','questions'],['Word order practice','practice','ex','order']],
partitive:[['40 partitive sentences','practice','ex','par'],['Partitive check tool','cases','anchor','partcheck'],['Flashcards: 3 forms','cards','deck','pt:all']],
genitive:[['Practise the genitive','practice','ex','gen'],['Flashcards: place words','cards','deck','pp:all']],
local:[['Practise location endings','practice','ex','loc'],['Word builder','cases','anchor','six']],
illative:[['Practise the illative','practice','ex','ill']],
have:[['Practise location endings','practice','ex','loc']],
time:[['Clock practice','practice','ex','clock'],['Numbers and time','numbers','anchor','clock'],['WHEN questions','questions','anchor','q-when']],
adj:[['Flashcards: opposites','cards','deck','n:opposites'],['Colours','vocab','cat','colours']],
chains:[['Verb + verb','verbs','anchor','infinitive'],['Translate sentences','practice','ex','tr']],
plural:[['Partitive practice','practice','ex','par']],
likes:[['Verb + case practice','practice','ex','rek'],['Flashcards: verb + case','cards','deck','rk:all']],
work:[['Job words','vocab','cat','jobs'],['Verb + case practice','practice','ex','rek']],
poss:[['Genitive practice','practice','ex','gen']],
object:[['Object practice','practice','ex','obj']],
imper:[['Commands practice','practice','ex','imp'],['Flashcards: commands','cards','deck','im:all']],
past:[['Past tense practice','practice','ex','past'],['Flashcards: past tense','cards','deck','pa:all'],['Past tense table','verbs','anchor','past']]
};
function stripMd(s){return String(s||'').replace(/\[\[|\]\]|\{\{|\}\}|==|\*\*|`/g,'')}
function md(s){let h=esc(s);
  h=h.replace(/\[\[(.+?)\]\]/g,(m,x)=>{const plain=x.replace(/==|\*\*|`/g,'').replace(/\s*→\s*/g,', ');return `<span class="fiw" data-say="${plain}" role="button" tabindex="0">${x}</span>`});
  h=h.replace(/\{\{(.+?)\}\}/g,'<span class="spw">$1</span>');
  h=h.replace(/==(.+?)==/g,'<mark class="hl">$1</mark>');
  h=h.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  h=h.replace(/`(.+?)`/g,'<span class="end">$1</span>');
  return h}
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('fiw')){e.preventDefault();sayNow(e.target.dataset.say)}});
const gOrder=()=>GRAMMAR_ORDER.map(id=>GRAMMAR.find(g=>g.id===id)).filter(Boolean);
const gDone=id=>sget('gdone:'+id,false);
function gBlock(b,k,ti){
  const H=b.h?`<h4 class="gh">${md(b.h)}</h4>`:'';
  if(b.t==='rule')return `<div class="card grule">${H}<p style="margin:0">${md(b.en)}</p>${b.ne?`<p class="ne t-ne" style="margin:6px 0 0">${md(b.ne)}</p>`:''}</div>`;
  if(b.t==='table')return `<div>${H}<div class="tbl"><table><thead><tr>${b.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  if(b.t==='ex')return `<div class="card">${H}<div class="stack" style="gap:8px">${b.items.map(it=>{const fi=it[0],sp=it[3];return `<div class="li">${spk(stripMd(fi))}<div class="lt"><div class="lfi">${md(fi)}</div>${sp&&sp!==fi?`<div class="lsp t-sp">🗣 ${md(sp)}</div>`:''}${it[1]?`<div class="len t-en">${md(it[1])}</div>`:''}${it[2]?`<div class="lne t-ne">${md(it[2])}</div>`:''}</div></div>`}).join('')}</div></div>`;
  if(b.t==='tricks')return `<div class="card gtricks">${H||'<h4 class="gh">Tricks</h4>'}${b.items.map(it=>`<div class="gtip"><span aria-hidden="true">💡</span><div>${md(it[0])}${it[1]?`<div class="ne t-ne">${md(it[1])}</div>`:''}</div></div>`).join('')}</div>`;
  if(b.t==='steps')return `<div class="card">${H}<ol class="gsteps">${b.items.map(it=>`<li><div>${md(it[0])}</div>${it[1]?`<div class="ne t-ne">${md(it[1])}</div>`:''}</li>`).join('')}</ol></div>`;
  if(b.t==='cards')return `<div>${H}<div class="grid wide">${b.items.map(it=>`<div class="card"><h4 style="margin:0 0 4px">${md(it[0])}</h4><p style="margin:0">${md(it[1])}</p>${it[2]?`<p class="ne t-ne" style="margin:4px 0 0">${md(it[2])}</p>`:''}${it[3]&&it[3].length?`<div class="pairs" style="margin-top:8px">${it[3].map(x=>`<span class="pair fiw" data-say="${esc(stripMd(x).replace(/\s*→\s*/g,', '))}" role="button" tabindex="0">${md(x)}</span>`).join('')}</div>`:''}</div>`).join('')}</div></div>`;
  if(b.t==='forms'){const c=FORM_COL[b.col]||FORM_COL.gen;const rows=FORMS40.filter(r=>r[c[0]]).slice(0,b.n||40);
    return `<div>${H}<p class="mut" style="margin:0 0 8px;font-size:.9rem">Tap a word to hear it. Cover the coloured column and test yourself.</p><div class="tbl"><table><thead><tr><th>Basic</th><th class="c-${c[2]}">${c[1]}</th><th class="t-en">English</th><th class="t-ne">Nepali</th></tr></thead><tbody>${rows.map(r=>`<tr><td><span class="fiw" data-say="${esc(r[0]+', '+r[c[0]])}" role="button" tabindex="0">${esc(r[0])}</span></td><td class="c-${c[2]}"><b>${esc(r[c[0]])}</b></td><td class="t-en mut">${esc(r[6])}</td><td class="ne t-ne">${esc(r[7])}</td></tr>`).join('')}</tbody></table></div></div>`}
  if(b.t==='check')return `<div class="card gcheck">${H||'<h4 class="gh">Quick check</h4>'}<p class="mut" style="margin:0 0 8px;font-size:.9rem">Write the answer, then press Check.</p>${b.items.map((it,i)=>{const id=`gc-${ti}-${k}-${i}`;return `<div class="gcrow" data-ans="${esc(stripMd(it[1]))}"><label for="${id}">${md(it[0])}</label><div class="row" style="gap:6px;flex-wrap:nowrap"><input id="${id}" type="text" autocomplete="off" spellcheck="false"><button class="btn sm ghost" data-gc="${id}">Check</button></div><div class="gcres"></div></div>`}).join('')}</div>`;
  return '';
}
let curG=sget('gcur','sounds');
function openTopic(id){
  const list=gOrder();const i=Math.max(0,list.findIndex(g=>g.id===id));const g=list[i];curG=g.id;sset('gcur',g.id);
  const col=TOPIC_COLOR[g.color]||lvlKey(g.lvl);
  $$('#gList [data-gt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.gt===g.id)));
  const links=(TOPIC_LINKS[g.id]||[]).map(([l,t,k,v])=>`<button class="btn sm ${k?'ghost':'pri'}" data-go="${t}"${k?` data-${k}="${v}"`:''}>${esc(l)}</button>`).join('');
  $('#gView').innerHTML=`<div class="ghead k-soft-${col}"><div style="font-size:2.6rem;line-height:1">${g.e}</div><div style="min-width:0">
    <div class="row" style="gap:6px">${tag('Lesson '+(i+1)+' / '+list.length,'nom')}${tag(g.lvl,lvlKey(g.lvl))}</div>
    <h3 style="margin:6px 0 2px">${esc(g.fi)}</h3><div style="font-weight:600">${esc(g.en)}</div><div class="ne t-ne">${esc(g.ne)}</div></div></div>
    <div class="note" style="margin:12px 0"><p style="margin:0">${md(g.intro[0])}</p>${g.intro[1]?`<p class="ne t-ne" style="margin:6px 0 0">${md(g.intro[1])}</p>`:''}</div>
    <div class="stack gblocks">${g.blocks.map((b,k)=>gBlock(b,k,i)).join('')}</div>
    <div class="card" style="margin-top:14px"><div class="grp-label">Practise this lesson</div><div class="row">${links}<button class="btn sm ghost" data-go="practice" data-ex="mixed">Mixed exercise</button></div>
     <label class="cando" style="margin-top:10px"><input type="checkbox" id="gDoneBox" ${gDone(g.id)?'checked':''}> I understand this lesson and did the quick check</label></div>
    <div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn ghost" id="gPrev" ${i===0?'disabled':''}>← ${i>0?esc(list[i-1].fi):''}</button><button class="btn pri" id="gNext" ${i===list.length-1?'disabled':''}>${i<list.length-1?esc(list[i+1].fi)+' →':'Last lesson'}</button></div>`;
  $('#gPrev').onclick=()=>{if(i>0){openTopic(list[i-1].id);$('#gView').scrollIntoView({block:'start'})}};
  $('#gNext').onclick=()=>{if(i<list.length-1){openTopic(list[i+1].id);$('#gView').scrollIntoView({block:'start'})}};
  $('#gDoneBox').onchange=e=>{sset('gdone:'+g.id,e.target.checked);const t=$(`#gList [data-gt="${g.id}"] .gck`);if(t)t.textContent=e.target.checked?'✓':'';if(e.target.checked)countActivity()};
  $$('#gView .gcheck [data-gc]').forEach(btn=>btn.onclick=()=>{const inp=document.getElementById(btn.dataset.gc);const row=btn.closest('.gcrow');const ans=row.dataset.ans;const r=checkAns(inp.value,ans.split(' / '));
    row.querySelector('.gcres').innerHTML=r.ok?`<span class="okmark">✓ Oikein!</span> ${spk(ans)}`:`<span class="badmark">${r.close?'Almost:':'Answer:'}</span> <b class="fi">${esc(ans)}</b> ${spk(ans)}`;
    row.classList.toggle('good',r.ok);countActivity()});
  $$('#gView .gcheck input').forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();inp.closest('.gcrow').querySelector('[data-gc]').click()}}));
}
RENDER.grammar=()=>{
  const list=gOrder();const lv=['A1.1','A1.2','A1.3'];
  $('#p-grammar').innerHTML=`<p class="eyebrow">Kielioppi · Grammar lessons</p><h2>${list.length} grammar lessons, in course order</h2>
  <p class="lede">The order follows the usual beginner course path (as in Suomen mestari 1): sounds and <i>olla</i> first, then verbs and questions, then the partitive, genitive and location cases, and finally objects, commands and the past tense. Each lesson has the rule, the logic, examples in three languages, spoken Finnish and a quick check. Tap any <span class="fiw" data-say="blue word" role="button" tabindex="0">blue word</span> to hear it.</p>
  <div class="legend">${[['nom','basic form'],['par','partitive'],['gen','genitive'],['in','inside: -ssa -sta -Vn'],['out','surface: -lla -lta -lle'],['ess','-na · -ksi · time'],['verb','verbs'],['sp','🗣 spoken']].map(([k,l])=>tag(l,k)).join('')}</div>
  <div class="glevels" id="gList">${lv.map(L=>`<div><div class="grp-label">${L} · ${esc(LEVELS.find(x=>x[0]===L)[1])}</div><div class="stack" style="gap:6px">${list.map((g,i)=>[g,i]).filter(([g])=>g.lvl===L).map(([g,i])=>`<button class="gtile k-soft-${lvlKey(L)}" data-gt="${g.id}" aria-pressed="false"><span class="mono mut">${i+1}</span><span style="font-size:1.2rem">${g.e}</span><span class="gtt"><b>${esc(g.fi)}</b><span class="mut">${esc(g.en)}</span></span><span class="gck">${gDone(g.id)?'✓':''}</span></button>`).join('')}</div></div>`).join('')}</div>
  <div id="gView" class="gview"></div>`;
  $('#gList').addEventListener('click',e=>{const b=e.target.closest('[data-gt]');if(b){openTopic(b.dataset.gt);$('#gView').scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})}});
  openTopic(curG);
};
