# Textile Engineering Tools

Free, open-source, local-first textile engineering calculators. Every calculator shows its units, formula and assumptions, and runs entirely in your browser: no account, backend, database or internet connection is needed once the app is built or running locally.

Repository: `vipintk2807/textile-engineering-tools`

> **Status:** first implementation of all seven specified calculator groups. See [Verification status](#verification-status) for exactly what has and has not been checked. The calculators are arithmetic tools, **not** validated against factory data and **not** standards-compliance tools.

## Calculators

| Group | Tool | What it calculates |
|---|---|---|
| Fabric | Fabric GSM Calculator | GSM (g/m²) from sample mass, length and width |
| Fabric | Fabric Consumption and Marker Efficiency | Fabric per garment, per dozen and per order (optional user-entered allowance); marker efficiency and unused marker area |
| Dyeing | Dyeing Liquor and Recipe Quantity | Liquor mass and approximate volume from a 1:R ratio; chemical mass from a % owf you enter |
| Production | Production Capacity | Theoretical output from rate × time, or time ÷ cycle time, plus whole-unit output |
| Production | Production Efficiency | Actual ÷ expected × 100 (never capped) |
| OEE | OEE Calculator | Run time, Availability, Performance, Quality, OEE (with warnings and "not available" handling) |
| Quality | Basic Quality Calculations | Defect percentage; mean; minimum, maximum and range |

Not included (by design): recipe generation, chemical recommendations, accept/reject decisions, SPC, history, accounts, cloud services, copy/export. See `docs/project_explanation.md`.

## Quick start (Windows)

Full instructions: [docs/windows_setup.md](docs/windows_setup.md).

Requirements: Node.js **22.12 or newer** (includes npm) and Git.

```powershell
cd "C:\path\to\textile-engineering-tools"
npm install        # first time only: also creates package-lock.json (see note below)
npm run dev        # open the URL printed in the terminal
```

> **Important:** this project was packaged without network access, so `package-lock.json` could not be generated. Run `npm install` once, then commit the generated `package-lock.json`. After that, use `npm ci` for reproducible installs. Details in [docs/windows_setup.md](docs/windows_setup.md).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check (`tsc -b`) and build static files into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once (use this for verification) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript checks without emitting files |

Verification sequence before committing: `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`, then `npm run preview` for a manual look.

## Project structure

```
src/
  app/            navigation data, hash routing, pages, App
  components/     shared UI (cards, fields, result panel, formula details, messages)
  calculators/    fabric/ dyeing/ production/ quality/
                  each: pure calculation functions (*.ts) + their tests,
                        and the React screens (*.tsx)
  lib/            validation, units, formatting (+ tests)
  styles/         tokens.css, global.css, layout.css, components.css
  test/           test setup and helpers
docs/             the six specification documents + guides (below)
```

Calculation functions are pure TypeScript, independent of React, and return `{ ok, value, warnings }` or `{ ok: false, errors }`. Raw form text is parsed and validated before they are called, and they validate again themselves.

## Documentation

| Document | Content |
|---|---|
| [docs/master_prompt.md](docs/master_prompt.md) | Development rules and workflow (specification) |
| [docs/project_explanation.md](docs/project_explanation.md) | Scope, users, exclusions (specification) |
| [docs/app_workflow.md](docs/app_workflow.md) | Navigation and calculator behaviour (specification) |
| [docs/app_theme.md](docs/app_theme.md) | Visual design and accessibility (specification) |
| [docs/technical_specification.md](docs/technical_specification.md) | Stack, architecture, testing (specification) |
| [docs/textile_calculation_reference.md](docs/textile_calculation_reference.md) | Authoritative formulas and examples (specification) |
| [docs/windows_setup.md](docs/windows_setup.md) | Install, run, test, build on Windows |
| [docs/user_guide.md](docs/user_guide.md) | How to use each calculator and read results |
| [docs/github_publishing.md](docs/github_publishing.md) | Publishing to GitHub (`vipintk2807`) |
| [docs/implementation_notes.md](docs/implementation_notes.md) | Decisions, spec interpretations, known limitations |
| [docs/verification_report.md](docs/verification_report.md) | What was actually checked, and what was not |

The six specification documents are included unchanged.

## Verification status

Short version (details in [docs/verification_report.md](docs/verification_report.md)):

- Checked in the packaging environment with substitute tooling: calculation and validation logic (102 unit-level checks, plus a mutation check), strict TypeScript checking of the calculation/library code, a production-mode bundle of the full app, and 130 browser checks in Chromium covering every calculator, validation, stale-result clearing, reset, navigation, keyboard use, narrow layout and absence of external requests.
- **Not run** (tooling could not be installed offline): `npm ci`/`npm install`, `npm run lint`, `npm run typecheck` on the React files, the Vitest + React Testing Library suite as written, and `npm run build` with Vite. Component tests (`*.ui.test.tsx`, `App.test.tsx`) are written but have never been executed.
- **Not done:** manual verification on Windows, other browsers, screen-reader testing, and review of formulas by a qualified textile practitioner.

## Licence

MIT, see [LICENSE](LICENSE). The licence was chosen as a default by the implementer because none was specified; change it before public release if you prefer another open-source licence. All dependencies are standard open-source packages, but their licences have not been individually reviewed in this environment.

## Privacy

No telemetry, analytics, remote fonts or remote scripts. Calculator inputs never leave the browser and are not stored.
