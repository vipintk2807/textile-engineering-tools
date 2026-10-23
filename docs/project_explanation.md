# **Textile Engineering Tools** 

## **1. Project Overview** 

`textile-engineering-tools` is an open-source collection of practical textile engineering calculators and utilities designed to help textile professionals perform routine calculations, convert units, estimate material requirements, evaluate production performance, and check basic quality measurements. 

The project will focus on useful, transparent engineering tools rather than a large management system. Each calculator will solve a clearly defined problem, display its inputs and outputs with appropriate units, and explain the calculation method and important assumptions. 

The application will initially target textile manufacturing and related operations relevant to Tiruppur, Tamil Nadu, while remaining useful to textile professionals in other regions. 

The project will be developed as an independent GitHub repository under the supplied repository name. It must be practical to build and maintain on a Windows laptop without a dedicated GPU, paid APIs, paid development tools, or mandatory cloud services. 

The initial release will prioritise a small set of well-defined calculators that can be tested independently. Additional tools will be introduced only when their formulas, input requirements, and expected behaviour are sufficiently established. 

## **2. Problem Being Solved** 

Textile engineering work involves recurring numerical calculations across fabric production, dyeing, garment manufacturing, quality control, machine operation, and production planning. 

These calculations can involve different units, process assumptions, production quantities, and measurement conventions. Incorrect unit conversions, misunderstood formulas, invalid inputs, or undocumented allowances can lead to misleading results. 

A practical calculator collection can help users: 

- Perform common calculations without repeatedly creating spreadsheets or manually applying formulas. 

- Convert between supported units consistently. 

- See the formula, input values, and assumptions behind each result. 

- Check fabric measurements and material consumption estimates. 

- Estimate dyeing liquor quantities from specified process inputs. 

- Calculate production rates, efficiency, and equipment effectiveness from recorded data. 

- Perform basic quality calculations using clearly defined counts and measurements. 

- Reproduce calculations using the same inputs and calculation rules. 

- Access engineering utilities without depending on an internet connection or paid service. 

The application will support calculations and preliminary engineering estimates. It will not replace laboratory testing, approved production procedures, machine manuals, quality specifications, or professional engineering judgement. 

## **3. Intended Users** 

### **3.1 Textile engineers and production personnel** 

Users who need to calculate production rates, equipment efficiency, material requirements, and basic process quantities. 

### **3.2 Dyeing and processing personnel** 

Users who need to calculate dyeing liquor quantities and chemical quantities from explicitly supplied batch weights, liquor ratios, and recipe concentrations. 

The application will not independently prescribe dyeing recipes, chemical selections, temperatures, pH values, or processing sequences. 

### **3.3 Fabric and garment manufacturing personnel** 

Users who need to calculate fabric GSM, fabric consumption from marker information, marker efficiency, and related material estimates. 

### **3.4 Quality personnel** 

Users who need to calculate defect percentages, sample averages, and basic measurement statistics from entered inspection or testing data. 

These calculations will support routine checks, not replace applicable customer acceptance criteria or standardised laboratory procedures. 

### **3.5 Students and independent textile practitioners** 

Users who need to understand and reproduce textile engineering calculations through worked examples, visible formulas, and clearly labelled units. 

## **4. Product Scope and Initial Release** 

The initial release will contain a single application with calculators grouped by engineering task. 

The following seven calculator groups define the initial product scope. The first release will prioritise the core calculations listed under each group; it will not attempt to implement every possible textile formula. 

### **4.1 Fabric GSM Calculator** 

**Purpose:** Calculate the mass per unit area of a fabric sample from its measured mass and area. 

#### **Inputs:** 

- Sample mass in grams. 

- Sample length and width in centimetres, or sample area in square centimetres. 

#### **Outputs:** 

- Sample area in square centimetres when length and width are supplied. 

- Fabric mass per unit area in grams per square metre (g/m²), conventionally called GSM. 

#### **Calculation basis:** 

For a rectangular sample: 

Area (cm²) = Length (cm) × Width (cm) 

GSM = Mass (g) × 10,000 / Area (cm²) 

The application will reject non-positive dimensions, areas, and sample masses where those values are required for the calculation. 

