# **Technical Specification** 

**Repository:** `textile-engineering-tools` **Document path:** `docs/technical_specification.md` **Status:** Development specification **Project type:** Local-first, open-source textile engineering calculator web application 

## **1. Purpose** 

This document defines the technical architecture, development environment, calculationengine design, input validation, testing requirements, and release requirements for `textileengineering-tools` . 

The application will provide practical textile engineering calculators with transparent formulas, explicit units, visible assumptions, and predictable results. It must be suitable for development and use on a Windows laptop without a dedicated GPU, paid services, or a continuously running backend. 

This specification complements the other project documents: 

- `docs/project_explanation.md` defines the project purpose, intended users, scope, and initial calculator groups. 

- `docs/app_workflow.md` defines navigation, calculator-screen behavior, and user interaction. 

- `docs/app_theme.md` defines visual design, colours, typography, responsive layout, and accessibility expectations. 

- `docs/textile_calculation_reference.md` will be the authoritative project document for calculation formulas, unit conventions, assumptions, and worked reference examples. 

- `docs/master_prompt.md` defines the overarching instructions and workflow for AIassisted development. 

If a calculation detail conflicts between this document and `docs/textile_calculation_reference.md` , the discrepancy must be investigated and resolved explicitly before implementation or release. Do not silently change a formula to make the implementation easier. 

## **2. Technical decisions** 

The initial implementation will use the following stack. 

|**Area**|**Decision**|
|---|---|
|Programming language|TypeScript|
|UI framework|React|
|Build tool and development<br>server|Vite|
|Styling|Plain CSS with reusable design tokens and components|



|Package manager|npm|
|---|---|
|Runtime|Node.js 22.12 or newer within a compatible supported<br>release line|
|Unit and component testing|Vitest and React Testing Library|
|DOM test environment|jsdom|
|Code quality|ESLint and TypeScript compiler checks|
|Version control|Git and GitHub|
|Primary development OS|Windows|
|Application runtime|Modern web browser|
|Backend|None for the initial release|
|Database|None for the initial release|
|Required external API|None|
|Required GPU|None|



Use the React TypeScript template provided by Vite as the starting point. Confirm the installed versions and their compatibility when scaffolding the project. The Node.js requirement above is deliberately aligned with the current Vite and Vitest requirements rather than relying on an older version that may no longer be supported. 

Use npm consistently. Commit `package-lock.json` so that another developer can install the dependency tree reproducibly with `npm ci` . 

Do not add a CSS framework, component library, state-management library, charting library, or routing dependency unless an identified requirement justifies it. The initial application should remain small and straightforward to maintain. 

Technical references: 

- Vite documentation: https://vite.dev/guide/ 

- React documentation: https://react.dev/learn 

- React TypeScript documentation: https://react.dev/learn/typescript 

- Vitest documentation: https://vitest.dev/guide/ 

- TypeScript documentation: https://www.typescriptlang.org/docs/ 

- React Testing Library documentation: https://testing-library.com/docs/react-testing- <u>library/intro/</u> 

These references describe the upstream tools. Their existence does not mean the repository has already been configured, tested, or released. 

## **3. Architecture** 

### **3.1 Architecture principles** 

Use a client-side architecture with a clear separation between: 

1. User interface and navigation. 

2. Calculator input and output handling. 

3. Calculation functions. 

4. Validation and error reporting. 

5. Shared formatting and unit presentation. 

6. Tests and technical documentation. 

Calculation results must be produced by deterministic TypeScript functions. They must not depend on React rendering, browser layout, network requests, current time, random values, or external services. 

A calculator must be testable independently of its visual interface. A change to the page layout must not require rewriting its mathematical formula. 

### **3.2 Data flow** 

The normal calculation flow is: 

1. The user enters values with explicit units. 

2. The interface reads and parses the input values. 

3. Input validation checks whether the values are present, finite, and valid for the selected calculation. 

4. The appropriate pure calculation function receives validated values. 

5. The function returns a typed result or a controlled validation/calculation error. 6. The interface presents the result, units, formula, assumptions, and any applicable warnings. 

7. If an input changes, the previous result is cleared or marked stale, following the consistent behavior defined in `docs/app_workflow.md` . 

Do not allow invalid input to silently become zero. Do not display a plausible-looking numerical result when validation has failed. 

