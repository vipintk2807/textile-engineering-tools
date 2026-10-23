# **Textile Calculation Reference** 

**Repository:** `textile-engineering-tools` **Document path:** `docs/textile_calculation_reference.md` **Purpose:** Authoritative reference for the formulas, units, assumptions, worked examples, and validation rules used by the project's initial textile engineering calculators. 

## **1. Purpose and authority** 

This document defines the calculation rules that must be followed when implementing, testing, reviewing, and maintaining the initial calculators in `textile-engineering-tools` . 

Its primary objectives are to ensure that: 

- Every calculation has an explicit mathematical definition. 

- Inputs and outputs use consistent, documented units. 

- Formula implementations can be independently checked. 

- Validation rules prevent invalid or misleading results. 

- Users can understand the assumptions behind each result. 

- Future changes do not silently alter established calculation behavior. 

This document is authoritative for the project's initial calculation definitions. It does not replace a textile testing standard, an approved production procedure, a machine manual, a chemical supplier's instructions, or professional engineering judgment. 

Related project documents: 

- `docs/project_explanation.md` defines the initial calculator scope. 

- `docs/app_workflow.md` defines calculator interaction and result presentation. 

- `docs/app_theme.md` defines the visual treatment of results, errors, and warnings. 

- `docs/technical_specification.md` defines the application architecture, implementation conventions, and testing requirements. 

- `docs/master_prompt.md` defines the overall development workflow and AI-assisted development constraints. 

If a formula or assumption changes, update this reference, the corresponding implementation, its tests, and the displayed explanation together. 

## **2. General calculation conventions** 

### **2.1 Units** 

Use the following base units for the initial calculators unless a calculation explicitly defines another unit. 

**Quantity** Mass of a fabric sample 

**Unit** gram (g) 

Fabric sample dimensions centimetre (cm) Area calculated from centimetre square centimetre (cm²) dimensions Fabric mass per unit area gram per square metre (g/m²) Marker length metre (m) Usable marker width metre (m) Marker and pattern-piece areas square metre (m²) Textile batch mass kilogram (kg) Liquor mass kilogram (kg) Approximate aqueous liquor volume litre (L) Chemical quantity kilogram (kg) or gram (g) Production rate units per hour Operating time hour (h) or second (s), as explicitly specified Cycle time second per unit (s/unit) Production counts whole units Percentages percent (%) A consistent user-selected unit within each data Descriptive measurements set 

A numerical value without a defined unit is not a complete engineering input. 

Do not combine incompatible units. Convert quantities explicitly before applying a formula. Unit labels must remain visible in the interface. 

### **2.2 Percentages** 

A percentage is a value expressed per hundred. 

For a numerical percentage (p): 

[ \text{Fraction}=\frac{p}{100} ] 

For example, 2% is the fraction 0.02. 

Use percentage values consistently in calculation functions and their documentation. If a function receives `2` to mean 2%, it must divide by 100 where the formula requires a fraction. Do not mix percentage values such as 2 with decimal fractions such as 0.02 without an explicit conversion. 

### **2.3 Numerical precision and rounding** 

Perform calculations using unrounded intermediate values. Round only for display, following the documented precision policy. 

For the initial release: 

- Display calculated percentages to two decimal places by default. 

- Display GSM to two decimal places by default. 

- Display calculated fabric lengths and masses to a practical precision appropriate to the input and output units. 

- Keep sufficient internal precision for dependent calculations. 

- Do not use formatted display strings as calculation inputs. 

- Do not imply that additional decimal places establish greater measurement accuracy. 

The above are display defaults, not claims about the precision of a textile test method or the accuracy of a production measurement. 

### **2.4 Input validity** 

Unless a particular calculator specifies otherwise: 

- Required numeric values must be present and finite. 

- Measurements used as divisors must be strictly greater than zero. 

- Quantities that represent counts must be integers. 

- Negative physical dimensions, masses, times, and production counts must be rejected. 

- Invalid arithmetic must not produce a displayed result. 

- Missing data must not silently be treated as zero. 

Each calculator's section below defines its specific validation rules. 

### **2.5 Formula transparency** 

Each result must show or provide access to: 

1. The formula used. 

2. The values substituted into the formula, where useful. 

3. The output unit. 

4. Any assumption that materially affects the result. 

5. Relevant warnings and limitations. 

The interface must display the formula actually implemented, not an alternative textbook formula. 

## **3. Fabric GSM calculator** 

### **3.1 Purpose** 

Calculate fabric mass per unit area from the mass and dimensions of a rectangular fabric sample. 

GSM means grams per square metre (g/m²). It is a mass-per-area quantity, not a thickness measurement. 

### **3.2 Inputs** 

**Input Symbol Unit Validation** Sample mass (m) g Greater than zero Sample length (l) cm Greater than zero Sample width (w) cm Greater than zero 

The input dimensions must describe the same rectangular sample whose mass is entered. 

### **3.3 Formula** 

First calculate the sample area: 

[ A_{\text{cm}^2}=l\times w ] 

Convert square centimetres to square metres: 

[ 1\text{ m}^2=10{,}000\text{ cm}^2 ] 

Then calculate GSM: 

[ \boxed{\text{GSM}=\frac{m}{A_{\text{cm}^2}}\times10{,}000} ] 

Equivalent formula: 

[ \text{GSM}=\frac{m\times10{,}000}{l\times w} ] 

Where: 

- (m) = sample mass in grams. 

- (l) = sample length in centimetres. 

- (w) = sample width in centimetres. 

- (A_{\text{cm}^2}) = rectangular sample area in square centimetres. 

### **3.4 Worked example** 

Given: 

- Sample mass = 9.60 g. 

