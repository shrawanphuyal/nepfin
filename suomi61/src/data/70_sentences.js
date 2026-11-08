// Lauseet · sentence lab (6 Nov). Hand-checked forms only.
// Noun forms: f = [genitive, partitive, -ssa, -sta, -Vn, -lla, -lta, -lle, plural -t]; '' = not used for this word.
// t: 'in' = place you are inside (-ssa/-sta/-Vn) · 'on' = place on a surface or open place (-lla/-lta/-lle)
//    'city' / 'city-on' · 'person' (-lla/-lta/-lle) · 'thing' · 'food'
// at/from/to: special forms (kotona, kotoa, kotiin).
const SB_NOUNS = {
kauppa:{f:['kaupan','kauppaa','kaupassa','kaupasta','kauppaan','kaupalla','kaupalta','kaupalle','kaupat'],t:'in',en:'the shop',ne:'पसल',e:'🏪'},
koulu:{f:['koulun','koulua','koulussa','koulusta','kouluun','koululla','koululta','koululle','koulut'],t:'in',en:'school',ne:'विद्यालय',e:'🏫'},
kirjasto:{f:['kirjaston','kirjastoa','kirjastossa','kirjastosta','kirjastoon','kirjastolla','kirjastolta','kirjastolle','kirjastot'],t:'in',en:'the library',ne:'पुस्तकालय',e:'📚'},
kahvila:{f:['kahvilan','kahvilaa','kahvilassa','kahvilasta','kahvilaan','kahvilalla','kahvilalta','kahvilalle','kahvilat'],t:'in',en:'the café',ne:'क्याफे',e:'☕'},
ravintola:{f:['ravintolan','ravintolaa','ravintolassa','ravintolasta','ravintolaan','ravintolalla','ravintolalta','ravintolalle','ravintolat'],t:'in',en:'the restaurant',ne:'रेस्टुरेन्ट',e:'🍽️'},
yliopisto:{f:['yliopiston','yliopistoa','yliopistossa','yliopistosta','yliopistoon','yliopistolla','yliopistolta','yliopistolle','yliopistot'],t:'in',en:'the university',ne:'विश्वविद्यालय',e:'🎓'},
pankki:{f:['pankin','pankkia','pankissa','pankista','pankkiin','pankilla','pankilta','pankille','pankit'],t:'in',en:'the bank',ne:'बैंक',e:'🏦'},
sauna:{f:['saunan','saunaa','saunassa','saunasta','saunaan','saunalla','saunalta','saunalle','saunat'],t:'in',en:'the sauna',ne:'सौना',e:'🧖'},
keittiö:{f:['keittiön','keittiötä','keittiössä','keittiöstä','keittiöön','keittiöllä','keittiöltä','keittiölle','keittiöt'],t:'in',en:'the kitchen',ne:'भान्सा',e:'🍳'},
koti:{f:['kodin','kotia','kodissa','kodista','kotiin','kodilla','kodilta','kodille','kodit'],t:'in',en:'home',ne:'घर',e:'🏡',at:'kotona',from:'kotoa',to:'kotiin',enat:'at home',enfrom:'from home',ento:'home'},
työ:{f:['työn','työtä','työssä','työstä','työhön','työllä','työltä','työlle','työt'],t:'in',en:'work',ne:'काम',e:'💼',at:'töissä',from:'töistä',to:'töihin',enat:'at work',enfrom:'from work',ento:'to work'},
asema:{f:['aseman','asemaa','asemassa','asemasta','asemaan','asemalla','asemalta','asemalle','asemat'],t:'on',en:'the station',ne:'स्टेसन',e:'🚉'},
tori:{f:['torin','toria','torissa','torista','toriin','torilla','torilta','torille','torit'],t:'on',en:'the market square',ne:'बजार चोक',e:'🧺'},
pysäkki:{f:['pysäkin','pysäkkiä','pysäkissä','pysäkistä','pysäkkiin','pysäkillä','pysäkiltä','pysäkille','pysäkit'],t:'on',en:'the bus stop',ne:'बस बिसौनी',e:'🚏'},
kuntosali:{f:['kuntosalin','kuntosalia','kuntosalissa','kuntosalista','kuntosaliin','kuntosalilla','kuntosalilta','kuntosalille','kuntosalit'],t:'on',en:'the gym',ne:'जिम',e:'🏋️'},
Helsinki:{f:['Helsingin','Helsinkiä','Helsingissä','Helsingistä','Helsinkiin','','','',''],t:'city',en:'Helsinki',ne:'हेल्सिंकी',e:'🏙️'},
Espoo:{f:['Espoon','Espoota','Espoossa','Espoosta','Espooseen','','','',''],t:'city',en:'Espoo',ne:'एस्पो',e:'🏘️'},
Turku:{f:['Turun','Turkua','Turussa','Turusta','Turkuun','','','',''],t:'city',en:'Turku',ne:'टुर्कु',e:'🏰'},
Tampere:{f:['Tampereen','Tamperetta','','','','Tampereella','Tampereelta','Tampereelle',''],t:'city-on',en:'Tampere',ne:'टाम्पेरे',e:'🏭'},
Vantaa:{f:['Vantaan','Vantaata','','','','Vantaalla','Vantaalta','Vantaalle',''],t:'city-on',en:'Vantaa',ne:'भान्ता',e:'✈️'},
Suomi:{f:['Suomen','Suomea','Suomessa','Suomesta','Suomeen','','','',''],t:'city',en:'Finland',ne:'फिनल्यान्ड',e:'🇫🇮'},
Nepal:{f:['Nepalin','Nepalia','Nepalissa','Nepalista','Nepaliin','','','',''],t:'city',en:'Nepal',ne:'नेपाल',e:'🇳🇵'},
Lappi:{f:['Lapin','Lappia','Lapissa','Lapista','Lappiin','','','',''],t:'city',en:'Lapland',ne:'ल्यापल्यान्ड',e:'❄️'},
Kathmandu:{f:['Kathmandun','Kathmandua','Kathmandussa','Kathmandusta','Kathmanduun','','','',''],t:'city',en:'Kathmandu',ne:'काठमाडौं',e:'🛕'},
Mikko:{f:['Mikon','Mikkoa','','','','Mikolla','Mikolta','Mikolle',''],t:'person',en:'Mikko',ne:'मिक्को',e:'🧑'},
Sita:{f:['Sitan','Sitaa','','','','Sitalla','Sitalta','Sitalle',''],t:'person',en:'Sita',ne:'सीता',e:'👩'},
äiti:{f:['äidin','äitiä','','','','äidillä','äidiltä','äidille','äidit'],t:'person',en:'my mother',ne:'आमा',e:'👩‍👧'},
ystävä:{f:['ystävän','ystävää','','','','ystävällä','ystävältä','ystävälle','ystävät'],t:'person',en:'a friend',ne:'साथी',e:'🧑‍🤝‍🧑'},
opettaja:{f:['opettajan','opettajaa','','','','opettajalla','opettajalta','opettajalle','opettajat'],t:'person',en:'the teacher',ne:'शिक्षक',e:'🧑‍🏫'},
lääkäri:{f:['lääkärin','lääkäriä','lääkärissä','lääkäristä','lääkäriin','lääkärillä','lääkäriltä','lääkärille','lääkärit'],t:'person',en:'the doctor',ne:'डाक्टर',e:'🧑‍⚕️'},
kahvi:{f:['kahvin','kahvia','kahvissa','kahvista','kahviin','','','','kahvit'],t:'food',en:'coffee',ne:'कफी',e:'☕'},
tee:{f:['teen','teetä','teessä','teestä','teehen','','','','teet'],t:'food',en:'tea',ne:'चिया',e:'🍵'},
vesi:{f:['veden','vettä','vedessä','vedestä','veteen','','','','vedet'],t:'food',en:'water',ne:'पानी',e:'💧'},
maito:{f:['maidon','maitoa','maidossa','maidosta','maitoon','','','','maidot'],t:'food',en:'milk',ne:'दूध',e:'🥛'},
mehu:{f:['mehun','mehua','mehussa','mehusta','mehuun','','','','mehut'],t:'food',en:'juice',ne:'जुस',e:'🧃'},
leipä:{f:['leivän','leipää','leivässä','leivästä','leipään','','','','leivät'],t:'food',en:'bread',ne:'रोटी',e:'🍞'},
riisi:{f:['riisin','riisiä','riisissä','riisistä','riisiin','','','','riisit'],t:'food',en:'rice',ne:'भात',e:'🍚'},
keitto:{f:['keiton','keittoa','keitossa','keitosta','keittoon','','','','keitot'],t:'food',en:'soup',ne:'सुप',e:'🍲'},
salaatti:{f:['salaatin','salaattia','salaatissa','salaatista','salaattiin','','','','salaatit'],t:'food',en:'salad',ne:'सलाद',e:'🥗'},
kirja:{f:['kirjan','kirjaa','kirjassa','kirjasta','kirjaan','kirjalla','kirjalta','kirjalle','kirjat'],t:'thing',en:'a book',ne:'किताब',e:'📖'},
lehti:{f:['lehden','lehteä','lehdessä','lehdestä','lehteen','lehdellä','lehdeltä','lehdelle','lehdet'],t:'thing',en:'a newspaper',ne:'पत्रिका',e:'📰'},
lahja:{f:['lahjan','lahjaa','lahjassa','lahjasta','lahjaan','lahjalla','lahjalta','lahjalle','lahjat'],t:'thing',en:'a present',ne:'उपहार',e:'🎁'},
kukka:{f:['kukan','kukkaa','kukassa','kukasta','kukkaan','kukalla','kukalta','kukalle','kukat'],t:'thing',en:'a flower',ne:'फूल',e:'🌷'},
auto:{f:['auton','autoa','autossa','autosta','autoon','autolla','autolta','autolle','autot'],t:'thing',en:'a car',ne:'गाडी',e:'🚗'},
bussi:{f:['bussin','bussia','bussissa','bussista','bussiin','bussilla','bussilta','bussille','bussit'],t:'thing',en:'the bus',ne:'बस',e:'🚌'},
juna:{f:['junan','junaa','junassa','junasta','junaan','junalla','junalta','junalle','junat'],t:'thing',en:'the train',ne:'रेल',e:'🚆'},
pyörä:{f:['pyörän','pyörää','pyörässä','pyörästä','pyörään','pyörällä','pyörältä','pyörälle','pyörät'],t:'thing',en:'a bike',ne:'साइकल',e:'🚲'},
pöytä:{f:['pöydän','pöytää','pöydässä','pöydästä','pöytään','pöydällä','pöydältä','pöydälle','pöydät'],t:'thing',en:'the table',ne:'टेबल',e:'🪵'},
puhelin:{f:['puhelimen','puhelinta','puhelimessa','puhelimesta','puhelimeen','puhelimella','puhelimelta','puhelimelle','puhelimet'],t:'thing',en:'a phone',ne:'फोन',e:'📱'},
koira:{f:['koiran','koiraa','koirassa','koirasta','koiraan','koiralla','koiralta','koiralle','koirat'],t:'thing',en:'a dog',ne:'कुकुर',e:'🐕'},
kissa:{f:['kissan','kissaa','kissassa','kissasta','kissaan','kissalla','kissalta','kissalle','kissat'],t:'thing',en:'a cat',ne:'बिरालो',e:'🐈'},
sisko:{f:['siskon','siskoa','','','','siskolla','siskolta','siskolle','siskot'],t:'person',en:'a sister',ne:'दिदी / बहिनी',e:'👧'}
};
// the 10 forms, what they answer and what they mean
const SB_CASES = [
 {k:'nom', i:-1, fi:'perusmuoto', name:'Basic form (nominative)', end:'–', q:'kuka? mikä?', en:'the word itself: subject, or after on (Tämä on kauppa)', ne:'मूल रूप (कर्ता)', c:'S'},
 {k:'gen', i:0, fi:'genetiivi', name:'Genitive', end:'-n', q:'kenen? minkä?', en:'whose, of (Mikon = Mikko\'s); also a whole object (Ostan kirjan)', ne:'को / का / की', c:'G'},
 {k:'part', i:1, fi:'partitiivi', name:'Partitive', end:'-a, -ta, -tta', q:'ketä? mitä?', en:'some, part of, not, after numbers 2+ (kahvia, kaksi kirjaa)', ne:'केही / अलिकति (नेपालीमा सिधा छैन)', c:'O'},
 {k:'ine', i:2, fi:'inessiivi', name:'Inside: in', end:'-ssa / -ssä', q:'missä?', en:'in, at (kaupassa = in the shop)', ne:'मा (भित्र)', c:'P'},
 {k:'ela', i:3, fi:'elatiivi', name:'Inside: out of', end:'-sta / -stä', q:'mistä?', en:'out of, from (kaupasta = from the shop)', ne:'बाट (भित्रबाट)', c:'P'},
 {k:'ill', i:4, fi:'illatiivi', name:'Inside: into', end:'-Vn, -hVn, -seen', q:'mihin?', en:'into, to (kauppaan = into the shop)', ne:'भित्र (जाने), तिर', c:'P'},
 {k:'ade', i:5, fi:'adessiivi', name:'Surface: on, at; has', end:'-lla / -llä', q:'missä? kenellä?', en:'on, at (asemalla); by (bussilla); has (Mikolla on auto)', ne:'मा (माथि); बाट (साधन); सँग (छ)', c:'P'},
 {k:'abl', i:6, fi:'ablatiivi', name:'Surface: off, from', end:'-lta / -ltä', q:'mistä? keneltä?', en:'off, from (asemalta; Mikolta = from Mikko)', ne:'बाट', c:'P'},
 {k:'all', i:7, fi:'allatiivi', name:'Surface: onto, to', end:'-lle', q:'mihin? kenelle?', en:'onto, to (asemalle; Mikolle = to Mikko)', ne:'लाई / तिर', c:'P'},
 {k:'pl', i:8, fi:'monikko', name:'Plural', end:'-t', q:'ketkä? mitkä?', en:'more than one (kaupat = the shops)', ne:'हरू', c:'S'}
];
// personal pronouns in the forms you need most
const SB_PRON = [
 ['minä','minun','minua','minulla','minulta','minulle','I · me','म · मेरो · मसँग · मबाट · मलाई'],
 ['sinä','sinun','sinua','sinulla','sinulta','sinulle','you','तिमी · तिम्रो · तिमीसँग · तिमीबाट · तिमीलाई'],
 ['hän','hänen','häntä','hänellä','häneltä','hänelle','he / she','ऊ · उसको · उसँग · उबाट · उसलाई'],
 ['me','meidän','meitä','meillä','meiltä','meille','we · us','हामी · हाम्रो · हामीसँग · हामीबाट · हामीलाई'],
 ['te','teidän','teitä','teillä','teiltä','teille','you (pl.)','तिमीहरू · तिमीहरूको · …'],
 ['he','heidän','heitä','heillä','heiltä','heille','they · them','उनीहरू · उनीहरूको · …']
];
// the verb decides the ending
const SB_VERBCASE = [
 ['mennä, tulla kotiin, matkustaa','mihin? -Vn / -lle','Menen kauppaan. Matkustan Tampereelle.','I go to the shop. I travel to Tampere.','कहाँ जाने: भित्र / तिर'],
 ['olla, asua, opiskella (place)','missä? -ssa / -lla','Asun Espoossa. Olen asemalla.','I live in Espoo. I am at the station.','कहाँ: मा'],
 ['tulla, lähteä','mistä? -sta / -lta','Tulen töistä. Lähden asemalta.','I come from work. I leave from the station.','कहाँबाट: बाट'],
 ['soittaa, antaa, kertoa, sanoa','kenelle? -lle','Soitan äidille. Annan kirjan Mikolle.','I call my mother. I give the book to Mikko.','कसलाई: लाई'],
 ['kysyä, saada, lainata','keneltä? -lta','Kysyn opettajalta. Sain lahjan Sitalta.','I ask the teacher. I got a present from Sita.','कसबाट: बाट'],
 ['olla (have)','kenellä? -lla + on','Minulla on auto. Mikolla on kiire.','I have a car. Mikko is in a hurry.','कोसँग छ: सँग'],
 ['pitää (like)','mistä? -sta','Pidän kahvista. En pidä kylmästä.','I like coffee. I don\'t like the cold.','मन पर्नु: बाट (फिनिसमा)'],
 ['juoda, syödä, ostaa (some), tarvita','mitä? partitive','Juon kahvia. Tarvitsen maitoa.','I drink coffee. I need milk.','केही: partitive'],
 ['odottaa, rakastaa, auttaa, ajatella','ketä? mitä? partitive (always)','Odotan bussia. Autan ystävää.','I wait for the bus. I help a friend.','सधैँ partitive'],
 ['puhua, opiskella (a subject)','mitä? partitive','Puhun suomea. Opiskelen historiaa.','I speak Finnish. I study history.','भाषा: partitive'],
 ['ostaa, lukea loppuun, tavata (the whole thing)','minkä? kenet? -n','Ostan kirjan. Tapaan Mikon.','I buy the book. I meet Mikko.','पूरै वस्तु: -n'],
 ['haluta, voida, osata, pitää (must), täytyy','+ basic verb (infinitive)','Haluan juoda teetä. Minun pitää lähteä.','I want to drink tea. I have to leave.','चाहनु + क्रियाको मूल रूप (-नु)']
];
// the builder: verbs, what they need, English
const SB_SUBJ = [['minä',0,'I'],['sinä',1,'you'],['hän',2,'he / she'],['me',3,'we'],['te',4,'you (pl.)'],['he',5,'they'],['Ram',2,'Ram'],['Sita ja Mei',5,'Sita and Mei']];
const SB_HAVE_SUBJ = ['minulla','sinulla','hänellä','meillä','teillä','heillä','Ramilla','Sitalla ja Meillä'];
const SB_VERBS = [
 {v:'olla', f:['olen','olet','on','olemme','olette','ovat'], en:'be', comp:'at', list:['koti','työ','kauppa','koulu','kirjasto','yliopisto','sauna','asema','kuntosali','Helsinki','Tampere'], manner:false},
 {v:'asua', f:['asun','asut','asuu','asumme','asutte','asuvat'], en:'live', comp:'at', notime:true, list:['Espoo','Helsinki','Vantaa','Tampere','Turku','Suomi','Nepal','Kathmandu']},
 {v:'mennä', f:['menen','menet','menee','menemme','menette','menevät'], en:'go', comp:'to', list:['kauppa','koulu','kirjasto','yliopisto','työ','koti','sauna','asema','kuntosali','Helsinki','Tampere'], manner:true},
 {v:'tulla', f:['tulen','tulet','tulee','tulemme','tulette','tulevat'], en:'come', comp:'from', list:['kauppa','koulu','yliopisto','työ','koti','asema','kuntosali','Turku','Tampere','Nepal'], manner:true},
 {v:'matkustaa', f:['matkustan','matkustat','matkustaa','matkustamme','matkustatte','matkustavat'], en:'travel', comp:'to', list:['Lappi','Turku','Tampere','Helsinki','Nepal','Kathmandu'], manner:true},
 {v:'juoda', f:['juon','juot','juo','juomme','juotte','juovat'], en:'drink', comp:'obj', list:['kahvi','tee','vesi','maito','mehu'], obj:'part'},
 {v:'syödä', f:['syön','syöt','syö','syömme','syötte','syövät'], en:'eat', comp:'obj', list:['leipä','riisi','keitto','salaatti'], obj:'part'},
 {v:'ostaa', f:['ostan','ostat','ostaa','ostamme','ostatte','ostavat'], en:'buy', comp:'obj', list:['maito','leipä','kahvi','kirja','lahja','puhelin','auto'], obj:'mixed'},
 {v:'lukea', f:['luen','luet','lukee','luemme','luette','lukevat'], en:'read', comp:'obj', list:['kirja','lehti'], obj:'part'},
 {v:'odottaa', f:['odotan','odotat','odottaa','odotamme','odotatte','odottavat'], en:'wait for', comp:'obj', list:['bussi','juna','ystävä','Mikko','äiti'], obj:'part'},
 {v:'puhua', f:['puhun','puhut','puhuu','puhumme','puhutte','puhuvat'], en:'speak', comp:'lang'},
 {v:'soittaa', f:['soitan','soitat','soittaa','soitamme','soitatte','soittavat'], en:'call', comp:'all', list:['äiti','Mikko','ystävä','opettaja','lääkäri','Sita']},
 {v:'antaa', f:['annan','annat','antaa','annamme','annatte','antavat'], en:'give', comp:'obj2', list:['kirja','lahja','kukka'], to:['Mikko','äiti','ystävä','opettaja','Sita']},
 {v:'pitää', f:['pidän','pidät','pitää','pidämme','pidätte','pitävät'], en:'like', comp:'ela', notime:true, list:['kahvi','tee','sauna','Suomi','Helsinki','kirja','koira','kissa']},
 {v:'(have)', f:['on','on','on','on','on','on'], en:'have', comp:'have', notime:true, list:['auto','koira','kissa','sisko','pyörä','puhelin']}
];
// irregular English verb forms the builder needs
const SB_EN3 = {go:'goes', 'wait for':'waits for', have:'has'};
const SB_LANGS = [['suomea','Finnish'],['englantia','English'],['nepalia','Nepali'],['ruotsia','Swedish'],['hindiä','Hindi']];
const SB_TIME = [['','',''],['tänään','today'],['huomenna','tomorrow'],['aamulla','in the morning'],['illalla','in the evening'],['maanantaina','on Monday'],['viikonloppuna','at the weekend'],['joka päivä','every day']];
const SB_MANNER = [['','',''],['bussilla','by bus','bussi + -lla'],['junalla','by train','juna + -lla'],['autolla','by car','auto + -lla'],['pyörällä','by bike','pyörä + -llä'],['kävellen','on foot','kävellä → kävellen']];