### **3.3 No backend in the initial release** 

The initial application will not require: 

- A server-side application. 

- A database. 

- User accounts or authentication. 

- A paid API or API key. 

- Cloud computation. 

- Remote calculation services. 

- Continuous internet access after the application assets have been made available locally. 

The development server is a development tool, not a production backend. 

The production build should consist of static files that can be served by a compatible static web server. A production build may be opened locally for basic inspection, but browser restrictions can prevent some static files from working correctly when opened directly through a `file://` URL. Use a local static HTTP server or the configured preview command for reliable verification. 

Hosting on GitHub Pages or another compatible free static host may be considered later. It is not a prerequisite for local development, and deployment must not introduce a paid-service dependency. 

## **4. Repository structure** 

Keep the repository organized around the application, calculation logic, tests, and documentation. 

Recommended structure: 

```
textile-engineering-tools/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── navigation.tsx
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── CalculatorCard.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── ResultPanel.tsx
│   │   ├── FormulaDetails.tsx
│   │   ├── ValidationMessage.tsx
│   │   └── WarningMessage.tsx
│   ├── calculators/
│   │   ├── fabric/
│   │   ├── dyeing/
│   │   ├── production/
│   │   └── quality/
│   ├── lib/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── units.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── test/
│   │   └── setup.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── docs/
│   ├── project_explanation.md
│   ├── app_workflow.md
│   ├── app_theme.md
│   ├── technical_specification.md
│   ├── textile_calculation_reference.md
│   └── master_prompt.md
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
```

```
└── vite.config.ts
```

This is a target organization, not a claim that these files already exist. Keep the generated Vite configuration compatible with the installed versions. Adapt the exact filenames where necessary without weakening the architecture or test requirements. 

Do not create empty folders or placeholder modules merely to match this diagram. Add each module when it has a real implementation. 

Keep calculator-specific functions and tests close to their relevant calculator group. Shared validation, formatting, layout, and design tokens belong in reusable modules. 

## **5. Application structure and navigation** 

Implement the navigation and screen hierarchy specified in `docs/app_workflow.md` . 

The initial calculator groups are: 

1. Fabric Calculators. 

2. Dyeing Calculators. 

3. Production Calculators. 

4. OEE Calculator. 

5. Quality Calculators. 

6. About and Limitations. 

The Home screen must describe the available tools and link to implemented calculators. Do not show invented usage statistics, fabricated user reviews, or calculators that are presented as functional when they are only placeholders. 

Use a small, maintainable navigation implementation. For static-hosting compatibility, prefer hash-based navigation if a router becomes necessary; otherwise, a simple, well-structured navigation state is sufficient. Browser Back and Forward behavior should be tested if navigation changes the URL or browser history. 

Every implemented calculator must have a stable title, a concise purpose statement, clearly labelled inputs, a Calculate action, a result area, formula and assumption details, and a way to reset its own inputs. 

The interface must not imply that a mathematically valid result is automatically suitable for a production decision. Display relevant limitations where users see the result, not only in a separate documentation page. 

## **6. Calculation-engine design** 

### **6.1 Pure functions** 

Implement calculation logic as exported TypeScript functions that receive validated numeric inputs and return explicit result objects. 

#### A function must: 

- Perform one defined calculation or a closely related set of calculations. 

- Use descriptive parameter and result names. 

- Document input units and output units. 

- Follow the approved formula and assumptions. 

- Avoid direct access to UI state. 

- Avoid formatting numbers for display. 

- Avoid changing global state or mutating unrelated data. 

- Return controlled errors for invalid calculation conditions. 

- Be covered by deterministic automated tests. 

Use TypeScript interfaces or types to make input and result structures clear. Do not use `any` to bypass type checking. 

A shared calculation-result convention may distinguish between successful results, validation errors, and warnings. Warnings must not be treated as calculation failures unless the underlying result is invalid. 

For example, an OEE performance factor above 100% may be a warning requiring investigation rather than an automatic rejection. By contrast, division by zero must not produce a displayed numerical result. 

### **6.2 Numeric precision** 

Use JavaScript numbers for the initial calculations. Do not round intermediate calculations unless a defined formula or documented measurement convention explicitly requires it. 

Separate calculation precision from display precision: 

- Keep sufficient precision internally for dependent calculations. 

