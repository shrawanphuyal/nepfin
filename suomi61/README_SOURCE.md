# Suomi 61 source
- `tools/make_data.js` builds `src/data/01_base.js` (words + earlier-course content) from `old.json` and `tools/newwords.js`.
- `src/data/*.js` content · `src/app/*.js` app · `src/style.css` · `src/shell.html`.
- `node build.js` writes `dist/suomi61.html` (Claude artifact) and `docs/` (phone app with service worker).
