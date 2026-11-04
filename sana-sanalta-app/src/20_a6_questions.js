// ================= QUESTIONS LAB =================
const koKo=w=>/[aou]/i.test(w)?'ko':'kö';
const FLIPI=[1,0,2,4,3,5];
const QB={v:Math.max(0,VERBS.findIndex(v=>v.fi==='puhua')),p:1};
function renderQB(){
  const v=VERBS[QB.v],i=QB.p,j=FLIPI[i];const f=v.f[i];const q=cap(f)+koKo(f);
  const pr=PRON[i][0];const ans=v.f[j],no=NEG[j]+' '+v.f[0].slice(0,-1);
  const spv=SPOKEN_VERBS[v.fi];let sp='';
  if(spv&&i===1){const w=spv[1].split(' ')[1];sp=cap(w)+'sä?'}else if(spv&&i===2){const w=spv[2].split(' ')[1];sp=cap(w)+'ks se?'}
  $$('#qbP [data-p]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.p===i)));
  $('#qbOut').innerHTML=`<div class="eyebrow">${pr} + ${esc(v.fi)} + -${koKo(f)}</div>
   <div class="row"><div class="res">${hlEnd(f,i).replace(/^./,m=>m.toUpperCase())}<span class="hl">${koKo(f)}</span> ${i!==2&&i!==5?'('+pr+')':pr}?</div>${spk(q+' '+pr+'?')}</div>
   ${sp?`<div class="lsp t-sp">🗣 ${sp}</div>`:''}
   <div class="t-en mut">${['Do I','Do you','Does he / she','Do we','Do you (all)','Do they'][i]} ${v.en.replace(/^to /,'')}?</div>
   <div class="grid" style="margin-top:12px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
    <div class="card k-soft-out"><div class="eyebrow">Yes</div><div class="row" style="gap:6px"><b class="fi">${cap(ans)}.</b>${spk(cap(ans))}</div><div class="mut" style="font-size:.85rem">or: Kyllä / Joo, ${PRON[j][0]} ${ans}.</div></div>
    <div class="card k-soft-ne"><div class="eyebrow">No</div><div class="row" style="gap:6px"><b class="fi">${cap(no)}.</b>${spk(cap(no))}</div><div class="mut" style="font-size:.85rem">or: Ei, ${PRON[j][0]} ${no}.</div></div></div>
   <p class="mut" style="font-size:.88rem;margin:10px 0 0">The answer flips the person: you ask with <b>${pr}</b>, the answer uses <b>${PRON[j][0]}</b>.</p>`;
}
let QA={i:0};
function renderQA(){const r=QA_BANK[QA.i];const key='qa:'+QA.i;
  $('#qaBox').innerHTML=`<div class="mut mono" style="font-size:.78rem">Question ${QA.i+1} of ${QA_BANK.length}</div>
  <div class="row" style="margin:6px 0"><div class="qprompt" style="margin:0">${esc(r[0])}</div>${spk(r[0])}</div>
  <div class="t-en mut">${esc(r[1])}</div><div class="ne t-ne">${esc(r[2])}</div>
  <label class="grp-label" for="qaIn">Your answer (say it aloud first, then write it)</label>
  <textarea id="qaIn" rows="2" placeholder="Kirjoita vastaus…">${esc(sget(key,''))}</textarea>${fiKeys('qaIn')}
  <div class="row" style="margin-top:8px"><button class="btn ghost sm" id="qaPrev">← Previous</button><button class="btn pri sm" id="qaShow">Show a model answer</button><button class="btn ghost sm" id="qaNext">Next →</button><button class="btn ghost sm" id="qaRnd">Random</button></div><div id="qaModel"></div>`;
  $('#qaIn').addEventListener('input',e=>sset(key,e.target.value));
  $('#qaPrev').onclick=()=>{QA.i=(QA.i+QA_BANK.length-1)%QA_BANK.length;renderQA()};$('#qaNext').onclick=()=>{QA.i=(QA.i+1)%QA_BANK.length;renderQA();sayNow(QA_BANK[QA.i][0])};
  $('#qaRnd').onclick=()=>{QA.i=rnd(0,QA_BANK.length-1);renderQA();sayNow(QA_BANK[QA.i][0])};
  $('#qaShow').onclick=()=>{$('#qaModel').innerHTML=`<div class="note ok" style="margin-top:10px">${lineHTML(r[3],r[4])}<p class="mut" style="font-size:.88rem;margin:6px 0 0">Change it to be true for you. Then say it three times.</p></div>`;sayNow(r[3]);countActivity()};
}
RENDER.questions=()=>{
  const grp=g=>`<div class="qgroup k-soft-${g.key}" id="q-${g.id}"><div class="row" style="gap:10px"><span style="font-size:1.8rem">${g.icon}</span><div><h4 style="margin:0;font-size:1.2rem">${g.en} <span class="ne">· ${g.ne}</span></h4><p class="mut" style="margin:2px 0 0;font-size:.92rem">${esc(g.logic)}</p></div></div>
   <div class="grid wide" style="margin-top:10px">${g.items.map(it=>`<div class="card"><div class="row" style="justify-content:space-between;gap:6px"><div class="row" style="gap:6px"><b class="fi" style="font-size:1.15rem">${esc(it[0])}</b>${spk(it[0])}</div>${tag('→ '+esc(it[3]),g.key)}</div><div><span class="t-en">${esc(it[1])}</span> · <span class="ne t-ne">${esc(it[2])}</span></div>
   <div class="stack" style="gap:8px;margin-top:8px">${it[4].map(e=>`<div class="qa"><div class="row" style="gap:6px;flex-wrap:nowrap">${spk(e[0])}<span class="fi">${esc(e[0])}</span></div><div class="row" style="gap:6px;flex-wrap:nowrap;padding-left:2px">${spk(e[1])}<span>– ${esc(e[1])}</span></div><div class="t-en mut" style="font-size:.85rem">${esc(e[2])}</div><div class="ne t-ne" style="font-size:.85rem">${esc(e[3])}</div></div>`).join('')}</div>
   ${it[5]?`<p class="mut" style="font-size:.85rem;margin:8px 0 0">${esc(it[5])}</p>`:''}</div>`).join('')}</div></div>`;
  $('#p-questions').innerHTML=`<p class="eyebrow">Kysymykset · Questions lab</p><h2>How Finnish questions are built, and how to answer them</h2>
  <p class="lede">There are only two kinds of question. Learn the logic once and you can ask anything: <b>(1)</b> yes / no questions with <b>-ko / -kö</b> on the verb, and <b>(2)</b> question-word questions that start with <b>K-</b> or <b>M-</b>.</p>
  ${jumpNav([['two','2 kinds'],['yesno','-ko / -kö'],['qbuild','Question builder'],['flip','Answering'],['negq','Etkö?'],['polite','Polite'],['groups','Question words'],['confuse','How vs when vs what kind'],['qa','Speaking: 30 questions']])}
  ${H3('two','Two kinds of question','in')}
  <div class="grid wide">
   <div class="card k-soft-in"><div class="eyebrow">Kind 1 · yes / no</div><h4>Verb first + -ko / -kö</h4>${lineHTML('Puhutko suomea?','Do you speak Finnish?','तिमी फिनिस बोल्छौ?','Puhutsä suomee?')}${lineHTML('Onko täällä vessa?','Is there a toilet here?','यहाँ शौचालय छ?','Onks täällä vessaa?')}<p class="mut" style="font-size:.9rem;margin:6px 0 0">Nepali puts <b>के</b> at the start. Finnish glues <b>-ko</b> to the verb.</p></div>
   <div class="card k-soft-ess"><div class="eyebrow">Kind 2 · question word</div><h4>K- or M- word first, normal order, no -ko</h4>${lineHTML('Missä asut?','Where do you live?','कहाँ बस्छौ?','Mis sä asut?')}${lineHTML('Milloin tulet?','When are you coming?','कहिले आउँछौ?','Koska sä tuut?')}<p class="mut" style="font-size:.9rem;margin:6px 0 0">Nepali question words start with <b>क</b> (को, के, कहाँ). Finnish ones start with <b>K</b> or <b>M</b>.</p></div>
  </div>
  ${H3('yesno','Building a -ko / -kö question','in')}
  <div class="steps">${YN_STEPS.map(s=>`<div class="step"><div class="eyebrow">${esc(s[0])}</div><div class="fi" style="font-size:1.15rem">${esc(s[1])}</div><div class="mut t-en" style="font-size:.88rem">${esc(s[2])}</div></div>`).join('')}</div>
  <div class="note" style="margin-top:12px"><span class="lbl">-ko or -kö?</span>Same vowel harmony as everywhere: if the verb has <b>a, o, u</b> → <b>-ko</b>. Otherwise → <b>-kö</b>. Puhut<b>ko</b>, Halua<b>tko</b> · Tiedät<b>kö</b>, Menet<b>kö</b>, Syöt<b>kö</b>.</div>
  <div class="grid tight" style="margin-top:12px">${KO_EX.map(k=>`<div class="card" style="padding:10px 12px"><div class="mut mono" style="font-size:.8rem">${k[0]} →</div><div class="row" style="gap:6px"><b class="fi">${k[1].replace(/(k[oö])\?$/,'<span class="hl">$1</span>?')}</b>${spk(k[1])}</div><div class="t-en mut" style="font-size:.85rem">${k[2]}</div></div>`).join('')}</div>
  ${H3('qbuild','Question builder: any verb, any person','in')}
  <div class="builder"><div class="stack" style="min-width:0"><div><div class="grp-label">1 · Verb</div><select id="qbV" aria-label="Verb">${VERBS.map((v,i)=>`<option value="${i}">${v.fi} · ${v.en}</option>`).join('')}</select></div>
   <div><div class="grp-label">2 · Who are you asking about?</div><div class="chips" id="qbP">${PRON.map((p,i)=>`<button class="chip" data-p="${i}">${p[0]} <span class="cnt">${p[2]}</span></button>`).join('')}</div></div>
   <div class="row"><button class="btn ghost sm" id="qbRand">Random</button><button class="btn pri sm" data-go="practice" data-ex="q">Practise: make questions</button></div></div><div class="out" id="qbOut"></div></div>
  ${H3('flip','Answering: repeat the verb, flip the person','out')}
  <p class="lede">Finns rarely answer just "kyllä". They repeat the verb, like Nepali: <span class="ne">बोल्नुहुन्छ? – बोल्छु।</span> For "no", use en / et / ei + the verb without its ending.</p>
  <div class="tbl"><table><thead><tr><th>Question</th><th>Yes</th><th>No</th><th>Person</th></tr></thead><tbody>${FLIP.map(r=>`<tr><td class="fi">${esc(r[0])} ${spk(r[0].replace(/[()]/g,''))}</td><td class="c-out"><b>${esc(r[1])}</b></td><td class="c-ne"><b>${esc(r[2])}</b></td><td class="mut">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
  ${H3('negq','Negative questions: Etkö? Eikö?','ne')}
  <div class="grid">${NEGQ.map(n=>`<div class="card">${lineHTML(n[0],n[1],n[2])}</div>`).join('')}</div>
  <div class="note" style="margin-top:10px"><span class="lbl">Recipe</span>Put -kö on the "not" verb: et → <b>etkö</b>, ei → <b>eikö</b>. Etkö tule? = Aren't you coming? Eikö niin? = Right?</div>
  ${H3('polite','Polite questions: -isi- = would / could','out')}
  <div class="grid wide">${POLITE.map(p=>`<div class="card">${lineHTML(p[0],p[1],p[2])}${p[3]?`<div class="mut" style="font-size:.85rem;margin-top:4px">${esc(p[3])}</div>`:''}</div>`).join('')}</div>
  <div class="note" style="margin-top:10px"><span class="lbl">How it works</span>voi<b>t</b>ko? (can you?) → vo<b>isit</b>ko? (could you?). saa<b>n</b>ko? (may I?) → sa<b>isin</b>ko? (could I have?). The -isi- softens it, like Nepali "दिनुहुन्छ <b>कि</b>?"</div>
  ${H3('groups','Question words: grouped by meaning','ess')}
  <p class="lede">Each group shows what the answer looks like (→). Listen for the ending in the question; the answer usually reuses it: <b>Mi<span class="hl">ssä</span>? → Turu<span class="hl">ssa</span></b>.</p>
  <div class="chips">${QGROUPS.map(g=>`<a class="chip" href="#q-${g.id}" data-jump="q-${g.id}">${g.icon} ${g.en}</a>`).join('')}</div>
  <div class="stack" style="gap:16px">${QGROUPS.map(grp).join('')}</div>
  ${H3('confuse','The confusing ones side by side','ess')}
  <div class="tbl"><table><thead><tr><th>English idea</th><th>Finnish</th><th>Ask yourself</th><th>Answer shape</th><th>Example</th></tr></thead><tbody>
   ${[['how','Miten? / Kuinka?','In what way?','hyvin, hitaasti, näin','Miten menee? – Hyvin.'],['how','Millä?','By what (bus, card)?','-lla: bussilla','Millä tulit? – Junalla.'],['how','Miltä?','How does it seem / taste?','-lta: hyvältä','Miltä maistuu? – Hyvältä.'],['how','Kuinka + adjective','How old / far / big?','number, adjective','Kuinka vanha olet? – 30.'],
     ['when','Milloin? / Koska?','Which day / time in general?','huomenna, maanantaina, kesällä','Milloin tulet? – Huomenna.'],['when','Monelta? / Mihin aikaan?','Which clock time?','-lta: kahdeksalta','Monelta juna lähtee? – Seitsemältä.'],['when','Kuinka kauan?','How long (duration)?','kaksi tuntia, viikon','Kauanko se kestää? – Tunnin.'],['when','Kuinka usein?','How often?','joka päivä, kerran viikossa','Kuinka usein uit? – Joka päivä.'],
     ['what kind','Millainen?','Describe it','adjective: kylmä, iso','Millainen sää on? – Kylmä.'],['what kind','Minkä värinen? / kokoinen?','Colour / size?','sininen / iso','Minkä värinen? – Sininen.'],['what','Mikä? vs Mitä?','Is it the subject, or the thing done?','Mikä = is / does · Mitä = is done','Mikä tämä on? · Mitä teet?']]
     .map(r=>`<tr><td>${tag(r[0],r[0]==='how'?'out':r[0]==='when'?'ess':'par')}</td><td><b class="fi">${r[1]}</b></td><td>${r[2]}</td><td class="mut">${r[3]}</td><td class="fi">${r[4]}</td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="qw">Practise: which question word?</button><button class="btn ghost sm" data-go="cards" data-deck="q:all">Flashcards</button></div>
  ${H3('qa','Speaking practice: the 30 questions everyone asks you','out')}
  <p class="lede">Play the question, answer out loud, write your answer, then compare with the model. Your answers are saved here so you can repeat them every day.</p>
  <div class="out qbox" id="qaBox"></div>`;
  const sel=$('#qbV');sel.value=QB.v;sel.addEventListener('change',()=>{QB.v=+sel.value;renderQB()});
  $('#qbP').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b){QB.p=+b.dataset.p;renderQB()}});
  $('#qbRand').onclick=()=>{QB.v=rnd(0,VERBS.length-1);QB.p=rnd(0,5);sel.value=QB.v;renderQB()};
  renderQB();renderQA();
};