- Round only for presentation, following the conventions established in `docs/textile_calculation_reference.md` . 

- Show units with the formatted values. 

- Do not imply that extra decimal places mean the original measurement was more accurate. 

- Do not use formatted display strings as inputs to further calculations. 

Check that calculated results are finite. If an input combination causes overflow or an invalid numerical result, return a controlled error rather than displaying `Infinity` or `NaN` . 

### **6.3 Unit handling** 

Every input and output must have a clearly identified unit or be explicitly dimensionless. 

Use consistent units within each calculation. Convert units explicitly before combining quantities expressed in different units. 

The initial implementation must not silently infer units from a number. Unit labels must be visible next to the relevant input or output. 

Use a shared unit-formatting approach where it reduces inconsistency, but do not introduce a general-purpose unit-conversion framework unless the implemented calculators require it. 

The initial release is not required to provide automatic conversion between every possible textile unit. Any conversion that is provided must have its own tests and documented conversion factor. 

### **6.4 Formula transparency** 

For each calculator, show: 

- The formula actually used. 

- A plain-language description of its variables. 

- The units expected by the calculation. 

- Any assumptions that materially affect the result. 

- Applicable warnings or limitations. 

The displayed formula must match the implementation. Do not display a textbook formula if the implementation uses a modified version without explaining the difference. 

Formula and assumption text should be maintained close to the relevant calculation definition where practical, so that the user interface and tests can be updated together. 

## **7. Initial calculator requirements** 

The formulas and assumptions in this section establish implementation boundaries. `docs/textile_calculation_reference.md` must provide the detailed calculation definitions, variable names, unit conventions, and reference examples before the calculators are considered ready for release. 

### **7.1 Fabric GSM** 

**Purpose:** Calculate fabric mass per unit area from a weighed rectangular sample. 

Required inputs: 

- Sample mass in grams. 

- Sample length in centimetres. 

- Sample width in centimetres. 

Calculation: 

Area in cm² = length in cm × width in cm 

GSM in g/m² = mass in g × 10,000 ÷ area in cm² 

Requirements: 

- Mass, length, and width must be greater than zero. 

- Calculate the area explicitly. 

- Display the calculated area and GSM. 

- Identify the result as calculated from the entered sample dimensions and mass. 

- Do not claim that the result is compliant with a particular test standard merely because the formula is dimensionally correct. 

Any future standard-specific sampling, conditioning, weighing, or reporting requirements must be independently verified and documented before being implemented. 

### **7.2 Fabric consumption and marker efficiency** 

**Purpose:** Calculate fabric consumption from marker information and calculate marker efficiency when pattern-piece area is known. 

For a marker representing a known number of garments: 

Base consumption per garment = marker length ÷ number of garments represented 

Adjusted consumption per garment = base consumption × (1 + allowance percentage ÷ 100) 

Length for a dozen garments = adjusted consumption per garment × 12 

Total order length = adjusted consumption per garment × order quantity 

Marker efficiency: 

Marker efficiency percentage = pattern-piece area ÷ marker area × 100 

Marker area = marker length × usable marker width 

Requirements: 

- Marker length and usable width must be positive. 

- The number of garments represented by a marker must be a positive integer. 

- Order quantity must be a non-negative integer; zero quantity produces a zero total order length. 

- Allowance must be explicitly entered and documented. Do not assume a universal allowance. 

- Pattern-piece area and marker area must use compatible area units. 

- Pattern-piece area must be positive and must not exceed marker area for a physically valid marker-efficiency calculation. 

- Show base consumption and adjusted consumption separately when allowance is used. 

- State whether consumption represents marker-based theoretical consumption or an allowance-adjusted estimate. 

- Do not silently add extra allowances for shrinkage, defects, end loss, or other production factors. 

Any future additions for garment size mixes, fabric width utilization, shrinkage, or cutting loss must be defined as separate, explicit calculation rules. 

### **7.3 Dyeing liquor and recipe quantity** 

**Purpose:** Calculate liquor quantity from a specified liquor ratio and calculate a chemical quantity from an entered percentage on weight of fabric (owf). 

For a liquor ratio of 1:R: 

Liquor mass in kg = textile batch mass in kg × R 

Approximate liquor volume in litres = liquor mass in kg, using the stated approximation of aqueous liquor density of approximately 1 kg/L. 

