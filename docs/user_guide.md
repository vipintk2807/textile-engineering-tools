# User guide

## Basics (all calculators)

- Pick a calculator from the sidebar (or the **Menu** button on small screens) or from the cards on the Home page.
- Every input shows its unit in its label. Type plain numbers with a **decimal point** (`12.5`). Commas, units (`5 g`), exponents (`1e3`) and text are rejected, never guessed.
- Select **Calculate**. Pressing Enter in a field also calculates.
- Before a valid calculation the result area shows only an instruction, never example numbers.
- **If you change any input, the previous result and messages are cleared**, so a result on screen always matches the inputs shown.
- **Reset** clears only the calculator you are using.
- Each calculator has a **Formula, units and assumptions** section, including your values substituted into the formula after a result.
- **Errors** (red, prefixed "Error:") mean no valid result exists. **Warnings** (amber, prefixed "Warning:") mean a result is shown but needs review; the result is never altered or capped.
- Screens with two modes (Fabric, Dyeing, Capacity) use the **Calculation mode** radio buttons. Entered values are kept when you switch modes during the same visit.
- Nothing is saved. Reloading the page clears all inputs.

## Fabric GSM

Enter sample mass (g), length (cm) and width (cm) of the same rectangular sample. Result: GSM in g/m² and the sample area. This is arithmetic only, not an ASTM D3776/D3776M or IS 1964 test.

## Fabric Consumption and Marker Efficiency

**Fabric Consumption:** marker length (choose m, cm, yd or in), garments in the marker (whole number). *Allowance (%)* is optional: leave it blank to see base consumption only; enter your own percentage (0 or more) to also get an adjusted figure. *Order quantity* is optional (whole number, 0 allowed) and adds a total order length. Results are in metres. No allowance is ever assumed.

**Marker Efficiency:** choose one length unit; enter marker length, usable width and the **total** area of all pattern pieces in that unit squared. The area may not exceed the marker area. Result: efficiency %, marker and pattern areas in m², and the geometric unused area %.

## Dyeing Liquor and Recipe Quantity

**Liquor Quantity:** batch mass (kg) and the multiplier **R** of a 1:R ratio (enter `8` for 1:8). Result: liquor mass (kg) and an *approximate* volume (L) assuming about 1 kg/L.

**Recipe Chemical Quantity:** batch mass (kg) and a percentage on weight of fabric (% owf). Result: chemical mass in kg and g. This is arithmetic on your number; it does not suggest recipes or dosages.

## Production Capacity

**Production Rate:** rate (units/hour) × operating time (hours). **Cycle Time:** operating time (seconds, minutes or hours) ÷ cycle time (seconds/unit, > 0). Both show *theoretical* output and, separately, whole complete units (rounded down). Downtime is not subtracted.

## Production Efficiency

Actual ÷ expected × 100. Expected must be above zero. Values over 100% are shown uncapped with a review warning.

## OEE

Choose the time unit for planned time and downtime, then enter planned time, included downtime, ideal cycle time (s/unit), total units and good units. Results: run time, Availability, Performance, Quality and OEE. If run time is zero, Performance and OEE show "Not available"; if total units is zero, Quality and OEE show "Not available". Performance above 100% triggers a warning but is not changed. Define planned time, downtime and ideal cycle time consistently before comparing OEE values.

## Basic Quality Calculations

- **Defect Percentage:** defective units (whole number) ÷ inspected units (whole number > 0) × 100. Counts defective *units*, not individual defects.
- **Measurement Average** and **Minimum, Maximum and Range:** enter two or more numbers, one per line or separated by spaces. Invalid entries are reported by position and are never skipped. The unit field is just a label for the results.

## Reading results responsibly

Results are calculations from your inputs. They do not replace laboratory testing, approved procedures, machine manuals, customer specifications or professional judgement. See the **About and Limitations** page in the app.
