# Textile Engineering Tools

Open-source textile calculators that show their units, formulas and assumptions. They run in a web browser and need no account, server or internet connection once installed.

## Overview

Textile Engineering Tools is a small set of calculators for routine work in fabric, dyeing, production and quality. You enter your own values. The tool calculates the result and shows how it got there: the formula, your numbers in the formula, and the assumptions behind it.

The first regional context is Tiruppur, Tamil Nadu. The calculations are general and are not tied to one factory's practice.

## The Problem

Textile teams do the same calculations again and again. Many are done on a phone calculator, in a personal spreadsheet, or from memory. Common risks are:

- Mixed units, such as centimetres and metres, yards and metres, or minutes and hours.
- Unclear assumptions. For example, is a fabric allowance included? Does a 1:8 liquor ratio mean 8 kg of liquor for each kg of fabric?
- Different meanings for the same term. A chemical amount in percent on weight of fabric (% owf) is not the same as grams per litre.
- Results that cannot be checked later because nobody recorded the formula that was used.

Typical situations are:

- Finding the GSM of a fabric from a cut sample.
- Estimating how much fabric an order needs from a marker.
- Working out how much chemical a dye batch needs.
- Calculating OEE for a machine for one shift.

This project does not claim how often these errors happen or what they cost.

## The Solution

Each calculator does one defined job and makes its working visible.

- Every input shows its unit.
- Every result comes with the formula and your values filled into it.
- Assumptions and limits are written next to the result.
- Bad input is rejected with a clear message. The tool never guesses.
- Warnings appear when a result is valid but needs a second look, such as OEE Performance above 100%.

The tools only calculate from your numbers. They do not recommend recipes, chemicals, settings or accept/reject decisions.

## Key Capabilities

| Area | Calculator | What it gives you |
|---|---|---|
| Fabric | Fabric GSM | GSM (g/m²) from sample mass, length and width |
| Fabric | Fabric Consumption | Fabric length per garment, per dozen and for an order, from a marker. An allowance is optional and is used only if you enter it. |
| Fabric | Marker Efficiency | Percentage of the marker area covered by pattern pieces, and the unused area |
| Dyeing | Liquor Quantity | Liquor mass, and an approximate volume (assumes about 1 kg/L), from the batch mass and a 1:R liquor ratio |
| Dyeing | Recipe Chemical Quantity | Chemical mass in kg and g from a percentage on weight of fabric (% owf) |
| Production | Production Capacity | Theoretical output from a rate and time, or from a cycle time and time. Whole complete units are shown separately. |
| Production | Production Efficiency | Actual output as a percentage of expected output. Values above 100% are shown, not capped. |
| OEE | OEE Calculator | Run time, Availability, Performance, Quality and OEE |
| Quality | Defect Percentage | Defective units as a percentage of inspected units |
| Quality | Measurement Average | Average of two or more measurements |
| Quality | Minimum, Maximum and Range | Smallest value, largest value and the difference |

Other behaviour:

- Supported units: length in m, cm, yd and in; time in s, min and h. Conversions use exact definitions.
- Changing any input clears the previous result, so a result on screen always matches the inputs shown.
- Reset clears only the calculator you are using.
- Nothing is saved. Reloading the page clears all values.
- Inputs never leave your browser. The app has no backend and makes no network requests of its own.

## How It Works

For each calculator the flow is the same: **Input, Process, Output**.

1. You pick a calculator and type your values.
2. You select **Calculate**.
3. The app checks every value. It rejects blanks, text, commas, zero or negative values where they are not allowed, and impossible combinations.
4. If everything is valid, it calculates and shows the result, the formula, your values in the formula, and any warning.

Example: Fabric GSM

| Input | Value |
|---|---|
| Sample mass | 9.6 g |
| Sample length | 20 cm |
| Sample width | 20 cm |

The area is 20 × 20 = 400 cm². GSM = 9.6 × 10,000 ÷ 400, so the result is **240.00 g/m²**.

Example: Fabric Consumption

A 6.2 m marker holds 5 garments, and you enter a 3% allowance. Base consumption is 6.2 ÷ 5 = 1.24 m per garment. With the allowance it is 1.2772 m per garment. Both figures are shown separately.

## System Architecture

The application is a static web app. All work happens in the browser.

```mermaid
flowchart LR
    A[User enters values] --> B[Screen component]
    B --> C[Parse and validate text input]
    C --> D[Calculation function]
    D --> E[Result or error]
    E --> F[Format numbers and show result]
```

The main parts are:

- **Screens** (`src/calculators/**/*.tsx`). React components that hold the form, call the calculation and display the result.
- **Calculation functions** (`src/calculators/**/*.ts`). Plain TypeScript with no React. Each returns either a result with optional warnings, or a list of errors. They check their inputs again, even though the screen has already parsed them.
- **Shared library** (`src/lib`). Input parsing and validation rules, unit conversion, and number formatting.
- **Shared components** (`src/components`). Cards, input fields, the result panel, formula section and messages.
- **App shell** (`src/app`). Navigation data and simple hash-based routing, such as `#/fabric/gsm`. This lets the built files work from any static folder or host without special server settings.

## Technology Stack

| Technology | Used for |
|---|---|
| TypeScript | Application and calculation code |
| React 19 | User interface |
| Vite 7 | Development server and production build |
| Plain CSS with design tokens | Styling (`src/styles`) |
| Vitest | Test runner |
| React Testing Library, user-event, jsdom | Component tests |
| ESLint and typescript-eslint | Code checks |
| npm | Dependency management and scripts |

There is no backend, database, authentication, external API or paid service.

## Installation and Setup

