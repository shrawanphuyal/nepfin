// ================= GRAMMAR v2 =================
// Three forms to learn with every noun: [nominative, genitive, partitive, illative, en, ne]
const THREE=[
['talo','talon','taloa','taloon','house','घर'],
['kauppa','kaupan','kauppaa','kauppaan','shop','पसल'],
['pöytä','pöydän','pöytää','pöytään','table','टेबल'],
['katu','kadun','katua','katuun','street','सडक'],
['koulu','koulun','koulua','kouluun','school','विद्यालय'],
['kahvi','kahvin','kahvia','kahviin','coffee','कफी'],
['pankki','pankin','pankkia','pankkiin','bank','बैंक'],
['vesi','veden','vettä','veteen','water','पानी'],
['käsi','käden','kättä','käteen','hand','हात'],
['järvi','järven','järveä','järveen','lake','ताल'],
['lapsi','lapsen','lasta','lapseen','child','बच्चा'],
['lumi','lumen','lunta','lumeen','snow','हिउँ'],
['kieli','kielen','kieltä','kieleen','language','भाषा'],
['huone','huoneen','huonetta','huoneeseen','room','कोठा'],
['perhe','perheen','perhettä','perheeseen','family','परिवार'],
['nainen','naisen','naista','naiseen','woman','महिला'],
['ihminen','ihmisen','ihmistä','ihmiseen','person','मान्छे'],
['mies','miehen','miestä','mieheen','man','पुरुष'],
['puhelin','puhelimen','puhelinta','puhelimeen','phone','फोन'],
['avain','avaimen','avainta','avaimeen','key','साँचो'],
['kaunis','kauniin','kaunista','kauniiseen','beautiful','सुन्दर'],
['maa','maan','maata','maahan','country, land','देश / जमिन'],
['työ','työn','työtä','työhön','work','काम'],
['tee','teen','teetä','teehen','tea','चिया'],
['Suomi','Suomen','Suomea','Suomeen','Finland','फिनल्यान्ड'],
['Helsinki','Helsingin','Helsinkiä','Helsinkiin','Helsinki','हेल्सिंकी']
];