// one word, many jobs
const SB_JOBS = {
 kauppa:[['Kauppa on auki.','The shop is open.','पसल खुला छ।','kauppa','basic form: the subject'],['Menen kauppaan.','I go to the shop.','म पसल जान्छु।','kauppaan','into: mihin?'],['Olen kaupassa.','I am in the shop.','म पसलमा छु।','kaupassa','in: missä? (k-p-t: pp → p)'],['Tulen kaupasta.','I come from the shop.','म पसलबाट आउँछु।','kaupasta','out of: mistä?'],['Kaupan ovi on kiinni.','The shop\'s door is closed.','पसलको ढोका बन्द छ।','Kaupan','of: kenen? minkä?'],['En löydä kauppaa.','I can\'t find the shop.','मैले पसल भेटिनँ।','kauppaa','partitive: after en'],['Kaupat ovat kiinni sunnuntaina.','The shops are closed on Sunday.','आइतबार पसलहरू बन्द हुन्छन्।','Kaupat','plural: -t']],
 Mikko:[['Mikko on suomalainen.','Mikko is Finnish.','मिक्को फिनिस हुन्।','Mikko','basic form: the subject'],['Soitan Mikolle.','I call Mikko.','म मिक्कोलाई फोन गर्छु।','Mikolle','to whom: kenelle? (kk → k)'],['Sain kirjan Mikolta.','I got a book from Mikko.','मैले मिक्कोबाट किताब पाएँ।','Mikolta','from whom: keneltä?'],['Mikolla on auto.','Mikko has a car.','मिक्कोसँग गाडी छ।','Mikolla','has: kenellä on?'],['Tämä on Mikon kirja.','This is Mikko\'s book.','यो मिक्कोको किताब हो।','Mikon','whose: kenen?'],['Odotan Mikkoa.','I am waiting for Mikko.','म मिक्कोलाई पर्खिरहेको छु।','Mikkoa','partitive: odottaa + ketä?'],['Tapaan Mikon huomenna.','I\'ll meet Mikko tomorrow.','म भोलि मिक्कोलाई भेट्छु।','Mikon','whole object: tavata + kenet?']],
 minä:[['Minä olen Ram.','I am Ram.','म राम हुँ।','Minä','subject'],['Minun nimeni on Ram.','My name is Ram.','मेरो नाम राम हो।','Minun','my: kenen?'],['Minulla on sisko.','I have a sister.','मेरी बहिनी छ।','Minulla','I have: kenellä on?'],['Soita minulle!','Call me!','मलाई फोन गर!','minulle','to me: kenelle?'],['Kysy minulta.','Ask me.','मलाई सोध।','minulta','from me: keneltä?'],['Odotatko minua?','Are you waiting for me?','मलाई पर्खिरहेका छौ?','minua','partitive: ketä?']]
};