// ================= PUHEKIELI =================
RENDER.puhe=()=>{
  const words=Object.entries(PUHE);
  $('#p-puhe').innerHTML=`<p class="eyebrow">Puhekieli · Spoken Finnish</p><h2>Book Finnish and street Finnish</h2>
  <p class="lede">Finns write <b>kirjakieli</b> (book language) but speak <b>puhekieli</b>. It is like formal तपाईं Nepali vs casual तिमी talk with friends, but bigger. Learn to <b>write</b> the book form and to <b>understand</b> the spoken form. Everywhere on this page, green = spoken.</p>
  ${jumpNav([['prules','9 rules'],['ppron','Pronouns'],['pverbs','Verbs'],['pwords','Words'],['psent','Sentence pairs']])}
  ${H3('prules','Nine rules that explain most of it','sp')}
  <div class="grid wide">${PUHE_RULES.map((r,i)=>`<div class="card k-soft-sp"><div class="eyebrow">Rule ${i+1}</div><h4>${esc(r[0])}</h4><div class="row" style="gap:8px"><span class="fi">${esc(r[1])}</span> → <span class="sp-c"><b>${esc(r[2])}</b></span>${spk(r[2].split(' / ')[0])}</div><p class="mut" style="font-size:.9rem;margin:6px 0 0">${esc(r[3])}</p></div>`).join('')}</div>
  ${H3('ppron','Pronouns','sp')}
  <div class="tbl"><table><thead><tr><th>Book</th><th class="sp-h">Spoken</th><th>Has (book)</th><th class="sp-h">Has (spoken)</th><th>My / your</th><th class="sp-h">Spoken</th></tr></thead><tbody>${[['minä','mä','minulla on','mulla on','minun','mun'],['sinä','sä','sinulla on','sulla on','sinun','sun'],['hän','se','hänellä on','sillä on','hänen','sen'],['me','me','meillä on','meil on','meidän','meiän'],['te','te','teillä on','teil on','teidän','teiän'],['he','ne','heillä on','niillä on','heidän','niiden']].map(r=>`<tr>${r.map((c,i)=>`<td class="${i%2?'sp-c':'fi'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  ${H3('pverbs','Verbs in speech','sp')}
  <p class="lede"><b>me</b> = passive: <span class="sp-c">me mennään</span> · <b>ne</b> = he / she form: <span class="sp-c">ne menee</span>. "Let's go!" = <span class="sp-c">Mennään!</span></p>
  <div class="tbl"><table><thead><tr><th>Verb</th>${['mä','sä','se','me','te','ne'].map(x=>`<th class="sp-h">${x}</th>`).join('')}</tr></thead><tbody>${Object.entries(SPOKEN_VERBS).map(([k,f])=>`<tr><td class="fi"><b>${k}</b></td>${f.map(x=>`<td class="sp-c">${x.split(' ')[1]} ${spk(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  ${H3('pwords','Everyday spoken words','sp')}
  <div class="row" style="margin-bottom:10px"><input type="search" id="pwSearch" placeholder="Search spoken words" aria-label="Search spoken words"></div>
  <div class="grid tight" id="pwGrid"></div>
  ${H3('psent','Book ↔ spoken: 30 sentence pairs','sp')}
  <div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-go="cards" data-deck="sp:all">Flashcards</button><button class="btn ghost sm" data-go="practice" data-ex="dict">Dictation practice</button></div>
  <div class="stack" style="gap:8px">${PUHE_SENT.map(s=>`<div class="pair2"><div>${lineHTML(s[0],s[2],s[3])}</div><div class="sp-side"><div class="row" style="gap:6px;flex-wrap:nowrap">${spk(s[1].split(' / ')[0])}<b class="sp-c">${esc(s[1])}</b></div></div></div>`).join('')}</div>`;
  const pw=()=>{const q=($('#pwSearch').value||'').toLowerCase();$('#pwGrid').innerHTML=words.filter(([a,b])=>!q||(a+' '+b).toLowerCase().includes(q)).map(([a,b])=>`<div class="card" style="padding:10px 12px"><div class="fi">${esc(a)}</div><div class="row" style="gap:6px;flex-wrap:nowrap"><b class="sp-c">${esc(b)}</b>${spk(b.split(' / ')[0])}</div></div>`).join('')||'<p class="mut">Nothing found.</p>'};
  $('#pwSearch').addEventListener('input',pw);pw();
};