- Sample length = 20 cm. 

- Sample width = 20 cm. 

Step 1: Calculate area. 

[ 

A=20\times20=400\text{ cm}^2 ] 

Step 2: Calculate GSM. 

[ \text{GSM}=\frac{9.60}{400}\times10{,}000 ] [ \boxed{\text{GSM}=240\text{ g/m}^2} ] 

Expected test result: 240.00 g/m² before any alternative display-precision setting. 

### **3.5 Validation and edge cases** 

- Reject blank, non-finite, zero, or negative mass. 

- Reject blank, non-finite, zero, or negative dimensions. 

- Confirm that the calculated area is positive and finite. 

- Confirm that the final GSM is finite. 

- Do not return a result if the area cannot be calculated validly. 

### **3.6 Interpretation and limitations** 

This calculation determines the mass per unit area implied by the entered mass and dimensions. It does not establish the accuracy of the weighing, dimensional measurement, sample conditioning, or sampling procedure. 

The official ASTM listing for ASTM D3776/D3776M describes multiple methods for determining fabric mass per unit area, with differences in specimen selection and reporting conditions. The formula in this application is not, by itself, a complete implementation of those test methods. 

Reference: ASTM D3776/D3776M — Standard Test Methods for Mass Per Unit Area <u>(Weight) of Fabric.</u> 

The Indian standard IS 1964 also addresses determination of mass per unit area of fabrics. Its current applicability and edition must be verified through the appropriate official BIS source before making a compliance claim. 

Reference document: IS 1964:2001 — Methods for Determination of Mass per Unit Length <u>and Mass per Unit Area of Fabrics.</u> 

The application must not claim compliance with ASTM, BIS, or another standard unless the applicable edition, procedure, and reporting requirements have been verified and implemented. 

## **4. Fabric consumption and marker efficiency** 

The initial fabric calculator contains two distinct calculations: 

1. Marker-based fabric consumption. 

2. Marker efficiency. 

These calculations are related, but one must not be applied as an additional correction to the other without a clearly defined method. 

### **4.1 Marker-based fabric consumption** 

#### **Purpose** 

Estimate fabric length per garment from the length of a marker and the number of garments represented by that marker. 

#### **Inputs** 

**Input Symbol Unit Validation** Marker length (L_m) m Greater than zero Garments represented by marker (N_m) garments Positive integer 

#### **Formula** 

[ \boxed{C_{\text{base}}=\frac{L_m}{N_m}} ] 

Where: 

- (C_{\text{base}}) = base fabric length per garment, in m/garment. 

- (L_m) = marker length, in metres. 

- (N_m) = number of garments represented by the marker. 

The marker length and garment count must refer to the same marker. 

#### **Worked example** 

Given: 

- Marker length = 6.20 m. 

- Garments represented = 5. 

[ 

- C_{\text{base}}=\frac{6.20}{5} ] 

[ 

\boxed{C_{\text{base}}=1.24\text{ m/garment}} ] 

Expected test result: 1.24 m per garment. 

### **4.2 Allowance-adjusted fabric consumption** 

#### **Purpose** 

Calculate an estimated consumption after applying an explicitly entered percentage allowance. 

#### **Input** 

Allowance percentage (a), expressed as a percentage. 

The allowance must be entered by the user. Do not assume a universal allowance for all fabrics, garments, cutting rooms, or production orders. 

#### **Formula** 

[ \boxed{C_{\text{adjusted}}=C_{\text{base}}\times\left(1+\frac{a}{100}\right)} ] 

Where: 

- (C_{\text{base}}) = base consumption in m/garment. 

- (a) = allowance percentage. 

- (C_{\text{adjusted}}) = allowance-adjusted consumption in m/garment. 

For the initial calculator, the allowance must be non-negative. If the project later supports negative adjustments, their meaning and validation requirements must be specified separately. 

#### **Worked example** 

Given: 

- Base consumption = 1.24 m/garment. 

- Allowance = 3%. 

[ 

C_{\text{adjusted}}=1.24\times\left(1+\frac{3}{100}\right) ] 

[ C_{\text{adjusted}}=1.24\times1.03 ] 

[ \boxed{C_{\text{adjusted}}=1.2772\text{ m/garment}} ] 

Display may show 1.28 m/garment, while internal calculations retain 1.2772. 

### **4.3 Length for a dozen garments** 

For a dozen garments: 

[ \boxed{C_{12}=C_{\text{adjusted}}\times12} ] 

Using the previous example: 

[ C_{12}=1.2772\times12 ] 

[ \boxed{C_{12}=15.3264\text{ m per dozen}} ] 

This result uses the allowance-adjusted consumption. If no allowance is applied, use base consumption and identify it accordingly. 

### **4.4 Total order fabric length** 

#### **Inputs** 

- Consumption per garment in m/garment. 

- Order quantity in garments. 

Order quantity must be a non-negative integer. 

#### **Formula** 

[ \boxed{L_{\text{order}}=C_{\text{selected}}\times N_{\text{order}}} ] 

Where (C_{\text{selected}}) is either the base consumption or allowance-adjusted consumption selected by the calculator, and (N_{\text{order}}) is the order quantity. 

Using the previous adjusted consumption example with an order quantity of 100 garments: 

[ L_{\text{order}}=1.2772\times100 ] 

[ 

\boxed{L_{\text{order}}=127.72\text{ m}} ] 

If the order quantity is zero, the total order length is zero. The per-garment consumption calculation remains a separate result. 

The output is a calculated estimate, not a purchase-order recommendation. It does not automatically account for roll ends, fabric defects, shrinkage, cutting loss, width variation, or other unentered production factors. 

### **4.5 Marker efficiency** 

