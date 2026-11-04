// ================= k-p-t-vaihtelu (consonant gradation) =================
// type: [key, strong, weak, title, nepali note, examples [[base, ending, result, en, ne]], verb examples [[verb, minä, hän, en]]]
const KPT_TYPES=[
['kk','kk','k','Double k → single k','दोहोरो k एउटा हुन्छ',[
['Afrikka','sta','Afrikasta','from Africa','अफ्रिकाबाट'],['pankki','ssa','pankissa','in the bank','बैंकमा'],['Turkki','ssa','Turkissa','in Turkey','टर्कीमा'],
['viikko','lla','viikolla','during the week','हप्तामा'],['kirkko','ssa','kirkossa','in the church','चर्चमा'],['pysäkki','llä','pysäkillä','at the bus stop','बिसौनीमा'],
['apteekki','ssa','apteekissa','in the pharmacy','औषधि पसलमा'],['penkki','llä','penkillä','on the bench','बेन्चमा'],['kukka','t','kukat','flowers','फूलहरू'],['Amerikka','n','Amerikan','of America','अमेरिकाको']],
[['nukkua','nukun','nukkuu','to sleep'],['leikkiä','leikin','leikkii','to play']]],
['pp','pp','p','Double p → single p','दोहोरो p एउटा हुन्छ',[
['Eurooppa','ssa','Euroopassa','in Europe','युरोपमा'],['kauppa','ssa','kaupassa','in the shop','पसलमा'],['kaappi','ssa','kaapissa','in the cupboard','दराजमा'],
['Lappi','ssa','Lapissa','in Lapland','ल्यापल्यान्डमा'],['lamppu','ssa','lampussa','in the lamp','बत्तीमा'],['kuppi','t','kupit','cups','कपहरू'],
['lippu','n','lipun','of the ticket','टिकटको'],['loppu','ssa','lopussa','at the end','अन्त्यमा']],
[['oppia','opin','oppii','to learn'],['hyppiä','hypin','hyppii','to hop, jump about']]],
['tt','tt','t','Double t → single t','दोहोरो t एउटा हुन्छ',[
['konsertti','n','konsertin','of the concert','कन्सर्टको'],['tomaatti','t','tomaatit','tomatoes','गोलभेडाहरू'],['kortti','sta','kortista','from the card','कार्डबाट'],
['planeetta','lla','planeetalla','on the planet','ग्रहमा'],['tyttö','n','tytön','the girl\'s','केटीको'],['lotto','n','loton','of the lottery','लटरीको'],
['jogurtti','t','jogurtit','yoghurts','दहीहरू'],['matto','lla','matolla','on the rug','गलैंचामा']],
[['ottaa','otan','ottaa','to take'],['odottaa','odotan','odottaa','to wait']]],
['k','k','–','Single k disappears','एउटा k हराउँछ',[
['Turku','ssa','Turussa','in Turku','टुर्कुमा'],['ruoka','sta','ruoasta','from / about the food','खानाबाट'],['tauko','lla','tauolla','on a break','विश्राममा'],
['sika','t','siat','pigs','सुँगुरहरू'],['jalka','t','jalat','legs, feet','खुट्टाहरू'],['selkä','ssä','selässä','on the back','ढाडमा'],
['märkä','lle','märälle','onto the wet (one)','भिजेकोमा'],['reikä','ssä','reiässä','in the hole','प्वालमा']],
[['lukea','luen','lukee','to read'],['hakea','haen','hakee','to fetch']]],
['p','p','v','Single p → v','एउटा p, v हुन्छ',[
['leipä','llä','leivällä','on the bread','रोटीमा'],['apu','lla','avulla','with the help','सहयोगले'],['tapa','t','tavat','habits, ways','बानीहरू'],
['halpa','n','halvan','of the cheap (one)','सस्तोको'],['arpa','lla','arvalla','by lottery ticket','चिट्ठाद्वारा'],['kylpy','ssä','kylvyssä','in the bath','नुहाउने टबमा']],
[['sopia','sovin','sopii','to suit, agree'],['kylpeä','kylven','kylpee','to bathe']]],
['t','t','d','Single t → d','एउटा t, d हुन्छ',[
['katu','lla','kadulla','on the street','सडकमा'],['pöytä','ltä','pöydältä','from the table','टेबलबाट'],['koti','t','kodit','homes','घरहरू'],
['maito','ssa','maidossa','in the milk','दूधमा'],['paita','sta','paidasta','from the shirt','सर्टबाट'],['äiti','n','äidin','mother\'s','आमाको'],['satu','n','sadun','of the fairy tale','कथाको']],
[['tietää','tiedän','tietää','to know'],['pitää','pidän','pitää','to like']]],
['nk','nk','ng','nk → ng','nk, ng हुन्छ',[
['Helsinki','ssä','Helsingissä','in Helsinki','हेल्सिंकीमा'],['kaupunki','ssa','kaupungissa','in the city','शहरमा'],['kenkä','ssä','kengässä','in the shoe','जुत्तामा'],
['aurinko','n','auringon','of the sun','सूर्यको'],['sänky','t','sängyt','beds','ओछ्यानहरू'],['vanki','t','vangit','prisoners','कैदीहरू'],['Hanko','ssa','Hangossa','in Hanko (town)','हान्कोमा']],
[['tunkea','tungen','tunkee','to push in']]],
['nt','nt','nn','nt → nn','nt, nn हुन्छ',[
['Hollanti','n','Hollannin','of Holland','हल्यान्डको'],['Islanti','sta','Islannista','from Iceland','आइसल्यान्डबाट'],['Irlanti','sta','Irlannista','from Ireland','आयरल्यान्डबाट'],
['Englanti','ssa','Englannissa','in England','इङ्ल्यान्डमा'],['ranta','lle','rannalle','to the beach','किनारतिर'],['tunti','t','tunnit','hours, lessons','घण्टाहरू'],
['sekunti','t','sekunnit','seconds','सेकेन्डहरू'],['lintu','n','linnun','of the bird','चराको']],
[['antaa','annan','antaa','to give'],['tuntea','tunnen','tuntee','to know (a person)']]],
['mp','mp','mm','mp → mm','mp, mm हुन्छ',[
['rumpu','n','rummun','of the drum','ड्रमको'],['kampa','t','kammat','combs','काइयोहरू'],['rampa','t','rammat','lame ones','लङ्गडाहरू'],
['lampi','ssa','lammessa','in the pond','पोखरीमा'],['kumpi','n','kumman','which one\'s (of two)','कुनको']],
[['ampua','ammun','ampuu','to shoot']]],
['lt','lt','ll','lt → ll','lt, ll हुन्छ',[
['ilta','lla','illalla','in the evening','बेलुका'],['silta','lla','sillalla','on the bridge','पुलमा'],['multa','ssa','mullassa','in the soil','माटोमा'],
['kulta','n','kullan','of gold, darling\'s','सुनको'],['Itävalta','ssa','Itävallassa','in Austria','अस्ट्रियामा'],['aalto','t','aallot','waves','छालहरू']],
[['kieltää','kiellän','kieltää','to forbid']]],
['rt','rt','rr','rt → rr','rt, rr हुन्छ',[
['parta','n','parran','of the beard','दाह्रीको'],['kerta','lla','kerralla','at one time, at once','एकै पटकमा'],['yläkerta','ssa','yläkerrassa','upstairs','माथिल्लो तलामा'],
['alakerta','ssa','alakerrassa','downstairs','तल्लो तलामा'],['virta','n','virran','of the stream','धाराको']],
[['kertoa','kerron','kertoo','to tell'],['ymmärtää','ymmärrän','ymmärtää','to understand']]],
['ht','ht','hd','ht → hd','ht, hd हुन्छ',[
['lahti','ssa','lahdessa','in the bay','खाडीमा'],['lehti','n','lehden','of the newspaper / leaf','पत्रिकाको'],['vahti','n','vahdin','of the guard','पहरेदारको']],
[['lähteä','lähden','lähtee','to leave'],['vaihtaa','vaihdan','vaihtaa','to change']]]
];
// rarer k changes, good to recognise
const KPT_SPECIAL=[
['k → j (after l, r or h + e, and in aika / poika)',[['aika','n','ajan','of the time','समयको'],['poika','n','pojan','the boy\'s','केटाको'],['kylki','n','kyljen','of the side (body)','कोखाको'],['järki','n','järjen','of reason','बुद्धिको']]],
['k → v (between two u or y)',[['puku','n','puvun','of the suit','सुटको'],['suku','n','suvun','of the family','कुलको'],['luku','n','luvun','of the chapter / number','अध्यायको']]]];
// no change at all
const KPT_NONE=[
['hk, sk, st, tk','These pairs never change.','यी जोडी कहिल्यै फेरिँदैनन्।',[['posti','ssa','postissa','at the post office','हुलाकमा'],['lista','lla','listalla','on the list','सूचीमा'],['kirjasto','ssa','kirjastossa','in the library','पुस्तकालयमा'],['tasku','ssa','taskussa','in the pocket','खल्तीमा'],['lasku','t','laskut','bills','बिलहरू'],['matka','lla','matkalla','on the trip','यात्रामा'],['retki','llä','retkellä','on an excursion','भ्रमणमा'],['vihko','ssa','vihkossa','in the notebook','कापीमा']]],
['Two vowels at the end','If the word ends in two vowels, there is nothing to change.','अन्त्यमा दुई स्वर भए केही फेरिँदैन।',[['vapaa','ssa','vapaassa','in the free (one)','खालीमा'],['keittiö','ssä','keittiössä','in the kitchen','भान्सामा'],['radio','ssa','radiossa','on the radio','रेडियोमा'],['museo','ssa','museossa','in the museum','संग्रहालयमा']]],
['No k, p or t before the last vowel','Most words have nothing to change: talo → talossa, koulu → koulussa.','धेरै शब्दमा फेर्नुपर्ने केही हुँदैन।',[['talo','ssa','talossa','in the house','घरमा'],['koulu','ssa','koulussa','at school','विद्यालयमा'],['Nepal','ista','Nepalista','from Nepal','नेपालबाट'],['sauna','ssa','saunassa','in the sauna','सौनामा']]]];
const KPT_WEAK=[['-n','genitive (of, \'s)','pankin'],['-t','plural','kaupat'],['-ssa / -ssä','in','Turussa'],['-sta / -stä','from (inside)','Afrikasta'],['-lla / -llä','on, at','kadulla'],['-lta / -ltä','from (surface)','pöydältä'],['-lle','to, onto','rannalle'],['-ksi','becoming, in a language','englanniksi'],['minä, sinä, me, te','verb persons','minä nukun'],['en, et, ei …','negative verb','hän ei nuku']];
const KPT_STRONG=[['basic form','nominative','kauppa'],['-a / -ta','partitive','kauppaa'],['-Vn / -hVn','illative (into)','kauppaan'],['-na / -nä','essive (as)','maanantaina'],['hän, he','verb persons','hän nukkuu, he nukkuvat']];
// all noun examples flattened: [base, end, result, en, ne, key, strong, weak]
const KPT_ALL=[...KPT_TYPES.flatMap(t=>t[5].map(e=>[...e,t[0],t[1],t[2]])),...KPT_SPECIAL.flatMap((s,i)=>s[1].map(e=>[...e,i?'kv':'kj',i?'k':'k',i?'v':'j']))];
function kptHL(base,res,strong,weak){
  const i=base.lastIndexOf(strong);if(i<0)return [esc(base),esc(res)];
  const b=esc(base.slice(0,i))+`<span class="kS">${esc(strong)}</span>`+esc(base.slice(i+strong.length));
  let r=esc(res);if(weak&&weak!=='–'&&res.substr(i,weak.length)===weak)r=esc(res.slice(0,i))+`<span class="kW">${esc(weak)}</span>`+esc(res.slice(i+weak.length));
  else if(weak==='–'&&res.slice(0,i)===base.slice(0,i))r=esc(res.slice(0,i))+`<span class="kW kgap">·</span>`+esc(res.slice(i));
  return [b,r]}