For a chemical entered as a percentage owf: 

Chemical mass in kg = textile batch mass in kg × owf percentage ÷ 100 

Chemical mass in grams = chemical mass in kg × 1,000 

Requirements: 

- Batch mass must be greater than zero. 

- The entered liquor-ratio multiplier must be greater than zero. 

- Chemical percentage must be non-negative. 

- Clearly distinguish percentage owf from a liquor concentration percentage or another dosing convention. 

- Display the units and the density assumption for the approximate liquor volume. 

- Do not present approximate volume as an exact volume measurement. 

- Do not generate dyeing recipes, recommend chemical dosages, or infer a process recipe from the calculation. 

The tool performs arithmetic on user-provided values. Chemical suitability, process conditions, compatibility, safety, and recipe correctness remain outside its scope. 

### **7.4 Production capacity** 

**Purpose:** Calculate theoretical production output using either a production rate or a cycle time. 

Rate-based mode: 

Theoretical output = production rate per hour × operating hours 

Cycle-time mode: 

Theoretical output = available operating time in seconds ÷ cycle time in seconds per unit 

Requirements: 

- Production rate must be non-negative. 

- Operating time must be non-negative. 

- Cycle time must be greater than zero. 

- Clearly define the time period used in each calculation. 

- Display theoretical output separately from whole-unit output when fractional theoretical results occur. 

- Do not silently convert theoretical capacity into actual production. 

- Do not subtract downtime unless the selected mode explicitly includes it and the interface states how it is treated. 

The tool must not assume that a production rate measured on one machine, line, or product applies to another. 

### **7.5 Production efficiency** 

**Purpose:** Compare actual production with expected production. 

Efficiency percentage = actual production ÷ expected production × 100 

Requirements: 

- Actual production must be non-negative. 

- Expected production must be greater than zero. 

- Both quantities must represent comparable units and periods. 

- Results above 100% are valid mathematical outcomes and must not be automatically capped. 

- Explain that the meaning of efficiency depends on how expected production was established. 

The application must not invent target production rates or infer missing production records. 

### **7.6 Overall Equipment Effectiveness (OEE)** 

**Purpose:** Calculate Availability, Performance, Quality, and OEE from user-provided production and time data. 

Run time = planned production time − included downtime 

Availability percentage = run time ÷ planned production time × 100 

Performance percentage = ideal cycle time × total units ÷ run time × 100 

Quality percentage = good units ÷ total units × 100 

OEE percentage = Availability percentage × Performance percentage × Quality percentage ÷ 10,000 

Required inputs: 

- Planned production time. 

- Downtime included in the calculation. 

- Ideal cycle time per unit. 

- Total units produced. 

- Good units produced. 

Requirements: 

- Planned production time must be greater than zero. 

- Downtime must be non-negative and cannot exceed planned production time. 

- Run time must be greater than zero for Performance to be calculated. 

- Ideal cycle time must be greater than zero. 

- Total units must be a non-negative integer. 

- Good units must be a non-negative integer and cannot exceed total units. 

- If total units are zero, Quality must not be calculated through division by zero. 

- Display run time and the three OEE factors in addition to the final OEE result. 

- Show a warning when Performance exceeds 100%, because the entered ideal cycle time, production counts, time basis, or assumptions may need investigation. 

- Do not automatically cap a calculated Performance result at 100%. 

- Do not silently alter downtime, counts, or cycle time to force a preferred result. 

When there is insufficient valid data to calculate a factor, show the reason and leave the affected result unavailable. Do not display zero as if it were a calculated factor when the factor is undefined. 

The exact definition of planned production time and which downtime categories are included must be explicit in the interface and in `docs/textile_calculation_reference.md` . Do not claim compliance with an OEE standard or a particular industry convention without verifying and implementing its relevant requirements. 

### **7.7 Basic quality utilities** 

**Purpose:** Provide simple arithmetic utilities for defect percentage and descriptive statistics. 

Defect percentage = defective units ÷ inspected units × 100 

Mean = sum of measurements ÷ number of measurements 

Range = maximum measurement − minimum measurement 

Requirements: 

- Defective units must be non-negative. 

- Inspected units must be greater than zero. 

- Defective units cannot exceed inspected units. 

