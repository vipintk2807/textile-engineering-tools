# **Application Workflow** 

## **1. Purpose** 

This document defines how users navigate and operate `textile-engineering-tools` , from selecting a textile engineering calculator to entering inputs, reviewing results, and correcting errors. 

The application will provide a single, consistent interface for routine textile engineering calculations. Each calculator will have a clearly defined purpose, explicit input units, visible calculation results, and explanations of important assumptions. 

The initial release will include seven calculator groups: 

1. Fabric GSM Calculator 

2. Fabric Consumption and Marker Efficiency Calculator 

3. Dyeing Liquor and Recipe Quantity Calculator 

4. Production Capacity Calculator 

5. Production Efficiency Calculator 

6. Overall Equipment Effectiveness (OEE) Calculator 

7. Basic Quality Calculation Utilities 

The application will run locally and will not require an account, a cloud service, or an internet connection for normal calculation workflows. 

## **2. Main Navigation** 

The application will use a simple sidebar on desktop and a compact navigation drawer or equivalent menu on smaller screens. 

The application header will display the project name, `Textile Engineering Tools` , and a navigation control for opening the main calculator categories. 

### **Navigation items** 

- **Home:** Introduces the application and provides access to the available calculators. 

- **Fabric Calculators:** Opens the GSM, fabric consumption, and marker efficiency tools. 

- **Dyeing Calculators:** Opens the liquor quantity and recipe quantity tools. 

- **Production Calculators:** Opens the production capacity and production efficiency tools. 

- **OEE Calculator:** Opens the equipment effectiveness calculator. 

- **Quality Calculators:** Opens the basic quality calculation utilities. 

- **About and Limitations:** Explains the purpose of the application, calculation limitations, and the distinction between mathematical results and process-specific engineering recommendations. 

The navigation will show only implemented calculators. A future feature must not appear as an operational tool before it is implemented. 

The application will not include user accounts, administration screens, a management dashboard, or a cloud workspace. 

## **3. Home Screen** 

The home screen will provide a practical entry point rather than a decorative business dashboard. 

It will contain: 

- The application name and a short explanation of its purpose. 

- Calculator categories with descriptive titles. 

- A short description of each available calculator. 

- Direct links to individual calculators. 

- A notice that results depend on the accuracy of entered values and the assumptions stated by each calculator. 

Each calculator entry will identify the problem it solves. For example, the GSM Calculator will describe calculating fabric mass per unit area from a sample's mass and dimensions. 

The home screen will not display fabricated production figures, simulated factory statistics, customer information, or performance charts unrelated to actual user calculations. 

If a calculator has not yet been implemented, it will not be presented as available. 

## **4. Standard Calculator Screen** 

All calculators will follow a consistent workflow and layout. 

### **4.1 Screen structure** 

Each calculator screen will contain: 

1. **Breadcrumb or category navigation:** Allows users to return to the relevant calculator group. 

2. **Calculator title:** Identifies the specific calculation. 3. **Purpose:** Briefly explains what the calculator determines. 4. **Input section:** Contains labelled fields, units, and short input guidance. 

5. **Calculation action:** A clearly labelled button, such as `Calculate` . 

6. **Result section:** Displays the calculated output and its unit. 7. **Calculation details:** Shows the formula, important intermediate values, and relevant assumptions. 

8. **Input correction:** Allows users to modify inputs and recalculate. 9. **Reset action:** Clears the current calculator's inputs and results after an explicit user action. 

Results will appear on the same screen as the inputs. Users will not need to navigate to a separate results page. 

Before a valid calculation has been performed, the result section will display a neutral instruction to enter the required values and calculate. It will not display invented default results. 

### **4.2 Input behaviour** 

Every input will have a descriptive label and, where applicable, a unit. 

- Required fields must be completed before calculation. 

- Numeric fields must reject invalid numeric values. 

- Values must satisfy the calculator's documented domain rules. 

- Unit conversions must follow the specified conversion rules. 

- The application must not silently replace invalid values with defaults. 

- Validation errors must identify the affected field or explain the invalid relationship between inputs. 

Where an input has a material engineering assumption, the interface will explain it next to the field or in a short information note. 

### **4.3 Result behaviour** 

After a successful calculation, the screen will show: 

- The primary result. 

- The appropriate output unit. 