function kptRow(e,strong,weak){const [b,r]=kptHL(e[0],e[2],strong,weak);
  return `<div class="kprow"><span class="kpb">${b}</span><span class="kpe">+ ${esc(e[1])}</span><span class="kpa">→</span><span class="kpr">${r}</span>${spk(e[0]+', '+e[2])}<span class="kpm"><span class="t-en">${esc(e[3])}</span> <span class="ne t-ne">${esc(e[4])}</span></span></div>`}
const KPT_EN_KEY={kk:'kk → k',pp:'pp → p',tt:'tt → t',k:'k → –',p:'p → v',t:'t → d',nk:'nk → ng',nt:'nt → nn',mp:'mp → mm',lt:'lt → ll',rt:'rt → rr',ht:'ht → hd',kj:'k → j',kv:'k → v',none:'no change'};
function kptWhy(key,end){if(key==='none')return 'No change: hk, sk, st, tk and two vowels at the end never change.';
  const closes=/^(n|t|ssa|ssä|sta|stä|lla|llä|lta|ltä|lle|ksi)$/.test(end);
  return `<b>${KPT_EN_KEY[key]}</b>. ${closes?`The ending <span class="end">-${esc(end)}</span> starts with a consonant, so it closes the syllable → <b>weak</b>.`:'This ending keeps it strong.'}`}
