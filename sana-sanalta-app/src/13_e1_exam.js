// ================= EXAM SETS (1–2) =================
// read/listen q: [question fi, en, ne, [options], index of correct]
// listen line: [speaker A/B/N, fi, en, ne]
const EXAMS=[
{id:'e1',e:'🙋',fi:'Minä ja arki',en:'Me and everyday life',ne:'म र दैनिक जीवन',lvl:'A1.1–A1.2',
read:[
{k:'📋',h:['Kahvilan ovessa','On the café door','क्याफेको ढोकामा'],t:[
['Kahvila Aamu','Café Aamu','क्याफे आमु'],
['Avoinna: maanantaista perjantaihin kello 7–18.','Open: Monday to Friday 7–18.','खुला: सोमबारदेखि शुक्रबारसम्म ७–१८ बजे।'],
['Lauantaina kello 9–16. Sunnuntaina suljettu.','Saturday 9–16. Closed on Sunday.','शनिबार ९–१६ बजे। आइतबार बन्द।'],
['Kahvi 2,50 € · Tee 2,20 € · Pulla 3,00 €','Coffee 2.50 € · Tea 2.20 € · Bun 3.00 €','कफी २.५० € · चिया २.२० € · पुल्ला ३ €'],
['Lounas joka arkipäivä kello 11–14.','Lunch every weekday 11–14.','हरेक कार्यदिन ११–१४ बजे दिउँसोको खाना।'],
['Langaton verkko on ilmainen.','The wifi is free.','वाइफाइ निःशुल्क छ।']],
q:[['Milloin kahvila on kiinni?','When is the café closed?','क्याफे कहिले बन्द हुन्छ?',['maanantaina','lauantaina','sunnuntaina'],2],
['Paljonko kahvi maksaa?','How much does coffee cost?','कफी कति पर्छ?',['2,20 €','2,50 €','3,00 €'],1],
['Milloin voi syödä lounasta?','When can you eat lunch?','दिउँसोको खाना कहिले खान सकिन्छ?',['joka päivä kello 7–18','arkisin kello 11–14','lauantaina kello 9–16'],1]]},
{k:'💬',h:['Tekstiviesti','A text message','मोबाइल सन्देश'],t:[
['Moi Ram! Olen nyt kaupassa.','Hi Ram! I am at the shop now.','नमस्ते राम! म अहिले पसलमा छु।'],
['Tarvitsemmeko maitoa?','Do we need milk?','हामीलाई दूध चाहिन्छ?'],
['Ostan leipää ja kahvia.','I am buying bread and coffee.','म रोटी र कफी किन्दैछु।'],
['Tulen kotiin kello kuusi.','I will come home at six.','म छ बजे घर आउँछु।'],
['Voitko tehdä ruokaa? Terveisin, Sita','Can you cook? Regards, Sita','तिमी खाना बनाउन सक्छौ? सीता']],
q:[['Missä Sita on nyt?','Where is Sita now?','सीता अहिले कहाँ छिन्?',['kotona','kaupassa','töissä'],1],
['Mitä Sita ostaa?','What does Sita buy?','सीता के किन्छिन्?',['maitoa ja kahvia','leipää ja kahvia','leipää ja maitoa'],1],
['Mitä Ramin pitää tehdä?','What should Ram do?','रामले के गर्नुपर्छ?',['tehdä ruokaa','käydä kaupassa','soittaa Sitalle'],0]]},
{k:'📖',h:['Ana','Ana','आना'],t:[
['Tämä on Ana.','This is Ana.','यो आना हो।'],
['Hän on kotoisin Espanjasta, mutta nyt hän asuu Tampereella.','She is from Spain, but now she lives in Tampere.','उनी स्पेनबाट हुन्, तर अहिले टाम्पेरेमा बस्छिन्।'],
['Ana on kolmekymmentäkaksi vuotta vanha.','Ana is thirty-two years old.','आना बत्तीस वर्षकी छिन्।'],
['Hän on sairaanhoitaja ja työskentelee sairaalassa.','She is a nurse and works in a hospital.','उनी नर्स हुन् र अस्पतालमा काम गर्छिन्।'],
['Ana puhuu espanjaa, englantia ja vähän suomea.','Ana speaks Spanish, English and a little Finnish.','आना स्पेनिस, अंग्रेजी र अलिअलि फिनिस बोल्छिन्।'],
['Hän opiskelee suomea kaksi kertaa viikossa.','She studies Finnish twice a week.','उनी हप्तामा दुई पटक फिनिस पढ्छिन्।'],
['Vapaa-ajalla Ana pelaa tennistä ja lukee kirjoja.','In her free time Ana plays tennis and reads books.','फुर्सदमा आना टेनिस खेल्छिन् र किताब पढ्छिन्।'],
['Hänellä ei ole lasta, mutta hänellä on kissa.','She has no children, but she has a cat.','उनको बच्चा छैन, तर एउटा बिरालो छ।']],
q:[['Mistä Ana on kotoisin?','Where is Ana from?','आना कहाँबाट हुन्?',['Tampereelta','Espanjasta','Englannista'],1],
['Mikä Anan ammatti on?','What is Ana\'s job?','आनाको पेशा के हो?',['opettaja','lääkäri','sairaanhoitaja'],2],
['Kuinka usein Ana opiskelee suomea?','How often does Ana study Finnish?','आना कति पटक फिनिस पढ्छिन्?',['joka päivä','kaksi kertaa viikossa','kerran kuussa'],1],
['Mikä lemmikki Analla on?','What pet does Ana have?','आनासँग कुन घरपालुवा जनावर छ?',['koira','kissa','ei mitään'],1]]}],
listen:[
{k:'🙋',h:['Esittely','An introduction','परिचय'],l:[
['N','Hei! Minun nimeni on Mikko Virtanen.','Hi! My name is Mikko Virtanen.','नमस्ते! मेरो नाम मिक्को भिर्तानेन हो।'],
['N','Olen neljäkymmentä vuotta vanha.','I am forty years old.','म चालीस वर्षको हुँ।'],
['N','Asun Turussa vaimoni ja kahden lapseni kanssa.','I live in Turku with my wife and two children.','म टुर्कुमा श्रीमती र दुई बच्चासँग बस्छु।'],
['N','Olen opettaja. Puhun suomea, ruotsia ja englantia.','I am a teacher. I speak Finnish, Swedish and English.','म शिक्षक हुँ। म फिनिस, स्विडिस र अंग्रेजी बोल्छु।'],
['N','Viikonloppuna käyn uimassa.','At the weekend I go swimming.','सप्ताहान्तमा म पौडी खेल्न जान्छु।']],
q:[['Kuinka vanha Mikko on?','How old is Mikko?','मिक्को कति वर्षका छन्?',['14','40','44'],1],
['Mitä Mikko tekee viikonloppuna?','What does Mikko do at the weekend?','मिक्को सप्ताहान्तमा के गर्छन्?',['käy uimassa','pelaa jalkapalloa','lukee kirjaa'],0]]},
{k:'☕',h:['Kahvilassa','At the café','क्याफेमा'],l:[
['A','Hei, mitä saisi olla?','Hi, what would you like?','नमस्ते, के लिनुहुन्छ?'],
['B','Yksi tee ja yksi pulla, kiitos.','One tea and one bun, please.','एउटा चिया र एउटा पुल्ला, धन्यवाद।'],
['A','Laitetaanko teehen maitoa?','Shall I put milk in the tea?','चियामा दूध हालौं?'],
['B','Ei kiitos. Paljonko se maksaa?','No thanks. How much is it?','पर्दैन, धन्यवाद। कति भयो?'],
['A','Viisi euroa kaksikymmentä senttiä.','Five euros twenty cents.','पाँच युरो बीस सेन्ट।'],
['B','Maksan kortilla.','I\'ll pay by card.','म कार्डबाट तिर्छु।']],
q:[['Mitä asiakas ostaa?','What does the customer buy?','ग्राहकले के किन्छ?',['kahvin ja pullan','teen ja pullan','teen ja voileivän'],1],
['Paljonko asiakas maksaa?','How much does the customer pay?','ग्राहकले कति तिर्छ?',['5,20 €','2,50 €','5,50 €'],0]]},
{k:'📞',h:['Puhelinnumero','A phone number','फोन नम्बर'],l:[
['A','Mikä sinun puhelinnumerosi on?','What is your phone number?','तिम्रो फोन नम्बर कति हो?'],
['B','Se on nolla neljä nolla, kolme kaksi viisi, seitsemän kahdeksan yhdeksän nolla.','It is 040 325 7890.','शून्य चार शून्य, तीन दुई पाँच, सात आठ नौ शून्य।'],
['A','Kiitos, soitan sinulle huomenna.','Thanks, I\'ll call you tomorrow.','धन्यवाद, म भोलि फोन गर्छु।']],
q:[['Mikä numero on?','What is the number?','नम्बर कति हो?',['040 325 7890','040 352 7890','040 325 7980'],0]]},
{k:'⏰',h:['Paljonko kello on?','What time is it?','कति बज्यो?'],l:[
['A','Anteeksi, paljonko kello on?','Excuse me, what time is it?','माफ गर्नुहोस्, कति बज्यो?'],
['B','Kello on puoli kolme.','It is half past two.','साढे दुई बज्यो।'],
['A','Kiitos! Bussi lähtee kolmelta, minulla on vielä aikaa.','Thanks! The bus leaves at three, I still have time.','धन्यवाद! बस तीन बजे छुट्छ, मसँग अझै समय छ।']],
q:[['Paljonko kello on?','What time is it?','कति बज्यो?',['3.30','2.30','3.00'],1],
['Milloin bussi lähtee?','When does the bus leave?','बस कहिले छुट्छ?',['kello kolme','kello puoli kolme','kello kolmetoista'],0]]},
{k:'📩',h:['Viesti kielikoulusta','A message from the language school','भाषा विद्यालयबाट सन्देश'],l:[
['N','Hei Ram, täällä on Liisa kielikoulusta.','Hi Ram, this is Liisa from the language school.','नमस्ते राम, म भाषा विद्यालयबाट लिसा बोल्दैछु।'],
['N','Huomenna ei ole suomen tuntia, koska opettaja on sairas.','There is no Finnish class tomorrow, because the teacher is sick.','भोलि फिनिस कक्षा छैन, किनभने शिक्षक बिरामी हुनुहुन्छ।'],
['N','Seuraava tunti on torstaina kello viisi.','The next class is on Thursday at five.','अर्को कक्षा बिहीबार पाँच बजे छ।'],
['N','Nähdään!','See you!','भेटौंला!']],
q:[['Miksi huomenna ei ole tuntia?','Why is there no class tomorrow?','भोलि किन कक्षा छैन?',['opettaja on sairas','koulu on kiinni','on loma'],0],
['Milloin seuraava tunti on?','When is the next class?','अर्को कक्षा कहिले छ?',['tiistaina kello viisi','torstaina kello viisi','torstaina kello kuusi'],1]]}],
write:[
{k:'form',h:['Lomake','A form','फारम'],task:['Täytä lomake omilla tiedoillasi.','Fill in the form with your own information.','आफ्नो विवरणले फारम भर्नुहोस्।'],
fields:['Etunimi','Sukunimi','Osoite','Postinumero ja kaupunki','Puhelinnumero','Syntymäaika','Kansalaisuus','Äidinkieli','Muut kielet'],
model:['Etunimi: Ram · Sukunimi: Sharma · Osoite: Kauppakatu 5 A 3 · Postinumero ja kaupunki: 20100 Turku · Puhelinnumero: 040 123 4567 · Syntymäaika: 15.5.1996 · Kansalaisuus: nepalilainen · Äidinkieli: nepali · Muut kielet: englanti, hindi, vähän suomea','First name · Last name · Address · Postcode and city · Phone number · Date of birth (day.month.year) · Citizenship · Mother tongue · Other languages']},
{k:'msg',h:['Kutsu kahville','Invite a friend for coffee','साथीलाई कफीको निम्तो'],task:['Kirjoita viesti ystävälle. Kutsu hänet kahville. Kerro päivä, kellonaika ja paikka.','Write a message to a friend. Invite them for coffee. Say the day, the time and the place.','साथीलाई सन्देश लेख्नुहोस्। कफी पिउन बोलाउनुहोस्। दिन, समय र ठाउँ भन्नुहोस्।'],words:'25–40',
frames:['Moi …!','Mitä kuuluu?','Tuletko kahville …?','Voimme mennä …','Sopiiko kello …?','Nähdään!'],
model:['Moi Liisa! Mitä kuuluu? Tuletko kahville lauantaina? Voimme mennä Kahvila Aamuun keskustassa. Sopiiko kello kaksi? Minä tarjoan pullat! Vastaa, kun ehdit. Terveisin, Ram','Hi Liisa! How are you? Will you come for coffee on Saturday? We can go to Café Aamu in the centre. Does two o\'clock suit you? The buns are on me! Answer when you have time. Regards, Ram']},
{k:'text',h:['Kerro itsestäsi','Write about yourself','आफ्नो बारेमा लेख्नुहोस्'],task:['Kirjoita itsestäsi: nimi, maa, kaupunki, perhe, työ, kielet ja harrastukset.','Write about yourself: name, country, city, family, work, languages and hobbies.','आफ्नो बारेमा लेख्नुहोस्: नाम, देश, शहर, परिवार, काम, भाषा र रुचि।'],words:'50–70',
frames:['Minun nimeni on …','Olen kotoisin …sta.','Asun …ssa.','Minulla on …','Olen …(ammatti).','Puhun …a ja …a.','Vapaa-ajalla …'],
model:['Minun nimeni on Ram Sharma. Olen kotoisin Nepalista, Pokharasta. Nyt asun Turussa. Olen naimisissa, ja minulla on kaksi lasta. Työskentelen ohjelmoijana IT-yrityksessä. Puhun nepalia, hindiä, englantia ja vähän suomea. Opiskelen suomea joka päivä. Vapaa-ajalla pelaan sulkapalloa ja kävelen metsässä. Pidän Suomesta, koska täällä on rauhallista.','My name is Ram Sharma. I am from Nepal, from Pokhara. Now I live in Turku. I am married and I have two children. I work as a programmer in an IT company. I speak Nepali, Hindi, English and a little Finnish. I study Finnish every day. In my free time I play badminton and walk in the forest. I like Finland because it is peaceful here.']}],
speak:[
{k:'intro',h:['Esittele itsesi','Introduce yourself','आफ्नो परिचय दिनुहोस्'],prep:30,time:60,items:[
['Kerro: nimi, maa, kaupunki, perhe, työ tai opiskelu, kielet, harrastukset.','Say: name, country, city, family, work or study, languages, hobbies.','भन्नुहोस्: नाम, देश, शहर, परिवार, काम वा पढाइ, भाषा, रुचि।',
'Hei! Minun nimeni on Ram. Olen kotoisin Nepalista. Asun Turussa perheeni kanssa. Minulla on vaimo ja kaksi lasta. Olen ohjelmoija. Puhun nepalia, englantia ja vähän suomea. Vapaa-ajalla pelaan sulkapalloa. Kiitos!','Hi! My name is Ram. I am from Nepal. I live in Turku with my family. I have a wife and two children. I am a programmer. I speak Nepali, English and a little Finnish. In my free time I play badminton. Thank you!']]},
{k:'qa',h:['Vastaa kysymyksiin','Answer the questions','प्रश्नको उत्तर दिनुहोस्'],prep:5,time:20,items:[
['Mikä sinun nimesi on?','What is your name?','तिम्रो नाम के हो?','Minun nimeni on Ram Sharma.','My name is Ram Sharma.'],
['Mistä olet kotoisin?','Where are you from?','तिमी कहाँबाट हौ?','Olen kotoisin Nepalista.','I am from Nepal.'],
['Missä asut?','Where do you live?','तिमी कहाँ बस्छौ?','Asun Turussa, keskustan lähellä.','I live in Turku, near the centre.'],
['Mitä kieliä puhut?','What languages do you speak?','तिमी कुन-कुन भाषा बोल्छौ?','Puhun nepalia, englantia ja vähän suomea.','I speak Nepali, English and a little Finnish.'],
['Mitä teet vapaa-ajalla?','What do you do in your free time?','फुर्सदमा के गर्छौ?','Pelaan sulkapalloa ja luen kirjoja.','I play badminton and read books.']]},
{k:'situ',h:['Mitä sanot?','What do you say?','तिमी के भन्छौ?'],prep:10,time:20,items:[
['Olet kahvilassa. Tilaa kahvi ja pulla.','You are in a café. Order a coffee and a bun.','तिमी क्याफेमा छौ। कफी र पुल्ला मगाऊ।','Hei! Saisinko yhden kahvin ja pullan, kiitos.','Hi! Could I have a coffee and a bun, please.'],
['Et ymmärrä. Pyydä toistamaan hitaasti.','You don\'t understand. Ask the person to repeat slowly.','तिमीले बुझेनौ। बिस्तारै दोहोर्‍याउन भन।','Anteeksi, en ymmärrä. Voitko puhua hitaammin?','Sorry, I don\'t understand. Can you speak more slowly?'],
['Kysy kadulla, paljonko kello on.','Ask someone in the street what time it is.','सडकमा कसैलाई कति बज्यो सोध।','Anteeksi, paljonko kello on?','Excuse me, what time is it?']]},
{k:'pic',h:['Kerro perheestäsi','Tell about your family','आफ्नो परिवारबारे भन'],pic:'👨‍👩‍👧‍👦 🏠 🐈',prep:30,time:60,items:[
['Kerro perheestäsi: keitä perheessä on, kuinka vanhoja he ovat, missä he asuvat.','Tell about your family: who is in it, how old they are, where they live.','आफ्नो परिवारबारे भन: को-को छन्, कति वर्षका, कहाँ बस्छन्।',
'Minun perheessäni on neljä ihmistä. Vaimoni nimi on Sita. Hän on sairaanhoitaja. Meillä on poika ja tytär. Poika on kuusi vuotta vanha ja tytär on kolme. Asumme Turussa. Vanhempani asuvat Nepalissa. Meillä on myös kissa.','There are four people in my family. My wife\'s name is Sita. She is a nurse. We have a son and a daughter. The son is six and the daughter is three. We live in Turku. My parents live in Nepal. We also have a cat.']]}]},

{id:'e2',e:'🏠',fi:'Koti ja ostokset',en:'Home and shopping',ne:'घर र किनमेल',lvl:'A1.2',
read:[
{k:'🏢',h:['Asuntoilmoitus','An apartment ad','फ्ल्याटको विज्ञापन'],t:[
['Vuokrataan kaksio Turun keskustasta.','Two-room flat for rent in Turku city centre.','टुर्कुको केन्द्रमा दुई कोठाको फ्ल्याट भाडामा।'],
['Koko 52 m². Olohuone, makuuhuone, keittiö ja kylpyhuone, jossa on sauna.','Size 52 m². Living room, bedroom, kitchen and a bathroom with a sauna.','५२ वर्गमिटर। बैठक कोठा, सुत्ने कोठा, भान्सा र सौना भएको बाथरुम।'],
['Vuokra 850 € kuukaudessa.','Rent 850 € a month.','भाडा महिनाको ८५० €।'],
['Asunto on kolmannessa kerroksessa. Talossa on hissi.','The flat is on the third floor. The building has a lift.','फ्ल्याट तेस्रो तलामा छ। भवनमा लिफ्ट छ।'],
['Lemmikit eivät ole sallittuja.','Pets are not allowed.','घरपालुवा जनावर राख्न पाइँदैन।'],
['Soita: 044 567 1234.','Call: 044 567 1234.','फोन: ०४४ ५६७ १२३४।']],
q:[['Mitä huoneita asunnossa on?','What rooms does the flat have?','फ्ल्याटमा कुन-कुन कोठा छन्?',['yksi huone ja keittiö','kaksi huonetta, keittiö ja kylpyhuone','kolme huonetta ja keittiö'],1],
['Mitä kylpyhuoneessa on?','What is in the bathroom?','बाथरुममा के छ?',['sauna','pesukone','kylpyamme'],0],
['Voiko asunnossa olla koira?','Can you have a dog in the flat?','फ्ल्याटमा कुकुर राख्न सकिन्छ?',['voi','ei voi','ei kerrota'],1]]},
{k:'🏷️',h:['Kaupan tarjoukset','Shop offers','पसलका अफरहरू'],t:[
['Tarjous maanantaista sunnuntaihin!','Offer from Monday to Sunday!','सोमबारदेखि आइतबारसम्म अफर!'],
['Banaanit 1,49 €/kg','Bananas 1.49 €/kg','केरा १.४९ €/किलो'],
['Ruisleipä 1,99 €','Rye bread 1.99 €','राई रोटी १.९९ €'],
['Maito 1 litra 0,99 €','Milk 1 litre 0.99 €','दूध १ लिटर ०.९९ €'],
['Kahvi 500 g 4,95 €','Coffee 500 g 4.95 €','कफी ५०० ग्राम ४.९५ €'],
['Kaksi pizzaa 6 €','Two pizzas 6 €','दुई पिज्जा ६ €']],
q:[['Paljonko kilo banaaneja maksaa?','How much is a kilo of bananas?','एक किलो केरा कति पर्छ?',['0,99 €','1,49 €','1,99 €'],1],
['Mikä maksaa 6 euroa?','What costs 6 euros?','६ युरो केको पर्छ?',['yksi pizza','kaksi pizzaa','kahvi'],1]]},
{k:'📖',h:['Hannan koti','Hanna\'s home','हान्नाको घर'],t:[
['Asun pienessä yksiössä Helsingissä.','I live in a small studio flat in Helsinki.','म हेल्सिंकीमा एउटा सानो एक कोठे फ्ल्याटमा बस्छु।'],
['Asunnossa on yksi huone, keittiö ja kylpyhuone.','The flat has one room, a kitchen and a bathroom.','फ्ल्याटमा एउटा कोठा, भान्सा र बाथरुम छ।'],
['Huoneessa on sänky, sohva ja iso ikkuna.','In the room there is a bed, a sofa and a big window.','कोठामा ओछ्यान, सोफा र ठूलो झ्याल छ।'],
['Ikkunan edessä on pöytä, jossa teen töitä.','In front of the window there is a table where I work.','झ्यालको अगाडि टेबल छ, जहाँ म काम गर्छु।'],
['Keittiö on pieni, mutta siellä on uusi jääkaappi.','The kitchen is small, but it has a new fridge.','भान्सा सानो छ, तर त्यहाँ नयाँ फ्रिज छ।'],
['Talon lähellä on ruokakauppa, kirjasto ja metroasema.','Near the building there is a grocery store, a library and a metro station.','भवनको नजिक किराना पसल, पुस्तकालय र मेट्रो स्टेसन छ।'],
['Pidän kodistani, koska se on valoisa ja rauhallinen.','I like my home because it is bright and peaceful.','मलाई मेरो घर मन पर्छ, किनभने यो उज्यालो र शान्त छ।'],
['Ainoa ongelma on, että vuokra on kallis.','The only problem is that the rent is expensive.','एउटै समस्या भनेको भाडा महँगो छ।']],
q:[['Missä Hanna asuu?','Where does Hanna live?','हान्ना कहाँ बस्छिन्?',['isossa talossa','pienessä yksiössä','kaksiossa'],1],
['Missä pöytä on?','Where is the table?','टेबल कहाँ छ?',['sängyn vieressä','ikkunan edessä','keittiössä'],1],
['Miksi Hanna pitää kodistaan?','Why does Hanna like her home?','हान्नालाई घर किन मन पर्छ?',['se on iso','se on valoisa ja rauhallinen','se on halpa'],1],
['Mikä on ongelma?','What is the problem?','समस्या के हो?',['asunto on pimeä','vuokra on kallis','kauppa on kaukana'],1]]}],
listen:[
{k:'📢',h:['Kaupan kuulutus','A shop announcement','पसलको घोषणा'],l:[
['N','Hyvät asiakkaat!','Dear customers!','प्रिय ग्राहकहरू!'],
['N','Tänään kaikki hedelmät ovat kaksikymmentä prosenttia halvempia.','Today all fruit is twenty percent cheaper.','आज सबै फलफूल बीस प्रतिशत सस्तो छ।'],
['N','Kauppa sulkeutuu tänään kello kahdeksantoista.','The shop closes today at 18.','पसल आज १८ बजे बन्द हुन्छ।'],
['N','Kiitos ja hyvää päivää!','Thank you and have a nice day!','धन्यवाद, दिन शुभ रहोस्!']],
q:[['Mitkä tuotteet ovat halvempia?','Which products are cheaper?','कुन सामान सस्तो छ?',['vihannekset','hedelmät','leivät'],1],
['Milloin kauppa menee kiinni?','When does the shop close?','पसल कहिले बन्द हुन्छ?',['kello 8','kello 18','kello 20'],1]]},
{k:'🛒',h:['Kaupassa','In the shop','पसलमा'],l:[
['A','Anteeksi, missä riisi on?','Excuse me, where is the rice?','माफ गर्नुहोस्, चामल कहाँ छ?'],
['B','Riisi on hyllyssä numero viisi, pastan vieressä.','The rice is on shelf number five, next to the pasta.','चामल पाँच नम्बर र्‍याकमा, पास्ताको छेउमा छ।'],
['A','Entä onko teillä kookosmaitoa?','And do you have coconut milk?','अनि तपाईंहरूसँग नरिवलको दूध छ?'],
['B','Valitettavasti kookosmaito on loppu.','Unfortunately the coconut milk has run out.','दुर्भाग्यवश नरिवलको दूध सकियो।'],
['A','Harmi. No, kiitos!','Too bad. Well, thanks!','कस्तो नराम्रो। ठीकै छ, धन्यवाद!']],
q:[['Missä riisi on?','Where is the rice?','चामल कहाँ छ?',['hyllyssä viisi','hyllyssä yhdeksän','kassan vieressä'],0],
['Mitä kaupassa ei ole?','What does the shop not have?','पसलमा के छैन?',['riisiä','pastaa','kookosmaitoa'],2]]},
{k:'📞',h:['Viesti isännöitsijältä','A message from the building manager','भवन व्यवस्थापकको सन्देश'],l:[
['N','Hei, täällä on isännöitsijä Laine.','Hi, this is building manager Laine.','नमस्ते, म भवन व्यवस्थापक लाइने बोल्दैछु।'],
['N','Huomenna kello kymmenen huoltomies tulee korjaamaan pesukoneenne.','Tomorrow at ten a repairman will come to fix your washing machine.','भोलि दस बजे मिस्त्री तपाईंको लुगा धुने मेसिन बनाउन आउँछ।'],
['N','Jos ette ole kotona, soittakaa minulle.','If you are not at home, call me.','तपाईं घरमा हुनुहुन्न भने मलाई फोन गर्नुहोस्।'],
['N','Numero on nolla viisi nolla, yksi yksi kaksi, kolme kolme neljä.','The number is 050 112 334.','नम्बर शून्य पाँच शून्य, एक एक दुई, तीन तीन चार।']],
q:[['Mikä on rikki?','What is broken?','के बिग्रेको छ?',['jääkaappi','pesukone','sauna'],1],
['Milloin huoltomies tulee?','When does the repairman come?','मिस्त्री कहिले आउँछ?',['tänään kello kymmenen','huomenna kello kymmenen','huomenna kello kaksi'],1]]},
{k:'💬',h:['Ystävät puhuvat','Friends talking','साथीहरूको कुराकानी'],l:[
['A','Mitä sinä teit eilen?','What did you do yesterday?','तिमीले हिजो के गर्‍यौ?'],
['B','Siivosin kotona ja kävin kaupassa. Entä sinä?','I cleaned at home and went to the shop. And you?','मैले घर सफा गरेँ र पसल गएँ। अनि तिमी?'],
['A','Minä olin töissä koko päivän. Illalla katsoin elokuvan.','I was at work all day. In the evening I watched a film.','म दिनभर काममा थिएँ। बेलुका मैले फिल्म हेरेँ।']],
q:[['Mitä B teki eilen?','What did B do yesterday?','B ले हिजो के गर्‍यो?',['oli töissä','siivosi ja kävi kaupassa','katsoi elokuvan'],1],
['Mitä A teki illalla?','What did A do in the evening?','A ले बेलुका के गर्‍यो?',['luki kirjaa','katsoi elokuvan','siivosi'],1]]}],
write:[
{k:'msg',h:['Ostoslista ja viesti','Shopping list and a message','किनमेल सूची र सन्देश'],task:['Kirjoita ostoslista (6 asiaa, käytä partitiivia) ja viesti kämppäkaverille: pyydä häntä käymään kaupassa.','Write a shopping list (6 things, use the partitive) and a message to your flatmate asking them to go to the shop.','किनमेल सूची (६ वटा सामान, partitive प्रयोग गर्नुहोस्) र सँगै बस्ने साथीलाई पसल जान अनुरोध गर्ने सन्देश लेख्नुहोस्।'],words:'25–40',
frames:['Ostoslista: maitoa, …','Hei! Voitko käydä kaupassa?','Tarvitsemme …','Osta myös …','Kiitos!'],
model:['Ostoslista: maitoa, leipää, kuusi kananmunaa, kilo perunoita, juustoa, kahvia. — Hei Mikko! Voitko käydä kaupassa töiden jälkeen? Tarvitsemme maitoa ja leipää aamiaiseksi. Osta myös kahvia, se on tarjouksessa. Maksan sinulle huomenna. Kiitos!','Shopping list: milk, bread, six eggs, a kilo of potatoes, cheese, coffee. — Hi Mikko! Can you go to the shop after work? We need milk and bread for breakfast. Buy coffee too, it is on offer. I will pay you tomorrow. Thanks!']},
{k:'msg',h:['Lappu naapureille','A note for the neighbours','छिमेकीलाई सूचना'],task:['Kirjoita lappu naapureille: sinulla on juhlat lauantaina ja voi olla ääntä. Kerro päivä ja kellonaika.','Write a note to your neighbours: you are having a party on Saturday and it may be noisy. Say the day and time.','छिमेकीलाई सूचना लेख्नुहोस्: शनिबार तपाईंको पार्टी छ र अलि हल्ला हुन सक्छ। दिन र समय लेख्नुहोस्।'],words:'25–40',
frames:['Hei naapurit!','Minulla on … lauantaina …','Juhlat ovat kello … – …','Voi olla vähän ääntä.','Pahoittelen!','Ystävällisin terveisin, …'],
model:['Hei naapurit! Minulla on syntymäpäiväjuhlat lauantaina 14.11. kello 18–22. Voi olla vähän ääntä. Pahoittelen! Jos on ongelmia, voit koputtaa oveen. Ystävällisin terveisin, Ram, asunto A 12','Hi neighbours! I am having a birthday party on Saturday 14 November from 18 to 22. It may be a little noisy. Sorry! If there is a problem, you can knock on the door. Kind regards, Ram, flat A 12']},
{k:'text',h:['Minun kotini','My home','मेरो घर'],task:['Kirjoita kodistasi: missä asut, mitä huoneita on, mitä huoneissa on ja mitä kodin lähellä on.','Write about your home: where you live, what rooms there are, what is in them and what is nearby.','आफ्नो घरबारे लेख्नुहोस्: कहाँ बस्नुहुन्छ, कुन कोठा छन्, कोठामा के छ र नजिक के छ।'],words:'50–70',
frames:['Asun …ssa.','Asunnossa on …','Olohuoneessa on …','… on …n vieressä.','Kotini lähellä on …','Pidän kodistani, koska …'],
model:['Asun kaksiossa Turussa. Asunnossa on olohuone, makuuhuone, keittiö ja kylpyhuone. Olohuoneessa on sohva, pöytä ja televisio. Sohvan edessä on matto. Ikkunan vieressä on iso kasvi. Keittiö on pieni, mutta siellä on kaikki. Kotini lähellä on kauppa ja bussipysäkki. Pidän kodistani, koska se on lämmin ja rauhallinen.','I live in a two-room flat in Turku. The flat has a living room, a bedroom, a kitchen and a bathroom. In the living room there is a sofa, a table and a TV. In front of the sofa there is a rug. Next to the window there is a big plant. The kitchen is small, but it has everything. Near my home there is a shop and a bus stop. I like my home because it is warm and peaceful.']}],
speak:[
{k:'qa',h:['Vastaa kysymyksiin','Answer the questions','प्रश्नको उत्तर दिनुहोस्'],prep:5,time:20,items:[
['Missä asut?','Where do you live?','तिमी कहाँ बस्छौ?','Asun Turussa, kaksiossa.','I live in Turku, in a two-room flat.'],
['Millainen kotisi on?','What is your home like?','तिम्रो घर कस्तो छ?','Kotini on pieni, mutta valoisa ja rauhallinen.','My home is small, but bright and peaceful.'],
['Kuinka monta huonetta kotonasi on?','How many rooms are there in your home?','तिम्रो घरमा कतिवटा कोठा छन्?','Kotonani on kaksi huonetta ja keittiö.','My home has two rooms and a kitchen.'],
['Mitä keittiössäsi on?','What is in your kitchen?','तिम्रो भान्सामा के छ?','Keittiössäni on jääkaappi, liesi, pöytä ja kaksi tuolia.','In my kitchen there is a fridge, a stove, a table and two chairs.'],
['Mitä ostat kaupasta joka viikko?','What do you buy from the shop every week?','तिमी हरेक हप्ता पसलबाट के किन्छौ?','Ostan maitoa, leipää, riisiä, vihanneksia ja hedelmiä.','I buy milk, bread, rice, vegetables and fruit.']]},
{k:'situ',h:['Mitä sanot?','What do you say?','तिमी के भन्छौ?'],prep:10,time:20,items:[
['Olet kaupassa. Kysy, missä maito on.','You are in a shop. Ask where the milk is.','तिमी पसलमा छौ। दूध कहाँ छ भनेर सोध।','Anteeksi, missä maito on?','Excuse me, where is the milk?'],
['Kysy, paljonko juusto maksaa.','Ask how much the cheese costs.','चिज कति पर्छ भनेर सोध।','Paljonko tämä juusto maksaa?','How much does this cheese cost?'],
['Kassalla: sano, että haluat maksaa kortilla.','At the checkout: say you want to pay by card.','क्यास काउन्टरमा: कार्डबाट तिर्न चाहन्छु भन।','Maksan kortilla, kiitos.','I\'ll pay by card, thanks.'],
['Soita isännöitsijälle: pesukone ei toimi.','Call the building manager: the washing machine doesn\'t work.','भवन व्यवस्थापकलाई फोन गर: लुगा धुने मेसिन चल्दैन।','Hei, täällä on Ram Sharma asunnosta A 12. Pesukone ei toimi. Voiko huoltomies tulla?','Hi, this is Ram Sharma from flat A 12. The washing machine doesn\'t work. Can a repairman come?']]},
{k:'pic',h:['Kuvaile huonetta','Describe the room','कोठाको वर्णन गर'],pic:'🛋️ 📺 🪴 🪟 🧸',prep:30,time:60,items:[
['Mitä huoneessa on ja missä? Käytä sanoja vieressä, edessä, päällä, alla.','What is in the room and where? Use: next to, in front of, on, under.','कोठामा के छ र कहाँ? vieressä, edessä, päällä, alla प्रयोग गर।',
'Huoneessa on sohva, televisio ja iso kasvi. Televisio on sohvan edessä. Kasvi on ikkunan vieressä. Sohvan päällä on nalle. Pöydän alla on matto. Huone on valoisa ja kodikas.','In the room there is a sofa, a TV and a big plant. The TV is in front of the sofa. The plant is next to the window. There is a teddy bear on the sofa. Under the table there is a rug. The room is bright and cosy.']]},
{k:'tell',h:['Kerro päivästäsi','Tell about your day','आफ्नो दिनबारे भन'],prep:30,time:60,items:[
['Kerro tavallisesta päivästäsi: mihin aikaan heräät, mitä syöt, mitä teet.','Tell about a normal day: when you wake up, what you eat, what you do.','सामान्य दिनबारे भन: कति बजे उठ्छौ, के खान्छौ, के गर्छौ।',
'Herään kello kuusi. Juon teetä ja syön leipää. Kello seitsemän lähden töihin bussilla. Lounaalla syön keittoa. Neljältä tulen kotiin. Illalla teen ruokaa ja opiskelen suomea. Menen nukkumaan kello kymmenen.','I wake up at six. I drink tea and eat bread. At seven I go to work by bus. At lunch I eat soup. At four I come home. In the evening I cook and study Finnish. I go to sleep at ten.']]}]}
];