// ---------- PARTITIVE ----------
// uses: [icon, title, rule, ne, examples [[fi,en,ne]]]
const PART_USES=[
['🔢','After numbers 2, 3, 4 …','After any number except 1, the noun goes into the partitive. The number is the "whole", the noun is "part of" it.','२ भन्दा माथिको संख्यापछि',[['kaksi kahvia','two coffees','दुई कफी'],['kolme lasta','three children','तीन बच्चा'],['viisi euroa','five euros','पाँच युरो'],['yksi kahvi','one coffee (no partitive with 1!)','एक कफी']]],
['⚖️','After amounts and containers','Words like paljon, vähän, liian, kilo, litra, kuppi, lasi, pullo, pala, pussi.','धेरै / थोरै / किलो / कप पछि',[['paljon rahaa','a lot of money','धेरै पैसा'],['vähän aikaa','a little time','अलिकति समय'],['kuppi teetä','a cup of tea','एक कप चिया'],['lasi vettä','a glass of water','एक गिलास पानी'],['kilo perunoita','a kilo of potatoes','एक किलो आलु']]],
['🥛','"Some" of a mass (you cannot count it)','Water, milk, coffee, bread, money, time, snow … When you mean "some" or "any", use the partitive.','अलिकति / केही (गन्न नसकिने कुरा)',[['Juon vettä.','I drink (some) water.','म पानी पिउँछु।'],['Ostan maitoa.','I buy (some) milk.','म दूध किन्छु।'],['Syön leipää.','I eat (some) bread.','म रोटी खान्छु।'],['Ulkona on lunta.','There is snow outside.','बाहिर हिउँ छ।']]],
['🚫','Every negative sentence','When the sentence has "not", the object becomes partitive. "Minulla ei ole …" always takes the partitive.','"छैन / गर्दिनँ" भएको वाक्यमा',[['Minulla ei ole autoa.','I don\'t have a car.','मसँग गाडी छैन।'],['En juo kahvia.','I don\'t drink coffee.','म कफी पिउँदिनँ।'],['En ymmärrä tätä.','I don\'t understand this.','मलाई यो बुझिएन।'],['Täällä ei ole vessaa.','There is no toilet here.','यहाँ शौचालय छैन।']]],
['❤️','After "partitive verbs"','Some verbs always take the partitive: rakastaa, odottaa, auttaa, opiskella, kuunnella, ajatella, etsiä, harrastaa, pelata, tervehtiä, kiittää, katsoa (TV).','केही क्रियापछि सधैं',[['Rakastan sinua.','I love you.','म तिमीलाई माया गर्छु।'],['Odotan bussia.','I am waiting for the bus.','म बस पर्खिरहेको छु।'],['Autan äitiä.','I help Mother.','म आमालाई सहयोग गर्छु।'],['Opiskelen suomea.','I study Finnish.','म फिनिस पढ्छु।'],['Kuuntelen musiikkia.','I listen to music.','म संगीत सुन्छु।']]],
['⏳','Action still going on, not finished','Partitive = "in the middle of it". Total object (-n) = "done, the whole thing".','काम चलिरहेको (नसकिएको)',[['Luen kirjaa.','I am reading a book (not finished).','म किताब पढ्दैछु।'],['Luin kirjan.','I read the (whole) book.','मैले किताब पढिसकेँ।'],['Kirjoitan kirjettä.','I am writing a letter.','म चिठी लेख्दैछु।']]],
['❓','Questions about having / existing','When you ask if something exists or if someone has "any", use the partitive.','"छ कि?" भनेर सोध्दा',[['Onko teillä maitoa?','Do you have (any) milk?','तपाईंसँग दूध छ?'],['Onko sinulla aikaa?','Do you have time?','तिमीसँग समय छ?'],['Onko sinulla lapsia?','Do you have children?','तिम्रा बच्चा छन्?']]],
['🌡️','Describing a mass word','"Kahvi on kuumaa" (the mass is hot) – but "Talo on iso" (a countable thing).','गन्न नसकिने कुराको वर्णन',[['Kahvi on kuumaa.','The coffee is hot.','कफी तातो छ।'],['Vesi on kylmää.','The water is cold.','पानी चिसो छ।'],['Ruoka on hyvää.','The food is good.','खाना मीठो छ।']]],
['🔗','After ilman (without) and some little words','ilman sokeria = without sugar. Also: ennen kahdeksaa = before eight.','बिना',[['kahvi ilman sokeria','coffee without sugar','चिनी बिनाको कफी'],['tee ilman maitoa','tea without milk','दूध बिनाको चिया']]]
];
// how to form: [rule title, ending, explanation, examples [[base, partitive]]]
const PART_FORM=[
['Ends in one short vowel','+ a / ä','The most common rule. Just add a or ä. Keep the strong consonant (kauppa, not kaupa).',[['talo','taloa'],['kissa','kissaa'],['koira','koiraa'],['kauppa','kauppaa'],['leipä','leipää'],['pöytä','pöytää'],['kahvi','kahvia'],['bussi','bussia'],['omena','omenaa'],['euro','euroa']]],
['Ends in two vowels (long vowel or diphthong)','+ ta / tä','Short words like maa, tee, työ, puu, and loan words ending in a long vowel.',[['maa','maata'],['tee','teetä'],['työ','työtä'],['puu','puuta'],['suu','suuta'],['jää','jäätä'],['Lontoo','Lontoota'],['vapaa','vapaata']]],
['Ends in -e','+ tta / ttä','Double t. Very common with words like huone, perhe, kirje.',[['huone','huonetta'],['perhe','perhettä'],['kone','konetta'],['kirje','kirjettä'],['vene','venettä'],['sade','sadetta'],['kappale','kappaletta']]],
['Ends in -nen','-nen → -sta / -stä','Cut -nen, add sta / stä. All the -lainen nationality words work like this.',[['nainen','naista'],['ihminen','ihmistä'],['suomalainen','suomalaista'],['nepalilainen','nepalilaista'],['iloinen','iloista'],['sininen','sinistä']]],
['Ends in a consonant','+ ta / tä','Words ending in -n, -s, -l, -r, -t usually just add ta / tä.',[['puhelin','puhelinta'],['avain','avainta'],['kaunis','kaunista'],['mies','miestä'],['kallis','kallista'],['olut','olutta'],['vastaus','vastausta'],['kevät','kevättä']]],
['Old -i words (e-stem)','learn them','Short old words ending in -i change their vowel. Learn them as pairs; they are very common.',[['vesi','vettä'],['käsi','kättä'],['lapsi','lasta'],['lumi','lunta'],['kieli','kieltä'],['järvi','järveä'],['nimi','nimeä'],['uusi','uutta'],['pieni','pientä'],['tuli','tulta']]]
];
// common plural partitives as ready-made chunks
const PART_PLURAL=[
['kilo omenoita','a kilo of apples','एक किलो स्याउ'],['kaksi kiloa perunoita','two kilos of potatoes','दुई किलो आलु'],['paljon ihmisiä','a lot of people','धेरै मानिस'],['paljon lapsia','many children','धेरै बच्चा'],['Onko sinulla lapsia?','Do you have children?','तिम्रा बच्चा छन्?'],['Ostan banaaneja.','I buy bananas.','म केरा किन्छु।'],['Pidän kirjoista – luen kirjoja.','I like books – I read books.','मलाई किताब मन पर्छ – म किताबहरू पढ्छु।'],['Syön marjoja.','I eat berries.','म बेरीहरू खान्छु।'],['monta kertaa','many times','धेरै पटक'],['paljon sanoja','a lot of words','धेरै शब्द'],['Täällä on paljon kauppoja.','There are many shops here.','यहाँ धेरै पसल छन्।'],['Tarvitsen tomaatteja.','I need tomatoes.','मलाई गोलभेडा चाहियो।']
];

