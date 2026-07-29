# Risk Lightspeed prototype

Author: [Mansur Syed](mailto:masyed@redhat.com)
Co-Author: Cursor (Grok 4.5)

Static click-through prototype of RHACS Risk with **Investigate with Lightspeed**.

**Pages:** https://mansursyed.github.io/rhacs-ux-prototypes/risk-lightspeed/

## Versions

| ID | Label | What you see |
|---|---|---|
| `baseline` | Baseline | **SoT Risk UI** — Name / Created / Cluster / Namespace / Priority; detail with Risk indicators tabs. No Lightspeed. |
| `v1` | v1 — Lightspeed | Baseline + Investigate with Lightspeed on detail |
| `v2` | v2 — Eng feedback | Lightspeed + updated `checkout-api` mock score/factors |

Default is **baseline**. Switcher lives in the floating prototype dock. Share links use `?prototype=baseline` / `v1` / `v2`.

Classic list URL: `/main/risk/workloads?filteredWorkflowView=Applications view&prototype=baseline`

Baseline list/detail components are ported from `stackrox/ui/.../Containers/Risk/` (source of truth).

## Local

```bash
npm install
npm run dev
```

Open http://localhost:5175/ (or the port Vite prints) — MSW serves fixtures from `src/mocks/data/`.

Preview the Pages build:

```bash
./deploy.sh
npx vite preview
```

## Mock data

**Synthetic only.** Fixtures under `src/mocks/data/` are invented demo workloads (`sync-worker`, `checkout-api`, … on `demo-secured-cluster`). Do **not** commit staging/Central exports — they can embed live tokens in process evidence. `npm run mocks:check` (also part of `npm run build`) fails if denylisted staging names or JWT-like strings appear.

- Base fixtures: `src/mocks/data/base/`
- Variant overrides: `src/mocks/data/variants/<id>/`
- Handlers: `src/mocks/handlers.ts` (MSW)

To add eng feedback as a new option: copy a variant folder, edit JSON, register it in `src/mocks/manifest.json`.

## Relation to source of truth

UI patterns and Lightspeed summary logic were adapted from the `stackrox/` SoT / prior RiskDev experiment. Design against live staging only in local `../stackrox/ui/` — never copy live API dumps into this prototype.