### Prerequisites

- Node.js 22.12 or newer (includes npm)
- Git, if you want to clone or publish the repository

Check your versions:

```bash
node -v
npm -v
```

### Install

From the project folder (the one that contains `package.json`):

```bash
npm install
```

If the repository does not yet contain `package-lock.json`, `npm install` creates it. Commit that file. After it is committed, use `npm ci` for repeatable installs.

### Run

```bash
npm run dev
```

Open the local address printed in the terminal. Vite usually prints `http://localhost:5173`.

### Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check with `tsc -b`, then build static files into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks without writing files |

### Configuration

No environment variables or configuration files need to be edited. The build uses relative asset paths (`base: './'` in `vite.config.ts`).

Step-by-step Windows instructions, including common problems, are in [docs/windows_setup.md](docs/windows_setup.md).

## Usage

1. Open the app and choose a calculator from the sidebar, or from the cards on the Home page. On a small screen, use the Menu button.
2. Enter values using a decimal point, for example `12.5`. Do not use commas, units or exponents.
3. Select **Calculate**. Pressing Enter in a field also calculates.
4. Read the result and open **Formula, units and assumptions** to see how it was calculated.
5. Use **Reset** to clear that calculator.

Notes for specific tools:

- Liquor ratio: enter only the multiplier. For a 1:8 ratio, type `8`.
- Allowance and order quantity in Fabric Consumption are optional. Leave them blank if you do not need them.
- Measurements are entered one per line or separated by spaces. Invalid entries are reported by position. Nothing is skipped.
- In OEE, choose the time unit first. It applies to both planned time and downtime.

A fuller guide to each calculator is in [docs/user_guide.md](docs/user_guide.md).

## Project Structure

```text
src/
  app/            Navigation data, hash routing, pages, App
  calculators/    fabric/  dyeing/  production/  quality/
                  Calculation functions (*.ts) with their tests, and screens (*.tsx)
  components/     Shared interface components
  lib/            Validation, units and number formatting
  styles/         Design tokens and CSS
  test/           Test setup and helpers
docs/             Specifications and guides
public/           Static assets
```

Documents in `docs/`:

| File | Content |
|---|---|
| [textile_calculation_reference.md](docs/textile_calculation_reference.md) | The formulas, rules and worked examples the code follows |
| [project_explanation.md](docs/project_explanation.md) | Scope, users and exclusions |
| [app_workflow.md](docs/app_workflow.md) | How each screen is meant to behave |
| [app_theme.md](docs/app_theme.md) | Visual design and accessibility |
| [technical_specification.md](docs/technical_specification.md) | Stack, architecture and testing rules |
| [master_prompt.md](docs/master_prompt.md) | Development rules for this project |
| [user_guide.md](docs/user_guide.md) | How to use each calculator |
| [windows_setup.md](docs/windows_setup.md) | Windows install, run and test steps |
| [github_publishing.md](docs/github_publishing.md) | Publishing to GitHub |
| [implementation_notes.md](docs/implementation_notes.md) | Design decisions and known limitations |
| [verification_report.md](docs/verification_report.md) | What was checked, and what was not |

## Current Status

Version 0.1.0. All the calculators in the table above are implemented. The unit tests and component tests are written.

What this means in practice:

- The calculation code was checked against the worked examples in `docs/textile_calculation_reference.md`, and against separately calculated values.
- The generated project was checked with substitute tools in its build environment. The full `npm` toolchain (install, lint, type check, Vitest and React Testing Library tests, Vite build) had not been run there. Run `npm run lint`, `npm run typecheck`, `npm run test:run` and `npm run build` on your machine to confirm. [docs/verification_report.md](docs/verification_report.md) lists exactly what was and was not run.
- The formulas follow the project's reference document. They have not been reviewed by a textile practitioner or validated against factory data.
- The GSM calculator is plain arithmetic. It does not implement ASTM D3776/D3776M or IS 1964, and no standards compliance is claimed.
- Testing so far covered Chromium at desktop and phone widths. Other browsers, screen readers and Windows have not been tested.
- The project is not deployed anywhere.

Not included by design: ERP or inventory features, user accounts, machine or PLC connections, dye recipe generation, chemical recommendations, colour matching, image-based defect detection, statistical process control, lot-acceptance decisions and costing. See [docs/project_explanation.md](docs/project_explanation.md).

## Roadmap

These are possible directions. None of them exists yet and none is a commitment.

- Confirm the full test, lint and build pipeline on Windows and commit the lockfile.
- Review the formulas and assumptions with textile practitioners.
- Test in more browsers and with screen readers.
- Add further tools only when their formulas are documented and tested. The project documents name these areas as candidates: yarn count conversions, fabric shrinkage, further dyeing and finishing calculations, expanded quality statistics, and exportable calculation summaries.
- Free static hosting, for example GitHub Pages.

## Contributing

Contributions are welcome. Please keep changes small and focused.

1. Fork the repository and create a branch.
2. Read [docs/technical_specification.md](docs/technical_specification.md) and [docs/textile_calculation_reference.md](docs/textile_calculation_reference.md).
3. Make your change. Put calculation logic in `src/calculators/**/*.ts`, not in React components.
4. Add or update tests. If you change a formula or rule, update the reference document in the same change.
5. Run `npm run lint`, `npm run typecheck`, `npm run test:run` and `npm run build`.
6. Open a pull request that explains what changed and why.

A new calculator needs a clear use case, a documented formula with its assumptions, input validation rules, and tests. Please do not add network requests, analytics or stored user data without prior discussion.

## License

Released under the MIT License. See [LICENSE](LICENSE).
