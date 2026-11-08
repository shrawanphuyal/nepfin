# Suomi 61 · Finnish A1.0 → A1.3

A 61-day Finnish course (1 Nov – 31 Dec 2026) for a Nepali speaker who knows English. It runs in the browser on a laptop and installs on a phone like an app. It works offline after the first visit. Nothing is uploaded: your progress stays on your device.

## What's inside
10 chapters in the order of Suomen mestari 1 (with matching Oma suomi 1 topics). Each chapter has words (rows or cards, flashcards), grammar, a long story, listening, speaking, writing, spoken Finnish and a chapter test. k-p-t is a core skill with its own trainer.

## Put it on GitHub Pages (English)
1. Unzip `suomi61-github.zip`. You get one folder, `suomi61`.
2. On github.com click **New repository**. Name it `suomi61`, choose **Public** (GitHub Pages is free for public repositories), and click **Create repository**.
3. On the empty repository page click **uploading an existing file**. Open the `suomi61` folder on your computer, select everything inside it (`docs`, `src`, `tools`, `build.js`, `package.json`, `README.md` …) and drag it into the browser. Click **Commit changes**.
   - Check that the repository now shows the folder `docs` at the top level (not `suomi61/docs`).
4. Open **Settings → Pages**. Under “Build and deployment” choose **Deploy from a branch**, branch `main`, folder **`/docs`**, and click **Save**.
5. Wait 1–2 minutes and refresh. Your address appears at the top: `https://<your-name>.github.io/suomi61/`.

Only the `docs` folder is the app. `src`, `tools` and `build.js` are the source code: keep them so the app can be rebuilt (`node build.js`).

## Works offline
Open the address once while online. The app then saves everything it needs on the device: all lessons, words, stories, tests, fonts and icons (about 2.5 MB). After that it opens with no internet, also from the home-screen icon. Only these need the internet: translation into Albanian, Vietnamese, Ukrainian, Persian, Arabic, Filipino and Turkish (Nepali is built in), the translator, and AI feedback (inside Claude only). Listening uses your device's own Finnish voice, which also works offline once it is installed.

## Install on the phone
- **Android (Chrome):** open the address → menu ⋮ → **Add to Home screen** (or **Install app**).
- **iPhone (Safari):** open the address → Share → **Add to Home Screen**.

## Install the Finnish voice
- **Android:** Settings → Text-to-speech output → Google → Install voice data → Finnish (suomi).
- **iPhone:** Settings → Accessibility → Spoken content → Voices → Finnish.
- **Windows:** Settings → Time & language → Speech → Add voices → Finnish. Restart the browser.

## Languages
- Finnish and English are always on. Settings → **Languages** → choose one helper language: Nepali (default, built in, works offline), Albanian, Vietnamese, Ukrainian, Persian, Arabic (Iraqi), Filipino or Turkish.
- The other languages are translated online the first time a screen opens (MyMemory in this app, free with a daily limit; add your email under Settings → Translator to raise it), then saved on the device. Machine translation can be wrong.

## Translator (Kääntäjä)
- Tap ⇄ at the top. Finnish, English and all eight helper languages, in every direction. Online only: the app has no offline translation packs, so it stays small. Without internet, “In the course” still finds Finnish, English and Nepali words from the course.

## Backup
Settings → **Download backup** saves one .json file. **Restore from file** loads it on another device. Do it every Sunday.

## Update
Upload the new files over the old ones (Add file → Upload files). Open the app once online: it shows “New version ready – tap to update”.

## Rebuild from source (optional)
Install Node.js 18+, then run `node build.js` in this folder. It writes `docs/` (the app) and `dist/suomi61.html` (a single-file copy). Fonts: Noto Sans and Bricolage Grotesque, SIL Open Font License (`src/fonts/LICENSE-OFL.txt`).

---

# सुओमी ६१ · फिनिस A1.0 → A1.3

१ नोभेम्बरदेखि ३१ डिसेम्बर २०२६ सम्मको ६१ दिने फिनिस पाठ्यक्रम। यो ल्यापटपको ब्राउजरमा चल्छ र फोनमा एपजस्तै राख्न सकिन्छ। पहिलो पटक खोलेपछि इन्टरनेटबिना पनि चल्छ। तपाईंको प्रगति तपाईंकै उपकरणमा मात्र बस्छ।

## भित्र के छ
सुओमेन मेस्तारी १ को क्रममा १० अध्याय। हरेक अध्यायमा शब्द, व्याकरण, लामो कथा, सुनाइ, बोलाइ, लेखाइ, बोलचालको फिनिस र परीक्षा छ।

## GitHub Pages मा राख्ने तरिका
1. `suomi61-github.zip` खोल्नुहोस् (unzip)। `suomi61` फोल्डर आउँछ।
2. github.com मा **New repository** थिच्नुहोस्। नाम `suomi61`, **Public** छान्नुहोस्, **Create repository** थिच्नुहोस्।
3. **uploading an existing file** थिच्नुहोस्। `suomi61` फोल्डरभित्रका सबै चीज (`docs`, `src`, `tools`, `build.js` …) छानेर ब्राउजरमा तान्नुहोस्। **Commit changes** थिच्नुहोस्।
4. **Settings → Pages** मा **Deploy from a branch**, branch `main`, folder **`/docs`** छान्नुहोस् र **Save** गर्नुहोस्।
5. १–२ मिनेटपछि ठेगाना देखिन्छ: `https://<तपाईंको-नाम>.github.io/suomi61/`।

## इन्टरनेटबिना
एक पटक इन्टरनेट हुँदा खोल्नुहोस्। त्यसपछि सबै पाठ, शब्द, कथा, परीक्षा, फन्ट र आइकन फोनमै बस्छन् र इन्टरनेटबिना चल्छ। नेपालीबाहेक अरू भाषाको अनुवाद र अनुवादकलाई मात्र इन्टरनेट चाहिन्छ।

## फोनमा राख्ने
- **Android (Chrome):** ठेगाना खोल्नुहोस् → मेनु ⋮ → **Add to Home screen**।
- **iPhone (Safari):** ठेगाना खोल्नुहोस् → Share → **Add to Home Screen**।

## फिनिस आवाज राख्ने
- **Android:** Settings → Text-to-speech output → Google → Install voice data → Finnish।
- **iPhone:** Settings → Accessibility → Spoken content → Voices → Finnish।
- **Windows:** Settings → Time & language → Speech → Add voices → Finnish।

## भाषा र अनुवादक
- फिनिस र अंग्रेजी सधैँ रहन्छन्। Settings → **Languages** मा सहायक भाषा छान्नुहोस्: नेपाली (पहिले नै छानिएको, अफलाइन चल्छ) वा अरू सात भाषा (अनलाइन अनुवाद)।
- अनुवादक (⇄) इन्टरनेटमा मात्र चल्छ। एप हल्का राख्न अफलाइन प्याक हटाइएको छ।

## ब्याकअप
Settings मा **Download backup** थिच्नुहोस्। अर्को उपकरणमा **Restore from file** ले फिर्ता ल्याउँछ। हरेक आइतबार गर्नुहोस्।
