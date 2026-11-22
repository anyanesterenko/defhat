#!/usr/bin/env bash
# Збирає сайт і публікує папку dist у гілку gh-pages (GitHub Pages).
# Запуск: npm run deploy
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE=$(git remote get-url origin)
npx astro build
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -f "$REMOTE" gh-pages
rm -rf .git
echo "Готово: сайт оновиться на GitHub Pages за хвилину-дві."