RENDER.kpt=()=>{
  const total=KPT_ALL.length+KPT_NONE.reduce((a,x)=>a+x[3].length,0);
  $('#p-kpt').innerHTML=`<p class="eyebrow">k-p-t-vaihtelu · Consonant gradation</p><h2>KPT: strong ↔ weak (vahva ↔ heikko)</h2>
  <p class="lede">When you add an ending, <b>k, p</b> and <b>t</b> in the last syllable often become "weaker". <span class="fi">Turku + ssa → Turussa</span>, <span class="fi">katu + lla → kadulla</span>. This page has ${total} examples with the logic, English and Nepali meanings, and audio.</p>
  <div class="note warn" style="margin-bottom:12px"><span class="lbl">नेपालीमा</span><span class="ne">नेपालीमा यस्तो नियम छैन। शब्दमा अन्त्य (pääte) थप्दा अन्तिम अक्षर बन्द भयो भने k, p, t "कमजोर" हुन्छन्: kk → k, pp → p, tt → t, k → हराउँछ, p → v, t → d।</span></div>
  ${jumpNav([['klogic','The logic'],['ktable','All 12 types'],['kwhen','When weak / strong'],['knone','No change'],['kspecial','Special k'],['kverbs','KPT in verbs'],['kreverse','Reverse KPT'],['kpractice','Practice']])}
  ${H3('klogic','The logic in one picture','ess')}
  <div class="grid wide">
   <div class="card"><div class="eyebrow">Step by step</div>
    <div class="kstep"><span class="kn">1</span><div>Take the word and the ending: <b class="fi">kauppa</b> + <span class="end">-ssa</span></div></div>
    <div class="kstep"><span class="kn">2</span><div>Split it into syllables: <span class="mono">kaup·pa</span> → with the ending <span class="mono">kau·<u>pas</u>·sa</span></div></div>
    <div class="kstep"><span class="kn">3</span><div>The syllable <span class="mono"><u>pas</u></span> now ends in a consonant (s). A <b>closed</b> syllable makes k, p, t <b>weak</b>: <span class="kS">pp</span> → <span class="kW">p</span></div></div>
    <div class="kstep"><span class="kn">4</span><div>Result: <b class="fi">kaupassa</b> ${spk('kaupassa')} (in the shop)</div></div></div>
   <div class="card"><div class="eyebrow">Compare: same word, different ending</div>
    ${[['kauppa','basic form','strong'],['kauppaa','partitive -a (open)','strong'],['kauppaan','illative -an (into)','strong'],['kaupan','genitive -n (closed)','weak'],['kaupassa','-ssa (closed)','weak'],['kaupat','plural -t (closed)','weak']].map(([w,d,s])=>`<div class="row" style="gap:8px;flex-wrap:nowrap;margin-top:6px">${spk(w)}<b class="fi" style="min-width:6.5em">${w}</b><span class="mut" style="font-size:.88rem">${d}</span><span class="tag k-${s==='weak'?'in':'par'}" style="margin-left:auto">${s}</span></div>`).join('')}</div>
   <div class="card k-soft-ess"><div class="eyebrow">Memory trick</div><h4 class="fi" style="font-size:1.15rem">"A consonant after it = soft."</h4>
    <p style="margin:0">If the ending starts with a consonant (<span class="mono">n, t, ss, st, ll, lt, ks</span>), the k / p / t goes soft. If the ending starts with a vowel (<span class="mono">-a, -an</span>), it stays strong.</p>
    <p class="ne t-ne" style="margin:6px 0 0">अन्त्य व्यञ्जनबाट सुरु भए नरम, स्वरबाट सुरु भए बलियो।</p></div>
  </div>
  ${H3('ktable','All 12 types: vahva → heikko','ess')}
  <div class="tbl"><table><thead><tr><th>Change</th><th>Word + ending</th><th>Result</th><th>Meaning</th></tr></thead><tbody>${KPT_TYPES.map(t=>{const e=t[5][0];const [b,r]=kptHL(e[0],e[2],t[1],t[2]);return `<tr><td class="mono" style="white-space:nowrap"><b class="kS">${t[1]}</b> → <b class="kW">${t[2]}</b></td><td style="white-space:nowrap">${b} <span class="mono mut">+ ${esc(e[1])}</span></td><td style="white-space:nowrap"><b>${r}</b> ${spk(e[2])}</td><td><span class="t-en mut">${esc(e[3])}</span> <span class="ne t-ne">${esc(e[4])}</span></td></tr>`}).join('')}</tbody></table></div>
  <div class="note" style="margin-top:10px"><span class="lbl">How to read the colours</span><span class="kS">orange = strong</span> in the basic form · <span class="kW">blue = weak</span> in the new form · <span class="kW kgap">·</span> = the k disappeared</div>
  <div class="stack" style="margin-top:14px">${KPT_TYPES.map(t=>`<details class="card kcard" ${t[0]==='kk'?'open':''}><summary><span class="mono kS" style="font-size:1.1rem">${t[1]}</span> → <span class="mono kW" style="font-size:1.1rem">${t[2]}</span> <b>${esc(t[3])}</b> <span class="ne t-ne" style="font-size:.9rem">${esc(t[4])}</span><span class="mut mono" style="font-size:.8rem">${t[5].length} words</span></summary><div class="db">${t[5].map(e=>kptRow(e,t[1],t[2])).join('')}
    <div class="grp-label" style="margin-top:10px">In verbs (minä = weak · hän = strong)</div>${t[6].map(v=>`<div class="row" style="gap:8px;flex-wrap:nowrap;margin-top:4px">${spk('minä '+v[1]+', hän '+v[2])}<span class="fi">${v[0]}</span><span class="mut">→</span><span>minä <b class="kW">${v[1]}</b> · hän <b class="kS">${v[2]}</b></span><span class="mut t-en" style="font-size:.88rem">${esc(v[3])}</span></div>`).join('')}</div></details>`).join('')}</div>
  ${H3('kwhen','When weak, when strong?','in')}
  <div class="grid wide">
   <div class="card k-soft-in"><h4>Weak (heikko) with these</h4>${KPT_WEAK.map(w=>`<div class="row" style="gap:8px;margin-top:4px"><span class="end">${esc(w[0])}</span><span class="mut" style="font-size:.88rem">${esc(w[1])}</span><b class="fi" style="margin-left:auto">${esc(w[2])}</b></div>`).join('')}</div>
   <div class="card k-soft-par"><h4>Strong (vahva) with these</h4>${KPT_STRONG.slice(0,5).map(w=>`<div class="row" style="gap:8px;margin-top:4px"><span class="end">${esc(w[0])}</span><span class="mut" style="font-size:.88rem">${esc(w[1])}</span><b class="fi" style="margin-left:auto">${esc(w[2])}</b></div>`).join('')}
    <p class="mut" style="font-size:.88rem;margin:8px 0 0">Quick test: say the new word. If the syllable with k/p/t now ends in a consonant, choose the weak form.</p></div></div>
  ${H3('knone','No KPT (ei k-p-t-vaihtelua)','nom')}
  <div class="grid wide">${KPT_NONE.map(n=>`<div class="card"><h4>${esc(n[0])}</h4><p class="mut" style="margin:0 0 6px;font-size:.9rem">${esc(n[1])} <span class="ne t-ne">${esc(n[2])}</span></p>${n[3].map(e=>kptRow(e,'','')).join('')}</div>`).join('')}</div>
  ${H3('kspecial','Special k changes (recognise them)','ess')}
  <div class="grid wide">${KPT_SPECIAL.map(s=>`<div class="card"><h4>${esc(s[0])}</h4>${s[1].map(e=>kptRow(e,'k','')).join('')}</div>`).join('')}</div>
  ${H3('kverbs','KPT in verbs: minä, sinä, me, te go soft','verb')}
  <div class="tbl"><table><thead><tr><th>Verb</th><th>Type</th><th>minä (weak)</th><th>hän (strong)</th><th>me (weak)</th><th>he (strong)</th><th class="t-en">English</th></tr></thead><tbody>${KPT_TYPES.flatMap(t=>t[6].map(v=>[t,v])).map(([t,v])=>{const vv=VERBS.find(x=>x.fi===v[0]);return `<tr><td><b class="fi">${v[0]}</b> ${spk(v[0])}</td><td class="mono">${t[1]}→${t[2]}</td><td class="kW"><b>${v[1]}</b></td><td class="kS"><b>${v[2]}</b></td><td>${vv?esc(vv.f[3]):'–'}</td><td>${vv?esc(vv.f[5]):'–'}</td><td class="t-en mut">${esc(v[3])}</td></tr>`}).join('')}</tbody></table></div>
  ${H3('kreverse','Reverse KPT: the basic form is the weak one','gen')}
  <p class="lede">Some words go the other way: the dictionary form is weak and the other forms are strong. You meet these later in A1; just recognise them for now.</p>
  <div class="grid">${[['sade','sateen','rain → of the rain','पानी'],['hammas','hampaan','tooth → of the tooth','दाँत'],['rengas','renkaan','tyre → of the tyre','टायर'],['opas','oppaan','guide → of the guide','गाइड'],['tavata','tapaan','to meet → I meet','भेट्नु'],['pelätä','pelkään','to fear → I fear','डराउनु'],['ajatella','ajattelen','to think → I think','सोच्नु'],['kuunnella','kuuntelen','to listen → I listen','सुन्नु']].map(r=>`<div class="card">${lineHTML(r[0]+' → '+r[1],r[2],r[3])}</div>`).join('')}</div>
  ${H3('kpractice','Practise','ess')}
  <div class="row"><button class="btn pri" data-go="practice" data-ex="kpt">Word + ending (random 10)</button><button class="btn ghost" data-go="practice" data-ex="kptpl">Plurals both ways</button><button class="btn ghost" data-go="homework">Homework 4.11</button><button class="btn ghost" data-go="cards" data-deck="kp:all">Flashcards</button></div>`;
};
// ---------- exercise sets ----------
const kptItem=(base,end,res,en,ne,key,dir)=>({p:`<div class="qprompt"><span class="fi">${esc(base)}</span> <span class="mut">+</span> <span class="end">${esc(end)}</span> = ?</div><div class="t-en mut">${esc(en)}</div><div class="ne t-ne">${esc(ne)}</div>`,a:res.split('|'),say:res.split('|')[0],x:kptWhy(key,end)});
const plItem=(base,pl,key,toBase)=>toBase?{p:`<div class="qprompt">Basic form of <span class="fi">${esc(pl)}</span>?</div><div class="mut">Plural → singular: make the consonant strong again.</div>`,a:[base],say:base,x:`<b>${KPT_EN_KEY[key]||''}</b> backwards: ${esc(pl)} → ${esc(base)}`}
  :{p:`<div class="qprompt"><span class="fi">${esc(base)}</span> <span class="mut">+</span> <span class="end">t</span> = ? <span class="mut" style="font-size:1rem">(plural)</span></div>`,a:[pl],say:pl,x:kptWhy(key,'t')};