- Important intermediate values, where relevant. 

- The formula or calculation method. 

- Any assumptions or limitations that materially affect interpretation. 

The displayed precision will follow the rules defined in `docs/textile_calculation_reference.md` . 

The application will distinguish between exact arithmetic results and estimates that depend on assumptions. It will not imply that a mathematically correct result automatically meets an industrial standard. 

### **4.4 Recalculation and reset** 

When users modify an input after calculating, the existing result must not be mistaken for the result of the new inputs. 

The interface will either clear the previous result when an input changes or visibly mark it as outdated until the user recalculates. The implementation must use one consistent behaviour across calculators. 

The `Reset` action will clear the current calculator's inputs, validation messages, and results. It will not affect other calculators or previously exported files. 

## **5. Fabric Calculators** 

### **5.1 Fabric GSM Calculator** 

**Navigation:** Fabric Calculators → Fabric GSM Calculator 

**Purpose:** Calculate fabric mass per unit area from a measured sample. 

#### **Inputs** 

- Sample mass in grams. 

- Sample length in centimetres. 

- Sample width in centimetres. 

The calculator will use length and width to determine the area of a rectangular sample. 

#### **Workflow** 

1. The user enters the sample mass. 

2. The user enters the sample length and width. 

3. The user selects `Calculate` . 

4. The application validates that the required measurements are positive and numeric. 5. The application calculates the sample area. 

6. The application calculates GSM. 

7. The result section displays the area and GSM. 

#### **Results** 

- Sample area in cm². 

- Fabric GSM in g/m². 

- Formula and substituted input values. 

The formula will be: 

GSM = Mass (g) × 10,000 / Area (cm²) 

The calculator will identify the result as a mathematical calculation from the entered sample measurements. It will not claim compliance with a prescribed fabric-testing standard. 

#### **Error handling** 

- Missing measurements: request the missing values. 

- Zero or negative dimensions: identify the invalid dimension. 

- Zero or negative sample mass: reject the input. 

- Invalid numeric input: request a valid number. 

### **5.2 Fabric Consumption and Marker Efficiency** 

**Navigation:** Fabric Calculators → Fabric Consumption and Marker Efficiency 

This screen will contain two separate calculation modes: 

- Fabric Consumption 

- Marker Efficiency 

The modes will share a screen but will have separate inputs, formulas, and results. 

#### **Mode A: Fabric Consumption** 

#### **Inputs** 

- Marker length. 

- Length unit. 

- Number of garments represented in the marker. 

- Optional additional allowance percentage. 

- Order quantity, when total order consumption is required. 

The interface will use consistent units and will clearly distinguish the base marker-based consumption from the adjusted estimate. 

#### **Workflow** 

1. The user enters the marker length and its unit. 

2. The user enters the number of garments represented by the marker. 

3. The user optionally enters an additional allowance percentage. 

4. The user enters the order quantity if a total requirement is needed. 5. The user selects `Calculate` . 

6. The application validates the inputs and calculates consumption. 7. The result section displays the base consumption and any requested adjusted quantities. 

#### **Results** 

- Base fabric length per garment. 

- Adjusted fabric length per garment when an allowance is supplied. 

- Fabric length per dozen garments. 

- Estimated total fabric length for the entered order quantity, when requested. 

The allowance will be treated as a user-supplied percentage. The interface will not assume that it automatically covers every production loss. 

#### **Error handling** 

- Marker length must be positive. 

- Garment count must be a positive whole number. 

- Order quantity must be a non-negative whole number when supplied. 

- Allowance must not be negative. 

- Invalid or incompatible units must be rejected. 

#### **Mode B: Marker Efficiency** 

#### **Inputs** 

- Total area of pattern pieces represented in the marker. 

- Marker length. 

- Usable marker width. 

- Consistent area and length units. 

#### **Workflow** 

1. The user enters the total pattern-piece area. 

2. The user enters marker length and usable marker width. 3. The user selects `Calculate` . 

4. The application validates the dimensions and checks that the pattern-piece area does not exceed the marker area. 

5. The application calculates marker efficiency. 

6. The result section displays marker area and marker efficiency. 

#### **Results** 

- Total marker area. 

- Total pattern-piece area. 

- Marker efficiency as a percentage. 

- Formula and calculation details. 

