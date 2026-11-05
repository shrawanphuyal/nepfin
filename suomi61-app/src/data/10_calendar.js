// The 61-day calendar, 1 Nov – 31 Dec 2026 (master prompt section 4).
// [module, new content, day task, kind, grammar lesson id(s)]
// kind: '' normal · week = Sunday weekly test · stage = stage test · mock · exam = class exam · light · final
const START_ISO = '2026-11-01';
const EXAM_ISO = '2026-11-25';
const END_ISO = '2026-12-31';
const CAL = [
['M0','Alphabet, 8 vowels, long and short sounds','Spell your name and city aloud','', 'L01'],
['M0–M1','Vowel harmony; greetings (Hei, Moi, Huomenta, Kiitos)','Greet 5 people in 5 situations','', 'L02'],
['M1','Personal pronouns; olla in all persons; numbers 0–20','Introduce yourself in 6 sentences','', 'L03'],
['M1–M2','Homework 4.11: k-p-t strong and weak grade, 30 word pairs','Read the 30 pairs aloud; write 10 sentences','', 'L04'],
['M2','Countries, languages, nationalities; numbers 20–100','Mistä olet kotoisin? – answer 8 ways','', 'L05'],
['M2','Verb type 1 present (puhua, asua, ostaa, lukea)','Write 8 sentences about your languages','', 'L06'],
['M2','Negative sentence (en, et, ei, emme, ette, eivät); -ko/-kö','Ask and answer 10 yes/no questions','', 'L07,L08'],
['Test','Review week 1 · Stage test A1.0','1-minute self-introduction, recorded','stage', ''],
['M2','Question words (kuka, mikä, missä, mistä, mihin, milloin, miksi, miten, paljonko)','Interview a classmate: 10 questions','', 'L09'],
['M2','At the kiosk: prices, euros and cents, Saisinko…?','Buy ice cream and coffee (dialogue)','', 'L10'],
['M3','Weather and seasons','Compare weather in Helsinki and Kathmandu','', 'g:adj'],
['M3','Months, times of day, -na in maanantaina, aamulla','Say when you do 8 things','', 'g:time'],
['M3','Genitive (minun, sinun, Pedron, Helsingin)','Describe 6 things that belong to people','', 'g:genitive'],
['M3','k-p-t in verb type 1 (nukkua → nukun, tietää → tiedän, ymmärtää → ymmärrän)','Conjugate 15 verbs aloud','', 'g:kpt'],
['M3','Adjectives, colours · weekly test','Write a 50-word email to a friend','week', 'g:adj'],
['M4','Family words; Minulla on…','Talk about your family in Nepal','', 'g:have'],
['M4','Appearance; Minulla ei ole… + partitive','Describe 3 people','', 'g:have'],
['M4','Partitive endings -a/-ä, -ta/-tä, -tta/-ttä','20 partitive forms, then 10 sentences','', 'g:partitive'],
['M4','Partitive verbs; signing up for a course','Role-play: course registration','', 'g:partitive'],
['M5','The clock; daily routine; verb type 2 (syödä, juoda)','Tell your day from 7.00 to 23.00','', 'g:vtypes'],
['M5','Verb types 3, 4, 5 (tulla, mennä; haluta, tavata; tarvita, valita)','25 verbs in 3 persons, aloud','', 'g:vtypes'],
['Test','At the department store · Stage test A1.1 (M1–M5)','2-minute talk: my week','stage', ''],
['Exam','Mock exam A (4 skills, 90 min) + fix weak points','Speaking rehearsal: 10 exam questions','mock', ''],
['Exam','Mock exam B + error review','Rewrite your weakest text','mock', ''],
['Exam','Class exam, day 1 – warm-up only','–','exam', ''],
['Exam','Class exam, day 2 – warm-up only','–','exam', ''],
['M6','Housing words; inner location cases -ssa, -sta, -Vn','Where are things in your room?','', 'g:local'],
['M6','Outer location cases -lla, -lta, -lle','10 sentences: pöydällä, bussilla, Pekalle','', 'g:local'],
['M6','Huoneessa on… sentences · weekly test','Describe your flat (60 words)','week', 'g:local'],
['M6','Plural nominative (talot, kadut, kaupat)','Talk about your street','', 'g:plural'],
['M6','tämä, tuo, se and nämä, nuo, ne','Shop dialogue: Saanko tämän?','', 'g:order'],
['M6','Imperative, sinä form (Tule! Mene! Odota! Älä mene!)','Give 10 instructions','', 'g:imper'],
['M6','Phone call to the caretaker','Report a broken tap or heater','', 'g:imper'],
['M6','Review + module test M6','Write a message to the housing office','', ''],
['M7','Travel and transport (bussilla, junalla, lentokoneella)','How do you get to the university?','', 'g:local'],
['M7','Word types -i and -i → -e- (kieli → kielen) · weekly test · Itsenäisyyspäivä','Read about Finnish Independence Day','week', 'g:genitive'],
['M7','Word types -e, -nen, -si (huone → huoneen, nainen → naisen, vesi → veden)','20 forms, then 10 sentences','', 'g:genitive'],
['M7','k-p-t in nouns (kauppa → kaupassa, katu → kadulla)','Give directions in town','', 'g:kpt'],
['M7','Demonstratives in cases (tässä, tuolla, siitä); at the hotel','Check in at a hotel','', 'g:local'],
['M7','On hauskaa matkustaa sentences; VR and HSL tickets','Buy a train ticket to Tampere','', 'g:chains'],
['Review','Mixed practice M1–M7','Speaking marathon: 20 questions','', ''],
['Test','Stage test A1.2 (4 skills)','–','stage', ''],
['M8','Food and drink; partitive of mass words (maitoa, riisiä, kahvia)','Your shopping list in sentences','', 'g:partitive'],
['M8','In a café and a restaurant; ordering','Order a meal for two','', 'g:partitive'],
['M8','Dates and ordinal numbers (ensimmäinen … kolmaskymmenesensimmäinen)','Say 10 dates, including your birthday','', 'g:time'],
['M8','Plural partitive intro (omenoita, kirjoja); postpositions (vieressä, alla, takana)','Describe a picture of a kitchen','', 'g:plural'],
['M8','Asking the way · module test M8','Write a party invitation (60 words)','', 'g:local'],
['M9','Work and jobs; Mitä teet työksesi?','Talk about your studies and job','', 'g:work'],
['M9','Object basics (Ostan kirjan vs Luen kirjaa)','15 object sentences','', 'g:object'],
['M9','kenelle / keneltä; pronouns in cases (minulle, sinulta) · weekly test','Who gives what to whom?','week', 'g:local'],
['M9','k-p-t in verb types 3 and 4 (ajatella → ajattelen, tavata → tapaan); että, koska, kun, jos','10 sentences with koska','', 'g:vtypes'],
['M9','Word types -in, -as/-äs, -is (puhelin → puhelimen, rikas → rikkaan, kaunis → kauniin) · module test M9','Lunch with colleagues (dialogue)','', 'g:kpt'],
['M10','Past tense, verb type 1, positive (puhuin, asuin, ostin) [Lisä]','What did you do yesterday?','', 'g:past'],
['M10','Jouluaatto: Christmas words; past tense of olla (olin, olit, oli)','Read a Christmas story','light', 'g:past'],
['M10','Past tense negative (en ollut, en mennyt)','Write a holiday message home','light', 'g:past'],
['M10','Verb type 6 (vanheta → vanhenen); pitää, haluta, voida, saada + infinitive','Say 8 things you must or want to do','light', 'g:chains'],
['Final','Revision 1: verbs and k-p-t','50-question verb drill','week', 'g:vtypes'],
['Final','Revision 2: cases and partitive','50-question case drill','', 'g:partitive'],
['Final','Revision 3: questions, dialogues, puhekieli','Speaking marathon: all 16 dialogues','', 'g:puhe'],
['Final','Final mock, part 1: reading, listening, writing','–','final', ''],
['Final','Final mock, part 2: speaking · level report · plan for January (A2.1)','3-minute talk about yourself','final', '']
];
const STAGES = [
  {id:'A1.0', name:'Start', from:1, to:8, mods:'M0–M2', test:8},
  {id:'A1.1', name:'Base', from:9, to:22, mods:'M2–M5', test:22},
  {id:'A1.2', name:'Grow', from:23, to:42, mods:'M6–M7', test:42},
  {id:'A1.3', name:'Target', from:43, to:61, mods:'M8–M10', test:61}
];
// 210 minutes in 9 blocks (section 5)
const BLOCKS = [
  {id:'review', n:1, fi:'Kertaus', en:'Spaced review', ne:'दोहोर्‍याइ', min:20, part:'am'},
  {id:'grammar', n:2, fi:'Kielioppi', en:'New grammar', ne:'नयाँ व्याकरण', min:40, part:'am'},
  {id:'words', n:3, fi:'Sanasto', en:'New words', ne:'नयाँ शब्द', min:25, part:'am'},
  {id:'listen', n:4, fi:'Kuuntelu', en:'Listening', ne:'सुनाइ', min:25, part:'pm'},
  {id:'read', n:5, fi:'Lukeminen', en:'Reading', ne:'पढाइ', min:25, part:'pm'},
  {id:'speak', n:6, fi:'Puhuminen', en:'Speaking', ne:'बोलाइ', min:30, part:'pm'},
  {id:'write', n:7, fi:'Kirjoittaminen', en:'Writing', ne:'लेखाइ', min:25, part:'pm'},
  {id:'puhe', n:8, fi:'Puhekieli', en:'Spoken Finnish', ne:'बोलचालको फिनिस', min:10, part:'pm'},
  {id:'check', n:9, fi:'Päivän testi', en:'Daily check', ne:'दैनिक जाँच', min:10, part:'pm'}
];
const SHORT_BLOCKS = ['review', 'words', 'speak', 'check'];