The calculator will distinguish a mathematical GSM calculation from a standards-compliant fabric test. ASTM D3776/D3776M describes multiple methods for determining fabric mass per unit area, with differences in specimen selection and treatment. The application will not claim that a result complies with that standard merely because the arithmetic is correct. 

Reference: ASTM International, ASTM D3776/D3776M, _Standard Test Methods for Mass Per Unit Area (Weight) of Fabric_ . 

### **4.2 Fabric Consumption and Marker Efficiency Calculator** 

**Purpose:** Estimate fabric length per garment from a completed marker and calculate marker utilisation when the necessary area information is available. 

#### **Inputs for marker-based consumption:** 

- Marker length. 

- Number of garments represented in the marker. 

- Optional allowance percentage for specified additional consumption. 

#### **Outputs:** 

- Base fabric length per garment. 

- Adjusted fabric length per garment when an allowance is entered. 

- Fabric length per dozen garments. 

- Estimated total fabric length for an entered order quantity. 

#### **Calculation basis:** 

Base consumption per garment = Marker length / Number of garments in the marker 

Adjusted consumption = Base consumption × (1 + Allowance percentage / 100) 

The allowance is an explicit user input. It will not be presented as a universal textile-industry standard or automatically assumed to cover shrinkage, spreading losses, defects, or every other source of additional consumption. 

The marker efficiency calculator will accept: 

- Total area of pattern pieces represented in the marker. 

- Marker length. 

- Usable marker width. 

Marker efficiency (%) = Total pattern-piece area / (Marker length × Usable marker width) × 100 

The area units must be consistent between the numerator and denominator. 

The application will reject zero or negative marker dimensions, a non-positive garment count, and pattern-piece areas that exceed the marker area. It will explain that calculated consumption and marker efficiency depend on the supplied marker dimensions and do not independently establish the actual fabric requirement for a production order. 

Reference: TextileNotes, _Marker Efficiency Formula_ and _Woven Fabric Consumption Calculator_ . These are practical secondary references; the applicable factory method and allowance policy must be confirmed before operational use. 

### **4.3 Dyeing Liquor and Recipe Quantity Calculator** 

**Purpose:** Calculate basic dyeing bath quantities and chemical masses from an explicitly supplied batch weight and recipe. 

The initial release will support the following calculations. 

#### **Liquor quantity** 

Inputs: 

- Textile batch weight in kilograms. 

- Liquor ratio expressed as a dimensionless ratio, such as 1:5. 

Output: 

- Calculated liquor quantity in litres, using the specified ratio convention and assuming an aqueous liquor density of approximately 1 kg/L for the basic volume conversion. 

For a liquor ratio of 1:R: 

Liquor mass (kg) = Textile mass (kg) × R 

Approximate liquor volume (L) = Liquor mass (kg), when the assumed density is 1 kg/L. 

The interface will explain that this is an estimate. Actual liquor preparation can require additional consideration of machine hold-up, residual liquor, process additions, and the convention used to define the batch weight and liquor ratio. 

#### **Recipe chemical quantity** 

Inputs: 

- Textile batch weight in kilograms. 

- Chemical concentration expressed as a percentage on weight of fabric (owf). 

#### Output: 

- Chemical quantity in grams or kilograms. 

Calculation basis: 

Chemical mass (kg) = Textile mass (kg) × Concentration percentage / 100 

The application will explicitly label the concentration basis as owf. It will not silently interpret percentages as a percentage of bath volume or as a concentration expressed in another convention. 

A future recipe extension may support additional concentration bases, but these will not be included until their input definitions and conversion rules are documented and tested. 

The calculator will not recommend a chemical recipe or determine whether a selected chemical is suitable for a particular fibre, shade, machine, or process. 

Reference: ScienceDirect Topics, _Liquor Ratio_ , summarising the definition of liquor ratio in textile dyeing. The precise process conventions and density assumptions require validation against the intended factory workflow. 

### **4.4 Production Capacity Calculator** 

**Purpose:** Estimate production capacity from an explicitly specified operating time and production rate. 

The initial release will support two calculation modes. 

