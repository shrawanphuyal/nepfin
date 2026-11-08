// Builds src/data/01_base.js from the earlier course (old.json) plus the new words.
const fs = require('fs');
const path = require('path');
const D = require('./old.json');
const { NEW, DAYS } = require('./newwords.js');

const CAT_GROUP = { greetings:1, numbers:2, time:3, days:3, months:3, countries:4, people:5, family:5, body:6, health:6,
  colours:8, home:9, kitchen:9, food:10, fruitveg:10, shopping:11, clothes:12, places:13, directions:13, transport:14,
  weather:15, nature:15, animals:15, school:16, jobs:17, hobbies:18, feelings:19, things:20, adjectives:23, opposites:23 };
const OFFICES = new Set(['Kela', 'virasto', 'poliisiasema', 'terveysasema']);
// module each group belongs to first (master prompt 8.2)
const GROUP_MOD = {1:1,2:1,3:1,4:2,5:4,6:4,7:4,8:3,9:6,10:8,11:2,12:3,13:6,14:7,15:3,16:1,17:9,18:5,19:4,20:6,21:6,22:2,23:3,24:2};
const DAY_MOD = {1:0,2:1,3:1,4:2,5:2,6:2,7:2,8:2,9:2,10:2};
const KPT_WEAK = {kauppa:'kaupan',pankki:'pankin',katu:'kadun',pöytä:'pöydän',kirkko:'kirkon',apteekki:'apteekin',pysäkki:'pysäkin',
  viikko:'viikon',leipä:'leivän',ruoka:'ruoan',tyttö:'tytön',äiti:'äidin',kortti:'kortin',takki:'takin',kaupunki:'kaupungin',
  lippu:'lipun',tunti:'tunnin',ranta:'rannan',ilta:'illan',jalka:'jalan',hattu:'hatun',kukka:'kukan',katto:'katon',matto:'maton',
  kissa:null,posti:null};
const PLACE_CASE = {kauppa:'in',ruokakauppa:'in',kahvila:'in',ravintola:'in',pankki:'in',posti:'in',apteekki:'in',sairaala:'in',
  terveyskeskus:'in',koulu:'in',yliopisto:'in',kirjasto:'in',asema:'out',pysäkki:'out',tori:'out',katu:'out',tie:'out',kirkko:'in',
  puisto:'in',toimisto:'in',lentokenttä:'out',kaupunki:'in',kylä:'in',meri:'out',järvi:'out',metsä:'in',vuori:'out',kuntosali:'out',
  uimahalli:'out',museo:'in',hotelli:'in',kioski:'out',kauppakeskus:'in',ranta:'out',piha:'out',parveke:'out',keittiö:'in',huone:'in'};

const forms = {};
for (const r of D.FORMS40) forms[r[0]] = { gen: r[1], par: r[2], ill: r[3], pl: r[4] };

const WORDS = [];
const seen = new Set();
let n = 0;
function add(w) { w.id = 'w' + (n++).toString(36); WORDS.push(w); return w; }

