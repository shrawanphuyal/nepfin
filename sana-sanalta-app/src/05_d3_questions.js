// ================= QUESTIONS LAB =================
// group: {id, icon, en, ne, key(colour), logic, items:[[word, en, ne, answerShape, [[q, a, qEn, qNe]...], tip]]}
const QGROUPS=[
{id:'who',icon:'🧑',en:'WHO',ne:'को',key:'gen',logic:'kuka = who. Before an ending it changes to kene- (like Nepali को → कस-).',items:[
['Kuka?','who','को?','a person: Mikko, minä, opettaja',[['Kuka tuo on?','Tuo on Mikko.','Who is that?','त्यो को हो?'],['Kuka tulee?','Liisa tulee.','Who is coming?','को आउँदैछ?']],'Plural: Ketkä? (who all)'],
['Kenen?','whose','कसको?','person + -n',[['Kenen kirja tämä on?','Se on Annan.','Whose book is this?','यो कसको किताब हो?']],'-n = -को'],
['Kenelle?','to whom','कसलाई?','person + -lle',[['Kenelle soitat?','Soitan äidille.','Who are you calling?','कसलाई फोन गर्दैछौ?']],'-lle = -लाई'],
['Keneltä?','from whom','कसबाट?','person + -lta',[['Keneltä sait lahjan?','Ystävältä.','Who did you get the gift from?','उपहार कसबाट पायौ?']],'-lta = -बाट'],
['Kenellä?','who has','कोसँग?','person + -lla',[['Kenellä on avain?','Minulla.','Who has the key?','साँचो कोसँग छ?']],'-lla on = -सँग छ'],
['Ketä?','whom (partitive)','कसलाई?','person in partitive',[['Ketä odotat?','Odotan ystävää.','Who are you waiting for?','कसलाई पर्खिरहेका छौ?']],'With partitive verbs: odottaa, rakastaa, auttaa.'],
['Kenen kanssa?','with whom','कोसँग?','person + -n kanssa',[['Kenen kanssa asut?','Perheeni kanssa.','Who do you live with?','कोसँग बस्छौ?']],'']
]},
{id:'what',icon:'❔',en:'WHAT',ne:'के',key:'nom',logic:'mikä is the basic "what". The ending shows its job in the sentence, exactly like other words.',items:[
['Mikä?','what (is it)','के?','basic form: omena, auto',[['Mikä tämä on?','Se on omena.','What is this?','यो के हो?'],['Mikä sinun nimesi on?','Minun nimeni on Ram.','What is your name?','तिम्रो नाम के हो?']],'When "what" is the subject or "is".'],
['Mitä?','what (doing / wanting)','के?','partitive or a verb',[['Mitä teet?','Luen kirjaa.','What are you doing?','के गर्दैछौ?'],['Mitä haluat?','Haluan kahvia.','What do you want?','के चाहन्छौ?']],'With action verbs. Mitä kuuluu? = How are you?'],
['Minkä?','which one (total)','कुन?','object with -n',[['Minkä kirjan ostit?','Ostin tämän kirjan.','Which book did you buy?','कुन किताब किन्यौ?']],'Minkä takia? = Why?'],
['Mitkä?','what (plural)','कुन-कुन?','plural',[['Mitkä kengät ovat sinun?','Mustat.','Which shoes are yours?','कुन जुत्ता तिम्रा हुन्?']],'']
]},
{id:'where',icon:'📍',en:'WHERE',ne:'कहाँ',key:'in',logic:'Three questions, three directions. The ending of the question is the ending of the answer.',items:[
['Missä?','where (at, in)','कहाँ (छ)?','-ssa / -lla',[['Missä asut?','Asun Turussa.','Where do you live?','कहाँ बस्छौ?'],['Missä bussi on?','Pysäkillä.','Where is the bus?','बस कहाँ छ?']],'Not moving. Spoken Turku: Mis?'],
['Mistä?','from where','कहाँबाट?','-sta / -lta',[['Mistä olet kotoisin?','Nepalista.','Where are you from?','कहाँबाट हौ?'],['Mistä tulet?','Töistä.','Where are you coming from?','कहाँबाट आउँदैछौ?']],'Moving away. Also: Mistä pidät? = What do you like?'],
['Mihin? / Minne?','where to','कहाँ (जाने)?','-Vn / -lle',[['Mihin menet?','Kauppaan.','Where are you going?','कहाँ जाँदैछौ?'],['Minne matkustat?','Nepaliin.','Where are you travelling?','कहाँ यात्रा गर्दैछौ?']],'Moving towards. Minne = Mihin.'],
['Millä?','by what (vehicle, tool)','केमा? / केले?','-lla',[['Millä menet töihin?','Bussilla.','How do you get to work?','काममा केमा जान्छौ?'],['Millä maksat?','Kortilla.','How will you pay?','केले तिर्छौ?']],'This is one kind of English "how"!']
]},
{id:'when',icon:'🕒',en:'WHEN',ne:'कहिले',key:'ess',logic:'English "when" is one word, Finnish has several. Ask yourself: a day? a clock time? how long? how often?',items:[
['Milloin?','when (day, time in general)','कहिले?','huomenna, maanantaina, kesällä',[['Milloin tulet?','Huomenna.','When are you coming?','कहिले आउँछौ?'],['Milloin on syntymäpäiväsi?','Toukokuussa.','When is your birthday?','जन्मदिन कहिले हो?']],'Koska? means the same in speech (and koska also = because).'],
['Monelta? / Mihin aikaan?','at what time (clock)','कति बजे?','number + -lta',[['Monelta juna lähtee?','Kahdeksalta.','What time does the train leave?','रेल कति बजे छुट्छ?'],['Mihin aikaan heräät?','Kello kuusi.','What time do you wake up?','कति बजे उठ्छौ?']],'Monelta is the everyday spoken way.'],
['Kuinka kauan? / Kauanko?','how long (duration)','कति समय?','number + partitive: kaksi tuntia',[['Kuinka kauan matka kestää?','Kaksi tuntia.','How long does the trip take?','यात्रामा कति समय लाग्छ?'],['Kauanko olet asunut Suomessa?','Vuoden.','How long have you lived in Finland?','फिनल्यान्डमा कति समयदेखि बस्दैछौ?']],'Not a time point, but a length of time!'],
['Kuinka usein?','how often','कति पटक?','kerran viikossa, joka päivä',[['Kuinka usein käyt salilla?','Kolme kertaa viikossa.','How often do you go to the gym?','जिम कति पटक जान्छौ?'],['Kuinka usein bussi kulkee?','Kymmenen minuutin välein.','How often does the bus run?','बस कति-कति बेला चल्छ?']],'Answers: aina, usein, joskus, harvoin, ei koskaan.'],
['Mistä lähtien? / Mihin asti?','since when / until when','कहिलेदेखि / कहिलेसम्म?','-sta / -Vn asti',[['Mihin asti kauppa on auki?','Kymmeneen asti.','Until when is the shop open?','पसल कहिलेसम्म खुला छ?']],''],
['Monesko?','which (date, in order)','कतिऔं?','ordinal: ensimmäinen, toinen…',[['Monesko päivä tänään on?','Ensimmäinen marraskuuta.','What is the date today?','आज कति गते हो?']],'']
]},
{id:'how',icon:'🧭',en:'HOW',ne:'कसरी',key:'out',logic:'English "how" is four different Finnish questions. Ask: in what way? by what? how does it seem? how + adjective?',items:[
['Miten? / Kuinka?','how (in what way)','कसरी?','an adverb: hyvin, hitaasti, näin',[['Miten menee?','Hyvin, kiitos.','How is it going?','कस्तो चल्दैछ?'],['Miten sanotaan "thank you"?','Kiitos.','How do you say "thank you"?','"thank you" कसरी भनिन्छ?'],['Miten pääsen asemalle?','Mene suoraan ja käänny oikealle.','How do I get to the station?','स्टेसन कसरी पुग्ने?']],'The general "how". Spoken: Mites?'],
['Millä?','how (by what means)','केमा?','-lla: bussilla, kortilla',[['Millä tulit?','Junalla.','How did you come?','केमा आयौ?']],'For vehicles, tools, money.'],
['Miltä?','how does it look / taste / feel','कस्तो लाग्छ?','adjective + -lta: hyvältä',[['Miltä ruoka maistuu?','Hyvältä!','How does the food taste?','खाना कस्तो लाग्यो?'],['Miltä tuntuu?','Tuntuu hyvältä.','How does it feel?','कस्तो महसुस हुन्छ?']],'With maistua, näyttää, tuntua, kuulostaa.'],
['Kuinka + adjective','how old / big / far','कति (पुरानो / ठूलो / टाढा)?','number or adjective',[['Kuinka vanha olet?','Olen kolmekymmentä.','How old are you?','तिमी कति वर्षको भयौ?'],['Kuinka pitkä matka on?','Kaksi kilometriä.','How far is it?','कति टाढा छ?']],'Kuinka + any adjective.']
]},
{id:'kind',icon:'🎨',en:'WHAT KIND',ne:'कस्तो',key:'par',logic:'You want a description. Answer with an adjective.',items:[
['Millainen?','what kind, what is it like','कस्तो?','adjective: kylmä, iso, kiva',[['Millainen sää on?','Kylmä ja tuulinen.','What is the weather like?','मौसम कस्तो छ?'],['Millainen sinun kotisi on?','Pieni mutta valoisa.','What is your home like?','तिम्रो घर कस्तो छ?']],'Spoken: millanen. Same: minkälainen.'],
['Minkä värinen?','what colour','कुन रङको?','colour: sininen',[['Minkä värinen auto on?','Punainen.','What colour is the car?','गाडी कुन रङको छ?']],''],
['Minkä kokoinen?','what size','कति साइजको?','size: iso, M, 40',[['Minkä kokoinen paita?','Medium.','What size shirt?','कुन साइजको सर्ट?']],''],
['Minkä maalainen?','what nationality','कुन देशको?','nationality: nepalilainen',[['Minkä maalainen olet?','Olen nepalilainen.','What nationality are you?','तिमी कुन देशको हौ?']],'']
]},
{id:'much',icon:'💶',en:'HOW MUCH / MANY',ne:'कति',key:'gen',logic:'Paljonko for amounts and money, montako for things you can count. After the number comes the partitive.',items:[
['Paljonko? / Kuinka paljon?','how much','कति?','number + euroa',[['Paljonko tämä maksaa?','Viisi euroa.','How much does this cost?','यो कति पर्छ?'],['Paljonko kello on?','Kello on kolme.','What time is it?','कति बज्यो?']],''],
['Montako? / Kuinka monta?','how many','कतिवटा?','number + partitive',[['Montako lasta sinulla on?','Kaksi lasta.','How many children do you have?','तिम्रा कतिवटा बच्चा छन्?'],['Kuinka monta kieltä puhut?','Kolmea.','How many languages do you speak?','कतिवटा भाषा बोल्छौ?']],'Noun after montako is partitive: montako lasta.']
]},
{id:'why',icon:'🤷',en:'WHY / WHICH',ne:'किन / कुन',key:'ess',logic:'Miksi asks for a reason, answer with koska (because). Kumpi chooses between two.',items:[
['Miksi?','why','किन?','Koska … (because)',[['Miksi opiskelet suomea?','Koska asun Suomessa.','Why do you study Finnish?','किन फिनिस पढ्छौ?'],['Miksi olet myöhässä?','Koska bussi oli myöhässä.','Why are you late?','किन ढिला भयौ?']],'Minkä takia? also = why.'],
['Kumpi?','which (of two)','कुन (दुईमध्ये)?','one of two',[['Kumpi on parempi, tee vai kahvi?','Kahvi!','Which is better, tea or coffee?','कुन राम्रो, चिया कि कफी?']],'vai = or (in questions) = Nepali कि.']
]}
];