#### **Mode A: Output from production rate** 

Inputs: 

- Production rate in units per hour. 

- Available operating time in hours. 

Output: 

Estimated production quantity = Production rate × Operating time 

#### **Mode B: Output from cycle time** 

Inputs: 

- Ideal or measured cycle time in seconds per unit. 

- Available operating time in seconds. 

#### Output: 

Estimated production quantity = Available operating time / Cycle time per unit 

Results may be fractional when calculated mathematically. Where the output represents a count of complete units, the application will display the theoretical result and the corresponding whole-unit capacity separately, without concealing the rounding method. 

The calculator will identify whether the rate represents an ideal rate, a historical observed rate, or a user-supplied planning rate. It will not assume that a machine can sustain its nominal rate continuously. 

This tool will initially provide a basic capacity estimate, not a complete production-planning system. 

### **4.5 Production Efficiency Calculator** 

**Purpose:** Calculate production efficiency from actual output and a clearly defined expected or standard output. 

#### **Inputs:** 

- Actual production quantity. 

- Expected production quantity for the same period and scope. 

#### **Output:** 

Production efficiency (%) = Actual production quantity / Expected production quantity × 100 

The expected output must be greater than zero, and both quantities must use compatible units and refer to the same reporting period and production scope. 

The result may exceed 100%. The application will not automatically cap it at 100%, because doing so could conceal a legitimate difference between actual and expected output or an error in the supplied production standard. 

The interface will explain that production efficiency depends on how expected output is defined. The calculator will not claim that this ratio is interchangeable with labour efficiency, machine efficiency, utilisation, or OEE. 

### **4.6 Overall Equipment Effectiveness (OEE) Calculator** 

**Purpose:** Calculate OEE from defined production-time, cycle-time, and quality-count inputs. 

The initial release will use the conventional three-factor model. 

#### **Inputs:** 

- Planned production time. 

- Downtime included in the selected OEE definition. 

- Ideal cycle time per unit. 

- Total units produced. 

- Good units produced. 

#### **Calculated factors:** 

Run time = Planned production time − Included downtime 

Availability (%) = Run time / Planned production time × 100 

Performance (%) = (Ideal cycle time × Total units produced) / Run time × 100 

Quality (%) = Good units produced / Total units produced × 100 

OEE (%) = Availability × Performance × Quality / 10,000 

The final division by 10,000 applies when the three component factors are expressed as percentages. Internally, the implementation may use fractional values between zero and one, provided the displayed results are consistent. 

The application will validate the relationships between planned time, downtime, run time, total output, and good output. It will reject impossible time relationships and invalid counts. 

Performance can exceed 100% when the entered ideal cycle time is inconsistent with the actual production rate. The application will flag this condition for review rather than silently changing the inputs or presenting the result as unquestionably valid. 

The calculator will explain that OEE depends on the definition of planned production time, included downtime, ideal cycle time, and good output. It will not prescribe a universal target or claim that one OEE benchmark is appropriate for every textile process. 

Reference: OEE.com, _OEE Calculation: Definitions, Formulas, and Examples_ . Its documented three-factor model supports the calculation structure; applicability to a specific textile machine and factory reporting convention requires confirmation. 

### **4.7 Basic Quality Calculation Utilities** 

**Purpose:** Provide a small set of transparent numerical utilities for routine inspection and measurement work. 

The initial release will include: 

#### **Defect percentage** 

Inputs: 

- Number of defective items. 

- Total inspected items. 

Output: 

Defect percentage (%) = Defective items / Inspected items × 100 

The application will require the defective-item count to be non-negative and no greater than the inspected-item count. 

#### **Measurement average** 

Inputs: 

- Two or more numerical measurements using the same unit. 

Output: 

Arithmetic mean = Sum of measurements / Number of measurements 

The application will reject an empty measurement list and non-numeric entries. 

#### **Minimum, maximum, and range** 

Outputs: 

- Minimum measurement. 

- Maximum measurement. 

- Range = Maximum − Minimum. 

These utilities will not automatically determine whether a fabric lot passes inspection. Acceptance limits, sampling plans, defect classifications, and applicable standards must be supplied or separately established. 

