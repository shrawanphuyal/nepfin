// ================= CASES TAB =================
const SVG={
 ssa:'<svg viewBox="0 0 76 54" aria-hidden="true"><rect class="s-box" x="14" y="8" width="40" height="38" rx="3"/><circle class="s-dot" cx="34" cy="27" r="6"/></svg>',
 sta:'<svg viewBox="0 0 76 54" aria-hidden="true"><rect class="s-box" x="6" y="8" width="40" height="38" rx="3"/><circle class="s-dot" cx="22" cy="27" r="4"/><path class="s-arr" d="M28 27H70M63 20l7 7-7 7"/></svg>',
 an:'<svg viewBox="0 0 76 54" aria-hidden="true"><rect class="s-box" x="30" y="8" width="40" height="38" rx="3"/><path class="s-arr" d="M4 27H48M41 20l7 7-7 7"/><circle class="s-dot" cx="54" cy="27" r="4"/></svg>',
 lla:'<svg viewBox="0 0 76 54" aria-hidden="true"><path class="s-surf" d="M8 36H68M16 36v14M60 36v14"/><circle class="s-dot" cx="38" cy="28" r="6"/></svg>',
 lta:'<svg viewBox="0 0 76 54" aria-hidden="true"><path class="s-surf" d="M4 40H52M12 40v12M44 40v12"/><circle class="s-dot" cx="24" cy="33" r="4"/><path class="s-arr" d="M30 30L66 8M57 8h9v9"/></svg>',
 lle:'<svg viewBox="0 0 76 54" aria-hidden="true"><path class="s-surf" d="M24 40H72M32 40v12M64 40v12"/><path class="s-arr" d="M8 6L44 30M35 30h9v-9"/><circle class="s-dot" cx="50" cy="33" r="4"/></svg>'
};
const SIX=[['in','ssa','-ssa / -ssä','Missä?','in, inside','-मा (भित्र)','Asun Turussa.','I live in Turku.'],['in','sta','-sta / -stä','Mistä?','out of, from','-बाट','Tulen kaupasta.','I come from the shop.'],['in','an','-an / -en / -in…','Mihin?','into, to','-मा / -तिर (जाने)','Menen kauppaan.','I go to the shop.'],
['out','lla','-lla / -llä','Missä?','on, at','-मा (माथि) / -सँग','Kirja on pöydällä.','The book is on the table.'],['out','lta','-lta / -ltä','Mistä?','off, from','-बाट','Otan kirjan pöydältä.','I take the book off the table.'],['out','lle','-lle','Mihin?','onto, to','-लाई / -माथि','Laitan kirjan pöydälle.','I put the book on the table.']];
const WB={r:0,c:'ssa'};
const CASE_RE={ssa:/ss[aä]$/,sta:/st[aä]$/,ill:/(h?[aeiouyäö]n|seen)$/,lla:/ll[aä]$/,lta:/lt[aä]$/,lle:/lle$/,gen:/n$/,pl:/t$/};
function hlCase(form,c){const m=form.match(CASE_RE[c]);if(!m)return esc(form);const k=form.length-m[0].length;return esc(form.slice(0,k))+'<span class="hl">'+esc(m[0])+'</span>'}
const kptChanged=(r,form)=>!form.toLowerCase().startsWith(r.fi.toLowerCase().slice(0,-1));
function renderWB(){
  const r=ROOTS[WB.r];if(!r.f[WB.c])WB.c=Object.keys(r.f)[0];
  $('#wbRoots').innerHTML=ROOTS.map((x,i)=>`<button class="chip" data-r="${i}" aria-pressed="${i===WB.r}">${esc(x.fi)}</button>`).join('');
  $('#wbCases').innerHTML=Object.keys(r.f).map(c=>`<button class="chip" data-c="${c}" aria-pressed="${c===WB.c}"><span class="mono">${CASE_META[c].end}</span></button>`).join('');
  const f=r.f[WB.c],m=CASE_META[WB.c];const s=SENT[r.k]&&SENT[r.k][WB.c]?SENT[r.k][WB.c](f):null;
  $('#wbOut').innerHTML=`<div class="eyebrow">${esc(r.fi)} + ${m.end}</div><div class="row"><div class="res">${hlCase(f,WB.c)}</div>${spk(f)}</div>
    <div style="margin-top:6px"><span class="t-en"><b>${esc(m.en(r))}</b></span> · <span class="ne t-ne">${esc(m.ne(r))}</span></div>
    <div class="mut" style="font-size:.9rem;margin-top:4px">Question: <span class="fi">${m.q}</span></div>
    ${kptChanged(r,f)?`<div style="margin-top:8px">${tag('KPT','ess')} <span class="mut" style="font-size:.9rem">The consonant got softer: <b>${esc(r.fi)}</b> → <b>${esc(f)}</b>.</span></div>`:''}
    ${s?`<div class="note" style="margin-top:12px">${lineHTML(s[0],cap(s[1].replace('X',r.en)),s[2].replace('X',r.ne))}</div>`:''}
    <div class="tbl" style="margin-top:12px"><table><tbody>${Object.keys(r.f).map(c=>`<tr><td class="mono" style="white-space:nowrap">${CASE_META[c].end}</td><td><b class="fi">${hlCase(r.f[c],c)}</b></td><td class="t-en">${esc(CASE_META[c].en(r))}</td><td class="ne t-ne">${esc(CASE_META[c].ne(r))}</td></tr>`).join('')}</tbody></table></div>`;
}
const exRow=x=>lineHTML(x[0],x[1],x[2]);
const PCHECK=['There is a number 2 or more before it (kaksi, viisi…)','There is an amount word (paljon, vähän, kilo, kuppi, lasi…)','The sentence has "not" (en, ei, ei ole…)','You mean "some" of something you can\'t count (water, money, time)','The verb is a partitive verb (rakastaa, odottaa, auttaa, opiskella…)','The action is still going on, not finished','You ask "is there any / do you have any?"'];
RENDER.cases=()=>{
  const tile=t=>`<div class="ctile k-soft-${t[0]}">${SVG[t[1]]}<div class="big">${t[2]}</div><div><span class="fi">${t[3]}</span> · <span class="t-en">${t[4]}</span> · <span class="ne t-ne">${t[5]}</span></div><div style="margin-top:4px">${lineHTML(t[6],t[7])}</div></div>`;
  $('#p-cases').innerHTML=`<p class="eyebrow">Sijamuodot · Cases and endings</p><h2>Endings are LEGO, just like Nepali विभक्ति</h2>
  <p class="lede">Finnish glues an ending onto a word instead of using "in", "from", "to", "of". You already do this in Nepali: घर<b>मा</b>, घर<b>बाट</b>, घर<b>को</b>. Each colour on this page is one family of endings.</p>
  ${jumpNav([['lego','LEGO idea'],['three','3 forms trick'],['partitive','Partitive: when'],['partform','Partitive: how'],['partcheck','Partitive check'],['genitive','Genitive'],['postpos','Place words'],['illative','Illative'],['six','6 location endings'],['object','Object'],['rektio','Verb + case'],['allcases','All endings'],['suffixes','New words']])}
  <div class="legend">${[['nom','basic form'],['par','partitive'],['gen','genitive'],['in','inside: -ssa -sta -Vn'],['out','surface: -lla -lta -lle'],['ess','-na · -ksi · time'],['verb','verbs']].map(([k,l])=>tag(l,k)).join('')}</div>
  ${H3('lego','The LEGO idea','nom')}
  <div class="grid wide">
    <div class="card"><div class="eyebrow">Finnish</div><div class="lego"><span class="l1">talo</span><span class="l2">ssa</span><span class="l3">ni</span><span class="l4">kin</span></div><div class="sp"></div>${lineHTML('talossanikin','house + in + my + too = "in my house too"')}</div>
    <div class="card"><div class="eyebrow">Nepali</div><div class="lego ne"><span class="l3">मेरो</span><span class="l1">घर</span><span class="l2">मा</span><span class="l4">पनि</span></div><div class="sp"></div><div class="ne" style="font-size:1.15rem">मेरो घरमा पनि</div><div class="t-en mut">my + house + in + too. Same pieces, different order.</div></div>
  </div>
  ${H3('three','The best trick: learn 3 forms of every noun','gen')}
  <p class="lede">Don't learn just <b>talo</b>. Learn <b>talo – talon – taloa</b> (basic, genitive, partitive). The genitive is the <b>master key</b>: remove its -n and you can add -ssa, -sta, -lla, -lta, -lle, -ksi. talon → talo|ssa, talo|sta, talo|lla.</p>
  <div class="tbl"><table><thead><tr><th>Basic</th><th class="c-gen">Genitive -n (master key)</th><th class="c-par">Partitive</th><th class="c-in">Illative (to)</th><th class="t-en">English</th><th class="t-ne">Nepali</th></tr></thead><tbody>${THREE.map(r=>`<tr><td><b class="fi">${r[0]}</b> ${spk(r[0]+', '+r[1]+', '+r[2])}</td><td class="c-gen">${r[1]}</td><td class="c-par">${r[2]}</td><td class="c-in">${r[3]}</td><td class="t-en">${r[4]}</td><td class="ne t-ne">${r[5]}</td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="cards" data-deck="pt:all">Flashcards: 3 forms</button></div>
  ${H3('partitive','Partitive: when do I use it?','par')}
  <div class="note k-soft-par" style="margin-bottom:12px"><span class="lbl">The one-line idea</span>Partitive = <b>a part of</b>, <b>some</b>, <b>not</b>, or <b>not finished</b>. Nepali has no partitive ending, so think: "Could I say <i>some</i> or <i>any</i> in English? Is there a number? Is there <i>not</i>?" → partitive.</div>
  <div class="grid wide">${PART_USES.map((u,i)=>`<div class="card k-soft-par"><div class="row" style="gap:8px"><span style="font-size:1.6rem">${u[0]}</span><div><div class="eyebrow">Use ${i+1}</div><h4 style="margin:0">${esc(u[1])}</h4></div></div><p style="margin:8px 0 4px;font-size:.93rem">${esc(u[2])}</p><div class="ne t-ne" style="font-size:.9rem">${esc(u[3])}</div><div class="stack" style="gap:6px;margin-top:8px">${u[4].map(exRow).join('')}</div></div>`).join('')}</div>
  <div class="note warn" style="margin-top:12px"><span class="lbl">Common confusion</span><b>Pidän kahvista</b> (I like coffee) is NOT partitive. pitää always takes -sta. Compare: <b>Juon kahvia</b> (partitive) · <b>Pidän kahvista</b> (-sta) · <b>Kahvi on kuumaa</b> (partitive, mass word).</div>
  ${H3('partform','Partitive: how to make it','par')}
  <div class="grid wide">${PART_FORM.map(f=>`<div class="card"><div class="row" style="justify-content:space-between"><h4 style="margin:0">${esc(f[0])}</h4>${tag(esc(f[1]),'par')}</div><p class="mut" style="font-size:.9rem;margin:6px 0">${esc(f[2])}</p><div class="pairs">${f[3].map(p=>`<span class="pair"><span class="mut">${p[0]}</span> → <b class="c-par">${p[1]}</b></span>`).join('')}</div></div>`).join('')}</div>
  <h4 style="margin-top:18px">Plural partitive as ready-made chunks (just learn these)</h4>
  <div class="grid">${PART_PLURAL.map(p=>`<div class="card">${lineHTML(p[0],p[1],p[2])}</div>`).join('')}</div>
  ${H3('partcheck','Partitive check: tick what is true','par')}
  <div class="builder"><div class="stack" id="pcBox">${PCHECK.map((t,i)=>`<label class="tog" style="border-radius:10px;padding:8px 10px"><input type="checkbox" data-pc="${i}"> ${esc(t)}</label>`).join('')}</div><div class="out" id="pcOut"></div></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="par">Practise: 40 partitive sentences</button></div>
  ${H3('genitive','Genitive -n: whose, where, must','gen')}
  <div class="grid wide">${GEN_USES.map(u=>`<div class="card k-soft-gen"><div class="row" style="gap:8px"><span style="font-size:1.5rem">${u[0]}</span><h4 style="margin:0">${esc(u[1])}</h4></div><p style="margin:8px 0;font-size:.93rem">${esc(u[2])}</p><div class="stack" style="gap:6px">${u[3].map(exRow).join('')}</div></div>`).join('')}</div>
  <div class="grid wide" style="margin-top:12px"><div class="tbl"><table><thead><tr><th>Who</th><th>Whose</th><th class="sp-h">Spoken</th><th class="t-en">English</th><th class="t-ne">Nepali</th></tr></thead><tbody>${PRONOUN_GEN.map(p=>`<tr><td class="mut">${p[0]}</td><td><b class="c-gen">${p[1]}</b></td><td class="sp-c">${p[2]}</td><td class="t-en">${p[3]}</td><td class="ne t-ne">${p[4]}</td></tr>`).join('')}</tbody></table></div>
   <div class="note"><span class="lbl">Book vs speech</span>Book: <b>minun autoni</b> (my car, with -ni on the noun too). Speech: <span class="sp-c">mun auto</span>. Both are right; learn to understand both. -ni = my, -si = your, -nsa = his / her.</div></div>
  <div class="note" style="margin-top:12px"><span class="lbl">How to form it</span>Add -n, and use the <b>weak</b> consonant (KPT): kauppa → kaupan, pöytä → pöydän. -e words: huone → huoneen. -nen words: nainen → naisen. Old -i words: vesi → veden, käsi → käden.</div>
  ${H3('postpos','Place words: genitive + vieressä, edessä…','gen')}
  <div class="grid">${POSTPOS.map(p=>`<div class="card"><div class="row" style="gap:8px;flex-wrap:nowrap"><span style="font-size:1.4rem">${p[0]}</span><b class="fi" style="font-size:1.1rem">${p[1]}</b>${spk(p[1])}</div><div><span class="t-en">${p[2]}</span> · <span class="ne t-ne">${p[3]}</span></div><div style="margin-top:6px">${lineHTML(p[4],p[5])}</div></div>`).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="gen">Practise the genitive</button><button class="btn ghost sm" data-go="cards" data-deck="pp:all">Flashcards: place words</button></div>
  ${H3('illative','Illative: Mihin? (into, to)','in')}
  <p class="lede">This is the hardest location ending because it has six shapes. Find the shape from how the word ends. It always uses the <b>strong</b> consonant: kauppa → kauppaan.</p>
  <div class="grid wide">${ILL_RULES.map(f=>`<div class="card k-soft-in"><div class="row" style="justify-content:space-between"><h4 style="margin:0">${esc(f[0])}</h4>${tag(esc(f[1]),'in')}</div><p class="mut" style="font-size:.9rem;margin:6px 0">${esc(f[2])}</p><div class="pairs">${f[3].map(p=>`<span class="pair"><span class="mut">${p[0]}</span> → <b class="c-in">${p[1]}</b></span>`).join('')}</div></div>`).join('')}</div>
  <h4 style="margin-top:16px">Special words to learn by heart</h4>
  <div class="grid tight">${ILL_SPECIAL.map(w=>`<div class="card" style="padding:10px 12px">${lineHTML(w[0],w[1],w[2])}</div>`).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="ill">Practise the illative</button></div>
  ${H3('six','The six location endings','out')}
  <p class="lede">Two sets of three. One set is for <b>inside</b> a space (a house, a city, a shop). The other is for <b>on a surface, at an open place, or a person</b>. Each set answers: where at, where from, where to.</p>
  <div class="axis-label">Inside a space · the box</div><div class="cases6">${SIX.slice(0,3).map(tile).join('')}</div>
  <div class="axis-label" style="margin-top:14px">Surface, open place or person · the table</div><div class="cases6">${SIX.slice(3).map(tile).join('')}</div>
  <div class="grid wide" style="margin-top:12px"><div class="note"><span class="lbl">Which set?</span>Cities, countries, buildings: box set (Turussa, Suomessa, kaupassa). Open places and surfaces: table set (torilla, asemalla, pöydällä). Learn by heart: <b>töissä</b> (at work), <b>kotona</b> (at home), <b>kotiin</b> (home).</div><div class="note"><span class="lbl">a or ä? Vowel harmony</span>Words with <b>a, o, u</b> take <b>a</b>: talossa. Words with <b>ä, ö, y</b> (or only e, i) take <b>ä</b>: metsässä, Helsingissä.</div></div>
  <h4 style="margin-top:18px">Word builder: try it</h4>
  <div class="builder"><div class="stack" style="min-width:0"><div><div class="grp-label">1 · Word</div><div class="chips" id="wbRoots"></div></div><div><div class="grp-label">2 · Ending</div><div class="chips" id="wbCases"></div></div></div><div class="out" id="wbOut"></div></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="loc">Practise location endings</button></div>
  ${H3('object','The object: whole thing or a part?','gen')}
  <div class="grid wide">${OBJECT.map(o=>`<div class="card k-soft-${o[4]}"><h4>${esc(o[0])}</h4><p class="mut" style="font-size:.92rem;margin:0 0 8px">${esc(o[1])}</p><div class="fi">${esc(o[2])}</div><div class="t-en mut" style="font-size:.9rem">${esc(o[3])}</div></div>`).join('')}</div>
  <div class="tbl" style="margin-top:12px"><table><thead><tr><th>Person</th><th class="c-gen">Whole (I see you)</th><th class="c-par">Partitive (I love you)</th><th class="t-en">English</th></tr></thead><tbody>${PRON_OBJ.map(p=>`<tr><td class="mut">${p[0]}</td><td class="c-gen"><b>${p[1]}</b></td><td class="c-par"><b>${p[2]}</b></td><td class="t-en">${p[3]}</td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="obj">Practise the object</button></div>
  ${H3('rektio','Verb + case: each verb wants its own ending','out')}
  <p class="lede">English says "like <i>something</i>", Finnish says "like <i>from</i> something" (pidän kahvi<b>sta</b>). Learn verbs together with their ending, as one chunk.</p>
  <div class="tbl"><table><thead><tr><th>Verb</th><th>Wants</th><th>Meaning</th><th>Example</th><th class="t-ne">Nepali</th></tr></thead><tbody>${REKTIO.map(r=>`<tr><td><b class="fi">${r[0]}</b></td><td>${tag(esc(r[1]),r[6])}</td><td class="t-en">${esc(r[2])}</td><td><span class="fi">${esc(r[3])}</span> ${spk(r[3])}<div class="t-en mut" style="font-size:.85rem">${esc(r[4])}</div></td><td class="ne t-ne">${esc(r[5])}</td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="rek">Practise verb + case</button><button class="btn ghost sm" data-go="cards" data-deck="rk:all">Flashcards</button></div>
  ${H3('allcases','All the endings you need for A1','ess')}
  <div class="grid wide">${CASES.map(c=>`<div class="card"><div class="row" style="justify-content:space-between"><span class="end" style="font-size:1.05rem">${esc(c[0])}</span>${tag(esc(c[1]),'nom')}</div><div style="margin-top:8px"><span class="t-en"><b>${esc(c[3])}</b></span> · <span class="ne t-ne">${esc(c[4])}</span>${c[2]!=='—'?` · <span class="fi">${esc(c[2])}</span>`:''}</div><div class="stack" style="gap:6px;margin-top:8px">${c[5].map(exRow).join('')}</div><p class="mut" style="font-size:.9rem;margin:8px 0 0">${esc(c[6])}</p></div>`).join('')}</div>
  ${H3('suffixes','Endings that make new words','nom')}
  <div class="grid wide">${SUFFIXES.map(s=>`<div class="card"><div class="row" style="justify-content:space-between"><span class="end" style="font-size:1.05rem">${esc(s[0])}</span><span class="ne t-ne" style="font-size:.9rem">${esc(s[2])}</span></div><div class="t-en" style="margin:6px 0"><b>${esc(s[1])}</b></div><div class="pairs">${s[3].map(x=>`<span class="pair"><span class="mut">${esc(x[0])}</span> → <b class="fi">${esc(x[2])}</b> <span class="mut t-en">${esc(x[3])}</span></span>`).join('')}</div><p class="mut" style="font-size:.9rem;margin:8px 0 0">${esc(s[4])}</p></div>`).join('')}</div>`;
  $('#wbRoots').addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(b){WB.r=+b.dataset.r;renderWB()}});
  $('#wbCases').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(b){WB.c=b.dataset.c;renderWB()}});
  renderWB();
  const pc=()=>{const on=$$('#pcBox [data-pc]').filter(x=>x.checked);$('#pcOut').innerHTML=on.length?`<div class="res c-par">Partitive</div><p>Use -a / -ta: <span class="fi">kahvia, vettä, autoa, kirjaa</span>.</p><p class="mut" style="margin:0">Reason: ${on.map(x=>esc(PCHECK[+x.dataset.pc])).join('; ')}.</p>`:`<div class="res c-gen">Not partitive</div><p>Use the basic form for a subject (<span class="fi">Kahvi on hyvää</span>) or the whole object -n (<span class="fi">Ostan kirjan</span>).</p><p class="mut" style="margin:0">Tick anything that is true about your sentence.</p>`};
  $('#pcBox').addEventListener('change',pc);pc();
};