- Mean, minimum, maximum, and range must use a set of at least two measurements for the initial implementation. 

- Measurements used in a single calculation must share the same unit and represent comparable quantities. 

- Reject empty measurement sets and non-finite values. 

- Display the number of measurements used when showing descriptive statistics. 

These utilities are not a complete quality-control system. They do not implement control charts, process capability analysis, sampling plans, acceptance criteria, or automated defect classification. 

## **8. Input validation and error handling** 

Validation must occur before a calculation function is called and must also be enforced by the calculation function where needed to protect its correctness when called independently. 

### **8.1 Numeric inputs** 

For every numeric input: 

- Reject blank values when the field is required. 

- Reject values that cannot be parsed as finite numbers. 

- Reject `NaN` , positive infinity, and negative infinity. 

- Apply the calculator's documented positive, non-negative, integer, and range requirements. 

- Do not silently substitute a default value for missing data. 

- Do not silently convert an invalid value to zero. 

- Provide a specific, actionable error message next to the relevant field or in a clearly associated error area. 

Use standard decimal-point input consistently. Do not silently reinterpret comma-separated input as either a decimal separator or a thousands separator. If localized numeric entry is added in the future, define and test its parsing rules explicitly. 

### **8.2 Calculation errors** 

Handle invalid denominators, impossible input relationships, and non-finite calculated results deliberately. 

Examples include: 

- Zero sample area. 

- Zero expected production. 

- Zero cycle time. 

- Zero run time in an OEE calculation. 

- Good-unit count greater than total-unit count. 

- Pattern-piece area greater than marker area. 

- Invalid or missing measurements. 

Do not expose raw JavaScript exceptions or stack traces to end users. Technical errors may be recorded in the development console during development, but the user interface must provide a clear message without leaking internal implementation details. 

### **8.3 Warnings versus errors** 

Use an error when the inputs cannot produce a valid result under the documented calculation rules. 

Use a warning when a numerical result is available but requires interpretation or verification. 

Warnings must explain the reason. Do not use warning styling to conceal invalid inputs or imply that an unsupported engineering assumption has been verified. 

### **8.4 Stale results** 

When an input changes after a successful calculation, follow the stale-result behavior specified in `docs/app_workflow.md` . A previous result must not appear to represent the new input values. 

The Calculate action must validate the current values before producing a new result. Reset must clear only the relevant calculator's input and result state. 

## **9. User interface and design implementation** 

Implement the visual design in `docs/app_theme.md` and the interaction behavior in `docs/app_workflow.md` . Those documents are authoritative for the presentation and workflow; this specification defines the technical implementation requirements. 

Use CSS custom properties for the approved colour palette, spacing scale, typography, borders, focus styles, and shared component dimensions. Avoid duplicating hard-coded design values across multiple components. 

Build reusable components for common interface patterns, including: 

- Application layout and navigation. 

- Calculator cards. 

- Form fields and unit labels. 

- Calculate and Reset actions. 

- Result panels. 

- Formula and assumption details. 

- Validation errors and warnings. 

- Tables or measurement lists where needed. 

Calculator-specific components may differ when the underlying task requires it, but they should follow the same layout and interaction conventions. 

Use semantic HTML elements, associated labels, keyboard-operable controls, and visible focus indicators. Do not rely on colour alone to communicate errors or warnings. Meet the accessibility requirements documented in `docs/app_theme.md` , including appropriate text contrast and responsive behavior. 

Use a system font stack rather than downloading remote fonts. Do not add decorative animations or complex visual effects that reduce readability or make the application harder to maintain. 

## **10. State management and persistence** 

Use React component state for active navigation, current calculator inputs, validation messages, calculation results, and warnings. 

Do not add a global state-management library for the initial application. 

The initial release does not require: 

- Persistent calculation history. 

- A database. 

- User profiles. 

- Cloud synchronization. 

- Automatic saving. 

- Cross-device state synchronization. 

Calculator state may reset when a user leaves a calculator or reloads the application unless a documented workflow explicitly requires otherwise. Make the behavior predictable and consistent. 

Do not use browser storage for sensitive or unnecessary information. If local persistence is introduced later, document what is stored, why it is needed, how it is cleared, and how the feature behaves in private browsing or when storage is unavailable. 

## **11. Dependencies and security** 