// grow a sentence step by step: [fi, en, ne, what was added]
const SB_LADDERS = [
{id:'kahvi', h:['Kahvi','Coffee','कफी'], steps:[
 ['kahvi','coffee','कफी','one word'],['Kahvi, kiitos.','A coffee, please.','एउटा कफी, धन्यवाद।','+ kiitos: a polite request'],['Juon kahvia.','I drink coffee.','म कफी पिउँछु।','+ verb juon (juoda + -n), object kahvi + -a (some coffee)'],['Juon kahvia aamulla.','I drink coffee in the morning.','म बिहान कफी पिउँछु।','+ time: aamu + -lla'],['Juon kahvia aamulla kotona.','I drink coffee at home in the morning.','म बिहान घरमा कफी पिउँछु।','+ place: kotona (at home)'],['Juon kahvia aamulla kotona, koska olen väsynyt.','I drink coffee at home in the morning, because I am tired.','म बिहान घरमा कफी पिउँछु, किनभने म थाकेको हुन्छु।','+ reason: koska …'],['Juon kahvia aamulla kotona, koska olen väsynyt. Entä sinä? Juotko sinäkin kahvia?','… And you? Do you drink coffee too?','… अनि तिमी? तिमी पनि कफी पिउँछौ?','+ ask back: Entä sinä? Juotko …?']],
 gloss:[['Juon','juoda + -n','I drink','V'],['kahvia','kahvi + -a','coffee (some)','O'],['aamulla','aamu + -lla','in the morning','T'],['kotona','koti → kotona','at home','P'],['koska','','because','R'],['olen','olla + -n','I am','V'],['väsynyt','','tired','O'],['Entä sinä?','','and you?','Q'],['Juotko','juot + -ko','do you drink?','Q'],['sinäkin','sinä + -kin','you too','S']]},
{id:'asua', h:['Asua','Living','बस्ने'], steps:[
 ['Espoo','Espoo','एस्पो','one word'],['Espoossa.','In Espoo.','एस्पोमा।','+ -ssa: in (missä?)'],['Asun Espoossa.','I live in Espoo.','म एस्पोमा बस्छु।','+ verb asun (asua + -n)'],['Asun Espoossa kerrostalossa.','I live in a block of flats in Espoo.','म एस्पोको अपार्टमेन्टमा बस्छु।','+ a second place: kerrostalo + -ssa'],['Asun Espoossa pienessä kerrostalossa.','I live in a small block of flats in Espoo.','म एस्पोको सानो अपार्टमेन्टमा बस्छु।','+ adjective with the same ending: pieni → pienessä'],['Asun Espoossa pienessä kerrostalossa ystävän kanssa.','I live in a small block of flats in Espoo with a friend.','म साथीसँग एस्पोको सानो अपार्टमेन्टमा बस्छु।','+ with someone: ystävä + -n + kanssa'],['Asun Espoossa pienessä kerrostalossa ystävän kanssa. Entä sinä? Missä sinä asut?','… And you? Where do you live?','… अनि तिमी? तिमी कहाँ बस्छौ?','+ ask back with the same question word']],
 gloss:[['Asun','asua + -n','I live','V'],['Espoossa','Espoo + -ssa','in Espoo','P'],['pienessä','pieni → piene- + -ssä','in a small','P'],['kerrostalossa','kerrostalo + -ssa','in a block of flats','P'],['ystävän','ystävä + -n','a friend\'s','G'],['kanssa','','with','R'],['Missä','','where?','Q'],['asut','asua + -t','you live','V']]},
{id:'mennä', h:['Mennä','Going','जाने'], steps:[
 ['kauppa','shop','पसल','one word'],['kauppaan','to the shop','पसलतिर','+ -an: into (mihin?)'],['Menen kauppaan.','I go to the shop.','म पसल जान्छु।','+ verb menen (mennä + -n)'],['Menen huomenna kauppaan.','Tomorrow I\'ll go to the shop.','म भोलि पसल जान्छु।','+ time: huomenna'],['Menen huomenna kauppaan bussilla.','Tomorrow I\'ll go to the shop by bus.','म भोलि बसमा पसल जान्छु।','+ how: bussi + -lla'],['Menen huomenna kauppaan bussilla, koska tarvitsen maitoa.','… because I need milk.','… किनभने मलाई दूध चाहिन्छ।','+ reason, and tarvita + partitive: maito + -a'],['Menen huomenna kauppaan bussilla, koska tarvitsen maitoa. Tuletko mukaan?','… Are you coming along?','… सँगै आउँछौ?','+ invite: tulet + -ko']],
 gloss:[['Menen','mennä + -n','I go','V'],['huomenna','','tomorrow','T'],['kauppaan','kauppa + -an','to the shop','P'],['bussilla','bussi + -lla','by bus','M'],['koska','','because','R'],['tarvitsen','tarvita + -n','I need','V'],['maitoa','maito + -a','milk (some)','O'],['Tuletko','tulet + -ko','are you coming?','Q'],['mukaan','','along','M']]},
{id:'puhua', h:['Puhua','Speaking','बोल्ने'], steps:[
 ['suomi','Finnish','फिनिस','one word'],['suomea','Finnish (after puhua)','फिनिस (puhua पछि)','+ -a: partitive'],['Puhun suomea.','I speak Finnish.','म फिनिस बोल्छु।','+ verb puhun (puhua + -n)'],['Puhun vähän suomea.','I speak a little Finnish.','म अलिअलि फिनिस बोल्छु।','+ how much: vähän'],['Puhun vähän suomea ja hyvin englantia.','I speak a little Finnish and English well.','म अलिअलि फिनिस र राम्रो अंग्रेजी बोल्छु।','+ ja: a second object'],['Puhun vähän suomea, mutta ymmärrän jo paljon.','I speak a little Finnish, but I already understand a lot.','म अलिअलि फिनिस बोल्छु, तर धेरै बुझ्छु।','+ mutta: a contrast'],['Puhun vähän suomea, mutta ymmärrän jo paljon. Puhutko sinä nepalia?','… Do you speak Nepali?','… तिमी नेपाली बोल्छौ?','+ ask back: puhut + -ko']],
 gloss:[['Puhun','puhua + -n','I speak','V'],['vähän','','a little','M'],['suomea','suomi + -a','Finnish','O'],['mutta','','but','R'],['ymmärrän','ymmärtää + -n (rt → rr)','I understand','V'],['jo','','already','T'],['paljon','','a lot','M'],['Puhutko','puhut + -ko','do you speak?','Q'],['nepalia','nepali + -a','Nepali','O']]},
{id:'soittaa', h:['Soittaa','Calling','फोन गर्ने'], steps:[
 ['äiti','mother','आमा','one word'],['äidille','to mother','आमालाई','+ -lle: to whom (kenelle?), t → d'],['Soitan äidille.','I call my mother.','म आमालाई फोन गर्छु।','+ verb soitan (soittaa + -n)'],['Soitan äidille illalla.','I call my mother in the evening.','म बेलुका आमालाई फोन गर्छु।','+ time: ilta + -lla'],['Soitan äidille joka ilta Nepaliin.','I call my mother in Nepal every evening.','म हरेक बेलुका नेपालमा आमालाई फोन गर्छु।','+ where to: Nepal + -iin'],['Soitan äidille joka ilta Nepaliin, koska minulla on ikävä.','… because I miss her.','… किनभने मलाई याद आउँछ।','+ reason with minulla on'],['Soitan äidille joka ilta Nepaliin, koska minulla on ikävä. Kenelle sinä soitat usein?','… Who do you call often?','… तिमी प्रायः कसलाई फोन गर्छौ?','+ ask back: Kenelle?']],
 gloss:[['Soitan','soittaa + -n (tt → t)','I call','V'],['äidille','äiti + -lle (t → d)','to mother','P'],['joka ilta','','every evening','T'],['Nepaliin','Nepal + -iin','to Nepal','P'],['koska','','because','R'],['minulla on ikävä','minä + -lla, on','I miss (someone)','V'],['Kenelle','kuka → kenelle','to whom?','Q'],['soitat','soittaa + -t','you call','V'],['usein','','often','T']]},
{id:'olla', h:['Minulla on','Having','मसँग छ'], steps:[
 ['sisko','sister','बहिनी','one word'],['Minulla on sisko.','I have a sister.','मेरी बहिनी छ।','+ minä + -lla + on = I have'],['Minulla on sisko ja kaksi veljeä.','I have a sister and two brothers.','मेरी एउटी बहिनी र दुई भाइ छन्।','+ number 2+ → partitive: veli → veljeä'],['Siskoni nimi on Asha.','My sister\'s name is Asha.','मेरी बहिनीको नाम आशा हो।','+ -ni = my'],['Hän asuu Kathmandussa ja opiskelee lääkäriksi.','She lives in Kathmandu and studies to be a doctor.','उनी काठमाडौंमा बस्छिन् र डाक्टरी पढ्छिन्।','+ two verbs: asuu, opiskelee'],['Minulla ei ole siskoa Suomessa.','I don\'t have a sister in Finland.','फिनल्यान्डमा मेरी बहिनी छैन।','+ ei ole → partitive: siskoa'],['Minulla ei ole siskoa Suomessa. Onko sinulla sisaruksia?','… Do you have brothers or sisters?','… तिम्रा दाजुभाइ-दिदीबहिनी छन्?','+ ask back: Onko sinulla …?']],
 gloss:[['Minulla','minä + -lla','I (have)','S'],['ei ole','','don\'t have','V'],['siskoa','sisko + -a','a sister (after ei)','O'],['Suomessa','Suomi + -ssa','in Finland','P'],['Onko','on + -ko','is there?','Q'],['sinulla','sinä + -lla','you (have)','S'],['sisaruksia','sisarus → plural partitive','siblings','O']]},
{id:'opiskella', h:['Opiskella','Studying','पढ्ने'], steps:[
 ['yliopisto','university','विश्वविद्यालय','one word'],['yliopistossa','at the university','विश्वविद्यालयमा','+ -ssa'],['Opiskelen yliopistossa.','I study at the university.','म विश्वविद्यालयमा पढ्छु।','+ verb opiskelen (opiskella → opiskele- + -n)'],['Opiskelen yliopistossa Espoossa.','I study at the university in Espoo.','म एस्पोको विश्वविद्यालयमा पढ्छु।','+ a city: Espoo + -ssa'],['Opiskelen digitalisaation hallintaa yliopistossa Espoossa.','I study the governance of digitalisation at the university in Espoo.','म एस्पोको विश्वविद्यालयमा डिजिटलाइजेसनको शासन पढ्छु।','+ what: hallinta + -a (partitive), digitalisaatio + -n'],['Opiskelen yliopistossa, ja teen osa-aikatyötä kahvilassa.','I study at the university, and I do part-time work in a café.','म विश्वविद्यालयमा पढ्छु, र क्याफेमा आंशिक काम गर्छु।','+ ja: a second sentence'],['Opiskelen yliopistossa, ja teen osa-aikatyötä kahvilassa. Mitä sinä teet työksesi?','… What do you do for a living?','… तिमी के काम गर्छौ?','+ ask back: Mitä …?']],
 gloss:[['Opiskelen','opiskella + -n','I study','V'],['yliopistossa','yliopisto + -ssa','at the university','P'],['ja','','and','R'],['teen','tehdä → tee- + -n','I do','V'],['osa-aikatyötä','osa-aikatyö + -tä','part-time work','O'],['kahvilassa','kahvila + -ssa','in a café','P'],['Mitä','','what?','Q'],['työksesi','työ + -ksi + -si','as your job','M']]},
{id:'saa', h:['Sää','The weather','मौसम'], steps:[
 ['kylmä','cold','चिसो','one word'],['On kylmä.','It is cold.','चिसो छ।','+ on: it is (no "it" in Finnish)'],['Tänään on kylmä.','It is cold today.','आज चिसो छ।','+ time first, then the verb'],['Tänään on kylmä ja tuulinen päivä.','Today is a cold and windy day.','आज चिसो र हावा चलेको दिन हो।','+ two adjectives + noun'],['Tänään on kylmä päivä, mutta aurinko paistaa.','Today is a cold day, but the sun is shining.','आज चिसो दिन हो, तर घाम लागेको छ।','+ mutta + a new subject: aurinko'],['Tänään on kylmä päivä, mutta aurinko paistaa. Laitan lämpimän takin päälle.','… I\'ll put on a warm coat.','… म न्यानो ज्याकेट लगाउँछु।','+ whole object: takki → takin, adjective lämmin → lämpimän'],['Tänään on kylmä päivä, mutta aurinko paistaa. Millainen sää siellä on?','… What is the weather like there?','… त्यहाँ मौसम कस्तो छ?','+ ask back: Millainen …?']],
 gloss:[['Tänään','','today','T'],['on','olla (hän form)','is','V'],['kylmä','','cold','O'],['päivä','','day','S'],['mutta','','but','R'],['aurinko','','the sun','S'],['paistaa','','shines','V'],['Millainen','','what kind?','Q'],['sää','','the weather','S'],['siellä','','there','P']]},
{id:'pitaa', h:['Pitää','Liking','मन पर्ने'], steps:[
 ['musiikki','music','संगीत','one word'],['musiikista','(of) music','संगीत (बाट)','+ -sta: pitää needs mistä?'],['Pidän musiikista.','I like music.','मलाई संगीत मन पर्छ।','+ verb pidän (pitää + -n, t → d)'],['Pidän nepalilaisesta musiikista.','I like Nepali music.','मलाई नेपाली संगीत मन पर्छ।','+ adjective with the same ending: -sta'],['Pidän nepalilaisesta musiikista ja suomalaisesta saunasta.','I like Nepali music and the Finnish sauna.','मलाई नेपाली संगीत र फिनिस सौना मन पर्छ।','+ ja + a second thing, same ending'],['Pidän nepalilaisesta musiikista, mutta en pidä kylmästä säästä.','I like Nepali music, but I don\'t like cold weather.','मलाई नेपाली संगीत मन पर्छ, तर चिसो मौसम मन पर्दैन।','+ mutta en pidä: the negative keeps -sta'],['Pidän nepalilaisesta musiikista, mutta en pidä kylmästä säästä. Mistä sinä pidät?','… What do you like?','… तिमीलाई के मन पर्छ?','+ ask back: Mistä?']],
 gloss:[['Pidän','pitää + -n (t → d)','I like','V'],['nepalilaisesta','nepalilainen → -sesta','Nepali (of)','O'],['musiikista','musiikki + -sta (kk → k)','music (of)','O'],['mutta','','but','R'],['en pidä','en + pidä','I don\'t like','V'],['kylmästä','kylmä + -stä','cold (of)','O'],['säästä','sää + -stä','weather (of)','O'],['Mistä','','what (of)?','Q'],['pidät','pitää + -t','you like','V']]},
{id:'matka', h:['Matkustaa','Travelling','यात्रा'], steps:[
 ['Lappi','Lapland','ल्यापल्यान्ड','one word'],['Lappiin','to Lapland','ल्यापल्यान्डतिर','+ -iin: into (mihin?)'],['Matkustan Lappiin.','I travel to Lapland.','म ल्यापल्यान्ड जान्छु।','+ verb matkustan'],['Matkustan Lappiin joulukuussa.','I travel to Lapland in December.','म डिसेम्बरमा ल्यापल्यान्ड जान्छु।','+ time: joulukuu + -ssa'],['Matkustan Lappiin joulukuussa junalla ystävän kanssa.','I travel to Lapland in December by train with a friend.','म डिसेम्बरमा साथीसँग रेलमा ल्यापल्यान्ड जान्छु।','+ how (-lla) + with whom (-n kanssa)'],['Matkustan Lappiin joulukuussa, koska haluan nähdä revontulet.','… because I want to see the northern lights.','… किनभने म उत्तरी ज्योति हेर्न चाहन्छु।','+ haluan + infinitive: nähdä'],['Matkustan Lappiin joulukuussa, koska haluan nähdä revontulet. Oletko sinä käynyt Lapissa?','… Have you been to Lapland?','… तिमी ल्यापल्यान्ड गएका छौ?','+ ask back: Oletko käynyt …?']],
 gloss:[['Matkustan','matkustaa + -n','I travel','V'],['Lappiin','Lappi + -in','to Lapland','P'],['joulukuussa','joulukuu + -ssa','in December','T'],['koska','','because','R'],['haluan','haluta + -n','I want','V'],['nähdä','basic form (infinitive)','to see','V'],['revontulet','plural -t','the northern lights','O'],['Oletko','olet + -ko','have you?','Q'],['käynyt','käydä → käynyt','been (visited)','V'],['Lapissa','Lappi + -ssa (pp → p)','in Lapland','P']]}
];
const SB_ROLE = {S:['Subject','कर्ता','who? what?'],V:['Verb','क्रिया','does what?'],O:['Object / what','कर्म','what?'],P:['Place','स्थान','where?'],T:['Time','समय','when?'],M:['How','कसरी','how?'],R:['Link','जोड्ने','and, but, because'],Q:['Question','प्रश्न','?'],G:['Whose','को','whose?']};

