# Verification report

This report lists only checks that were actually performed, how, and with what outcome. The project was built and checked in a sandbox **without network access** and with only some tools installed, so several of the intended verification commands could **not** be run. Substitute checks are described honestly as substitutes.

## A. What was run, and the observed result

| # | Check | How it was done | Result |
|---|---|---|---|
| 1 | Calculation and validation unit tests (11 files, 102 test cases) | Test files are written for Vitest. Vitest could not be installed, so they were run with a minimal stand-in for `describe`/`it`/`expect` (supports `toBe`, `toEqual`, `toBeCloseTo` with Vitest's tolerance rule, `toBeNull`, `toBeUndefined`, `toBeDefined`, `toHaveLength`, `toMatch`) executed with `tsx` | 102 passed, 0 failed |
| 2 | Independence of expected values | Reference values (OEE 74.7937 %, 83.333 %, unit conversions, etc.) were computed separately in Python with exact rational arithmetic, and the textbook examples come from `textile_calculation_reference.md` | Used as test expectations |
| 3 | Mutation check | In a scratch copy: changed 10,000 to 1,000 in the cm²→m² factor, 10,000 to 1,000 in the OEE product, and removed the `/ 100` in the allowance formula | 9 tests failed as expected; original source restored and 102 pass again |
| 4 | Strict TypeScript check of `src/lib` and `src/calculators/**/*.ts` (including the unit tests, against a stub of the `vitest` types) | `tsc` 6.0.3 with `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` | No errors. (The project pins TypeScript ~5.9; 6.0.3 was the only version available.) |
| 5 | Production-mode bundle of the full app | esbuild 0.27.7 (not Vite) with React 19.2.5 from the local global install, `NODE_ENV=production`; syntax and import resolution of all TSX/CSS | Built successfully (about 721 kB JS, 12 kB CSS) |
| 6 | Browser end-to-end checks | Chromium via Playwright against that bundle served over local HTTP: 130 assertions covering Home and navigation (links, current page, Back/Forward, refresh, unknown route, document title), all seven calculators with the reference examples, invalid and boundary inputs, comma and exponent rejection, overflow handling, stale-result clearing, Reset (including isolation between quality calculators), mode switching, OEE warnings and "Not available" cases, label association for every form control on 13 pages, one `h1` per page, keyboard (skip link, focus outline, Enter to calculate), 375 px width (no horizontal overflow on 7 pages, menu open/close/Escape/navigate), and desktop layout | 130 passed, 0 failed (after correcting three mistakes in the test script itself: two selectors and one timing wait) |
| 7 | External network requests and console | Monitored during check 6 | No requests outside the local server; no console errors or warnings |
| 8 | Colour contrast | WCAG relative-luminance formula applied to the palette pairs actually used | Text pairs: lowest 4.55:1 (muted text on the page background). The documented-neutral control border `#94a3b8` gave 2.56:1 against white (below 3:1), so it was changed to `#64748b` (4.76:1). Not a conformance claim. |
| 10 | Partial compiler pass over all `.ts`/`.tsx` files (including components and component tests) | `tsc` 6.0.3 with `strict`, `noUnusedLocals`, `noUnusedParameters` but **without** React, Vite or Testing Library typings (unavailable), so type errors that depend on those typings cannot be detected | No unused imports, locals or parameters reported. The remaining diagnostics were all attributable to the missing typings (JSX element types, CSS side-effect imports, stubbed `vitest` exports). This is **not** a type check of the React code. |
| 9 | Visual inspection | Screenshots at 1280 px (OEE) and 375 px (GSM with errors) | Layout as intended; sidebar made sticky and a duplicated description removed as a result |

## B. What was NOT run

| Check | Why not | What to do |
|---|---|---|
| `npm ci` / `npm install` | No registry access. Dependency versions and peer ranges were never resolved. **`package-lock.json` does not exist.** | Run `npm install` on Windows and commit the lockfile |
| `npm run lint` (ESLint) | ESLint, typescript-eslint, plugins not installed | Run it; `eslint.config.js` was written but never executed, so it may need adjustment |
| `npm run typecheck` / `tsc -b` on the whole project | `@types/react`, `@types/react-dom` and `vite/client` types unavailable, so **the `.tsx` files and `useCalculatorForm.ts` have never been type-checked** (only compiled by esbuild, which does not check types) | Run it and fix any reported errors |
| `npm run test:run` with real Vitest, jsdom and React Testing Library | Not installed | Run it. **The component tests (`App.test.tsx`, `*.ui.test.tsx`) have never been executed**; they are written against the real markup but may contain mistakes. The browser checks in A6 cover the same behaviours with a different tool, not these test files |
| `npm run build` (Vite) and `npm run preview` | Vite not installed | Run both and inspect `dist/` |
| Manual verification on Windows | Sandbox is Linux | Follow windows_setup.md |
| Firefox/Edge/Safari, touch devices, screen readers, axe/Lighthouse | Not available | Test manually |
| Dependency licence review | No registry access | Review after `npm install` |
| Domain review of formulas | Needs a qualified practitioner | See implementation_notes.md |

## C. Acceptance criteria status (from `technical_specification.md` section 18)

Not marked complete wholesale. Items with real evidence above: calculation reference examples reproduced in unit and browser checks; invalid, boundary, zero-denominator and non-finite handling tested; stale-result clearing and Reset behaviour exercised in a browser; no external requests observed; calculation functions separate from UI. Items **without** evidence: ESLint, whole-project TypeScript check, Vite build and preview, real Vitest/RTL results, Windows installation, cross-browser and accessibility checks, dependency licences, lockfile.
