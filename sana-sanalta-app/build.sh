#!/usr/bin/env bash
# Rebuilds docs/index.html from the files in src/. Run: bash build.sh
set -euo pipefail
cd "$(dirname "$0")"
OUT=docs/index.html
{
  cat src/head.html
  cat src/shell.html
  echo '<script>'
  cat src/[0-9][0-9]_*.js
  cat src/pwa.js
  echo 'init();'
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > "$OUT"
# new cache name so installed phones pick up the new version
STAMP=$(date +%Y%m%d%H%M%S)
sed -i.bak "s/const CACHE='sana-[^']*'/const CACHE='sana-$STAMP'/" docs/sw.js && rm -f docs/sw.js.bak
echo "Built $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes), cache sana-$STAMP"