// homework 4.11 (class sheets): [base, ending, answer, en, ne, rule]
const HW5=[['Turkki','ssa','Turkissa','in Turkey','टर्कीमा','kk'],['viikko','lla','viikolla','during the week','हप्तामा','kk'],['Lappi','ssa','Lapissa','in Lapland','ल्यापल्यान्डमा','pp'],['kaappi','n','kaapin','of the cupboard','दराजको','pp'],['tyttö','n','tytön','the girl\'s','केटीको','tt'],['planeetta','lla','planeetalla','on the planet','ग्रहमा','tt'],['ruoka','sta','ruoasta|ruuasta','from / about the food','खानाबाट','k'],['selkä','ssä','selässä','on the back','ढाडमा','k'],['kylpy','ssä','kylvyssä','in the bath','नुहाउने टबमा','p'],['apu','lla','avulla','with the help','सहयोगले','p'],
 ['maito','ssa','maidossa','in the milk','दूधमा','t'],['pöytä','ltä','pöydältä','from the table','टेबलबाट','t'],['kaupunki','ssa','kaupungissa','in the city','शहरमा','nk'],['aurinko','n','auringon','of the sun','सूर्यको','nk'],['Islanti','sta','Islannista','from Iceland','आइसल्यान्डबाट','nt'],['ranta','lle','rannalle','to the beach','किनारतिर','nt'],['Itävalta','ssa','Itävallassa','in Austria','अस्ट्रियामा','lt'],['kulta','n','kullan','of gold','सुनको','lt'],['yläkerta','ssa','yläkerrassa','upstairs','माथिल्लो तलामा','rt'],['virta','n','virran','of the stream','धाराको','rt']];