// questions from one sentence: each slot becomes a question word
const SB_QSENT = [
{fi:'Ram juo kahvia kahvilassa aamulla.', en:'Ram drinks coffee in the café in the morning.', slots:[
 ['Ram','S','Kuka juo kahvia kahvilassa?','Ram.','Who drinks coffee in the café?'],['juo','V','Mitä Ram tekee aamulla?','Hän juo kahvia.','What does Ram do in the morning?'],['kahvia','O','Mitä Ram juo?','Kahvia.','What does Ram drink?'],['kahvilassa','P','Missä Ram juo kahvia?','Kahvilassa.','Where does Ram drink coffee?'],['aamulla','T','Milloin Ram juo kahvia?','Aamulla.','When does Ram drink coffee?']], yn:['Juoko Ram kahvia?','Juo. / Ei juo.','Does Ram drink coffee?']},
{fi:'Sita menee bussilla yliopistoon kello kahdeksan.', en:'Sita goes to the university by bus at eight.', slots:[
 ['Sita','S','Kuka menee bussilla yliopistoon?','Sita.','Who goes to the university by bus?'],['bussilla','M','Miten Sita menee yliopistoon?','Bussilla.','How does Sita go to the university?'],['yliopistoon','P','Mihin Sita menee?','Yliopistoon.','Where does Sita go?'],['kello kahdeksan','T','Mihin aikaan Sita menee yliopistoon?','Kello kahdeksan.','What time does Sita go to the university?']], yn:['Meneekö Sita bussilla?','Menee. / Ei mene.','Does Sita go by bus?']},
{fi:'Mikko soittaa äidille Turkuun, koska hänellä on ikävä.', en:'Mikko calls his mother in Turku, because he misses her.', slots:[
 ['Mikko','S','Kuka soittaa äidille?','Mikko.','Who calls his mother?'],['äidille','P','Kenelle Mikko soittaa?','Äidille.','Who does Mikko call?'],['Turkuun','P','Mihin Mikko soittaa?','Turkuun.','Where does Mikko call to?'],['koska hänellä on ikävä','R','Miksi Mikko soittaa äidille?','Koska hänellä on ikävä.','Why does Mikko call his mother?']], yn:['Soittaako Mikko äidille?','Soittaa. / Ei soita.','Does Mikko call his mother?']},
{fi:'Meillä on kaksi lasta ja kissa.', en:'We have two children and a cat.', slots:[
 ['Meillä','S','Kenellä on kissa?','Meillä.','Who has a cat?'],['kaksi lasta','O','Montako lasta teillä on?','Kaksi.','How many children do you have?'],['kissa','O','Mikä lemmikki teillä on?','Kissa.','What pet do you have?']], yn:['Onko teillä koiraa?','Ei ole. Meillä ei ole koiraa.','Do you have a dog?']}
];
// question word ↔ the ending in the answer
const SB_QMATCH = [['Missä?','-ssa / -lla','kaupassa, asemalla','in, at'],['Mistä?','-sta / -lta','kaupasta, asemalta','from'],['Mihin?','-Vn / -lle','kauppaan, asemalle','to'],['Kenellä?','-lla','Mikolla (on auto)','who has'],['Keneltä?','-lta','Mikolta','from whom'],['Kenelle?','-lle','Mikolle','to whom'],['Kenen?','-n','Mikon','whose'],['Mitä? Ketä?','partitive','kahvia, Mikkoa','what, whom'],['Miten?','-lla, -sti','bussilla, hitaasti','how'],['Milloin?','-lla, -na','aamulla, maanantaina','when']];