for (const cat of Object.keys(D.NOUNS)) {
  for (const it of D.NOUNS[cat].items) {
    const key = cat + ':' + it[1];
    if (seen.has(key)) continue; seen.add(key);
    let g = CAT_GROUP[cat] || 24;
    if (OFFICES.has(it[1])) g = 21;
    const w = { e: it[0], fi: it[1], en: it[2], ne: it[3], x: [it[4], it[5], it[6]], g, c: cat };
    const base = it[1].split(' / ')[0];
    if (forms[base]) w.f = forms[base];
    if (D.PUHE[it[1]] || D.PUHE[base]) w.sp = D.PUHE[it[1]] || D.PUHE[base];
    if (KPT_WEAK[base]) w.k = KPT_WEAK[base];
    if (PLACE_CASE[base] && g === 13 || PLACE_CASE[base] && cat === 'home') w.pc = PLACE_CASE[base];
    add(w);
  }
}
for (const v of D.VERBS) {
  const w = { e: v.e, fi: v.fi, en: v.en, ne: v.ne, x: v.x, g: 22, c: 'verbs', vt: v.t, vf: v.f, k: v.k && v.k.includes('→') ? v.k : undefined };
  add(w);
}
for (const r of NEW) {
  const [day, g, e, fi, en, ne, xf, xe, xn, k, sp] = r;
  const w = add({ e, fi, en, ne, x: [xf, xe, xn], g, c: 'new', d: day });
  if (k) w.k = k;
  if (sp) w.sp = sp;
}
// schedule existing words into days
const missing = [];
for (const [day, list] of Object.entries(DAYS)) {
  for (const ref of list) {
    if (ref === '@greetings') { WORDS.filter(w => w.c === 'greetings').forEach(w => { w.d = +day; }); continue; }
    let cat = null, fi = ref;
    if (ref.includes(':')) [cat, fi] = ref.split(':');
    const w = WORDS.find(w => w.fi === fi && (!cat || w.c === cat) && !w.d) || WORDS.find(w => w.fi === fi && (!cat || w.c === cat));
    if (!w) { missing.push(ref); continue; }
    w.d = +day;
  }
}
// chapter-build words (6 Nov): skip anything already in the list
const { NOUNS2, VERBS2 } = require('./newwords2.js');
const have = new Set(WORDS.map(w => w.fi.toLowerCase()));
let added = 0;
for (const r of NOUNS2) { const [ch, g, e, fi, en, ne, xf, xe, xn] = r; if (have.has(fi.toLowerCase())) continue; have.add(fi.toLowerCase()); add({ e, fi, en, ne, x: [xf, xe, xn], g, c: 'ch', ch }); added++; }
for (const r of VERBS2) { const [ch, e, fi, t, en, ne, f, k, xf, xe, xn] = r; if (have.has(fi)) continue; have.add(fi); const w = add({ e, fi, en, ne, x: [xf, xe, xn], g: 22, c: 'verbs', vt: t, vf: f, ch }); if (k) w.k = k; added++; }
// chapter for every word: by day, then by old category, then by group
const DAY_CH = d => d <= 3 ? 1 : 2;
const CAT_CH = { greetings: 1, numbers: 1, days: 1, school: 1, countries: 2, things: 2, colours: 3, adjectives: 3, opposites: 3, weather: 3, months: 3, nature: 3, people: 4, family: 4, body: 4, feelings: 4, time: 5, hobbies: 10, clothes: 5, home: 6, kitchen: 6, directions: 6, places: 6, transport: 7, animals: 7, food: 8, fruitveg: 8, shopping: 8, jobs: 9, health: 9 };
for (const w of WORDS) {
  if (!w.ch) w.ch = w.d ? DAY_CH(w.d) : w.c === 'verbs' ? (w.vt === 1 ? 2 : w.vt === 6 ? 10 : 5) : (CAT_CH[w.c] || ({ 16: 1, 17: 9, 21: 9, 25: 6, 26: 10 })[w.g] || 2);
  w.m = w.d ? DAY_MOD[w.d] : (w.c === 'ch' ? Math.min(9, w.ch) : GROUP_MOD[w.g]);
  delete w.c;
}
console.log('chapter words added', added);
const perCh = {}; WORDS.forEach(w => { perCh[w.ch] = (perCh[w.ch] || 0) + 1; }); console.log('per chapter', perCh);

const byDay = {};
WORDS.forEach(w => { if (w.d) byDay[w.d] = (byDay[w.d] || 0) + 1; });
console.log('words', WORDS.length, 'scheduled', Object.values(byDay).reduce((a, b) => a + b, 0), byDay, 'missing', missing);

const OLD = {};
for (const k of ['KPT_TYPES','KPT_SPECIAL','KPT_NONE','KPT_WEAK','KPT_STRONG','HW5','HW6','HWPL','HW_BOOK','HW_BOOK_NONE','HW_EX16','HW_EX18','HW_DIPH',
  'ARKI','QGROUPS','KO_EX','POLITE','QA_BANK','PUHE_SENT','SPOKEN_VERBS','PUHE_RULES','GRAMMAR','STORIES','PLACES','EXAMS','WRITING','PRONUN','LEN_PAIRS','HOMEWORK','FORMS40']) OLD[k] = D[k];

let out = '// Generated by tools/make_data.js: words and earlier course content.\n';
out += 'const WORDS=' + JSON.stringify(WORDS) + ';\n';
for (const k of Object.keys(OLD)) out += 'const ' + k + '=' + JSON.stringify(OLD[k]) + ';\n';
fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/01_base.js'), out);
console.log('bytes', out.length);
