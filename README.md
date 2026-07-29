# RHACS UX Prototypes

Personal workspace for RHACS / StackRox UI–UX work.

**Pages:** https://mansursyed.github.io/rhacs-ux-prototypes/

## Structure

```
rhacs-ux-prototypes/
├── stackrox/                 ← MAIN SOURCE OF TRUTH (local clone of stackrox/stackrox)
│                               Live local UI; connect to staging while designing
├── <feature>/                ← Shareable GitHub Pages prototypes branched off that SoT
│   e.g. risk-lightspeed/       Multiple versions, mock data, shareable links
├── .secrets/                 ← Staging API token (gitignored)
└── .cursor/rules/
```

| Layer | Role |
|---|---|
| **`stackrox/`** | Upstream product UI. Pull latest when work lands. Local live env against staging. |
| **Feature subfolders** | Click-through prototypes for a specific effort. MSW + version switcher. Deployed to Pages. |

`stackrox/` is gitignored here (it has its own git remote). Feature folders are what this repo tracks and publishes.

## Workflow

1. **Pull SoT** — keep `stackrox/` current with upstream `master` (or the branch you need).
2. **Design live** — run the UI from `stackrox/ui/` against staging to explore real data and flows.
3. **Prototype in a subfolder** — for a feature effort, create e.g. `risk-lightspeed/` from the SoT UI + snapshotted mocks. Ship versions (`baseline` / `v1` / `v2`) with a switcher; share Pages links for review.
4. **After acceptance** — when engineering ships the real change, pull latest StackRox into `stackrox/` and use that as the base for the next effort.

## Local live environment (staging)

From `stackrox/ui/`:

```bash
CYPRESS_COMPONENT_TEST=true \
UI_START_TARGET=https://staging.demo.stackrox.com \
ROX_API_TOKEN="$(cat ../../.secrets/stackrox-api-token)" \
npm start
```

Open http://localhost:3000/

Requires Node 22+ and `npm install` once under `stackrox/ui/apps/platform`.  
Token path: `.secrets/stackrox-api-token` (never commit).

## Feature prototypes (GitHub Pages)

Each feature folder is a static app (Vite + MSW + mock JSON in-repo) so it works without Central.

Expected Pages URL pattern:

`https://mansursyed.github.io/rhacs-ux-prototypes/<feature>/`

### `risk-lightspeed/`

Risk + Investigate with Lightspeed click-through prototype.

- Local: `cd risk-lightspeed && npm run dev`
- Build for Pages: `cd risk-lightspeed && ./deploy.sh`
- Share: https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/?prototype=v1

Versions: `baseline` · `v1` (Lightspeed) · `v2` (eng-feedback mock). See `risk-lightspeed/README.md`.

## Updating the source of truth

```bash
cd stackrox
git fetch origin
git checkout master
git pull --ff-only origin master
# re-apply only the small local staging helpers if needed (ROX_API_TOKEN wiring)
```

Then start the next feature folder from that refreshed baseline.
