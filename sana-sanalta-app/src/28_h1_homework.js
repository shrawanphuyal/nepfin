// ================= HOMEWORK (from class) =================
// book page examples (k-p-t table in the textbook): [base, ending, result, en, ne, key]
const HW_BOOK=[['Afrikka','sta','Afrikasta','from Africa','अफ्रिकाबाट','kk'],['Eurooppa','ssa','Euroopassa','in Europe','युरोपमा','pp'],['konsertti','n','konsertin','of the concert','कन्सर्टको','tt'],
['Turku','ssa','Turussa','in Turku','टुर्कुमा','k'],['leipä','llä','leivällä','on the bread','रोटीमा','p'],['katu','lla','kadulla','on the street','सडकमा','t'],
['Helsinki','ssä','Helsingissä','in Helsinki','हेल्सिंकीमा','nk'],['Hollanti','n','Hollannin','of Holland','हल्यान्डको','nt'],['rumpu','n','rummun','of the drum','ड्रमको','mp'],
['ilta','lla','illalla','in the evening','बेलुका','lt'],['parta','n','parran','of the beard','दाह्रीको','rt']];
const HW_BOOK_NONE=[['posti','ssa','postissa','at the post office','हुलाकमा'],['matka','lla','matkalla','on the trip','यात्रामा'],['vapaa','ssa','vapaassa','in the free (one)','खालीमा'],['keittiö','ssä','keittiössä','in the kitchen','भान्सामा']];
// textbook exercise 16: verb + place + -ssa/-lla → 15 model sentences
const HW_EX16=[
['Me + syödä keittoa','hyvä ravintola','Me syömme keittoa hyvässä ravintolassa.','We eat soup in a good restaurant.','हामी राम्रो रेस्टुरेन्टमा सुप खान्छौं।','me → syö+mme · hyvä ravintola → hyvä<b>ssä</b> ravintola<b>ssa</b> (both words get the ending)'],
['Anna + pestä hiukset','kylmä suihku','Anna pesee hiukset kylmässä suihkussa.','Anna washes her hair in a cold shower.','आना चिसो पानीको धारामा कपाल धुन्छिन्।','type 3: pestä → pese- → hän pesee'],
['Te + juoda kahvia','halpa kahvila','Te juotte kahvia halvassa kahvilassa.','You drink coffee in a cheap café.','तिमीहरू सस्तो क्याफेमा कफी पिउँछौ।','KPT: halpa → hal<b>v</b>assa (lp → lv)'],
['Minä + maksaa laskun','se pankki','Minä maksan laskun siinä pankissa.','I pay the bill in that bank.','म त्यो बैंकमा बिल तिर्छु।','se → <b>siinä</b> · KPT: pankki → pan<b>k</b>issa'],
['Hän + herätä aamulla','pehmeä sänky','Hän herää aamulla pehmeässä sängyssä.','He wakes up in the morning in a soft bed.','उनी बिहान नरम ओछ्यानमा ब्युँझन्छन्।','type 4: herätä → hän herää · KPT: sänky → sän<b>g</b>yssä'],
['He + odottaa junaa','vanha asema','He odottavat junaa vanhalla asemalla.','They wait for the train at the old station.','उनीहरू पुरानो स्टेसनमा रेल पर्खन्छन्।','asema takes -lla (open place)'],
['Hän + lähettää kirjeen','tuo posti','Hän lähettää kirjeen tuossa postissa.','She sends the letter at that post office.','उनी त्यो हुलाकबाट चिठी पठाउँछिन्।','tuo → <b>tuossa</b> · posti: st, no KPT'],
['Sinä + asua','tämä pieni asunto','Sinä asut tässä pienessä asunnossa.','You live in this small flat.','तिमी यो सानो फ्ल्याटमा बस्छौ।','tämä → <b>tässä</b> · pieni → pienessä · KPT: asunto → asu<b>nn</b>ossa'],
['Lapset + uida','tuo uusi uimahalli','Lapset uivat tuossa uudessa uimahallissa.','The children swim in that new swimming hall.','बच्चाहरू त्यो नयाँ पौडी हलमा पौडिन्छन्।','uusi → <b>uudessa</b> (old -si word)'],
['Susan ja Jere + ottaa aurinkoa','kuuma ranta','Susan ja Jere ottavat aurinkoa kuumalla rannalla.','Susan and Jere sunbathe on the hot beach.','सुसान र जेरे तातो किनारमा घाम ताप्छन्।','ranta takes -lla · KPT: ranta → ra<b>nn</b>alla'],
['Sinä + kävellä koiran kanssa','iso puisto','Sinä kävelet koiran kanssa isossa puistossa.','You walk with the dog in the big park.','तिमी ठूलो पार्कमा कुकुरसँग हिँड्छौ।','type 3: kävellä → kävele- → sinä kävelet'],
['Me + opiskella suomea','tämä kiva koulu','Me opiskelemme suomea tässä kivassa koulussa.','We study Finnish in this nice school.','हामी यो राम्रो विद्यालयमा फिनिस पढ्छौं।','opiskella → opiskele- → me opiskelemme'],
['Te + katsoa televisiota','vihreä sohva','Te katsotte televisiota vihreällä sohvalla.','You watch TV on the green sofa.','तिमीहरू हरियो सोफामा टिभी हेर्छौ।','on a sofa = -lla: sohva<b>lla</b>, vihreä<b>llä</b>'],
['Sinä + matkustaa','Eurooppa','Sinä matkustat Euroopassa.','You travel in Europe.','तिमी युरोपमा यात्रा गर्छौ।','KPT: Eurooppa → Euroo<b>p</b>assa'],
['Isoisä + ajaa autolla','kapea katu','Isoisä ajaa autolla kapealla kadulla.','Grandfather drives on the narrow street.','हजुरबुबा साँघुरो सडकमा गाडी चलाउनुहुन्छ।','on a street = -lla · KPT: katu → ka<b>d</b>ulla']];
// speaking model: what is in your home (like the textbook task)
const HW_EX18=[
['A','Mitä sinulla on makuuhuoneessa?','What do you have in the bedroom?','तिम्रो सुत्ने कोठामा के छ?'],
['B','Minulla on makuuhuoneessa sänky, vaatekaappi ja pieni pöytä.','In my bedroom I have a bed, a wardrobe and a small table.','मेरो सुत्ने कोठामा ओछ्यान, लुगा दराज र सानो टेबल छ।'],
['A','Millainen sänky on?','What is the bed like?','ओछ्यान कस्तो छ?'],
['B','Se on iso ja pehmeä.','It is big and soft.','यो ठूलो र नरम छ।'],
['A','Minkä värinen vaatekaappi on?','What colour is the wardrobe?','लुगा दराज कुन रङको छ?'],
['B','Valkoinen.','White.','सेतो।'],
['A','Mitä sinulla on keittiössä?','What do you have in the kitchen?','भान्सामा के छ?'],
['B','Keittiössä on jääkaappi, liesi, pöytä ja kaksi tuolia.','In the kitchen there is a fridge, a stove, a table and two chairs.','भान्सामा फ्रिज, चुलो, टेबल र दुईवटा कुर्सी छन्।'],
['A','Onko sinulla sohva olohuoneessa?','Do you have a sofa in the living room?','बैठक कोठामा सोफा छ?'],
['B','On. Minulla on harmaa sohva ja iso matto.','Yes. I have a grey sofa and a big rug.','छ। मसँग खैरो सोफा र ठूलो गलैंचा छ।'],
['A','Onko sinulla televisiota?','Do you have a TV?','टिभी छ?'],
['B','Ei, minulla ei ole televisiota.','No, I don\'t have a TV.','छैन, मसँग टिभी छैन।'],
['A','Mitä sinulla ei ole, mutta tarvitset?','What don\'t you have, but need?','तिमीसँग के छैन, तर चाहिन्छ?'],
['B','Minulla ei ole kirjahyllyä. Tarvitsen kirjahyllyn.','I don\'t have a bookshelf. I need a bookshelf.','मसँग किताबको र्‍याक छैन। मलाई र्‍याक चाहिन्छ।']];
// pronunciation: two different vowels (diphthongs)
const HW_DIPH=[['ai',[['aika','time'],['laiva','ship'],['kaikki','all']]],['ei',[['hei','hi'],['leipä','bread'],['seinä','wall']]],['oi',[['koira','dog'],['poika','boy'],['moi','hi']]],['ui',[['uida','to swim'],['kuiva','dry'],['muisti','memory']]],
['yi',[['hyi','yuck'],['lyijy','lead (metal)'],['myin','I sold']]],['äi',[['äiti','mother'],['päivä','day'],['näin','I saw']]],['öi',[['öisin','at night'],['töissä','at work'],['söin','I ate']]],['au',[['auto','car'],['sauna','sauna'],['kaunis','beautiful']]],
['eu',[['neuvo','advice'],['leuka','chin'],['seura','company']]],['iu',[['viulu','violin'],['kiulu','bucket'],['hius','a hair']]],['ou',[['koulu','school'],['joulu','Christmas'],['housut','trousers']]],['äy',[['käydä','to visit'],['täysi','full'],['näytös','show']]],
['öy',[['pöytä','table'],['löytää','to find'],['köyhä','poor']]],['ie',[['tie','road'],['kieli','language'],['viedä','to take']]],['uo',[['ruoka','food'],['tuoli','chair'],['suomi','Finnish']]],['yö',[['yö','night'],['työ','work'],['syödä','to eat']]]];
const HOMEWORK=[{id:'hw1104',due:'2026-11-04',title:'KOTITEHTÄVÄ keskiviikoksi 4.11',task:['Opiskele k, p, t-vaihtelu ja esimerkit paperissa.','Study k-p-t gradation and the examples on the paper.','k, p, t-परिवर्तन र कागजमा भएका उदाहरणहरू अध्ययन गर्नुहोस्।']}];
const hwKeyTable=(rows,isPl)=>`<div class="tbl"><table><thead><tr><th>#</th><th>Task</th><th>Answer</th><th>Rule</th><th class="t-en">English</th><th class="t-ne">Nepali</th></tr></thead><tbody>${rows.map((r,i)=>isPl?`<tr><td class="mono">${i+1}</td><td>${esc(r[0])} + t</td><td><b class="fi">${esc(r[1])}</b> ${spk(r[1])}</td><td class="mono">${KPT_EN_KEY[r[2]]}</td><td class="t-en mut">${esc(r[3])}</td><td class="ne t-ne">${esc(r[4])}</td></tr>`
  :`<tr><td class="mono">${i+1}</td><td>${esc(r[0])} + ${esc(r[1])}</td><td><b class="fi">${esc(r[2].replace('|',' / '))}</b> ${spk(r[2].split('|')[0])}</td><td class="mono">${KPT_EN_KEY[r[5]]}</td><td class="t-en mut">${esc(r[3])}</td><td class="ne t-ne">${esc(r[4])}</td></tr>`).join('')}</tbody></table></div>`;