// ---------- GENETIVE ----------
const GEN_USES=[
['👤','Owner: whose?','-n = Nepali -को. Ramin auto = रामको गाडी.',[['Ramin auto','Ram\'s car','रामको गाडी'],['äidin puhelin','Mother\'s phone','आमाको फोन'],['Suomen pääkaupunki','the capital of Finland','फिनल्यान्डको राजधानी'],['opettajan nimi','the teacher\'s name','शिक्षकको नाम']]],
['📍','Before place words (postpositions)','The word before vieressä, edessä, takana … is always genitive.',[['aseman vieressä','next to the station','स्टेसनको छेउमा'],['talon edessä','in front of the house','घरको अगाडि'],['pöydän alla','under the table','टेबलमुनि'],['ystävän kanssa','with a friend','साथीसँग']]],
['❗','Who must: täytyy / pitää','"Minun täytyy" = मैले … पर्छ. The person is genitive, like Nepali "मैले जानुपर्छ".',[['Minun täytyy mennä.','I must go.','मैले जानुपर्छ।'],['Sinun pitää levätä.','You need to rest.','तिमीले आराम गर्नुपर्छ।'],['Hänen täytyy tehdä töitä.','She has to work.','उहाँले काम गर्नुपर्छ।']]],
['✅','A whole, finished object','Ostan kirjan = I buy the (one, whole) book. The -n object means "all of it, done".',[['Ostan kirjan.','I buy a book.','म किताब किन्छु।'],['Syön omenan.','I eat an apple (all of it).','म एउटा स्याउ खान्छु।'],['Otan tämän.','I\'ll take this one.','म यो लिन्छु।']]]
];
const PRONOUN_GEN=[
['minä','minun','mun','my','मेरो'],['sinä','sinun','sun','your','तिम्रो'],['hän','hänen','sen','his / her','उसको / उहाँको'],['me','meidän','meiän','our','हाम्रो'],['te','teidän','teiän','your (pl.)','तिमीहरूको'],['he','heidän','niiden','their','उनीहरूको']
];
// postpositions: [icon, word, en, ne, example fi, example en]
const POSTPOS=[
['⬆️','edessä','in front of','अगाडि','Bussi on talon edessä.','The bus is in front of the house.'],
['⬇️','takana','behind','पछाडि','Pyörä on talon takana.','The bike is behind the house.'],
['↔️','vieressä','next to','छेउमा','Apteekki on pankin vieressä.','The pharmacy is next to the bank.'],
['🔽','alla','under','मुनि','Kissa on pöydän alla.','The cat is under the table.'],
['🔼','päällä','on top of','माथि','Kirja on pöydän päällä.','The book is on top of the table.'],
['⏺️','keskellä','in the middle of','बीचमा','Tori on kaupungin keskellä.','The square is in the middle of the city.'],
['↕️','välissä','between','बीचमा (दुईको)','Kahvila on kaupan ja pankin välissä.','The café is between the shop and the bank.'],
['📏','lähellä','near','नजिक','Asun aseman lähellä.','I live near the station.'],
['🔄','ympärillä','around','वरिपरि','Talon ympärillä on puita.','There are trees around the house.'],
['🧑‍🤝‍🧑','kanssa','with','सँग','Tulen ystävän kanssa.','I come with a friend.'],
['🏠','luona','at someone\'s place','को घरमा','Olen äidin luona.','I am at Mother\'s place.'],
['⏭️','jälkeen','after','पछि','Töiden jälkeen menen kotiin.','After work I go home.'],
['⏱️','aikana','during','को समयमा','Kesän aikana matkustan.','During the summer I travel.'],
['🎯','takia','because of','को कारणले','Sateen takia jäin kotiin.','Because of the rain I stayed home.']
];

