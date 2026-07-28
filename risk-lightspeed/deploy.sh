#!/usr/bin/env bash
# Build Risk Lightspeed for GitHub Pages and prepare dist/ for deploy.
# Pages URL: https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

export VITE_BASE_PATH="${VITE_BASE_PATH:-/rhacs-ux-prototypes/risk-lightspeed/}"

echo "Building with base ${VITE_BASE_PATH}"
npm run build

# SPA fallback for GitHub Pages deep links
cp dist/index.html dist/404.html

echo ""
echo "Build ready in dist/"
echo "Share URL: https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/?prototype=v1"
echo ""
echo "To publish from the repo root (gh-pages / Actions), commit this folder and push main,"
echo "or copy dist/ contents to the Pages publishing branch under risk-lightspeed/."