Prefer established, actively maintained open-source dependencies with licences compatible with the repository's selected open-source licence. 

Before adding a dependency: 

1. Identify the specific requirement it solves. 

2. Check whether the existing stack can solve the requirement without it. 

3. Review maintenance status and compatibility. 

4. Check its licence. 

5. Add it only if the benefit justifies the extra maintenance burden. 

Use `npm ci` for clean dependency installation in verification workflows. Commit the lockfile and avoid unreviewed dependency changes. 

Do not commit: 

- API keys. 

- Passwords. 

- Tokens. 

- Personal or confidential production data. 

- Machine-specific secrets. 

- Unnecessary generated files or local dependency directories. 

The initial application must not make undisclosed network requests, load remote scripts, or transmit calculator inputs to an external service. Any future feature that introduces network access must document its purpose and data handling and receive explicit review before inclusion. 

The application is a calculation utility, not a safety-certification or process-control system. It must not imply that its outputs replace approved production procedures, laboratory testing, equipment instructions, chemical safety information, or professional engineering judgment. 

## **12. Testing strategy** 

Automated tests are mandatory for calculation logic and important validation rules. A successful visual inspection alone is not sufficient. 

### **12.1 Unit tests** 

Use Vitest to test every exported calculation function. 

For each calculator, include: 

- At least one independently checked normal example. 

- Boundary-value tests. 

- Invalid-input tests. 

- Zero-denominator tests where relevant. 

- Unit and scaling tests. 

- Tests for warnings and undefined results. 

- Tests confirming that invalid inputs cannot produce misleading numeric results. 

Expected results must be calculated independently from the implementation or derived from a verified reference example. Do not copy the implementation's own output into a test and treat that as proof of correctness. 

Use tolerances for floating-point comparisons where appropriate. Do not use tolerances so broad that they conceal formula or unit-conversion errors. 

### **12.2 Component tests** 

Use React Testing Library to verify user-visible behavior. 

Test that: 

- Each input has an accessible label and the correct unit. 

- Required fields and invalid values produce useful errors. 

- Valid values produce the expected result and units. 

- Formula and assumption details are available. 

- Warnings appear when required. 

- Editing an input does not leave an apparently current but stale result. 

- Reset clears the correct calculator state. 

- Navigation opens the intended calculator. 

- Zero, empty, and boundary values are handled correctly. 

Prefer tests that interact with the interface as a user would. Avoid tests that depend unnecessarily on internal React implementation details. 

### **12.3 Integration and manual testing** 

Before release, verify the complete application flow in a modern desktop browser on Windows. 

At minimum, check: 

- Home screen and navigation. 

- Every implemented calculator from input through result. 

- Invalid inputs and recovery after errors. 

- Reset and repeated calculations. 

- Browser refresh and navigation behavior. 

- Narrow viewport and mobile layout. 

- Keyboard navigation and visible focus. 

- Formula, unit, and warning readability. 

- Local production build behavior. 

- Absence of unintended network dependencies. 

A calculator must not be considered complete solely because its component renders or its unit test passes. 

### **12.4 Test commands** 

Configure `package.json` with clear, repeatable scripts. The expected script purposes are: 

- `npm run dev` — start the local development server. 

- `npm run build` — run required type checks and produce the production build, or invoke the build alongside a separate type-check script. 

- `npm run preview` — serve the production build locally for inspection. 

- `npm run test` — run unit and component tests in watch mode if that is the chosen default. 

- `npm run test:run` — run tests once and exit. 

- `npm run lint` — run ESLint. 

- `npm run typecheck` — run the TypeScript compiler checks without emitting application output. 

These are required script behaviors, not a claim that the scripts have already been implemented. If the generated template uses different script names, align the scripts and this documentation during setup. 

Release verification must use a non-interactive test command such as `npm run test:run` , not a watch process that waits for further changes. 

### **12.5 Testing limitations** 

Automated tests cannot establish that a textile process assumption is correct simply by demonstrating that code implements it consistently. Domain formulas, conventions, and worked examples must be reviewed against trustworthy technical references or qualified domain review. 

Do not report test success, browser compatibility, accessibility conformance, or engineering validation unless the relevant checks have actually been performed. 

## **13. Development workflow on Windows** 