// ---------- ILLATIVE ----------
const ILL_RULES=[
['One short vowel at the end','repeat the vowel + n','Uses the STRONG consonant (kauppaan, not kaupaan).',[['talo','taloon'],['kauppa','kauppaan'],['koulu','kouluun'],['Turku','Turkuun'],['metsä','metsään'],['pöytä','pöytään'],['kahvila','kahvilaan']]],
['New words ending in -i','i + in','Loan words and names: pankki, Helsinki, Nepal (Nepali-).',[['pankki','pankkiin'],['Helsinki','Helsinkiin'],['bussi','bussiin'],['Nepal','Nepaliin'],['hotelli','hotelliin']]],
['Old -i words','e + en','The i changes to e: Suomi → Suomeen.',[['Suomi','Suomeen'],['järvi','järveen'],['vesi','veteen'],['lumi','lumeen'],['käsi','käteen']]],
['Ends in -e','+ seen','Long e and -seen.',[['huone','huoneeseen'],['perhe','perheeseen'],['kone','koneeseen'],['Lontoo','Lontooseen']]],
['Short word with a long vowel','h + vowel + n','The vowel repeats after h.',[['maa','maahan'],['työ','työhön'],['yö','yöhön'],['suu','suuhun'],['pää','päähän'],['tee','teehen']]],
['Ends in a consonant','use the genitive stem','Take the genitive (puhelimen), remove -n, then add the vowel + n.',[['puhelin','puhelimeen'],['nainen','naiseen'],['avain','avaimeen'],['kaunis','kauniiseen']]]
];
const ILL_SPECIAL=[
['kotiin','(to) home','घर (जाने)'],['töihin','to work','काममा (जाने)'],['ulos','out(side)','बाहिर (जाने)'],['sisään','in(side)','भित्र (जाने)'],['kotona','at home','घरमा'],['kotoa','from home','घरबाट'],['töissä','at work','काममा'],['töistä','from work','कामबाट'],['lääkäriin','to the doctor','डाक्टरकहाँ'],['nukkumaan','to sleep (go to bed)','सुत्न']
];