#### **Purpose** 

Calculate the percentage of the marker area occupied by its pattern pieces. 

#### **Inputs** 

|**Input**|**Symbol**|**Uni**|**t**<br>**Validation**|
|---|---|---|---|
|Total area of pattern pieces represented by the marker|(A_p)|m²|Greater than zero|
|Marker length|(L_m)|m|Greater than zero|
|Usable marker width|(W_m)|m|Greater than zero|



The total pattern-piece area must include the pattern pieces represented by the complete marker, not just one garment, unless the marker represents exactly one garment. 

All area and length measurements must describe the same marker and use compatible units. 

#### **Formula** 

Marker area: 

[ A_m=L_m\times W_m ] 

Marker efficiency: 

[ \boxed{\eta_m=\frac{A_p}{A_m}\times100} ] 

Equivalent formula: 

[ \boxed{\eta_m=\frac{A_p}{L_m\times W_m}\times100} ] 

Where: 

- (A_p) = total pattern-piece area. 

- (A_m) = marker area. 

- (L_m) = marker length. 

- (W_m) = usable marker width. 

- (\eta_m) = marker efficiency in percent. 

#### **Worked example** 

Given: 

- Marker length = 6.20 m. 

- Usable marker width = 1.50 m. 

- Total pattern-piece area = 7.75 m². 

Step 1: Calculate marker area. 

[ 

A_m=6.20\times1.50=9.30\text{ m}^2 ] 

Step 2: Calculate marker efficiency. 

[ \eta_m=\frac{7.75}{9.30}\times100 ] 

[ 

\boxed{\eta_m\approx83.33%} ] 

Expected test result: approximately 83.33%. 

The pattern-piece area in this example represents the pieces for all five garments in the marker. It must not be multiplied by five again. 

### **4.6 Marker unused-area percentage** 

If the pattern-piece area and marker area satisfy the validity checks, the unused marker-area percentage may be calculated as: 

[ \boxed{U_m=100-\eta_m} ] 

For the example above: 

[ 

U_m=100-83.333\ldots ] 