function hwBanner(){const t=todayKey();const h=HOMEWORK.filter(x=>x.due>=t&&daysTo(x.due)<=7).sort((a,b)=>a.due<b.due?-1:1)[0];if(!h)return '';
  const d=daysTo(h.due);return `<div class="examban" style="background:var(--s-in)"><div class="row" style="justify-content:space-between"><div><div class="eyebrow" style="margin:0">Homework · ${d===0?'due today':d===1?'due tomorrow':'due in '+d+' days'}</div><div class="eb-big" style="color:var(--c-in)">🏫 ${esc(h.title)}</div><div>${esc(h.task[0])} <span class="t-en mut">${esc(h.task[1])}</span></div></div><button class="btn sm pri" data-go="homework">Open homework</button></div></div>`}
RENDER.homework=()=>{
  const h=HOMEWORK[0];
  $('#p-homework').innerHTML=`<p class="eyebrow">Kotitehtävät · Homework</p><h2>${esc(h.title)}</h2>
  <div class="note" style="margin-bottom:14px"><p class="fi" style="margin:0;font-size:1.1rem">${esc(h.task[0])}</p><div class="t-en">${esc(h.task[1])}</div><div class="ne t-ne">${esc(h.task[2])}</div></div>
  <p class="lede">Work through the parts in order. Each exercise checks your answers and explains the rule. The answer keys are hidden, so try first.</p>
  <div id="hwMine"></div>
  ${jumpNav([['hwmine','My list'],['hw1','1 · The book table'],['hw2','2 · Harjoitus 5'],['hw3','3 · Harjoitus 6'],['hw4','4 · Plurals A/B'],['hw5','5 · Sentences (ex. 16)'],['hw6','6 · Speaking (ex. 18)'],['hw7','7 · Two vowels']])}
  ${H3('hw1','1 · Learn the table from the paper','ess')}
  <p class="lede">The first form has the <span class="kS">strong</span> consonant. When the ending is added, it becomes <span class="kW">weak</span>. Say each pair aloud three times.</p>
  <div class="card">${HW_BOOK.map(e=>{const t=KPT_TYPES.find(x=>x[0]===e[5]);return kptRow(e,t[1],t[2])}).join('')}</div>
  <div class="card" style="margin-top:10px"><h4>Ei k-p-t-vaihtelua (no change)</h4><p class="mut" style="margin:0 0 6px;font-size:.9rem">hk, sk, st, tk never change · two vowels at the end: nothing to change</p>${HW_BOOK_NONE.map(e=>kptRow(e,'','')).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-go="kpt">Full KPT page (${KPT_ALL.length}+ examples)</button></div>
  ${H3('hw2','2 · Harjoitus 5: write the words','par')}
  <div class="row"><button class="btn pri sm" data-go="practice" data-ex="hw5">Do it with checking (20)</button></div>
  <details class="card" style="margin-top:10px"><summary>Answer key (try first!)</summary><div class="db">${hwKeyTable(HW5)}</div></details>
  ${H3('hw3','3 · Harjoitus 6: write the words','par')}
  <div class="row"><button class="btn pri sm" data-go="practice" data-ex="hw6">Do it with checking (20)</button></div>
  <details class="card" style="margin-top:10px"><summary>Answer key (try first!)</summary><div class="db">${hwKeyTable(HW6)}<p class="mut" style="font-size:.9rem;margin:8px 0 0">Watch out: <b>tasku → taskussa</b> (sk) and <b>posti → postissa</b> (st) do not change.</p></div></details>
  ${H3('hw4','4 · Plurals: A and B (pair work)','par')}
  <p class="lede">Partner A makes the plural, partner B finds the basic form. Plural <span class="end">-t</span> closes the syllable, so the consonant goes weak. Going back to the basic form, it becomes strong again.</p>
  <div class="row"><button class="btn pri sm" data-go="practice" data-ex="hwpl">Do both directions (19)</button></div>
  <details class="card" style="margin-top:10px"><summary>Answer key</summary><div class="db">${hwKeyTable(HWPL,true)}</div></details>
  ${H3('hw5','5 · Exercise 16: verb + place + ending','in')}
  <p class="lede">Two rules: (1) the verb gets the person ending, (2) <b>every word</b> describing the place gets the same ending: <span class="fi">hyvä<b>ssä</b> ravintola<b>ssa</b></span>. Pointing words change too: <b>tämä → tässä</b>, <b>tuo → tuossa</b>, <b>se → siinä</b>.</p>
  <div class="stack" style="gap:8px">${HW_EX16.map((s,i)=>`<details class="card"><summary><span class="mono mut">${i+1}</span> ${esc(s[0])} + <i>${esc(s[1])}</i></summary><div class="db">${lineHTML(s[2],s[3],s[4])}<div class="mut" style="font-size:.9rem;margin-top:6px">💡 ${s[5]}</div></div></details>`).join('')}</div>
  <p class="mut" style="font-size:.9rem">Write your own sentence first, then open it to compare.</p>
  ${H3('hw6','6 · Exercise 18: talk about your home','out')}
  <p class="lede">Use: <span class="fi">Mitä sinulla on …ssa?</span> · <span class="fi">Millainen … on?</span> · <span class="fi">Minkä värinen … on?</span> · <span class="fi">Minulla ei ole …a</span> (partitive after "not").</p>
  <div class="card"><div class="stack" style="gap:6px">${HW_EX18.map(l=>`<div class="row" style="gap:8px;flex-wrap:nowrap;align-items:flex-start"><span class="mono mut" style="min-width:1.2em">${l[0]}</span>${lineHTML(l[1],l[2],l[3])}</div>`).join('')}</div>
   <div class="row" style="margin-top:10px"><button class="btn ghost sm" id="hwPlay18">▶ Play the dialogue</button></div></div>
  ${H3('hw7','7 · Pronunciation: two different vowels','nom')}
  <p class="lede">Say both vowels inside one syllable, gliding from the first to the second: <b>ai</b> like Nepali "ऐ" in "भाइ", <b>au</b> like "औ". Tap each word, repeat it three times.</p>
  <div class="grid tight">${HW_DIPH.map(([d,ws])=>`<div class="card" style="padding:10px 12px"><div class="mono" style="font-size:1.3rem;font-weight:700;color:var(--fi)">${d}</div>${ws.map(w=>`<div class="row" style="gap:6px;flex-wrap:nowrap;margin-top:4px">${spk(w[0])}<b class="fi">${esc(w[0])}</b><span class="mut t-en" style="font-size:.85rem">${esc(w[1])}</span></div>`).join('')}</div>`).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" data-go="practice" data-ex="lenlisten">🎧 Listening game: short or long sound?</button></div>
  <div class="note" style="margin-top:14px"><span class="lbl">New homework?</span>Send a photo of the next homework or exercise sheet and it will be added here, with answers and the rule for each item.</div>`;
  $('#hwPlay18').onclick=()=>playLines(HW_EX18.map(l=>[l[0],l[1]]),null,null);
};