// ---------- VERB + CASE (rektio) ----------
// [verb, case label, pattern, example fi, en, ne, colourKey]
const REKTIO=[
['pitää','-sta (from)','like = "hold from"','Pidän kahvista.','I like coffee.','मलाई कफी मन पर्छ।','in'],
['tykätä','-sta','like (spoken)','Tykkään musiikista.','I like music.','मलाई संगीत मन पर्छ।','in'],
['puhua','-sta','talk about','Puhumme säästä.','We talk about the weather.','हामी मौसमको बारेमा कुरा गर्छौं।','in'],
['kertoa','-sta + -lle','tell someone about','Kerron äidille matkasta.','I tell Mother about the trip.','म आमालाई यात्राबारे भन्छु।','in'],
['olla kotoisin','-sta','be from','Olen kotoisin Nepalista.','I am from Nepal.','म नेपालबाट हुँ।','in'],
['mennä','-Vn / -lle','go to','Menen kauppaan / torille.','I go to the shop / square.','म पसल / बजार जान्छु।','in'],
['tulla','-sta / -lta','come from','Tulen töistä.','I come from work.','म कामबाट आउँदैछु।','in'],
['muuttaa','-Vn','move to','Muutin Suomeen.','I moved to Finland.','म फिनल्यान्ड सरेँ।','in'],
['vastata','-Vn','answer (to)','Vastaan kysymykseen.','I answer the question.','म प्रश्नको जवाफ दिन्छु।','in'],
['soittaa','-lle','call someone','Soitan äidille.','I call Mother.','म आमालाई फोन गर्छु।','out'],
['antaa','-lle','give to','Annan lahjan ystävälle.','I give a gift to a friend.','म साथीलाई उपहार दिन्छु।','out'],
['sanoa','-lle','say to','Sano hänelle hei!','Say hi to him!','उसलाई नमस्ते भन!','out'],
['kysyä','-lta','ask (from) someone','Kysyn opettajalta.','I ask the teacher.','म शिक्षकसँग सोध्छु।','out'],
['saada','-lta','get from','Sain viestin Mikolta.','I got a message from Mikko.','मैले मिक्कोबाट सन्देश पाएँ।','out'],
['näyttää','-lta','look (like)','Näytät väsyneeltä.','You look tired.','तिमी थाकेको देखिन्छौ।','out'],
['maistua','-lta','taste (like)','Tämä maistuu hyvältä.','This tastes good.','यो मीठो लाग्छ।','out'],
['tuntua','-lta','feel (like)','Se tuntuu kylmältä.','It feels cold.','यो चिसो लाग्छ।','out'],
['kuulostaa','-lta','sound (like)','Kuulostaa hyvältä!','Sounds good!','राम्रो सुनिन्छ!','out'],
['rakastaa','partitive','love','Rakastan sinua.','I love you.','म तिमीलाई माया गर्छु।','par'],
['odottaa','partitive','wait for','Odotan bussia.','I wait for the bus.','म बस पर्खन्छु।','par'],
['auttaa','partitive','help','Autan ystävää.','I help a friend.','म साथीलाई सहयोग गर्छु।','par'],
['opiskella','partitive','study','Opiskelen suomea.','I study Finnish.','म फिनिस पढ्छु।','par'],
['kuunnella','partitive','listen to','Kuuntelen radiota.','I listen to the radio.','म रेडियो सुन्छु।','par'],
['ajatella','partitive','think of','Ajattelen perhettä.','I think of my family.','म परिवारको बारेमा सोच्छु।','par'],
['haluta','+ verb (-a)','want to','Haluan syödä.','I want to eat.','म खान चाहन्छु।','verb'],
['voida','+ verb','can, be able','Voin tulla.','I can come.','म आउन सक्छु।','verb'],
['osata','+ verb','know how','Osaan uida.','I can swim.','म पौडी खेल्न जान्दछु।','verb'],
['täytyy','minun + verb','must','Minun täytyy mennä.','I must go.','मैले जानुपर्छ।','gen']
];

// ---------- OBJECT ----------
const OBJECT=[
['Total object  -n (or -t plural)','Positive sentence, the whole thing, finished or will be finished.','Ostan kirjan. · Syön omenan. · Ostin kengät.','I buy a book. · I eat an apple. · I bought the shoes.','gen'],
['Partitive object  -a / -ta','Negative sentence, unfinished, "some", or a partitive verb.','En osta kirjaa. · Luen kirjaa. · Syön leipää. · Rakastan sinua.','I don\'t buy a book. · I\'m reading a book. · I eat bread. · I love you.','par'],
['Basic form (no ending)','After a command, and after täytyy / pitää.','Osta maito! · Minun täytyy ostaa maito.','Buy the milk! · I must buy the milk.','nom']
];
const PRON_OBJ=[
['minä','minut','minua','me'],['sinä','sinut','sinua','you'],['hän','hänet','häntä','him / her'],['me','meidät','meitä','us'],['te','teidät','teitä','you (pl.)'],['he','heidät','heitä','them']
];