// yes/no: how to build
const YN_STEPS=[
['1. Start with the sentence','Sinä puhut suomea.','You speak Finnish.'],
['2. Move the verb to the front','Puhut sinä suomea …','(verb first)'],
['3. Glue -ko or -kö onto the verb','Puhutko sinä suomea?','Do you speak Finnish?'],
['4. Drop sinä if you like','Puhutko suomea?','The -t already says "you".']
];
// ko / kö examples: [verb form, question, en]
const KO_EX=[
['olet','Oletko?','Are you?'],['on','Onko?','Is (there)?'],['voit','Voitko?','Can you?'],['puhut','Puhutko?','Do you speak?'],['haluat','Haluatko?','Do you want?'],['osaat','Osaatko?','Can you (skill)?'],['asut','Asutko?','Do you live?'],['tulet','Tuletko?','Are you coming?'],
['tiedät','Tiedätkö?','Do you know?'],['menet','Menetkö?','Are you going?'],['syöt','Syötkö?','Do you eat?'],['näet','Näetkö?','Do you see?'],['pidät','Pidätkö?','Do you like?'],['ymmärrät','Ymmärrätkö?','Do you understand?'],['tarvitset','Tarvitsetko?','Do you need?'],['saan','Saanko?','May I?']
];
// person flip: question person -> answer person
const FLIP=[
['Oletko (sinä) kotona?','Olen.','En ole.','you → I'],
['Oletteko (te) kotona?','Olemme. / (speech) Ollaan.','Emme ole.','you all → we'],
['Onko hän kotona?','On.','Ei ole.','he/she → he/she'],
['Ovatko he kotona?','Ovat.','Eivät ole.','they → they'],
['Olenko minä myöhässä?','Olet.','Et ole.','I → you'],
['Onko sinulla autoa?','On.','Ei ole.','"have" → On / Ei ole']
];
const NEGQ=[
['Etkö tule?','Aren\'t you coming?','तिमी आउँदैनौ?'],['Eikö hän ole kotona?','Isn\'t she at home?','उनी घरमा छैनन् र?'],['Etkö ymmärrä?','Don\'t you understand?','बुझेनौ?'],['Eikö olekin kaunis päivä?','Isn\'t it a beautiful day?','कस्तो राम्रो दिन, होइन र?'],['Eikö niin?','Right? Isn\'t it so?','होइन र?']
];
// polite questions: [fi, en, ne, note]
const POLITE=[
['Voitko auttaa?','Can you help?','सहयोग गर्न सक्छौ?','Direct, friendly.'],
['Voisitko auttaa?','Could you help?','सहयोग गरिदिनुहुन्छ कि?','-isi- = would / could. Softer.'],
['Voisitteko puhua hitaammin?','Could you speak more slowly?','अलि बिस्तारै बोलिदिनुहुन्छ?','te-form = very polite.'],
['Saanko kysyä?','May I ask?','सोध्न पाउँ?','saada = be allowed.'],
['Saisinko kahvin?','Could I have a coffee?','एउटा कफी पाउँ कि?','The most useful café / shop phrase.'],
['Haluaisitko teetä?','Would you like some tea?','चिया खानुहुन्छ कि?','Offering something.'],
['Olisiko teillä aikaa huomenna?','Would you have time tomorrow?','भोलि समय होला कि?','Very polite.'],
['Sopisiko torstai?','Would Thursday suit you?','बिहीबार मिल्ला?','Booking times.'],
['Voinko maksaa kortilla?','Can I pay by card?','कार्डबाट तिर्न सक्छु?',''],
['Onko tämä paikka vapaa?','Is this seat free?','यो सिट खाली छ?','']
];
// personal question & answer bank for speaking: [q, en, ne, model answer, answer en]
const QA_BANK=[
['Mikä sinun nimesi on?','What is your name?','तिम्रो नाम के हो?','Minun nimeni on Ram.','My name is Ram.'],
['Mistä olet kotoisin?','Where are you from?','कहाँबाट हौ?','Olen kotoisin Nepalista.','I am from Nepal.'],
['Missä asut?','Where do you live?','कहाँ बस्छौ?','Asun Turussa.','I live in Turku.'],
['Kuinka vanha olet?','How old are you?','कति वर्षको भयौ?','Olen kolmekymmentä vuotta vanha.','I am thirty years old.'],
['Mitä teet työksesi?','What do you do for work?','के काम गर्छौ?','Olen ohjelmoija.','I am a programmer.'],
['Mitä kieliä puhut?','What languages do you speak?','कुन-कुन भाषा बोल्छौ?','Puhun nepalia, englantia ja vähän suomea.','I speak Nepali, English and a little Finnish.'],
['Kauanko olet asunut Suomessa?','How long have you lived in Finland?','फिनल्यान्डमा कति समय भयो?','Olen asunut Suomessa kaksi vuotta.','I have lived in Finland for two years.'],
['Onko sinulla perhettä?','Do you have a family?','तिम्रो परिवार छ?','On. Minulla on vaimo ja kaksi lasta.','Yes. I have a wife and two children.'],
['Mitä teet vapaa-ajalla?','What do you do in your free time?','फुर्सदमा के गर्छौ?','Vapaa-ajalla kävelen ja luen.','In my free time I walk and read.'],
['Mistä pidät?','What do you like?','तिमीलाई के मन पर्छ?','Pidän saunasta ja luonnosta.','I like the sauna and nature.'],
['Millainen sää tänään on?','What is the weather like today?','आज मौसम कस्तो छ?','Tänään on kylmä ja pilvinen.','Today it is cold and cloudy.'],
['Mihin aikaan heräät?','What time do you wake up?','कति बजे उठ्छौ?','Herään kello kuusi.','I wake up at six.'],
['Millä menet töihin?','How do you get to work?','काममा केमा जान्छौ?','Menen töihin bussilla.','I go to work by bus.'],
['Mitä söit aamupalaksi?','What did you eat for breakfast?','बिहान के खायौ?','Söin puuroa ja join teetä.','I ate porridge and drank tea.'],
['Mitä teit eilen?','What did you do yesterday?','हिजो के गर्‍यौ?','Eilen olin töissä ja illalla kävin kaupassa.','Yesterday I was at work and in the evening I went to the shop.'],
['Mitä teet viikonloppuna?','What are you doing at the weekend?','सप्ताहान्तमा के गर्छौ?','Viikonloppuna tapaan ystäviä.','At the weekend I meet friends.'],
['Kuinka usein käyt kaupassa?','How often do you go to the shop?','कति पटक पसल जान्छौ?','Käyn kaupassa kaksi kertaa viikossa.','I go to the shop twice a week.'],
['Mikä on puhelinnumerosi?','What is your phone number?','तिम्रो फोन नम्बर कति हो?','Se on nolla neljä nolla, yksi kaksi kolme, neljä viisi kuusi seitsemän.','It is 040 123 4567.'],
['Milloin on syntymäpäiväsi?','When is your birthday?','तिम्रो जन्मदिन कहिले हो?','Syntymäpäiväni on viidestoista toukokuuta.','My birthday is on the fifteenth of May.'],
['Osaatko uida?','Can you swim?','पौडी खेल्न जान्दछौ?','Osaan. / En osaa.','Yes, I can. / No, I can\'t.'],
['Pidätkö kahvista?','Do you like coffee?','तिमीलाई कफी मन पर्छ?','Pidän. / En pidä, juon mieluummin teetä.','Yes. / No, I prefer tea.'],
['Oletko naimisissa?','Are you married?','तिम्रो बिहे भएको छ?','Olen. / En ole.','Yes, I am. / No, I am not.'],
['Onko sinulla lapsia?','Do you have children?','तिम्रा बच्चा छन्?','On, kaksi. / Ei ole.','Yes, two. / No.'],
['Mikä on lempiruokasi?','What is your favourite food?','तिम्रो मनपर्ने खाना के हो?','Lempiruokani on dal bhat.','My favourite food is dal bhat.'],
['Millainen sinun kotisi on?','What is your home like?','तिम्रो घर कस्तो छ?','Kotini on pieni mutta valoisa kaksio.','My home is a small but bright two-room flat.'],
['Miltä Suomi tuntuu?','How does Finland feel?','फिनल्यान्ड कस्तो लाग्छ?','Suomi tuntuu hyvältä, mutta talvi on pitkä.','Finland feels good, but winter is long.'],
['Miksi opiskelet suomea?','Why are you studying Finnish?','किन फिनिस पढ्छौ?','Koska asun Suomessa ja haluan puhua ihmisten kanssa.','Because I live in Finland and want to talk with people.'],
['Mitä teet huomenna?','What are you doing tomorrow?','भोलि के गर्छौ?','Huomenna menen töihin ja illalla opiskelen.','Tomorrow I go to work and study in the evening.'],
['Kenen kanssa asut?','Who do you live with?','कोसँग बस्छौ?','Asun perheeni kanssa.','I live with my family.'],
['Monelta lähdet töihin?','What time do you leave for work?','कति बजे काममा निस्कन्छौ?','Lähden töihin puoli kahdeksalta.','I leave for work at half past seven.']
];