const HW6=[['penkki','llä','penkillä','on the bench','बेन्चमा','kk'],['tauko','lla','tauolla','on a break','विश्राममा','k'],['kortti','sta','kortista','from the card','कार्डबाट','tt'],['kerta','lla','kerralla','at one time, at once','एकै पटकमा','rt'],['kenkä','ssä','kengässä','in the shoe','जुत्तामा','nk'],['Amerikka','n','Amerikan','of America','अमेरिकाको','kk'],['lamppu','ssa','lampussa','in the lamp','बत्तीमा','pp'],['silta','lla','sillalla','on the bridge','पुलमा','lt'],['Irlanti','sta','Irlannista','from Ireland','आयरल्यान्डबाट','nt'],['kaappi','sta','kaapista','from the cupboard','दराजबाट','pp'],
 ['paita','sta','paidasta','from the shirt','सर्टबाट','t'],['tasku','ssa','taskussa','in the pocket','खल्तीमा','none'],['arpa','lla','arvalla','with a lottery ticket','चिट्ठाद्वारा','p'],['multa','ssa','mullassa','in the soil','माटोमा','lt'],['alakerta','ssa','alakerrassa','downstairs','तल्लो तलामा','rt'],['lintu','n','linnun','of the bird','चराको','nt'],['halpa','n','halvan','of the cheap (one)','सस्तोको','p'],['märkä','lle','märälle','onto the wet (one)','भिजेकोमा','k'],['posti','ssa','postissa','at the post office','हुलाकमा','none'],['lotto','n','loton','of the lottery','लटरीको','tt']];