// ---------- VERB EXTRAS ----------
// past tense: inf -> [minä past, hän past, -nut form]
const PAST={
olla:['olin','oli','ollut'],puhua:['puhuin','puhui','puhunut'],asua:['asuin','asui','asunut'],nukkua:['nukuin','nukkui','nukkunut'],ottaa:['otin','otti','ottanut'],lukea:['luin','luki','lukenut'],kirjoittaa:['kirjoitin','kirjoitti','kirjoittanut'],oppia:['opin','oppi','oppinut'],opiskella:['opiskelin','opiskeli','opiskellut'],ymmärtää:['ymmärsin','ymmärsi','ymmärtänyt'],tietää:['tiesin','tiesi','tiennyt'],tuntea:['tunsin','tunsi','tuntenut'],antaa:['annoin','antoi','antanut'],kertoa:['kerroin','kertoi','kertonut'],lähteä:['lähdin','lähti','lähtenyt'],odottaa:['odotin','odotti','odottanut'],auttaa:['autoin','auttoi','auttanut'],pitää:['pidin','piti','pitänyt'],alkaa:['aloin','alkoi','alkanut'],hakea:['hain','haki','hakenut'],soittaa:['soitin','soitti','soittanut'],unohtaa:['unohdin','unohti','unohtanut'],sopia:['sovin','sopi','sopinut'],ostaa:['ostin','osti','ostanut'],maksaa:['maksoin','maksoi','maksanut'],kysyä:['kysyin','kysyi','kysynyt'],sanoa:['sanoin','sanoi','sanonut'],katsoa:['katsoin','katsoi','katsonut'],ajaa:['ajoin','ajoi','ajanut'],rakastaa:['rakastin','rakasti','rakastanut'],muistaa:['muistin','muisti','muistanut'],matkustaa:['matkustin','matkusti','matkustanut'],tanssia:['tanssin','tanssi','tanssinut'],laulaa:['lauloin','lauloi','laulanut'],istua:['istuin','istui','istunut'],leikkiä:['leikin','leikki','leikkinyt'],keittää:['keitin','keitti','keittänyt'],etsiä:['etsin','etsi','etsinyt'],vaihtaa:['vaihdoin','vaihtoi','vaihtanut'],
tehdä:['tein','teki','tehnyt'],nähdä:['näin','näki','nähnyt'],syödä:['söin','söi','syönyt'],juoda:['join','joi','juonut'],saada:['sain','sai','saanut'],voida:['voin','voi','voinut'],käydä:['kävin','kävi','käynyt'],tuoda:['toin','toi','tuonut'],viedä:['vein','vei','vienyt'],myydä:['myin','myi','myynyt'],uida:['uin','ui','uinut'],
mennä:['menin','meni','mennyt'],tulla:['tulin','tuli','tullut'],kävellä:['kävelin','käveli','kävellyt'],ajatella:['ajattelin','ajatteli','ajatellut'],kuunnella:['kuuntelin','kuunteli','kuunnellut'],työskennellä:['työskentelin','työskenteli','työskennellyt'],harjoitella:['harjoittelin','harjoitteli','harjoitellut'],nousta:['nousin','nousi','noussut'],juosta:['juoksin','juoksi','juossut'],pestä:['pesin','pesi','pessyt'],
haluta:['halusin','halusi','halunnut'],tavata:['tapasin','tapasi','tavannut'],osata:['osasin','osasi','osannut'],pelata:['pelasin','pelasi','pelannut'],siivota:['siivosin','siivosi','siivonnut'],tilata:['tilasin','tilasi','tilannut'],herätä:['heräsin','heräsi','herännyt'],vastata:['vastasin','vastasi','vastannut'],lainata:['lainasin','lainasi','lainannut'],hypätä:['hyppäsin','hyppäsi','hypännyt'],pelätä:['pelkäsin','pelkäsi','pelännyt'],
tarvita:['tarvitsin','tarvitsi','tarvinnut'],valita:['valitsin','valitsi','valinnut'],häiritä:['häiritsin','häiritsi','häirinnyt'],lämmetä:['lämpenin','lämpeni','lämmennyt'],vanheta:['vanhenin','vanheni','vanhennut']
};
const PAST_RULES=[
['Add -i- before the person ending','puhu + i + n = puhuin','The past tense marker is the letter i. Person endings stay the same: -n, -t, (hän), -mme, -tte, -vat.'],
['a / ä / e disappears before i','otta → otin · lukea → luin · tulla → tulin','The last vowel of the stem drops. ostaa → ostin, lähteä → lähdin, mennä → menin.'],
['o, u, y, ö stay','sanoa → sanoin · puhua → puhuin · kysyä → kysyin','These round vowels are strong; they keep their place.'],
['Long vowels get short','saada → sain · juoda → join · syödä → söin · viedä → vein','aa → a, uo → o, yö → ö, ie → e.'],
['-ta / -tä verbs (type 4) take -si-','haluta → halusin · tavata → tapasin · osata → osasin','Add s before i. Type 5: tarvita → tarvitsin.'],
['Watch out: t → s','tietää → tiesin · ymmärtää → ymmärsin · tuntea → tunsin','A few common verbs change t into s.'],
['Hän and he are strong (KPT)','minä otin – hän otti – he ottivat','The same KPT rule as the present: minä, sinä, me, te soft; hän and he strong.']
];
const PAST_TIME=[['eilen','yesterday','हिजो'],['toissapäivänä','the day before yesterday','अस्ति'],['viime viikolla','last week','गएको हप्ता'],['viime kuussa','last month','गएको महिना'],['viime vuonna','last year','गएको वर्ष'],['viime kesänä','last summer','गएको गर्मीमा'],['kaksi päivää sitten','two days ago','दुई दिन अघि'],['aamulla','in the morning','बिहान']];