Use a current supported Node.js release that satisfies the requirements in Section 2, together with the npm version supplied with that installation. 

The expected local workflow is: 

1. Install Git and Node.js if they are not already available. 

2. Open Windows Terminal, PowerShell, or a compatible terminal. 

3. Clone the repository or open the existing working copy. 

4. Run `npm ci` to install the locked dependencies. 

5. Run `npm run dev` and open the local URL printed by Vite. 

6. Implement one calculator or small, testable feature at a time. 

7. Run the relevant tests and type checks. 

8. Run the full test suite and lint checks. 

9. Run `npm run build` . 

10. Inspect the production build with `npm run preview` . 

11. Review the code and documentation before committing. 

Do not assume a local directory name, port number, or browser URL without checking the actual command output. 

The application must not require a dedicated GPU, Docker, a Linux subsystem, a paid IDE, or a cloud development environment. 

If installation fails, inspect the actual error and installed Node.js/npm versions before changing dependencies. Do not resolve dependency problems by deleting the lockfile or randomly upgrading packages without understanding the cause. 

## **14. Build and deployment requirements** 

The production build must generate static application assets using Vite. 

Before release: 

- Confirm that the build completes successfully. 

- Confirm that TypeScript checks pass. 

- Confirm that the test suite passes. 

- Confirm that lint checks pass. 

- Inspect the built application through the configured preview server. 

- Check for broken assets, console errors, and navigation failures. 

- Confirm that the production configuration does not require a secret or paid API. 

- Confirm that any static-hosting base path is configured correctly if deployment uses a subdirectory. 

Do not commit build output unless the chosen deployment workflow explicitly requires it. Keep generated files and local dependencies out of version control through `.gitignore` . 

A future free static-hosting workflow may use GitHub Pages or a comparable service. Hosting, automated deployment, custom domains, and continuous integration are optional infrastructure features, not prerequisites for the initial calculator implementation. 

If a deployment workflow is added, document its trigger, build command, output directory, required repository settings, and verification procedure. Never claim a deployment succeeded without checking its result. 

## **15. Maintainability and code quality** 

Use strict TypeScript settings where supported by the selected template. Resolve meaningful type errors instead of suppressing them broadly. 

Follow these conventions: 

- Use descriptive names for variables, functions, and units. 

- Keep calculation functions small and independently testable. 

- Avoid duplicate formulas across calculator components. 

- Keep UI components focused on presentation and interaction. 

- Centralize shared validation and formatting behavior. 

- Use consistent error and warning conventions. 

- Remove unused code and dependencies. 

- Avoid unnecessary abstractions for hypothetical future features. 

- 

   - Comment on non-obvious formulas, assumptions, and engineering decisions rather than narrating every line. 

- Keep documentation aligned with the actual implementation. 

Do not create one enormous component containing all calculators. Do not build an elaborate plugin architecture or dynamic formula engine for the initial release. A simple folder-based structure with shared components and isolated calculation modules is sufficient. 

## **16. Scope controls** 

The initial implementation must prioritize the seven calculator groups defined in `docs/project_explanation.md` and specified in Section 7 of this document. 

Do not expand the initial release into: 

- ERP or inventory management. 

- Production planning or scheduling. 

- Machine, PLC, or IoT integration. 

- Automatic dye recipe generation. 

- Automated colour matching. 

- Computer vision. 

- Predictive maintenance. 

- Advanced statistical process control. 

- AI-generated production recommendations. 

- Full energy accounting. 

- A comprehensive costing system. 

- Persistent multi-user records. 

Future features must have a clear use case, documented requirements, verified formulas where applicable, tests, and a scope decision before implementation. 

A new calculator must not be added to the navigation as a functional tool until its formula, inputs, units, assumptions, validation rules, result behavior, and test cases have been defined. 

## **17. Open assumptions and items requiring verification** 

The following matters must remain explicit until evidence or an implementation decision resolves them. 

### **17.1 Domain verification** 

- The exact formulas, units, worked examples, and rounding conventions must be reviewed in `docs/textile_calculation_reference.md` before implementation is finalized. 

- Any claim of compliance with a textile testing standard requires verification of the applicable standard and the relevant procedure, not just a formula comparison. 

- Liquor volume based on 1 kg/L is an approximation; actual density may differ with composition and temperature. 