const HWPL=[['kauppa','kaupat','pp','shops','पसलहरू'],['sekunti','sekunnit','nt','seconds','सेकेन्डहरू'],['viikko','viikot','kk','weeks','हप्ताहरू'],['tomaatti','tomaatit','tt','tomatoes','गोलभेडाहरू'],['silta','sillat','lt','bridges','पुलहरू'],['tapa','tavat','p','habits, ways','बानीहरू'],['koti','kodit','t','homes','घरहरू'],['sänky','sängyt','nk','beds','ओछ्यानहरू'],['sika','siat','k','pigs','सुँगुरहरू'],['kuppi','kupit','pp','cups','कपहरू'],
 ['kampa','kammat','mp','combs','काइयोहरू'],['jalka','jalat','k','legs, feet','खुट्टाहरू'],['jogurtti','jogurtit','tt','yoghurts','दहीहरू'],['rampa','rammat','mp','lame ones','लङ्गडाहरू'],['vanki','vangit','nk','prisoners','कैदीहरू'],['pysäkki','pysäkit','kk','bus stops','बिसौनीहरू'],['tunti','tunnit','nt','hours, lessons','घण्टाहरू'],['aalto','aallot','lt','waves','छालहरू'],['äiti','äidit','t','mothers','आमाहरू']];
