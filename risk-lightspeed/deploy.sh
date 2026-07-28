#!/usr/bin/env bash
# Build Risk Lightspeed for GitHub Pages and prepare dist/ for deploy.
# Pages URL: https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

export VITE_BASE_PATH="${VITE_BASE_PATH:-/rhacs-ux-prototypes/risk-lightspeed/}"

echo "Building with base ${VITE_BASE_PATH}"
npm run build

# SPA fallback for GitHub Pages deep links (also copy to site root 404.html in CI)
cp dist/index.html dist/404.html

echo ""
echo "Build ready in dist/"
echo "Share URL: https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/main/risk/workloads?filteredWorkflowView=Applications%20view&prototype=baseline"
echo ""
echo "Note: GitHub Pages needs site/404.html (repo publish root) = this index.html for deep links."
echo "The Pages workflow copies dist/index.html to site/404.html on deploy."