## **5. Shared Application Functionality** 

All initial calculators will follow a consistent interaction model. 

### **5.1 Input and calculation workflow** 

Users will: 

1. Select a calculator from its engineering category. 

2. Enter the required values and select supported units where applicable. 

3. Review short explanations of important inputs and assumptions. 

4. Run the calculation. 

5. View the result, units, formula, and relevant intermediate values. 

6. Correct inputs and recalculate when necessary. 

The application will not calculate from incomplete or invalid inputs. Errors will identify the relevant field or explain the invalid relationship between values. 

### **5.2 Formula transparency** 

Each calculator will show the formula or calculation method used, the units of its inputs and outputs, and any assumptions that materially affect the result. 

Where useful, the application will show intermediate values so users can check the calculation independently. 

### **5.3 Unit handling** 

The application will explicitly identify units for dimensions, masses, times, rates, and calculated results. 

Only conversions with clearly defined relationships will be supported. A conversion will not be treated as proof that two measurements are equivalent under different test conditions. 

### **5.4 Local operation** 

The application will be designed to run locally on Windows without a required account, external API, or internet connection during normal calculator use. 

Core calculations will run on the user's machine. The application will not require cloud computation, a GPU, or an AI model. 

### **5.5 Data persistence** 

The initial release will not require a database, user account, or central server. 

Calculator inputs will be entered directly into the relevant tool. Saving a calculation history or maintaining reusable production records is outside the initial scope unless it becomes necessary to support a clearly defined core workflow. 

### **5.6 Results and exports** 

Results will be readable on screen and suitable for manual verification. 

Copying results and exporting calculation summaries may be implemented as small local features where they can be completed and tested reliably. These features must not be represented as available until implemented. 

The initial release will not promise PDF reports, spreadsheet integration, or a central reporting system as core functionality. 

## **6. Technical Direction and Development Constraints** 

The project will use a simple, local-first architecture suitable for a beginner to develop and maintain on Windows. 

The detailed technology choices and dependency requirements will be defined in `docs/technical_specification.md` . The architecture must meet these constraints: 

- Free and open-source technologies wherever practical. 

- No mandatory paid subscriptions, APIs, hosted databases, or deployment services. 

- Calculation logic separated from interface components. 

- Automated tests for formulas, input validation, unit conversions, and edge cases. 

- A responsive interface suitable for desktop use and smaller screens. 

- Clear installation instructions and reproducible local setup. 

- No requirement for a dedicated GPU or specialised hardware. 

- No unnecessary accounts, microservices, machine integrations, or cloud infrastructure. 

The project will not add artificial intelligence, machine learning, computer vision, or industrial hardware communication merely to make the application appear more advanced. 

## **7. Engineering Correctness and Verification** 

Engineering correctness is a core product requirement. 

Each calculator must have a documented calculation method and a set of tests with independently established expected results before it is considered complete. 

The project will distinguish between: 

- **Verified facts:** Claims supported by an identified reliable source or established mathematical relationship. 

- **Engineering decisions:** Chosen implementation rules, input conventions, and presentation behaviour. 

- **Assumptions:** Conditions that must hold for a calculation to be valid. 

- **Synthetic examples:** Invented values used for development and testing, clearly labelled as such. 

- **Unverified requirements:** Process-specific details that require confirmation from a qualified textile practitioner, applicable standard, machine manual, or factory procedure. 

Testing will include normal inputs, boundary values, invalid values, zero denominators, unit conversions, precision, rounding, and relationships between inputs. 

No calculator will be described as industrially validated merely because its software tests pass. Software verification establishes that the implementation follows its specified rules; it does not independently establish that those rules are appropriate for every factory process. 

## **8. Explicit Exclusions from the Initial Release** 

The initial release will not include: 

- Factory ERP, inventory, purchasing, order management, or accounting. 

- User accounts, multi-user permissions, or cloud synchronisation. 

- Live machine monitoring, PLC connections, IoT sensors, or automated production data collection. 

- Automatic dye recipe generation or chemical recommendations. 

- Advanced colour matching, spectrophotometer integration, or colour-difference analysis. 