// conversation: answer · add · ask back
const SB_KEEP = [['Joo.','Yeah.','हो।'],['Niin.','Right. / I see.','हो नि।'],['Aha!','Aha!','अँ!'],['Ai jaa?','Oh really?','ए हो र?'],['Okei.','OK.','ठीक छ।'],['Kiva!','Nice!','राम्रो!'],['Oikeasti?','Really?','साँच्चै?'],['Totta!','True!','साँचो!'],['Mielenkiintoista!','Interesting!','रोचक!'],['Entä sinä?','And you?','अनि तिमी?'],['Miten niin?','How so?','कसरी?'],['Mitä tarkoitat?','What do you mean?','के भन्न खोज्नुभएको?'],['Voitko toistaa?','Can you repeat?','फेरि भन्न सक्नुहुन्छ?'],['Hetkinen, mietin.','Just a moment, I\'m thinking.','एकछिन, सोच्दैछु।'],['Minäkin!','Me too!','म पनि!'],['En minäkään.','Me neither.','म पनि होइन।']];
const SB_SHORT = [['A','Hei! Mistä olet kotoisin?','Hi! Where are you from?'],['B','Nepalista.','From Nepal.'],['A','Aha. Missä asut?','Aha. Where do you live?'],['B','Espoossa.','In Espoo.'],['A','Okei. Mitä teet?','OK. What do you do?'],['B','Opiskelen.','I study.'],['A','…','(silence: the talk stops)']];
const SB_GROW = [['A','Hei! Mistä olet kotoisin?','Hi! Where are you from?',''],['B','Olen Nepalista, Pokharasta. Entä sinä?','I\'m from Nepal, from Pokhara. And you?','answer + add + ask'],['A','Olen Tampereelta. Onko Pokhara iso kaupunki?','I\'m from Tampere. Is Pokhara a big city?','answer + ask'],['B','On aika iso. Siellä on kaunis järvi ja vuoria. Oletko käynyt Nepalissa?','Quite big. There is a beautiful lake and mountains. Have you been to Nepal?','answer + add + ask'],['A','En ole, mutta haluaisin! Mitä sinä teet Suomessa?','No, but I\'d like to! What do you do in Finland?','answer + ask'],['B','Opiskelen yliopistossa ja teen töitä kahvilassa. Missä sinä opiskelet?','I study at the university and work in a café. Where do you study?','answer + add + ask'],['A','Minäkin opiskelen siellä! Mennäänkö kahville?','I study there too! Shall we go for coffee?','answer + invite']];
// practice questions with three answer levels and follow-up questions
const SB_CONV = [
 ['Mitä kuuluu?','How are you?','कस्तो छ?',['Hyvää.','Kiitos, hyvää. Olen vähän väsynyt.','Kiitos, hyvää! Olen vähän väsynyt, koska tein eilen paljon töitä. Entä sinulle?'],['Miksi olet väsynyt?','Mitä teit eilen?','Mitä teet tänään?']],
 ['Mistä olet kotoisin?','Where are you from?','तिमी कहाँबाट हौ?',['Nepalista.','Olen kotoisin Nepalista, Pokharasta.','Olen kotoisin Nepalista, Pokharasta. Se on kaunis kaupunki järven rannalla. Entä sinä, mistä sinä olet?'],['Millainen Pokhara on?','Onko siellä kylmä?','Kauanko olet asunut Suomessa?']],
 ['Missä asut?','Where do you live?','तिमी कहाँ बस्छौ?',['Espoossa.','Asun Espoossa, lähellä asemaa.','Asun Espoossa, lähellä asemaa. Minulla on pieni kaksio. Missä sinä asut?'],['Millainen asunto sinulla on?','Asutko yksin?','Miten menet sieltä keskustaan?']],
 ['Mitä teet työksesi?','What do you do for a living?','तिमी के काम गर्छौ?',['Opiskelen.','Olen opiskelija yliopistossa.','Olen maisteriopiskelija yliopistossa, ja teen osa-aikatyötä kahvilassa. Mitä sinä teet?'],['Mitä opiskelet?','Missä kahvilassa?','Onko työ kivaa?']],
 ['Mitä teet viikonloppuna?','What are you doing at the weekend?','सप्ताहान्तमा के गर्छौ?',['En tiedä.','Menen ehkä kirjastoon.','Lauantaina menen kirjastoon, ja sunnuntaina tapaan ystäviä. Onko sinulla suunnitelmia?'],['Mitä luet?','Keitä tapaat?','Haluatko tulla mukaan?']],
 ['Puhutko suomea?','Do you speak Finnish?','तिमी फिनिस बोल्छौ?',['Vähän.','Puhun vähän suomea.','Puhun vähän suomea, mutta ymmärrän jo paljon. Puhu hitaasti, kiitos!'],['Kauanko olet opiskellut suomea?','Onko suomi vaikeaa?','Mitä kieliä muuten puhut?']],
 ['Mistä pidät?','What do you like?','तिमीलाई के मन पर्छ?',['Musiikista.','Pidän musiikista ja ruoanlaitosta.','Pidän musiikista ja ruoanlaitosta. Teen usein nepalilaista ruokaa. Mistä sinä pidät?'],['Mitä musiikkia kuuntelet?','Mitä ruokaa teet?','Osaatko tehdä momoja?']],
 ['Millainen sää tänään on?','What is the weather like today?','आज मौसम कस्तो छ?',['Kylmä.','Tänään on kylmä ja tuulinen.','Tänään on kylmä ja tuulinen, mutta aurinko paistaa. Pidätkö talvesta?'],['Onko sinulla lämmin takki?','Onko Nepalissa lunta?','Mikä vuodenaika on paras?']],
 ['Onko sinulla perhettä Suomessa?','Do you have family in Finland?','फिनल्यान्डमा तिम्रो परिवार छ?',['Ei ole.','Ei ole. Perheeni asuu Nepalissa.','Ei ole, perheeni asuu Nepalissa. Soitan äidille joka sunnuntai. Asuuko sinun perheesi lähellä?'],['Onko sinulla sisaruksia?','Kenelle soitat useimmiten?','Milloin menet Nepaliin?']],
 ['Mitä söit tänään?','What did you eat today?','आज के खायौ?',['Puuroa.','Söin aamulla puuroa.','Söin aamulla puuroa ja join teetä. Lounaaksi syön riisiä. Mitä sinä söit?'],['Teetkö ruokaa itse?','Mikä on lempiruokasi?','Missä syöt lounasta?']],
 ['Miksi opiskelet suomea?','Why do you study Finnish?','किन फिनिस पढ्छौ?',['Työn takia.','Koska asun Suomessa.','Koska asun Suomessa ja haluan tehdä töitä täällä. Suomi on vaikea mutta kaunis kieli. Osaatko sinä nepalia?'],['Onko suomi vaikeampi kuin englanti?','Mikä on vaikeinta?','Miten opiskelet kotona?']],
 ['Voitko auttaa minua?','Can you help me?','मलाई सहयोग गर्न सक्छौ?',['Voin.','Voin. Mitä tarvitset?','Totta kai! Mitä tarvitset? Etsitkö jotain?'],['Missä asema on?','Paljonko lippu maksaa?','Mihin bussi menee?']]
];