Object.assign(EXSETS,{kpt:['k-p-t: word + ending','kpt','','ess'],kptpl:['k-p-t: plurals both ways','kpt','','ess'],hw5:['Homework 4.11: Harjoitus 5','kpt','','par'],hw6:['Homework 4.11: Harjoitus 6','kpt','','par'],hwpl:['Homework 4.11: plurals (A/B)','kpt','','par']});
const KPT_SETS={
 kpt:()=>pick(KPT_ALL,10).map(e=>kptItem(e[0],e[1],e[2],e[3],e[4],e[5])),
 kptpl:()=>shuffle(HWPL).slice(0,10).map((r,i)=>plItem(r[0],r[1],r[2],i%2===1)),
 hw5:()=>HW5.map(r=>kptItem(...r)),hw6:()=>HW6.map(r=>kptItem(...r)),
 hwpl:()=>HWPL.map((r,i)=>plItem(r[0],r[1],r[2],i%2===1))};
{const _bs=buildSet;buildSet=function(id,opts){return KPT_SETS[id]?KPT_SETS[id](opts||{}):_bs(id,opts)}}
// flashcards: kp:all
{const _dc=deckCards;deckCards=function(id){if(id==='kp:all')return KPT_ALL.map(e=>({id:'kp|'+e[0]+e[1],e:'🔀',fi:e[0]+' + '+e[1],en:e[3],ne:e[4],back:`<div class="bigfi" style="font-size:1.6rem">${esc(e[2].split('|')[0])}</div><div class="hint">${KPT_EN_KEY[e[5]]}</div>`,say2:e[2].split('|')[0],ask:'Say the new form'}));return _dc(id)}
 const g=DECK_GROUPS.find(x=>x[0]==='Grammar');if(g)g[1].unshift(['kp:all','k-p-t forms'])}

if(typeof TOPIC_LINKS!=='undefined'&&TOPIC_LINKS.kpt)TOPIC_LINKS.kpt.unshift(['Full KPT page ('+KPT_ALL.length+' examples)','kpt']);