[ \boxed{U_m\approx16.67%} 

#### ] 

This describes the geometric area not occupied by the pattern pieces within the marker rectangle. It is not a complete measurement of total fabric loss across cutting, spreading, handling, defects, or order execution. 

### **4.7 Validation and limitations** 

- Marker length and usable width must be positive and finite. 

- The number of garments represented by a marker must be a positive integer. 

- Order quantity must be a non-negative integer. 

- Allowance must be non-negative in the initial implementation. 

- Pattern-piece area must be positive and finite. 

- Pattern-piece area must not exceed marker area for a valid geometric efficiency result. 

- Do not cap a mathematically computed efficiency to hide invalid input. 

- Do not apply marker efficiency as an additional factor to marker-based consumption: marker length already represents the fabric length used by that marker. 

Marker efficiency depends on the marker layout, pattern-piece area, usable width, size ratio, and other marker constraints. The calculation does not optimize marker placement or determine whether a layout is technically suitable for cutting. 

Reference: TextileNotes — Marker Efficiency Formula. 

## **5. Dyeing liquor and recipe quantity** 

### **5.1 Purpose** 

The initial dyeing calculator performs two independent arithmetic operations: 

1. Estimate liquor quantity from textile batch mass and an entered liquor ratio. 

2. Calculate the quantity of a chemical entered as a percentage on weight of fabric (owf). 

It does not select a dye recipe, determine a suitable shade, recommend chemical dosages, or calculate process conditions. 

### **5.2 Liquor ratio convention** 

For this calculator, the input uses the convention: 

#### **1 = 1 unit of textile mass to R equivalent units of liquor mass.** 

The user enters the multiplier (R), not the full text `1:R` . 

The application must explain this convention beside the input. 

### **5.3 Liquor mass** 

#### **Inputs** 

**Input Symbol Unit Validation** Textile batch mass (M_b) kg Greater than zero Liquor-ratio multiplier (R) Dimensionless Greater than zero 

#### **Formula** 

[ \boxed{M_l=M_b\times R} ] 

Where: 

- (M_b) = textile batch mass in kilograms. 

- (R) = entered liquor-ratio multiplier. 

- (M_l) = calculated liquor mass in kilograms. 

#### **Worked example** 

Given: 

- Textile batch mass = 250 kg. 

- Liquor ratio = 1:8. 

[ M_l=250\times8 ] [ \boxed{M_l=2{,}000\text{ kg}} ] 

### **5.4 Approximate liquor volume** 

For an aqueous liquor, the application may estimate volume using the stated approximation: 

[ \rho\approx1\text{ kg/L} ] 

Therefore: 

[ 

\boxed{V_l\approx\frac{M_l}{1\text{ kg/L}}} ] 

When the numerical mass is expressed in kilograms, this approximation gives the same numerical value in litres: 

[ \boxed{V_l\text{ in L}\approx M_l\text{ in kg}} ] 

For the example above: 

[ \boxed{V_l\approx2{,}000\text{ L}} ] 

The result must be labelled as an approximate liquor volume. 

**Important:** This approximation assumes liquor density of approximately 1 kg/L. Actual density may vary with chemical composition, dissolved materials, and temperature. The estimate must not be presented as an exact tank fill volume or a complete machine-loading calculation. 

### **5.5 Chemical quantity at percentage owf** 

#### **Meaning** 

In this calculator, `% owf` means the entered percentage of chemical mass relative to the entered textile batch mass. 

The user supplies the percentage. The application performs the arithmetic and does not determine whether that percentage is appropriate for a particular dye, fibre, process, or shade. 

#### **Inputs** 

**Input Symbol Unit Validation** Textile batch mass (M_b) kg Greater than zero Chemical percentage owf (p) % Non-negative 

#### **Formula** 

Chemical mass in kilograms: 

[ \boxed{M_c=M_b\times\frac{p}{100}} ] 

Chemical mass in grams: 

[ \boxed{M_{c,g}=M_b\times\frac{p}{100}\times1{,}000} ] 

Equivalent simplified formula: 

[ \boxed{M_{c,g}=M_b\times p\times10} ] 

The simplified formula is valid when batch mass is in kilograms and (p) is entered as a percentage value such as 2 for 2%. 

#### **Worked example** 

Given: 

- Textile batch mass = 250 kg. 

- Chemical percentage = 2% owf. 

[ M_c=250\times\frac{2}{100} ] [ \boxed{M_c=5\text{ kg}} ] Convert to grams: [ M_{c,g}=5\times1{,}000 ] [ \boxed{M_{c,g}=5{,}000\text{ g}} ] Expected test results: 5 kg and 5,000 g. 

### **5.6 Validation and limitations** 

- Batch mass must be positive and finite. 

- Liquor-ratio multiplier must be positive and finite. 

- Chemical percentage must be non-negative and finite. 

- A zero chemical percentage is mathematically valid and produces zero chemical quantity. 

- Liquor ratio and percentage owf must be clearly distinguished. 

- Do not treat a percentage owf as a percentage of liquor volume. 

- Do not treat a g/L concentration as a percentage owf. 

- Do not assume that all chemicals in a real process use the same dosing basis. 

- Do not infer chemical strength, commercial concentration, active content, or stocksolution concentration. 

- Do not convert a stock-solution recipe into a chemical mass unless the required concentration and conversion rules are explicitly implemented and verified. 

Reference: ScienceDirect Topics — Dyeing Process, which describes the use of material mass as a basis for expressing dye quantity. Its general explanation supports the distinction between a material-based percentage and a liquor concentration; it does not establish a suitable dosage for any particular process. 

The liquor-ratio convention and approximate volume calculation must be displayed as assumptions. The tool is a calculator, not a dyeing-process recommendation system. 

## **6. Production capacity calculator** 

### **6.1 Purpose** 

Calculate theoretical production output using either: 

- A production rate and operating duration. 

- An available operating duration and a cycle time per unit. 

These are separate calculation modes. Do not combine their inputs or silently subtract downtime. 

### **6.2 Rate-based mode** 

#### **Inputs** 

**Input Symbol Unit Validation** Production rate (r) units/hour Non-negative Operating duration (t_h) hours Non-negative 

The rate and duration must refer to compatible production conditions and the same unit definition. 

#### **Formula** 

[ \boxed{Q_t=r\times t_h} ] 

Where: 

- (r) = production rate in units per hour. 

- (t_h) = operating duration in hours. 

- (Q_t) = theoretical output in units. 

#### **Worked example** 

Given: 

- Production rate = 120 units/hour. 

- Operating duration = 7.5 hours. 

[ Q_t=120\times7.5 ] [ \boxed{Q_t=900\text{ units}} ] 

Expected test result: 900 units. 

### **6.3 Cycle-time mode** 

#### **Inputs** 

**Input Symbol Unit Validation** Available operating duration (t_s) seconds Non-negative Cycle time (c_s) seconds/unit Greater than zero 

Convert operating duration to seconds before applying the formula if it was entered in another unit. 

For hours: 

[ t_s=t_h\times3{,}600 ] 

#### **Formula** 

[ \boxed{Q_t=\frac{t_s}{c_s}} ] 

Where: 

 (t_s) = available operating time in seconds. 

- (c_s) = cycle time in seconds per unit. 

- (Q_t) = theoretical output in units. 

#### **Worked example** 

Given: 

- Operating duration = 7.5 hours. 

- Cycle time = 45 seconds/unit. 

Convert hours to seconds: 

[ t_s=7.5\times3{,}600=27{,}000\text{ s} ] 

Calculate theoretical output: 

[ Q_t=\frac{27{,}000}{45} ] [ \boxed{Q_t=600\text{ units}} ] 

Expected test result: 600 units. 

### **6.4 Theoretical output and whole-unit output** 

Theoretical output is the direct mathematical result of the selected formula. 

If the result is fractional, the application may additionally display a whole-unit output using the floor operation: 

[ \boxed{Q_{\text{whole}}=\lfloor Q_t\rfloor} ] 

For example, 10.8 theoretical units corresponds to 10 complete units under this simple wholecycle interpretation. 

The whole-unit result is a mathematical estimate, not a prediction of actual production. Do not round a theoretical result upward and imply that a partially completed unit is finished. 

If theoretical output is exactly an integer, the whole-unit result is the same integer. 

### **6.5 Validation and limitations** 

- Production rate must be finite and non-negative. 

- Operating duration must be finite and non-negative. 

- Cycle time must be finite and strictly positive. 

- Negative output is invalid. 

- A zero rate or zero operating duration produces zero theoretical output. 

- Reject non-finite results. 

- Identify the time basis used. 

- Do not assume that rated speed equals sustainable actual production. 

- Do not automatically account for downtime, operator availability, material shortages, defects, changeovers, or line balancing. 

The calculator does not predict actual factory output unless the user provides a rate or time basis that appropriately represents the conditions being estimated. 

## **7. Production efficiency calculator** 

### **7.1 Purpose** 

Calculate the ratio of actual production to expected production. 

The term _production efficiency_ is used differently across organizations and production systems. This project implements a generic ratio and does not claim that it is a universal or standard-specific efficiency measure. 

### **7.2 Inputs** 

**Input Symbol Unit Validation** Actual production (Q_a) Units Non-negative Expected production (Q_e) Units Greater than zero 

Both quantities must use comparable units and cover the same production period and scope. 

### **7.3 Formula** 

[ \boxed{E_p=\frac{Q_a}{Q_e}\times100} ] 

Where: 

- (Q_a) = actual production. 

- (Q_e) = expected production. 

- (E_p) = calculated production efficiency in percent. 

### **7.4 Worked example** 

Given: 

- Actual production = 850 units. 

- Expected production = 800 units. 

[ 

E_p=\frac{850}{800}\times100 ] 

[ 

\boxed{E_p=106.25%} ] 

Expected test result: 106.25%. 

### **7.5 Validation and interpretation** 

- Actual production must be finite and non-negative. 

- Expected production must be finite and greater than zero. 

- Reject incompatible units or periods. 

- Do not cap the result at 100%. 

- A result greater than 100% is mathematically valid. 

- Do not invent an expected production target. 

- Clearly explain that the result depends on the user-supplied expected quantity. 

A result above 100% means actual production exceeded the entered expected quantity. It does not independently establish that the production target was appropriate or that the process was efficient by another organizational definition. 

## **8. Overall Equipment Effectiveness (OEE) calculator** 

### **8.1 Purpose** 

Calculate Availability, Performance, Quality, and Overall Equipment Effectiveness using user-provided production and time data. 

OEE combines three factors. Each factor describes a different relationship between planned production, operating time, output, and acceptable output. 

This implementation uses the conventional relationship: 

[ 

\boxed{\text{OEE}=\text{Availability}\times\text{Performance}\times\text{Quality}} ] 

When all three factors are expressed as percentages, divide their product by 10,000 to obtain OEE as a percentage. 

Reference: OEE.com — OEE Calculation: Definitions, Formulas, and Examples. 

### **8.2 Inputs** 

|**Input**|**Symbo**|**l**<br>**Unit**|**Validation**|
|---|---|---|---|
|Planned production<br>time|(T_p)|Seconds|Greater than zero|
|Included downtime|(T_d)|Seconds|Non-negative and no greater than planned time|
|Ideal cycle time|(T_i)|Seconds/un|it Greater than zero|



|Total units produced|(Q_t)|Units|Non-negative integer|
|---|---|---|---|
|Good units produced|(Q_g)|Units|Non-negative integer and no greater than total<br>units|



Planned production time and included downtime must use the same time unit. Convert them to a common unit before calculating run time. 

Ideal cycle time must be expressed in seconds per unit if the calculation function uses seconds for time. 

The definition of downtime included in the calculation must be visible to the user. Do not silently include or exclude particular downtime categories. 

### **8.3 Run time** 

[ \boxed{T_r=T_p-T_d} ] 

Where: 

- (T_p) = planned production time. 

- (T_d) = included downtime. 

- (T_r) = calculated run time. 

Run time cannot be negative. 

If downtime equals planned production time, run time is zero. In that situation, Availability can be calculated as zero, but Performance cannot be calculated by dividing by run time. 

### **8.4 Availability** 

Availability is the percentage of planned production time during which the process was running. 

[ \boxed{A_v=\frac{T_r}{T_p}\times100} ] 

Where: 

- (A_v) = Availability percentage. 

- (T_r) = run time. 

- (T_p) = planned production time. 

Because planned production time must be greater than zero and run time cannot be negative or exceed planned time, Availability should lie between 0% and 100% under these input rules. 

### **8.5 Performance** 

Performance compares the ideal time required for the recorded total output with the calculated run time. 

[ \boxed{P_f=\frac{T_i\times Q_t}{T_r}\times100} ] 

Where: 

- (P_f) = Performance percentage. 

- (T_i) = ideal cycle time in seconds per unit. 

- (Q_t) = total units produced. 

- (T_r) = run time in seconds. 

The product (T_i\times Q_t) has units of seconds. The ratio is therefore dimensionless. 

Performance cannot be calculated when run time is zero. 

Performance above 100% must not be automatically capped. It should generate a warning that the ideal cycle time, time basis, unit count, or underlying assumptions may need review. 

A value above 100% is a signal to investigate the inputs or the definition of the ideal cycle time; it is not permission for the application to modify the data. 

### **8.6 Quality** 

[ \boxed{Q_f=\frac{Q_g}{Q_t}\times100} ] 

Where: 

- (Q_f) = Quality percentage. 

- (Q_g) = good units produced. 

- (Q_t) = total units produced. 

The calculation requires total units greater than zero. 

If total units are zero, Quality is undefined for this input set and must not be calculated through division by zero. 

Good units cannot exceed total units. 

### **8.7 OEE** 

When Availability, Performance, and Quality are available: 

[ 

\boxed{\text{OEE}=\frac{A_v\times P_f\times Q_f}{10{,}000}} ] 

Here, (A_v), (P_f), and (Q_f) are percentage values, such as 90 rather than 0.90. 

An equivalent formula using decimal fractions is: 

[ \text{OEE}=A_d\times P_d\times Q_d ] 

Where (A_d), (P_d), and (Q_d) are decimal fractions. If the result is to be displayed as a percentage, multiply the decimal result by 100. 

Do not mix the percentage and decimal-fraction forms within the same calculation. 

### **8.8 Worked example** 

Use the following reference data: 

- Planned production time = 420 minutes. 

- Included downtime = 47 minutes. 

- Ideal cycle time = 1 second/unit. 

- Total units produced = 19,271. 

- Good units produced = 18,848. 

Convert time to seconds: 

[ T_p=420\times60=25{,}200\text{ s} ] 

[ T_d=47\times60=2{,}820\text{ s} ] 

Calculate run time: 

[ T_r=25{,}200-2{,}820 ] [ T_r=22{,}380\text{ s} ] 

Calculate Availability: 

[ A_v=\frac{22{,}380}{25{,}200}\times100 ] [ \boxed{A_v\approx88.81%} ] Calculate Performance: [ P_f=\frac{1\times19{,}271}{22{,}380}\times100 ] [ \boxed{P_f\approx86.10%} ] Calculate Quality: [ Q_f=\frac{18{,}848}{19{,}271}\times100 ] [ \boxed{Q_f\approx97.81%} ] 

Calculate OEE using the unrounded factor values: 

[ \text{OEE}=\frac{A_v\times P_f\times Q_f}{10{,}000} ] [ \boxed{\text{OEE}\approx74.79%} ] 

Small differences in the last displayed decimal may arise from display rounding. Tests must compare against independently calculated values using an appropriate numerical tolerance. 

### **8.9 OEE validation and undefined results** 

Apply these rules: 

- Planned production time must be greater than zero. 

- Included downtime must be between zero and planned production time, inclusive. 

- Run time must not be negative. 

- Ideal cycle time must be greater than zero. 

- Total units and good units must be non-negative integers. 

- Good units must not exceed total units. 

- Availability must not be calculated with a zero planned-time denominator. 

- Performance must not be calculated with zero run time. 

- Quality must not be calculated with zero total units. 

- OEE must not be presented as a complete result when a required factor is undefined. 

- Non-finite intermediate and final results must be rejected. 

If planned time equals downtime, the calculator may show Availability as 0% but must mark Performance, Quality where undefined, and OEE appropriately unavailable. It must not present a fabricated zero for a factor that could not be calculated. 

If total units are zero while run time is positive, Performance evaluates to 0% under the formula, but Quality remains undefined because its denominator is zero. The application must not claim a complete OEE result for this case. 

### **8.10 Interpretation and limitations** 

OEE is sensitive to the definitions of planned production time, included downtime, ideal cycle time, total units, and good units. 

Before comparing OEE values across machines, shifts, lines, or organizations, confirm that the definitions and collection methods are consistent. 

The calculator does not automatically determine: 

- Which downtime categories should be included. 

- What ideal cycle time a machine or process should achieve. 

- Whether a recorded unit meets a customer's quality requirements. 

- Whether a production record is accurate. 

- The causes of a low OEE result. 

It is a calculation utility, not a machine-monitoring system, production database, or processdiagnostic tool. 

## **9. Basic quality utilities** 

The initial quality group contains a defect-percentage calculation and basic descriptive statistics. It is not a statistical process control package. 

### **9.1 Defect percentage** 

#### **Inputs** 

**Input Symbol Unit Validation** Defective units (D) Units Non-negative integer Inspected units (N) Units Positive integer 

For this initial calculation, the input is the number of defective units, not the number of individual defects. If one inspected unit has multiple defects, do not count it multiple times unless a separate defect-count metric is explicitly defined. 

#### **Formula** 

[ \boxed{D_p=\frac{D}{N}\times100} ] 

Where: 

- (D) = defective units. 

- (N) = inspected units. 

- (D_p) = percentage of inspected units that are defective. 

#### **Worked example** 

Given: 

- Defective units = 12. 

- Inspected units = 600. 

[ D_p=\frac{12}{600}\times100 ] [ \boxed{D_p=2.00%} ] 

Expected test result: 2.00%. 

#### **Validation** 

- Defective units must be a non-negative integer. 

- Inspected units must be a positive integer. 

- Defective units must not exceed inspected units. 

- A zero inspected count must be rejected because the percentage is undefined. 

- Do not confuse defective-unit percentage with defects per unit or defects per hundred units. 

### **9.2 Arithmetic mean** 

#### **Purpose** 

Calculate the arithmetic mean of a list of measurements expressed in the same unit. 

For (n) measurements (x_1,x_2,\ldots,x_n): 

[ \boxed{\bar{x}=\frac{\sum_{i=1}^{n}x_i}{n}} ] 

Where: 

- (x_i) = an individual measurement. 

- (n) = number of measurements. 

- (\bar{x}) = arithmetic mean. 

#### **Worked example** 

Measurements: 

12, 15, 18 Sum: [ 12+15+18=45 ] 

Mean: 

[ \bar{x}=\frac{45}{3} ] [ \boxed{\bar{x}=15} ] 

The output unit is the same as the input measurement unit. 

#### **Validation** 

- Require at least two measurements for the initial implementation. 

- Reject blank or non-finite measurements. 

- Require a consistent unit for all measurements in the same set. 

- Reject a result that is not finite. 

- Do not silently remove invalid values from the set. 

The initial application does not automatically identify or exclude outliers. 

### **9.3 Minimum and maximum** 

For a non-empty set of measurements: 

[ \boxed{x_{\min}=\min(x_1,x_2,\ldots,x_n)} ] [ \boxed{x_{\max}=\max(x_1,x_2,\ldots,x_n)} ] For the example set 12, 15, 18: [ \boxed{x_{\min}=12} ] [ \boxed{x_{\max}=18} ] 

The minimum and maximum retain the input unit. 

The initial interface should use the same minimum of two valid measurements as the other descriptive-statistics utilities. 

### **9.4 Range** 

Range is the difference between the maximum and minimum values. 

[ \boxed{R_x=x_{\max}-x_{\min}} ] For the example set: [ R_x=18-12 ] [ \boxed{R_x=6} ] 

The range has the same unit as the measurements. 

A range of zero is valid when all measurements are equal. 

### **9.5 Interpretation and limitations** 

The mean, minimum, maximum, and range are descriptive statistics. They do not independently determine whether a textile product meets a specification. 

The initial quality tools do not implement: 

- Control charts. 

- Process capability indices. 

- Sampling plans. 

- Acceptance sampling. 

- Confidence intervals. 

- Automatic outlier handling. 

- Defect classification. 

- Customer-specific acceptance criteria. 

Such features require separate definitions, assumptions, and tests before they can be added. 

## **10. Cross-calculator validation matrix** 

The following matrix summarizes the most important input rules for implementation and regression testing. 

|**Calculator**|**Must be**<br>**positive**|**May be zero**|**Must be**<br>**integer**|**Important**<br>**relationship**|
|---|---|---|---|---|
|Fabric GSM|Mass, length,<br>width|None of these|No|Area must be finite<br>and positive|
|Fabric<br>consumption|Marker length,<br>marker garment<br>count|Order quantity,<br>allowance|Garment count<br>and order<br>quantity|Allowance must be<br>non-negative|
|Marker<br>efficiency|Marker length,<br>width, pattern<br>area|None of these|No|Pattern area must not<br>exceed marker area|
|Dyeing liquor|Batch mass,<br>ratio multiplier|<sup>None of these</sup>|No|Volume is<br>approximate|
|Chemical<br>quantity, % owf|<sup>Batch mass</sup>|Chemical<br>percentage|No|Percentage is a<br>percentage of textile<br>mass|
|Production<br>capacity, rate<br>mode|None required<br>beyond finite<br>values|Rate, operating<br>duration|No|Rate and duration<br>must be compatible|
|Production||||Time and cycle time|
|capacity, cycle<br>mode|Cycle time|Operating duration|No|must use compatible<br>units|
|Production<br>efficiency|Expected<br>production|Actual production|No|Actual and expected<br>quantities must be<br>comparable|
|OEE|Planned time,<br>ideal cycle time|Downtime, total<br>count, good count|Production<br>counts|Downtime ≤ planned<br>time; good count ≤<br>total count|
|Defect<br>percentage|Inspected count|Defective count|Both counts|Defective count ≤<br>inspected count|
|Descriptive|No individual|Individual|No|At least two finite,|



|statistics|value must be<br>positive|measurements may<br>be zero|same-unit<br>measurements|
|---|---|---|---|



All inputs and calculated outputs must be finite. A positive requirement does not permit positive infinity. A non-negative requirement does not permit `NaN` . 

## **11. Recommended independent reference tests** 

These examples are intended to become regression tests. They are reference expectations calculated from the formulas in this document; they are not claims that an implementation has already passed them. 

|**Calculator**|**Input summary**|**Expected result**|
|---|---|---|
|Fabric GSM|9.60 g; 20 cm × 20 cm|240.00 g/m²|
|Fabric consumption|6.20 m marker; 5 garments|1.24 m/garment|
|Allowance-adjusted<br>consumption|1.24 m/garment; 3% allowance|1.2772 m/garment|
|Length per dozen|1.2772 m/garment|15.3264 m/dozen|
|Total order length|1.2772 m/garment; 100 garments|127.72 m|
|Marker efficiency|7.75 m² pattern area; 6.20 m × 1.50 m marker|<sup>Approximately</sup><br>83.33%|
|Marker unused area|Marker efficiency approximately 83.33%|Approximately<br>16.67%|
|Liquor mass|250 kg batch; 1:8 liquor ratio|2,000 kg|
|Approximate liquor<br>volume|2,000 kg liquor; assumed density 1 kg/L|Approximately<br>2,000 L|
|Chemical quantity|250 kg batch; 2% owf|5 kg or 5,000 g|
|Production capacity, rate<br>mode|120 units/hour; 7.5 hours|900 units|
|Production capacity,<br>cycle-time mode|7.5 hours; 45 seconds/unit|600 units|
|Production efficiency|850 actual; 800 expected|106.25%|
|OEE|420 min planned; 47 min downtime; 1 s/unit;<br>19,271 total; 18,848 good|<br>Approximately<br>74.79%|
|Defect percentage|12 defective; 600 inspected|2.00%|
|Mean|12, 15, 18|15|
|Minimum|12, 15, 18|12|
|Maximum|12, 15, 18|18|
|Range|12, 15, 18|6|



For floating-point results, use a suitable numerical tolerance in automated tests. The tolerance must be small enough to detect incorrect formulas, unit conversions, and percentage handling. 

## **12. Required invalid-input tests** 

Each calculator must include tests for its own invalid and boundary conditions. At minimum, test the following cases. 

### **Fabric GSM** 

- Missing mass. 

- Zero mass. 

- Negative mass. 

- Zero length. 

- Negative width. 

- Non-finite values. 

- Non-finite final calculation, if an extreme input can produce one. 

### **Fabric consumption and marker efficiency** 

- Zero marker length. 

- Zero garments represented. 

- Fractional garment count. 

- Negative allowance. 

- Zero order quantity. 

- Zero usable marker width. 

- Zero pattern-piece area. 

- Pattern-piece area greater than marker area. 

- Mismatched units or pattern area for a different marker. 

### **Dyeing** 

- Zero batch mass. 

- Zero liquor-ratio multiplier. 

- Negative chemical percentage. 

- Zero chemical percentage. 

- Extremely large values that produce non-finite results. 

- Confusing percentage owf with a g/L concentration. 

### **Production capacity** 

- Zero production rate. 

- Zero operating time. 

- Zero cycle time. 

- Negative values. 

- Fractional theoretical output. 

- Very large values that produce non-finite results. 

### **Production efficiency** 

- Zero expected production. 

- Zero actual production. 

- Actual production greater than expected production. 

- Negative values. 

- Incompatible quantities or periods. 

### **OEE** 

- Zero planned production time. 

- Downtime greater than planned time. 

- Downtime equal to planned time. 

- Zero ideal cycle time. 

- Zero total count. 

- Good count greater than total count. 

- Performance greater than 100%. 

- Negative counts or time. 

- Undefined factor and OEE behavior. 

### **Quality** 

- Zero inspected units. 

- Defective count greater than inspected count. 

- Negative counts. 

- Empty measurement list. 

- One measurement only. 

- Non-finite measurement. 

- Mixed units. 

- Equal measurements producing a valid zero range. 

Tests must assert not only that invalid input is rejected, but also that the user interface does not show a misleading previous result as though it belongs to the invalid input. 

## **13. Formula implementation and maintenance rules** 

For every calculation: 

1. Keep the mathematical function separate from the user interface. 

2. Define parameter units and output units in its types or documentation. 

3. Validate inputs before performing arithmetic. 

4. Check denominators and calculated values. 

5. Avoid rounding intermediate values. 

6. Display the formula and assumptions consistently with the implementation. 

7. Add a normal reference test and relevant edge-case tests. 

8. Update this document when the formula or assumptions change. 

A calculation function must not depend on React state, the browser, a remote service, or hidden application defaults. 

Do not replace a formula with an approximate shortcut unless the shortcut is mathematically equivalent under the documented units and assumptions. If an approximation is necessary, state the approximation and its effect on the result. 

Do not make a formula change solely to reproduce a preferred business result. Investigate the inputs, units, definition, and supporting reference first. 

## **14. Domain limitations and unresolved questions** 

The following boundaries remain important even when the arithmetic is correct. 

### **14.1 Fabric GSM** 

The formula calculates mass per area. Sampling method, conditioning, specimen dimensions, weighing accuracy, selvage treatment, and reporting conventions may affect a real test result. Any standard-specific implementation requires verification against the applicable standard edition. 

### **14.2 Fabric consumption** 

Marker-based consumption depends on the marker and the garments represented by it. Allowances are user-provided. Roll-end losses, defects, shrinkage, size mixes, width changes, and cutting practices are not automatically included. 

### **14.3 Dyeing** 

The calculator does not decide whether a liquor ratio or chemical percentage is appropriate. The basis of textile mass, liquor density, chemical concentration, commercial strength, process chemistry, and equipment conditions may require additional information in real production. 

### **14.4 Production capacity and efficiency** 

The meaning of a production rate, expected quantity, cycle time, and operating duration depends on the machine, process, product, and reporting period. The application does not establish the correct target or predict actual production without adequate input data. 

### **14.5 OEE** 

The calculation depends on consistent definitions of planned production time, downtime, ideal cycle time, total output, and good output. Comparisons are meaningful only when the underlying definitions and data collection methods are comparable. 

### **14.6 Quality statistics** 

Simple averages and ranges do not establish process stability, capability, compliance, or acceptance. Those conclusions require appropriate methods and verified criteria. 

### **14.7 User research and local practices** 

The project's relevance to textile users in Tiruppur, Tamil Nadu, is a product objective, not evidence that any particular formula, allowance, machine convention, or production practice 

is universal. Industry-specific requirements must be verified before they become application defaults. 

When an unresolved question affects calculation correctness, do not silently choose an unsupported value. Keep the relevant input explicit, display the limitation, and defer any feature that cannot yet be specified reliably. 

## **15. Technical references** 

The following sources support the formulas or boundaries discussed in this document. General educational resources are useful for understanding a calculation but do not replace official standards or an approved process specification. 

1. **ASTM International — ASTM D3776/D3776M, Standard Test Methods for Mass Per Unit Area (Weight) of Fabric.** Official listing describing the scope and options for fabric mass-per-area measurement. <u>https://store.astm.org/d3776_d3776m-20r25.html</u> 

2. **Bureau of Indian Standards document reference — IS 1964:2001, Methods for Determination of Mass per Unit Length and Mass per Unit Area of Fabrics.** The current edition and applicability must be confirmed through an appropriate official BIS source before claiming compliance. 

   - <u>https://law.resource.org/pub/in/bis/S12/is.1964.2001.pdf</u> 

3. **OEE.com — OEE Calculation: Definitions, Formulas, and Examples.** Reference for the Availability, Performance, Quality, and OEE relationships. <u>https://www.oee.com/calculating-oee/</u> 

4. **TextileNotes — Marker Efficiency Formula.** Educational reference for patternpiece area divided by marker area. Use it as a formula explanation, not as a substitute for a specific cutting-room specification. 

   - <u>https://textilenotes.com/formulas/marker-efficiency</u> 

5. **ScienceDirect Topics — Dyeing Process.** General educational reference discussing dye quantity expressed relative to the weight of textile material. It does not establish a suitable recipe or dosage for a particular process. 

   - <u>https://www.sciencedirect.com/topics/engineering/dyeing-process</u> 

Reference pages may change. Recheck the source and applicable edition before introducing standards-based functionality or making compliance claims. 

## **16. Release requirement** 

A calculator is ready for release only when: 

- Its formula is defined in this document. 

- Inputs, units, assumptions, and output meanings are explicit. 

- Validation prevents invalid or misleading results. 

- At least one normal example has been independently checked. 

- Boundary and invalid-input tests are implemented and passing. 

- The interface displays the correct formula and relevant limitations. 

- The implemented behavior matches the documentation. 

- Any domain-specific claim has appropriate supporting evidence. 

This reference is a living technical document. Keep it aligned with the code and tests throughout the project workflow: 

**TARGET → SPECIFY → BUILD → TEST → VERIFY → IMPROVE → RELEASE** 