- Computer vision, fabric-defect image recognition, or predictive maintenance. 

- Advanced statistical process control or automated lot-acceptance decisions. 

- AI chat assistants or paid model integrations. 

- Comprehensive garment costing, energy costing, or financial accounting. 

- A full textile production-planning or scheduling system. 

- Claims of compliance with a textile standard without implementation and verification of the relevant requirements. 

These exclusions keep the first release focused on calculations that can be understood, implemented, and tested independently. 

## **9. Future Expansion** 

The repository may later expand to include additional utilities in the following areas: 

- Yarn count and linear-density conversions. 

- Woven and knitted fabric calculations beyond the initial consumption tools. 

- Fabric shrinkage and dimensional-change calculations. 

- Textile costing and material-cost estimation. 

- Machine-specific production calculations. 

- Additional dyeing and finishing calculations. 

- Expanded quality statistics and inspection utilities. 

- Reusable calculation records and exportable summaries. 

Each addition will require a defined use case, documented formulas and assumptions, suitable validation rules, and testable acceptance criteria. 

Future features will not be included solely because they appear in the repository's broad project description. They must provide practical value and be supported by sufficiently reliable engineering information. 

## **10. Assumptions and Items Requiring Verification** 

The initial scope makes the following explicit assumptions. 

**Target users:** The application is intended for textile professionals and learners who need accessible engineering calculations. The relative priority of different user groups has not yet been established through direct user research. 

**Tiruppur relevance:** Tiruppur is the intended regional context for practical examples and potential future requirements. No specific factory workflow, production practice, or regional industry statistic is assumed to be universally applicable. 

**Dyeing calculations:** The basic liquor-ratio and owf calculations are mathematical estimates. Batch-weight conventions, liquor-ratio definitions, density assumptions, and recipe practices must be checked against the intended use before production adoption. 

**Fabric consumption:** Marker-based calculations depend on accurate marker dimensions, garment count, usable width, and explicitly specified allowances. Actual consumption can vary with production conditions and factory-specific procedures. 

**OEE:** The selected formula follows a documented three-factor model. The time-accounting rules and ideal cycle-time definitions must be confirmed for the machine or process being evaluated. 

**Quality calculations:** Defect percentage and basic measurement statistics are mathematical summaries, not substitutes for prescribed sampling methods or acceptance criteria. 

**Standards:** ASTM D3776/D3776M is a relevant reference for fabric mass per unit area. The application will not reproduce restricted standards text or claim compliance without reviewing the applicable requirements and verifying the implemented method. 

**Examples and datasets:** Initial examples will use clearly labelled synthetic values. No real factory data, production benchmark, or customer result is assumed to be available. 

These uncertainties do not prevent development of the initial calculators. They define the boundaries within which the application may make reliable claims. 

## **11. Definition of Initial Release Completion** 

The initial release will be considered ready for publication when: 

- All seven calculator groups described in this document have their agreed core functionality implemented. 

- Every implemented calculator has documented inputs, outputs, units, formulas, assumptions, and validation rules. 

- Automated tests cover the specified normal cases, boundary cases, invalid inputs, and relevant calculation relationships. 

- The main user workflows have been manually verified on a Windows environment. 

- The application operates locally without mandatory paid services or an internet connection. 

- The interface clearly distinguishes calculation results from estimates and processspecific recommendations. 

- No unimplemented feature is presented as operational. 

- The repository includes the required project documentation, setup instructions, supported-functionality descriptions, limitations, and an appropriate open-source licence. 

- Test execution and manual verification results are reported accurately, including unresolved defects and unverified process-specific requirements. 

A successful build alone will not constitute release readiness. The calculations, validation behaviour, user workflows, and installation procedure must be checked against the documented requirements. 

## **12. Expected Outcome** 

`textile-engineering-tools` will provide a focused, maintainable, open-source toolkit for routine textile engineering calculations. 

Its value will come from practical utility, transparent formulas, explicit units, careful input validation, and reproducible results—not from the number of features or the complexity of its technology stack. 

The initial release will establish a reliable foundation for expanding the collection as additional textile calculations are researched, specified, tested, and verified. 

