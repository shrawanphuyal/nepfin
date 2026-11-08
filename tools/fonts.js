// Copies the self-hosted fonts (variable weight, only the scripts the app needs) into src/fonts and writes fonts.css.
// Run once after `npm i @fontsource-variable/noto-sans @fontsource-variable/noto-sans-devanagari @fontsource-variable/noto-sans-arabic @fontsource-variable/bricolage-grotesque` in a folder given as argv[2].
const fs = require('fs'), path = require('path');
const base = path.join(process.argv[2] || '../fontpkg', 'node_modules/@fontsource-variable');
const PICK = { 'noto-sans': ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'], 'noto-sans-devanagari': ['devanagari'], 'noto-sans-arabic': ['arabic'], 'bricolage-grotesque': ['latin', 'latin-ext', 'vietnamese'] };
const out = path.join(__dirname, '../src/fonts'); fs.mkdirSync(out, { recursive: true });
let css = '/* Self-hosted fonts (SIL Open Font License), from @fontsource-variable */\n';
for (const [pkg, subsets] of Object.entries(PICK)) {
  const src = fs.readFileSync(path.join(base, pkg, 'wght.css'), 'utf8');
  for (const block of src.split(/(?=\/\* )/)) {
    const m = /\/\* (.+?)-wght-normal \*\//.exec(block); if (!m) continue;
    const sub = m[1].slice(pkg.length + 1); if (!subsets.includes(sub)) continue;
    const file = m[1] + '-wght-normal.woff2';
    fs.copyFileSync(path.join(base, pkg, 'files', file), path.join(out, file));
    css += block.replace('./files/', './').trim() + '\n';
  }
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);
fs.copyFileSync(path.join(base, 'noto-sans', 'LICENSE'), path.join(out, 'LICENSE-OFL.txt'));
console.log(fs.readdirSync(out).map(f => f + ' ' + Math.round(fs.statSync(path.join(out, f)).size / 1024) + 'KB').join('\n'));