Marker efficiency (%) = Pattern-piece area / Marker area × 100 

The application will not infer actual production losses or fabric consumption beyond the supplied information. 

## **6. Dyeing Calculators** 

### **6.1 Dyeing Liquor and Recipe Quantity Calculator** 

**Navigation:** Dyeing Calculators → Dyeing Liquor and Recipe Quantity 

The screen will contain two modes: 

- Liquor Quantity 

- Recipe Chemical Quantity 

The application will not combine these modes into an automatic recipe generator. 

#### **Mode A: Liquor Quantity** 

#### **Inputs** 

- Textile batch weight in kilograms. 

- Liquor ratio value, expressed using a documented convention. 

The interface will display an example of the ratio format, such as `1:5` , and explain which part of the ratio the user must enter. 

#### **Workflow** 

1. The user enters the textile batch weight. 

2. The user enters the liquor ratio. 

3. The user selects `Calculate` . 

4. The application validates both inputs. 

5. The application calculates the liquor mass and its approximate volume. 

6. The result section displays the values and the density assumption. 

#### **Results** 

- Estimated liquor mass in kilograms. 

- Approximate liquor volume in litres. 

- Formula and density assumption. 

For the basic calculation, the application will assume an aqueous liquor density of approximately 1 kg/L when converting mass to volume. 

#### **Error handling** 

- Batch weight must be positive. 

- Liquor ratio must be positive. 

- Missing or invalid values must be identified. 

- The result must be labelled as an estimate where the density assumption affects interpretation. 

#### **Mode B: Recipe Chemical Quantity** 

#### **Inputs** 

- Textile batch weight in kilograms. 

- Chemical concentration as a percentage on weight of fabric (owf). 

#### **Workflow** 

1. The user enters the batch weight. 

2. The user enters the chemical concentration. 

3. The user selects `Calculate` . 

4. The application validates the inputs. 

5. The application calculates the chemical quantity. 

6. The result section displays the chemical mass in grams and kilograms. 

#### **Results** 

- Chemical mass in kilograms. 

- Chemical mass in grams. 

- Formula and concentration basis. 

Chemical mass (kg) = Batch weight (kg) × Concentration (%) / 100 

The interface will explicitly state that the entered percentage is owf. It will not treat the input as a bath-volume concentration. 

The tool will calculate quantities only. It will not recommend chemical selection, dosage suitability, or dyeing process conditions. 

## **7. Production Calculators** 

### **7.1 Production Capacity Calculator** 

**Navigation:** Production Calculators → Production Capacity 

The screen will provide two calculation modes: 

- Production Rate 

- Cycle Time 

#### **Mode A: Production Rate** 

#### **Inputs** 

- Production rate in units per hour. 

- Available operating time in hours. 

#### **Workflow** 

1. The user enters the production rate. 

2. The user enters available operating time. 

3. The user selects `Calculate` . 

4. The application validates the values. 

5. The application calculates estimated production capacity. 6. The result section displays the theoretical output and the corresponding whole-unit capacity. 

#### **Formula** 

Estimated output = Production rate × Operating time 

The result will be labelled as an estimate based on the supplied rate and time. 

#### **Mode B: Cycle Time** 

#### **Inputs** 

- Ideal or measured cycle time in seconds per unit. 

- Available operating time in seconds or a supported time unit. 

#### **Workflow** 

1. The user enters the cycle time. 

2. The user enters the available operating time. 

3. The user selects `Calculate` . 

4. The application validates the inputs. 

5. The application calculates theoretical capacity. 

6. The result section displays the theoretical and whole-unit output. 

#### **Formula** 

Theoretical output = Available operating time / Cycle time per unit 

The interface will distinguish a theoretical capacity estimate from guaranteed production. Downtime, changeovers, material shortages, and other operational effects are not automatically included unless explicitly represented by the inputs. 

### **7.2 Production Efficiency Calculator** 

**Navigation:** Production Calculators → Production Efficiency 

**Purpose:** Calculate actual production as a percentage of expected production. 

#### **Inputs** 

- Actual production quantity. 

- Expected production quantity. 

Both values must use compatible units and cover the same reporting period and production scope. 

#### **Workflow** 

1. The user enters actual production. 

2. The user enters expected production. 

3. The user selects `Calculate` . 

4. The application checks that expected production is positive and that the quantities are valid. 

