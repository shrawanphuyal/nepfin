// Stage test A1.0 (8 Nov) — 4 skills, 90 min. Auto-scored parts use the exercise item format of 20_lessons.js.
const STAGE_TESTS = {
"A1.0":{day:8, title:["Vaihetesti A1.0","Stage test A1.0","चरण परीक्षा A1.0"], min:90,
 parts:[
 {id:"listen", fi:"Kuuntelu", en:"Listening", ne:"सुनाइ", min:20, items:[
  ["lis","tuuli",["tuli","tuuli","tulli"],1],["lis","kissa",["kisa","kissa"],1],["lis","mutta",["muta","mutta"],1],["lis","sää",["sää","saa"],0],
  ["lis","seitsemäntoista",["7","17","70"],1],["lis","kaksikymmentäkolme",["23","32","203"],0],["lis","nolla neljä viisi",["045","054","040"],0],
  ["lis","Hyvää yötä!",["in the morning","late at night"],1],["lis","Kiitos, samoin!",["Thanks, you too!","Sorry!"],0],["lis","Anteeksi, en ymmärrä.",["I don't understand.","I don't know."],0]]},
 {id:"read", fi:"Lukeminen", en:"Reading", ne:"पढाइ", min:20,
  text:{h:["Uusi opiskelija","A new student","नयाँ विद्यार्थी"], lines:[["Hei! Minun nimeni on Anna Tamm.","Hi! My name is Anna Tamm.","नमस्ते! मेरो नाम आन्ना ताम हो।"],["Olen kotoisin Virosta, Tallinnasta.","I am from Estonia, from Tallinn.","म इस्टोनियाको टालिनबाट हुँ।"],["Asun nyt Helsingissä. En asu Espoossa.","I live in Helsinki now. I don't live in Espoo.","म अहिले हेल्सिंकीमा बस्छु। एस्पोमा बस्दिनँ।"],["Puhun viroa, venäjää ja englantia.","I speak Estonian, Russian and English.","म इस्टोनियाली, रुसी र अंग्रेजी बोल्छु।"],["Opiskelen suomea yliopistossa maanantaina ja keskiviikkona.","I study Finnish at the university on Monday and Wednesday.","म सोमबार र बुधबार विश्वविद्यालयमा फिनिस पढ्छु।"],["Olen kaksikymmentäneljä vuotta vanha.","I am twenty-four years old.","म चौबीस वर्षकी हुँ।"]]},
  items:[
  ["mc","Mistä Anna on kotoisin?",["Suomesta","Virosta","Venäjältä"],1,"Olen kotoisin Virosta.","Virosta = इस्टोनियाबाट।","case"],
  ["mc","Missä Anna asuu nyt?",["Helsingissä","Espoossa","Tallinnassa"],0,"Asun nyt Helsingissä.","हेल्सिंकीमा।","case"],
  ["mc","Puhuuko Anna venäjää?",["Puhuu.","Ei puhu."],0,"Puhun viroa, venäjää ja englantia.","बोल्छिन्।","ve"],
  ["mc","Milloin Anna opiskelee suomea?",["ti ja to","ma ja ke","la ja su"],1,"maanantaina ja keskiviikkona.","सोम र बुध।","wc"],
  ["mc","Kuinka vanha Anna on?",["14","24","42"],1,"kaksikymmentäneljä = 24.","२४।","wc"],
  ["mc","Notice: <b>KIINNI SUNNUNTAINA</b>. The shop is",["open on Sunday","closed on Sunday"],1,"kiinni = closed.","kiinni = बन्द।","wc"],
  ["mc","Door: <b>TYÖNNÄ</b>. You",["push","pull"],0,"työnnä = push, vedä = pull.","धकेल्नुहोस्।","wc"],
  ["mc","Price list: <b>Kahvi 2,50 €</b>. Coffee costs",["two euros five","two euros fifty"],1,"2,50 = kaksi euroa viisikymmentä.","२ युरो ५०।","wc"],
  ["mc","Sign: <b>ULOS</b> means",["entrance","exit"],1,"ulos = out.","बाहिर।","wc"],
  ["mc","Note: <b>Tervetuloa kahville!</b> means",["Welcome for coffee!","Coffee is closed."],0,"Tervetuloa = welcome.","स्वागत।","wc"]]},
 {id:"grammar", fi:"Rakenteet", en:"Grammar", ne:"व्याकरण", min:20, items:[
  ["mc","Me ___ Nepalista.",["olen","olemme","ovat"],1,"me → olemme.","me → olemme।","ve"],
  ["mc","He ___ kotona.",["on","ovat","olette"],1,"he → ovat.","he → ovat।","ve"],
  ["mc","Asun ___ (in Helsinki).",["Helsinkissä","Helsingissä"],1,"nk → ng.","nk → ng।","kpt"],
  ["mc","Olen kotoisin ___ (from Nepal).",["Nepalissa","Nepalista"],1,"From = -sta.","-sta।","case"],
  ["mc","Puhutko ___?",["suomi","suomea"],1,"After puhua: suomea.","suomea।","part"],
  ["mc","Minä ___ puhu ruotsia.",["ei","en"],1,"minä → en.","en।","ve"],
  ["mc","___ englantia? (Do you speak)",["Puhutko","Puhutkö"],0,"u → -ko.","-ko।","vh"],
  ["fill","Hän ___ (asua) Turussa.","asuu","hän → asuu.","asuu।","ve"],
  ["fill","Olen kau___ (in the shop).","passa","kauppa → kaupassa.","kaupassa।","kpt"],
  ["fill","He eivät ___ (tietää).","tiedä","Bare weak verb: tiedä.","tiedä।","ve"]]},
 {id:"write", fi:"Kirjoittaminen", en:"Writing", ne:"लेखाइ", min:20, task:{
  h:["Esittely ja lomake","Introduction and form","परिचय र फारम"],
  task:["Kirjoita 6–8 lausetta itsestäsi: nimi, maa, kaupunki, kielet, opiskelu, yksi kieltolause ja puhelinnumero.","Write 6–8 sentences about yourself: name, country, city, languages, study, one negative sentence and your phone number.","आफ्नोबारे ६–८ वाक्य लेख्नुहोस्: नाम, देश, शहर, भाषा, पढाइ, एउटा नकारात्मक वाक्य र फोन नम्बर।"],
  points:["name","from (-sta)","live (-ssa)","languages (-a/-ä)","study","one negative sentence","phone number"],
  model:"Hei! Minun nimeni on Ram Sharma. Olen kotoisin Nepalista. Asun Espoossa. Puhun nepalia, englantia ja vähän suomea. En puhu ruotsia. Opiskelen yliopistossa. Puhelinnumeroni on 040 123 4567."}},
 {id:"speak", fi:"Puhuminen", en:"Speaking", ne:"बोलाइ", min:10, tasks:[
  ["Esittele itsesi (1 min).","Introduce yourself (1 minute).","आफ्नो परिचय दिनुहोस् (१ मिनेट)।","Hei! Minun nimeni on Ram. Olen kotoisin Nepalista, Pokharasta. Asun Espoossa. Olen opiskelija. Puhun nepalia, englantia ja vähän suomea. En puhu ruotsia. Kiitos!"],
  ["Tavaa nimesi ja sano puhelinnumerosi.","Spell your name and say your phone number.","नाम हिज्जे गर्नुहोस् र फोन नम्बर भन्नुहोस्।","R – är, A – aa, M – äm. Puhelinnumeroni on nolla neljä nolla, yksi kaksi kolme, neljä viisi kuusi seitsemän."],
  ["Vastaa: Puhutko suomea? Asutko Helsingissä? Mistä olet kotoisin?","Answer: Do you speak Finnish? Do you live in Helsinki? Where are you from?","जवाफ दिनुहोस्।","Puhun vähän. En asu Helsingissä, asun Espoossa. Olen kotoisin Nepalista."]]}
 ]}
};
// Writing and speaking rubric (section 10.4)
const RUBRIC = [["Content and task done","Sisältö",3],["Grammar","Rakenteet",3],["Vocabulary","Sanasto",2],["Fluency, pronunciation or text structure","Sujuvuus",2]];
// Error tags (section 10.2)
const TAGS = {ve:["verb ending","क्रियाको अन्त्य"],vt:["verb type","क्रियाको प्रकार"],kpt:["k-p-t","k-p-t"],case:["case","विभक्ति"],part:["partitive","partitive"],vh:["vowel harmony","स्वर सामञ्जस्य"],aa:["ä/a, ö/o","ä/a, ö/o"],ls:["long/short sound","लामो/छोटो आवाज"],wo:["word order","शब्दक्रम"],wc:["word choice","शब्द छनोट"],sp:["spelling","हिज्जे"]};
