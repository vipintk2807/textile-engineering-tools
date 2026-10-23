# Implementation notes

Decisions made while implementing the specification documents, places where documents were interpreted, and known limitations. The six specification documents were **not** modified. If any decision below should change, update the owning specification document, the code, the tests and this file together.

## 1. Interpretations where documents differ or are silent

| Topic | Documents | Decision |
|---|---|---|
| Marker length unit | `app_workflow.md` 5.2 lists a "length unit"; `textile_calculation_reference.md` 2.1 uses metres | Unit selector (m, cm, yd, in) for marker length. Converted to metres in the calculation layer (exact factors: 0.01, 0.9144, 0.0254). Outputs are in metres. |
| Marker-efficiency units | Reference uses m²; workflow says "consistent area and length units" | One length-unit selector for marker length and width; pattern area is entered in that unit squared. The ratio is computed in the entered units (it is dimensionless, which avoids false rejections from floating-point conversion); areas are converted to m² for display. |
| Time units | Reference 2.1: hours or seconds "as explicitly specified"; workflow: "a supported time unit" | Rate mode: hours only. Cycle mode: seconds, minutes or hours. OEE: seconds, minutes or hours for planned time and downtime (shared selector); ideal cycle time always in s/unit. |
| Optional allowance | Spec 7.2 "must be explicitly entered"; workflow "optional"; reference 4.3 "if no allowance is applied, use base consumption and identify it accordingly" | Blank allowance means none was entered: only base consumption is used and labelled "base". An entered `0` is treated as an applied 0% allowance. No default is assumed. |
| Optional order quantity | Workflow: "when total order consumption is required" | Blank skips the total. `0` is valid and gives a total of 0. |
| Quality utilities layout | Workflow 9.3 allows a shared list "when it does not create ambiguity" | Three separate calculators on one page (Defect Percentage, Measurement Average, Min/Max/Range), each with its own list, result and Reset. |
| Numeric inputs | Spec: "appropriate numeric input type" | Text inputs with `inputMode="decimal"` and strict own parsing, so blank, malformed and out-of-range values get distinct messages. Browser `type="number"` hides malformed text. |
| Measurement separators | Spec 8.1: do not reinterpret commas | Measurements are separated by line breaks or spaces. An entry containing a comma is rejected with an explanation. |
| Stale results | Workflow 4.4: clear **or** mark outdated, consistently | Any input change clears the result and messages in that calculator. |
| Modes keep state | Not specified | The two modes of a screen both stay mounted, so values survive switching modes. Leaving the page or reloading clears everything (spec 10). |
| Error vs warning | Spec 8.3 | Warnings only for Production Efficiency above 100% and OEE Performance above 100%. Results are never capped or altered. |
| OEE zero cases | Reference 8.9 | Run time 0: Availability 0%, Performance and OEE "Not available". Total units 0: Performance 0%, Quality and OEE "Not available". Quality is also unavailable if total units is 0 even when run time > 0. |
| OEE folder | Spec 4 tree lists fabric/dyeing/production/quality | OEE lives in `calculators/production/` and has its own navigation entry. |
| Display precision | Reference 2.3 | Percentages and GSM: 2 decimals. Lengths, areas, masses: 2 to 4 decimals (very small non-zero values keep 3 significant digits). Counts: whole numbers. Theoretical output: up to 4 decimals. Number format: en-US (decimal point, comma thousands) for consistency; it is a presentation choice. |
| Whole-unit output | Reference 6.4: floor | `floor`, but a value within 1e-9 (relative) of a whole number is treated as that whole number, so floating-point error (for example 0.3 ÷ 0.1 = 2.9999999999999996, 4.35 × 100 = 434.99999999999994) cannot drop a complete unit. A genuinely fractional value is always rounded down. |
| Unused marker area | Reference 4.6 "may be calculated" | Shown as a supporting value, labelled as geometric area only. |
| Copy / export | Optional in workflow 12 | Not implemented and not shown. |
| Licence | Master prompt 19: do not assume one is selected | MIT added as a **default placeholder decision**. Confirm or change before public release. |
| Routing | Spec 5: hash-based if a router is needed | Small hash-route hook (no router dependency). Back/Forward and refresh work. Unknown addresses show a "Page not found" page. |

## 2. Items from the documents that cannot be satisfied by software

- "Mismatched units or pattern area for a different marker" (reference section 12): the software can enforce a single unit selection and the area ≤ marker area rule, but cannot detect a pattern area taken from a different marker. The interface states this requirement beside the input.
- "Incompatible quantities or periods" for production efficiency: cannot be detected; stated in the helper text and assumptions.
- "Confusing % owf with g/L": prevented only by labelling (`% owf`, "percent of the textile batch mass, not of the bath volume").

## 3. Known limitations and unresolved assumptions

- Formulas follow `textile_calculation_reference.md`. They have **not** been reviewed by a qualified textile practitioner or validated against factory data.
- Not implemented (out of scope): ASTM D3776/D3776M or IS 1964 procedures; standard-specific conditioning/sampling; any dyeing recipe logic; stock-solution or g/L concentrations; lot acceptance; SPC.
- Liquor volume assumes about 1 kg/L.
- Whole-unit tolerance (1e-9 relative) is an implementation decision, documented above.
- Very large inputs are rejected with a message when a result would not be finite; behaviour near the limits of double precision is otherwise not specified.
- Dependency versions in `package.json` were selected from knowledge without registry access and have never been installed by the implementer. `package-lock.json` is **missing** and must be generated with `npm install` (see windows_setup.md). Dependency licences have not been individually reviewed here.
- Accessibility: colour contrast ratios for the palette were computed (all text pairs used reach at least 4.5:1; the control border was darkened from the documented neutral because the first choice reached only 2.56:1 against white). No screen-reader test, no automated accessibility audit (axe, Lighthouse) and no WCAG conformance claim.
- Only Chromium (via Playwright) was used for browser checks, at 1280 px and 375 px widths. Not tested: Windows, Edge, Firefox, Safari, real touch devices.