5. The application calculates production efficiency. 

6. The result section displays the percentage and the entered quantities. 

#### **Formula** 

Production efficiency (%) = Actual production / Expected production × 100 

A result above 100% will be displayed without capping, accompanied by an explanation that the expected production basis may need review. 

The calculator will not automatically classify a result as good or bad because the meaning depends on the production standard and reporting context. 

## **8. OEE Calculator** 

**Navigation:** OEE Calculator 

**Purpose:** Calculate Availability, Performance, Quality, and Overall Equipment Effectiveness from a defined production period. 

### **Inputs** 

- Planned production time. 

- Included downtime. 

- Ideal cycle time per unit. 

- Total units produced. 

- Good units produced. 

Time inputs will use clearly labelled units. The application will convert compatible time units consistently before calculation. 

### **Workflow** 

1. The user enters planned production time. 

2. The user enters downtime included in the calculation. 

3. The user enters ideal cycle time. 

4. The user enters total production and good production counts. 

5. The user selects `Calculate` . 

6. The application validates the time relationships and production counts. 

7. The application calculates run time. 

8. The application calculates Availability, Performance, and Quality. 

9. The application calculates OEE. 

10. The result section displays the three component percentages and the final OEE percentage. 

### **Results** 

- Run time. 

- Availability percentage. 

- Performance percentage. 

- Quality percentage. 

- Overall OEE percentage. 

- Formula and intermediate calculation values. 

The application will use the documented three-factor OEE model. The screen will explain that results depend on the chosen definitions of planned time, downtime, ideal cycle time, and good production. 

### **Validation and error handling** 

- Planned production time must be positive. 

- Downtime must not be negative or exceed planned production time. 

- Run time must be positive for calculations that use it as a denominator. 

- Ideal cycle time must be positive. 

- Total units produced must be a non-negative whole number. 

- Good units must be a non-negative whole number and cannot exceed total units. 

- Where production is zero, the application must handle undefined ratios explicitly rather than divide by zero. 

- Performance above 100% will trigger an explanatory warning rather than automatic correction. 

The application will not invent missing production data or apply undocumented assumptions to force an OEE result. 

## **9. Basic Quality Calculation Utilities** 

**Navigation:** Quality Calculators → Basic Quality Calculations 

The screen will provide three utilities: 

- Defect Percentage 

- Measurement Average 

- Minimum, Maximum, and Range 

### **9.1 Defect Percentage** 

#### **Inputs** 

- Number of defective items. 

- Total inspected items. 

#### **Workflow** 

1. The user enters the defective-item count. 

2. The user enters the total inspected count. 

3. The user selects `Calculate` . 

4. The application validates the counts. 

5. The result section displays the defect percentage. 

#### **Formula** 

Defect percentage (%) = Defective items / Inspected items × 100 

The inspected count must be positive, and the defective count must be between zero and the inspected count. 

The result describes the supplied counts only. It does not determine lot acceptance or substitute for a defined sampling plan. 

### **9.2 Measurement Average** 

#### **Inputs** 

- A list of two or more numerical measurements. 

- A common measurement unit. 

#### **Workflow** 

1. The user enters the measurements in a list or multiline field. 

2. The user selects `Calculate` . 

3. The application validates the entries and checks that the list contains at least two measurements. 

4. The application calculates the arithmetic mean. 

5. The result section displays the average and measurement count. 

#### **Formula** 

Arithmetic mean = Sum of measurements / Number of measurements 

All measurements must use the same unit. The application will not silently combine incompatible units. 

### **9.3 Minimum, Maximum, and Range** 

This utility will use the same measurement list as the Measurement Average calculator when the shared interface permits it without creating ambiguous behaviour. Otherwise, it will provide a separate measurement input field. 

#### **Results** 

- Minimum measurement. 

- Maximum measurement. 

- Range. 

Range = Maximum measurement − Minimum measurement 

The application will reject an empty list or invalid measurement entries. 

These utilities will not determine compliance with a textile specification unless applicable limits and assessment rules are separately defined. 

## **10. Formula, Assumption, and Help Content** 

Each calculator will include concise explanatory content relevant to its engineering purpose. 

The help content will describe: 

- What the calculator measures or estimates. 

- The meaning of each input. 

- Required units and conventions. 

- The formula used. 

