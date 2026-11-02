# Sana Sanalta – Finnish A1.1 → A1.3

A 30-day Finnish course for Nepali speakers, with everything in Finnish, English and Nepali, plus spoken Finnish (puhekieli) and audio.
It works as a **phone app**: you install it from your browser, it opens from your home screen, and it works offline.

**What's inside:**
- **Plans:** a 30-day plan, plus an exam track that runs to 25–26 Nov.
- **Grammar:** 22 grammar lessons, verbs, cases (partitive, genitive, illative and the others) and a question lab.
- **Words and speech:** numbers and time, 358 words, puhekieli, and flashcards.
- **Reading and conversation:** 15 stories and 18 conversations in real places.
- **Practice:** 20 exercise sets, 15 writing tasks, and 5 mock exams (reading, listening, writing, speaking).

---

## 1. Put it online with GitHub Pages (free, about 10 minutes)

1. Sign in at [github.com](https://github.com) (or make a free account).
2. Click **New repository**. Name it `sana-sanalta`, choose **Public**, then click **Create repository**.
   On a free GitHub account, Pages only works for public repositories. The course content will be public, but **your progress is never uploaded**; it stays on your phone.
3. On the new repository page, click **uploading an existing file**. Drag in **everything inside** this folder (`docs`, `src`, `build.sh`, `README.md`, `.gitignore`), then click **Commit changes**.
   - `docs/.nojekyll` is a hidden file. If your computer doesn't drag it, that's fine; the app works without it.
4. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then **Branch: main** and **Folder: /docs**. Click **Save**.
5. Wait 1–2 minutes. Your app is at:
   `https://YOUR-USERNAME.github.io/sana-sanalta/`

If you already use git on your computer, you can upload with these commands instead:
```bash
cd sana-sanalta-app
git init && git add . && git commit -m "Sana Sanalta Finnish course"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sana-sanalta.git
git push -u origin main
```
Then do step 4.

## 2. Install it on your phone

- **Android (Chrome):** open your link. Tap the **📲 Install app** button, or the **⋮ menu → Install app / Add to Home screen**.
- **iPhone (Safari):** open your link, tap **Share → Add to Home Screen**.

After the first open, the app works **offline**. When you are online, it loads the newest version by itself.

## 3. Turn on the Finnish voice (for the 🔈 buttons)

- **Android:** Settings → System → Languages → **Text-to-speech output** → Google speech engine → Install voice data → **Finnish (suomi)**.
- **iPhone:** Settings → Accessibility → **Spoken Content** → Voices → **Finnish → Satu** (download it).

If no Finnish voice is installed, words are read with an English accent. The app shows a note when this happens.

## 4. Your progress

Your progress is saved **only on that phone**, in the browser. This covers flashcards, ticked days, writing and exam scores.
Open **Vinkit (Method & tips) → Back up your progress** and save a backup file now and then. You can restore it later on a new phone.

Progress from the Claude version of the page does not move here automatically.

## 5. Change the content later

The page is built from the files in `src/`:

| File | What it holds |
|---|---|
| `head.html`, `pwa.js` | Phone-app parts: icon, install button, offline mode, backup |
| `shell.html` | Colours, layout and the page frame |
| `01`–`10` | Data: words, places, grammar tables, questions, stories, 30-day plan, exercises |
| `11`–`12` | The 22 grammar lessons |
| `13`–`14` | The 5 exam sets |
| `15`–`25` | App code for each tab |

To change something:
1. Edit a file in `src/`.
2. Run `bash build.sh`. It rebuilds `docs/index.html`.
3. Commit and push, or upload `docs/index.html` and `docs/sw.js` again on GitHub.

Installed phones pick up the new version the next time they open the app online.

## 6. Optional: a real Android app (APK / Play Store)

Go to [pwabuilder.com](https://www.pwabuilder.com), paste your GitHub Pages link, and choose **Package for stores → Android**.
This wraps the same app in Chrome, so the Finnish voice still works.
For daily use, installing from the browser (step 2) is enough.

## What does not work outside Claude

The **"✨ Check my text with Claude"** button only works when the page is opened inside Claude, so it is hidden here. Compare your writing with the model answers instead.

---

## नेपालीमा छोटो निर्देशन

1. github.com मा लगइन गर्नुहोस् → **New repository** → नाम `sana-sanalta` → **Public** → Create।
2. **uploading an existing file** थिच्नुहोस् → यो फोल्डरभित्रका सबै फाइल तान्नुहोस् → **Commit changes**।
3. **Settings → Pages** → Branch: **main**, Folder: **/docs** → **Save**।
4. १–२ मिनेटपछि `https://तपाईंको-username.github.io/sana-sanalta/` खोल्नुहोस्।
5. फोनमा: Android मा **Install app** वा ⋮ → **Add to Home screen**; iPhone मा **Share → Add to Home Screen**।
6. आवाजको लागि फोनमा **Finnish (suomi)** आवाज इन्स्टल गर्नुहोस्।
7. तपाईंको प्रगति फोनमै सुरक्षित हुन्छ। **Vinkit → Back up your progress** बाट बेलाबेलामा ब्याकअप लिनुहोस्।

Onnea opiskeluun! 🇫🇮 पढाइको शुभकामना!