- Dyeing recipe arithmetic does not establish chemical compatibility, suitability, or process safety. 

- Marker allowances are user-provided assumptions, not universal values. 

- OEE definitions depend on the agreed production-time and downtime conventions. These conventions must be documented before results are used for comparison. 

- Actual production practices in Tiruppur and other textile locations must not be generalized without evidence or user research. 

### **17.2 Product decisions** 

- Direct user research has not yet established the full priority order of calculators. 

- Persistence, calculation history, export, printing, and downloadable reports are not required for the first release. 

- Free static hosting is a possible later option, not a confirmed deployment. 

- The initial application does not promise offline installation as a packaged desktop application. It is a local-first web application that can run locally without a backend. 

- The minimum browser versions will follow the supported production target of the selected Vite release unless testing establishes a narrower compatibility requirement. 

### **17.3 Implementation verification** 

- The proposed repository structure must be reconciled with the actual files when development begins. 

- Dependency versions must be selected and locked during project setup. 

- Test commands and configuration must be confirmed in `package.json` . 

- Accessibility, responsive behavior, Windows compatibility, and production-build behavior must be verified through actual checks. 

- No calculator, test, or deployment should be described as complete until its acceptance criteria have been met. 

When an unresolved item affects the correctness or safety of a calculation, do not guess. Document the limitation and postpone that calculation or feature until it can be implemented responsibly. 

## **18. Release acceptance criteria** 

The initial release is ready only when all applicable criteria below have been satisfied. 

### **Application** 

 

The application installs and runs on the supported Windows development environment. 

 

The Home screen and navigation accurately reflect the implemented calculators. 

 

Every released calculator follows the workflow and visual design documents. 

 

The layout works at desktop and narrow viewport sizes. 

 

Inputs and results clearly identify units. 

 

Formulas, assumptions, errors, and warnings are visible and understandable. 

 

Editing inputs cannot leave a misleading stale result. 

 

No calculator silently substitutes missing or invalid values. 

### **Calculation correctness** 

 

Each implemented formula has been checked against an independently verified reference example. 

 

Calculation functions are separate from UI components. 

 

Positive, non-negative, integer, and range constraints are enforced as required. 

 

Division-by-zero and non-finite results are handled. 

 

Unit conversions and display rounding follow the calculation reference. 

 

Warnings and undefined results are handled correctly. 

 

No unsupported textile-process recommendations or compliance claims are made. 

### **Engineering quality** 

 

Unit and component tests pass. 

 

TypeScript checks pass. 

 

ESLint checks pass. 

 

The production build completes. 

 

The production build has been inspected through the preview server. 

 

Keyboard operation and basic accessibility requirements have been checked. 

 

No unnecessary external service, paid API, or secret is required. 

 

Dependencies and their licences have been reviewed. 

 

The lockfile and repository ignore rules are correct. 

### **Documentation and release** 

 

Documentation matches the actual implementation. 

 

Known limitations and unverified assumptions are documented. 

 

The repository includes an appropriate open-source licence before public release. 

 

Setup and verification instructions are sufficient for another developer to reproduce the checks. 

 

The release description reports only functionality that has actually been implemented and tested. 

A checked acceptance item must be supported by a real verification result. Do not mark criteria complete merely because they appear in this specification. 

## **19. Change management** 

When modifying a calculation, first identify the affected formula, assumptions, units, validation rules, UI text, tests, and documentation. 

For a formula change: 

1. Record why the existing formula is being changed. 2. Verify the proposed formula against an appropriate technical reference or qualified domain review. 

3. Update `docs/textile_calculation_reference.md` . 

4. Update the pure calculation function. 

5. Update or add independently checked tests. 

6. Update displayed formulas, assumptions, units, and warnings. 

7. Run the complete verification workflow. 

8. Document any change that affects previously produced results or user expectations. 

For a new calculator, define its scope and requirements before implementation. For a UI-only change, confirm that the calculation logic and result interpretation remain unchanged. 

Do not silently alter established formulas, unit conventions, default assumptions, or output meanings during refactoring. 

The governing development workflow is: 

#### **TARGET → SPECIFY → BUILD → TEST → VERIFY → IMPROVE → RELEASE** 

Use this sequence to keep the project focused on practical textile engineering needs, transparent calculations, reproducible testing, and maintainable open-source development. 