// imperative: [inf, sinä command, älä form, te command, en, ne]
const IMPER=[
['tulla','Tule!','Älä tule!','Tulkaa!','Come!','आऊ!'],
['mennä','Mene!','Älä mene!','Menkää!','Go!','जाऊ!'],
['istua','Istu!','Älä istu!','Istukaa!','Sit!','बस!'],
['odottaa','Odota!','Älä odota!','Odottakaa!','Wait!','पर्ख!'],
['katsoa','Katso!','Älä katso!','Katsokaa!','Look!','हेर!'],
['kuunnella','Kuuntele!','Älä kuuntele!','Kuunnelkaa!','Listen!','सुन!'],
['puhua','Puhu!','Älä puhu!','Puhukaa!','Speak!','बोल!'],
['syödä','Syö!','Älä syö!','Syökää!','Eat!','खाऊ!'],
['juoda','Juo!','Älä juo!','Juokaa!','Drink!','पिऊ!'],
['tehdä','Tee!','Älä tee!','Tehkää!','Do!','गर!'],
['ottaa','Ota!','Älä ota!','Ottakaa!','Take!','लेऊ!'],
['antaa','Anna!','Älä anna!','Antakaa!','Give!','देऊ!'],
['avata','Avaa!','Älä avaa!','Avatkaa!','Open!','खोल!'],
['sulkea','Sulje!','Älä sulje!','Sulkekaa!','Close!','बन्द गर!'],
['kirjoittaa','Kirjoita!','Älä kirjoita!','Kirjoittakaa!','Write!','लेख!'],
['toistaa','Toista!','Älä toista!','Toistakaa!','Repeat!','दोहोर्‍याऊ!'],
['soittaa','Soita!','Älä soita!','Soittakaa!','Call!','फोन गर!'],
['olla hyvä','Ole hyvä!','Älä ole!','Olkaa hyvä!','Here you are / Please!','लिनुहोस्!']
];
// verb + infinitive chunks: [fi, en, ne]
const INF_CHUNKS=[
['Haluan oppia suomea.','I want to learn Finnish.','म फिनिस सिक्न चाहन्छु।'],
['Haluaisin maksaa kortilla.','I would like to pay by card.','म कार्डबाट तिर्न चाहन्छु।'],
['Voin auttaa sinua.','I can help you.','म तिमीलाई सहयोग गर्न सक्छु।'],
['Voitko soittaa minulle?','Can you call me?','मलाई फोन गर्न सक्छौ?'],
['Osaan uida.','I know how to swim.','म पौडी खेल्न जान्दछु।'],
['En osaa ajaa autoa.','I can\'t drive a car.','मलाई गाडी चलाउन आउँदैन।'],
['Saanko istua tässä?','May I sit here?','यहाँ बस्न पाउँ?'],
['Täällä ei saa tupakoida.','Smoking is not allowed here.','यहाँ धुम्रपान गर्न पाइँदैन।'],
['Minun täytyy mennä töihin.','I have to go to work.','मैले काममा जानुपर्छ।'],
['Sinun pitää levätä.','You need to rest.','तिमीले आराम गर्नुपर्छ।'],
['Aion matkustaa Nepaliin.','I am planning to travel to Nepal.','म नेपाल जाने योजनामा छु।'],
['Yritän puhua suomea.','I try to speak Finnish.','म फिनिस बोल्ने कोसिस गर्छु।'],
['Alan ymmärtää.','I am starting to understand.','मलाई बुझ्न थालेको छ।'],
['Tykkään uida.','I like swimming.','मलाई पौडी खेल्न मन पर्छ।'],
['Menen nukkumaan.','I am going to sleep.','म सुत्न जान्छु।'],
['Lähdetään syömään!','Let\'s go and eat!','खान जाऊँ!'],
['Käyn kaupassa ostamassa maitoa.','I\'ll pop to the shop to buy milk.','म दूध किन्न पसल जान्छु।']
];