- Important assumptions and limitations. 

- 

- Situations in which the result should not be treated as a definitive engineering decision. 

The interface will not display long technical documents by default. Detailed formulas, references, and engineering conventions will be maintained in `docs/textile_calculation_reference.md` and surfaced in the relevant calculator as needed. 

If a calculation depends on a convention that has not been verified, the application must clearly identify the assumption. It must not imply that the selected convention is universally followed across textile factories. 

## **11. Shared Error and Empty States** 

The application will use consistent messages for common states. 

### **Initial state** 

Before calculation, the result area will prompt the user to enter valid inputs and calculate. 

### **Missing input** 

The application will identify required fields that have not been supplied. 

### **Invalid input** 

The application will explain whether a value must be positive, non-negative, an integer, or within a specified relationship to another input. 

### **Invalid calculation** 

If a denominator is zero or the entered values make the calculation undefined, the application will explain why no result can be produced. 

### **Engineering warning** 

If a result is mathematically calculable but may indicate inconsistent assumptions, the application will display the result with a warning. For example, an OEE Performance value above 100% will prompt the user to review the ideal cycle time and production data. 

### **Successful calculation** 

The application will display the result, unit, formula, and relevant intermediate values. 

### **Reset** 

Resetting a calculator will clear its current input values, result, and validation messages. The user will be able to start another calculation without reloading the application. 

## **12. Calculation History, Copying, and Export** 

The initial release will not require a persistent calculation history or database. 

A calculator will retain the values needed for the current on-screen workflow, subject to the application's implemented state-management behaviour. Navigating away from a calculator will not be presented as permanently saving its inputs. 

Copying a result or exporting a summary may be provided where implemented and tested. Any copied or exported summary should include, as applicable: 

- Calculator name. 

- Input values and units. 

- Output values and units. 

- Formula or calculation method. 

- Important assumptions or warnings. 

The application will not claim to provide saved reports, PDF generation, spreadsheet exports, or reusable calculation records until those capabilities have been implemented and verified. 

## **13. Responsive Behaviour and Accessibility** 

The application will prioritise desktop use while remaining usable on smaller screens. 

On desktop: 

- Navigation will remain readily accessible. 

- Input and result sections may be displayed side by side where space allows. 

- Long formulas and explanations will remain readable. 

On smaller screens: 

- Input and result sections will stack vertically. 

- Form fields and buttons will fit the available width. 

- Tables or long outputs will not force the entire page to overflow horizontally. 

- Navigation will remain accessible through a compact menu. 

All input fields will have visible labels. Validation messages will not rely on colour alone. Controls will support keyboard interaction, and focus states will remain visible. 

The interface will use clear terminology and familiar measurement units rather than unexplained technical abbreviations. 

## **14. Workflow Boundaries** 

The application will perform calculations from user-provided data. It will not independently verify the truth of those inputs or obtain live factory measurements. 

The application will not: 

- Connect to production machinery. 

- Retrieve factory production records. 

- Generate chemical recipes. 

- Decide whether a fabric lot meets a customer specification. 

- Guarantee production capacity. 

- Certify compliance with textile testing standards. 

- Claim that calculated values have been validated against real factory data. 

These boundaries will be communicated through the relevant calculator explanations and the application's About and Limitations section. 

## **15. Workflow Acceptance Criteria** 

The application workflow will be considered implemented when: 

- Users can navigate from the home screen to each implemented calculator. 

- Each calculator presents its defined inputs, units, actions, and results. 

- Invalid inputs are rejected with clear, actionable messages. 

- Successful calculations display the correct result and relevant calculation details. 

- Changing inputs cannot leave an old result appearing current. 

- Reset clears only the active calculator's current state. 

- Formula explanations and assumptions are available where needed. 

- OEE and other calculations with potentially undefined results handle zero denominators and inconsistent inputs explicitly. 

- Navigation and calculator screens remain usable on desktop and smaller screens. 

- Keyboard navigation and visible input labels are supported. 

- The interface does not present unimplemented features or fabricated results as operational. 

- Manual verification confirms the principal user workflows on the supported Windows environment. 

Passing these criteria establishes that the specified workflows behave as intended. It does not, by itself, establish the suitability of every formula for every textile process; formula correctness and process-specific applicability must also be addressed by the calculation reference and testing requirements. 

