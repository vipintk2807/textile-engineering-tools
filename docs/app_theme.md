# **Application Theme** 

## **1. Purpose** 

This document defines the visual design system for `textile-engineering-tools` , an opensource collection of practical textile engineering calculators. 

The interface must prioritise calculation accuracy, readability, predictable interaction, and ease of use. Users should be able to enter measurements, understand the units, calculate results, and verify the formulas without navigating through unnecessary screens. 

The design will use a restrained technical appearance appropriate for engineering utilities. It will avoid decorative dashboards, artificial factory statistics, excessive animation, and visual elements that do not improve the calculation workflow. 

This document defines the theme, typography, layout, components, interaction states, responsiveness, and accessibility requirements. Calculator-specific functionality and navigation are defined in `docs/app_workflow.md` . Formula definitions, input conventions, and calculation assumptions belong in `docs/textile_calculation_reference.md` . 

## **2. Design Principles** 

The application will follow these principles. 

### **2.1 Calculation-first interface** 

The input fields, Calculate action, and primary result must be the most prominent elements on each calculator screen. 

Users should not have to search through charts, cards, or decorative content to find the result. 

### **2.2 Explicit units** 

Units must be visible beside or within the relevant field labels. A value such as `250` must never be presented without enough context to establish whether it represents grams, centimetres, seconds, kilograms, or another quantity. 

Output units must appear directly beside the corresponding result. 

### **2.3 Transparent results** 

The primary result must be visually distinct from supporting information. Formulas, intermediate values, assumptions, and warnings must remain accessible without overwhelming the main calculation. 

### **2.4 Consistency** 

All calculators will share the same field styles, buttons, validation behaviour, result presentation, spacing rules, and interaction patterns. 

A user who learns to use the GSM Calculator should be able to understand the input and result sections of the OEE Calculator without learning a new interface convention. 

### **2.5 Practical simplicity** 

The application will use ordinary interface components and a small number of reusable design patterns. It will not require a component library, charting library, animation framework, or visualisation package unless an implemented feature genuinely needs one. 

### **2.6 Honest presentation** 

The interface must distinguish a mathematical result from an estimate, an assumption, or an engineering recommendation. It must not make unverified calculations appear authoritative through colours, badges, charts, or confidence indicators. 

## **3. Visual Identity** 

The visual identity will use a light, neutral background with dark blue navigation and a restrained blue accent for primary actions. 

The overall appearance should resemble a practical engineering reference tool rather than an enterprise management dashboard. 

The design will use: 

- A light neutral page background. 

- White calculator surfaces. 

- Dark navy headings and navigation. 

- Blue primary actions and focus indicators. 

- Neutral borders and dividers. 

- Clear dark text for measurements and results. 

- Restrained warning and error colours for validation and engineering cautions. 

Large gradients, glass effects, decorative illustrations, excessive shadows, animated backgrounds, and unnecessary colour variations will not be used. 

## **4. Colour Palette** 

The following colour values define the initial theme. They should be implemented as central design tokens rather than repeated as unrelated hard-coded values throughout the application. 

|**Token**|**Colour**|**Hex**|**Usage**|
|---|---|---|---|
|Primary|Deep blue|<sup>`#1D4ED8`</sup>|<sup>Primary buttons, active navigation indicators,</sup><br>interactive links|
|Primary hover|Darker|`#1E40AF`|Hover state for primary actions|



||blue||
|---|---|---|
|Navigation|Dark navy|<sup>`#172554` </sup>Desktop sidebar and selected navigation surfaces|
|Page background|Light grey|<sup>`#F8FAFC` </sup>Main application background|
|Surface|White|`#FFFFFF`Calculator panels, forms, and result surfaces|
|Main text|Dark slate|<sup>`#0F172A` </sup>Headings, primary labels, and important values|
|Secondary text|Slate|`#475569`Supporting descriptions, units, and explanatory text|
|Muted text|Slate grey|<sup>`#64748B` </sup>Secondary metadata and non-critical helper text|
|Border|Light slate|<sup>`#E2E8F0` </sup>Input borders, card borders, and dividers|
|Input background|White|`#FFFFFF`Editable fields|
|Focus indicator|Blue|`#2563EB`Keyboard focus outline|
|Success|Dark green|<sup>`#166534` </sup>Confirmed successful actions or operations|
|Success<br>background|Pale green|<sup>`#F0FDF4` </sup>Non-prominent success messages|
|Warning|Dark<br>amber|`#92400E`Engineering warnings and review notices|
|Warning<br>background|Pale amber|<sup>`#FFFBEB` </sup>Warning panels|
|Error|Dark red|`#B91C1C`Validation errors and failed operations|
|Error background|Pale red|`#FEF2F2`Error messages and error panels|



### **4.1 Colour usage rules** 

- 

- 

- 

   - Primary blue must identify the main action, not every clickable element. 

   - Dark navy should be reserved for navigation and selected structural elements. 

   - Result values must remain readable in dark text on a light surface. 

- Warning colours must identify a condition that deserves review, not decorate ordinary results. 

- 

- 

- 

- Error colours must be accompanied by a clear text explanation. 

- Success colours must not be used to imply that a calculated engineering result is correct for every real-world process. 

- Disabled controls must remain legible and distinguishable from active controls. 

Colour must never be the only means of communicating an error, warning, selection, or status. 

## **5. Typography** 

The application will use a system sans-serif font stack to avoid unnecessary font downloads and preserve offline operation. 

Recommended font stack: 

```
"Segoe UI", Arial, sans-serif
```

The interface will use a clear typographic hierarchy. 

**Element Desktop size Weight Purpose** Application name 20 px 600 Header identity 

|Page title|26 px|600|Calculator or category heading|
|---|---|---|---|
|Section heading|18 px|600|Input and result sections|
|Card title|16 px|600|Calculator links and panels|
|Body text|14–16 px|400|Descriptions and explanations|
|Field label|14 px|500|Input identification|
|Helper text|13 px|400|Units, examples, and input guidance|
|Primary result|28–36 px|600|Main numerical output|
|Supporting result|15–18 px|500|Intermediate values|
|Formula text|14 px|400|Calculation method|



On narrow screens, page titles may reduce to approximately 22–24 px and primary results to approximately 26–30 px. 

These are initial design values, not rigid limits. Actual rendering must be checked on supported desktop and mobile widths. 

### **5.1 Numerical presentation** 

Numerical outputs must be easy to distinguish from explanatory text. 

- Use tabular numerals where supported for values that users compare. 

- Keep the output unit visually adjacent to the number. 

- Avoid excessive decimal places. 

- Apply the precision and rounding rules established in the calculation reference. 

- Do not round intermediate values prematurely when doing so could materially change the final result. 

- Use consistent decimal separators and number formatting within the application. 

The theme document does not establish the engineering precision of individual calculators. Those decisions belong in the calculation reference. 

## **6. Layout and Spacing** 

The application will use a consistent spacing scale based on multiples of four pixels. 

**Token Size Typical use** `space-1` 4 px Small internal gaps `space-2` 8 px Label-to-helper spacing `space-3` 12 px Compact component spacing `space-4` 16 px Standard field and section spacing `space-5` 20 px Panel internal spacing `space-6` 24 px Separation between related sections `space-8` 32 px Major section separation `space-10` 40 px Large page-level separation 

### **6.1 Application shell** 

On desktop, the application will use: 

- A fixed-width or width-constrained left sidebar of approximately 240 px. 

- A main content area that uses the remaining available width. 

- A content maximum width of approximately 1200 px. 

- Page padding of approximately 32 px on wide screens. 

- Page padding of approximately 20–24 px on medium screens. 

- Page padding of approximately 16 px on narrow screens. 

The sidebar must not consume excessive horizontal space on smaller displays. 

### **6.2 Calculator page layout** 

A calculator page will follow this hierarchy: 

1. Breadcrumb or category link. 

2. Page title and brief description. 

3. Input section. 

4. Calculate and Reset actions. 

5. Result section. 

6. Formula and assumptions. 

7. Relevant warnings or limitations. 

The main input and result sections may appear side by side on wide screens when this improves the workflow. On narrower screens, they must stack vertically. 

The primary result must remain visually close to the inputs and calculation action. 

### **6.3 Calculator category layout** 

The home screen and category screens will use a responsive grid of calculator cards. 

Each card will contain: 

- Calculator title. 

- One-sentence description. 

- A text link or clearly identifiable navigation action. 

Cards must have consistent internal spacing and alignment. Icons are optional and should only be added when they improve identification. 

The application will not use charts, KPI tiles, production metrics, or simulated activity summaries on the home screen. 

## **7. Navigation Design** 

### **7.1 Desktop navigation** 

The sidebar will use a dark navy background with high-contrast text. 

Navigation items will have: 

- A consistent row height of approximately 40–44 px. 

- A visible hover state. 

- A distinct active state. 

- A clear keyboard focus indicator. 

- Sufficient spacing between interactive items. 

The active navigation item may use a lighter navy surface and a blue accent indicator. Active state must not depend on colour alone. 

### **7.2 Mobile navigation** 

On smaller screens, the sidebar will become a compact navigation drawer or menu. 

The navigation control must: 

- Have an accessible name. 

- Be keyboard operable. 

- Indicate whether the menu is expanded. 

- Allow users to close the menu. 

- Avoid obscuring the active calculator's main action or results unnecessarily. 

### **7.3 Breadcrumbs** 

Breadcrumbs will use small, muted text with clearly distinguishable interactive links. 

The current page will be identified as the final breadcrumb item and will not be styled as an active link unless it is actually interactive. 

## **8. Reusable Interface Components** 

The application will implement a small, consistent set of reusable components. Component behaviour must be shared wherever the same interaction occurs across calculators. 

### **8.1 Buttons** 

The application will use three button styles. 

#### **Primary button** 

- Blue background. 

- White text. 

- Medium font weight. 

- Used for the main `Calculate` action. 

#### **Secondary button** 

- White or neutral background. 

- Dark text. 

- Neutral border. 

- Used for `Reset` and other secondary actions. 

#### **Text button** 

- Transparent background. 

- Primary-colour text. 

- Used for lower-emphasis actions such as opening a help section. 

Buttons will have a minimum height of approximately 40 px, with 44 px preferred for frequently used touch controls. 

Button labels must describe the action. Icon-only buttons must have accessible names and must not replace a clear text action when space permits. 

Hover, focus, pressed, and disabled states must be implemented consistently. 

### **8.2 Input fields** 

Numeric inputs will use a white background, neutral border, and readable text. 

Each input component must support: 

- A visible label. 

- An appropriate numeric input type. 

- A unit indicator or adjacent unit selector when needed. 

- Helper text where an input convention needs explanation. 

- A visible focus state. 

- An error state with an explanatory message. 

- Clear handling of missing or invalid values. 

Placeholders may provide examples, but they must not replace labels. 

Inputs must not silently change the user's entered value or unit without clear feedback. 

### **8.3 Unit selectors** 

Where multiple units are supported, the unit selector will appear adjacent to the relevant input. 

The interface will clearly distinguish the numeric value from the selected unit. Unit conversion must be performed by the calculation layer, not by visually relabelling a value. 

Only supported units will be selectable. The application must not imply that a unit is supported merely because it can be typed into a field. 

### **8.4 Calculator panels** 

Calculator panels will use white surfaces, neutral borders, and consistent internal spacing. 

Recommended defaults: 

- Border radius: 8 px. 

- Border: 1 px solid the border token. 

- Internal padding: 20–24 px. 

- No shadow by default. 

- Clear separation between input, result, and explanatory sections. 

Shadows may be used sparingly when they establish a genuine layer or overlay. Ordinary calculator cards should rely on spacing and borders. 

### **8.5 Result panel** 

The result panel is one of the most important reusable components. 

It will contain: 

- A clear result heading. 

- The primary numerical result. 

- The output unit. 

- Supporting results or intermediate values when relevant. 

- Formula and assumption details in a separate section. 

The primary result may use a subtly tinted neutral surface, but it must not be styled as a success message solely because the arithmetic completed. 

A valid calculation can produce an undesirable, unexpected, or operationally questionable value. The interface must distinguish calculation success from engineering interpretation. 

### **8.6 Formula and assumption section** 

The formula section will present calculation methods in readable text or mathematical notation. 

It will use: 

- A short heading such as `Formula` . 

- A readable expression. 

- A brief explanation of the variables. 

- Relevant units and assumptions. 

- A source reference where applicable. 

Long explanations should be collapsible when they would otherwise distract from routine calculations. Essential warnings and input conventions must remain visible when they affect safe or correct interpretation. 

### **8.7 Warning and error panels** 

Warnings and errors will use distinct visual treatments. 

#### **Validation error** 

Indicates that a calculation cannot proceed because an input is missing or invalid. 

#### **Engineering warning** 

Indicates that a result is mathematically available but deserves review because of an assumption, inconsistent input, or unusual result. 

#### **General operation error** 

Indicates that an application operation failed and the user may need to retry. 

Each message must explain the issue in plain language and identify the corrective action when known. 

The application must not show a generic success message when calculation validation fails. 

### **8.8 Information notes** 

Small information notes may explain: 

- Input conventions. 

- Unit assumptions. 

- Density assumptions. 

- The meaning of a percentage. 

- Limitations of a particular calculation. 

These notes should remain short and appear near the relevant input or result. 

Tooltips must not be the only place where essential information is available, particularly for keyboard and touch users. 

### **8.9 Tables and lists** 

Tables may be used for intermediate values, measurement summaries, or comparisons. 

They must have: 

- Clear column headings. 

- Units in headings or labels. 

- Consistent numerical alignment. 

- Readable row spacing. 

- Appropriate handling on narrow screens. 

For a small number of results, a simple labelled list is preferable to a large table. 

## **9. Calculator-Specific Visual Requirements** 

All calculator groups will use the shared components defined above. The following requirements address the specific information each calculator must communicate. 

### **9.1 Fabric GSM Calculator** 

The interface must visually distinguish: 

- Sample mass in grams. 

- Sample length in centimetres. 

- Sample width in centimetres. 

- Calculated sample area. 

- Final GSM in g/m². 

The GSM result will be the primary visual output. Sample area and formula details will be supporting information. 

A standards-compliance badge or certification graphic must not be shown. 

### **9.2 Fabric Consumption and Marker Efficiency** 

The screen will use two clearly labelled modes: `Fabric Consumption` and `Marker Efficiency` . 

Each mode must display only its relevant input fields. 

For fabric consumption, the interface must distinguish base consumption from consumption adjusted by an optional allowance. 

For marker efficiency, the interface must show the marker area and pattern-piece area used in the calculation. 

The layout must make it difficult to confuse a length measurement with an area measurement. 

### **9.3 Dyeing Liquor and Recipe Quantity** 

The screen will use two clearly labelled modes: `Liquor Quantity` and `Recipe Chemical Quantity` . 

For liquor calculations, the result section will distinguish liquor mass from approximate liquor volume and show the density assumption. 

For recipe calculations, the interface will explicitly label the concentration basis as `owf (%)` . 

The interface must not visually imply that a calculated quantity is a recommended dyeing recipe or an approved chemical dosage. 

### **9.4 Production Capacity** 

The screen will distinguish the `Production Rate` and `Cycle Time` calculation modes. 

The result section will separate theoretical output from whole-unit capacity when the theoretical result is fractional. 

The displayed result must identify the time and production units used. A production estimate must not be styled as a guaranteed target or confirmed production figure. 

### **9.5 Production Efficiency** 

The result section will show actual production, expected production, and the resulting efficiency percentage. 

Values above 100% will remain visible and will be accompanied by a review warning where appropriate. 

The interface will not use automatic red/green classifications to judge performance without a defined operational policy. 

### **9.6 OEE Calculator** 

The OEE result section will show the three component factors and the final OEE percentage. 

Availability, Performance, and Quality must be individually labelled. The final OEE result must be visually prominent without obscuring the component values. 

If Performance exceeds 100%, or the inputs create an undefined result, the interface will display a clear explanation. 

The design will not impose a universal OEE target or use an unsupported industry benchmark as a visual reference. 

### **9.7 Basic Quality Calculations** 

The quality screen will distinguish `Defect Percentage` , `Measurement Average` , and `Minimum, Maximum, and Range` . 

Counts will be displayed as counts, measurement results will retain their supplied units, and percentages will be explicitly labelled. 

The application must not present basic quality statistics as an automatic pass/fail decision unless a separately specified acceptance rule is implemented. 

## **10. Interaction States** 

All interactive components must have defined visual states. 

### **10.1 Default state** 

The component displays its normal appearance and accepts interaction. 

### **10.2 Hover state** 

Interactive elements may use a subtle background, border, or text change. 

Hover must not be required to understand an action because touch devices do not provide the same interaction. 

### **10.3 Focus state** 

Keyboard focus must be clearly visible. 

The focus indicator will use the blue focus token and sufficient contrast against the surrounding surface. It must not be removed without an accessible replacement. 

### **10.4 Pressed state** 

Buttons and navigation controls may use a darker or slightly altered surface to show that an action is being activated. 

### **10.5 Disabled state** 

Disabled controls must look inactive and must not appear to be available for immediate use. 

A disabled Calculate button may be used where appropriate, but validation messages must still explain what is required. The interface must not leave the user unable to determine why calculation is unavailable. 

### **10.6 Validation state** 

Invalid fields will use the error colour and an explanatory text message. 

The application must not rely only on a red border to communicate invalid input. 

### **10.7 Calculation success state** 

After a successful calculation, the result panel will display the new result and associated calculation details. 

The interface may confirm that the calculation completed, but it must not equate successful execution with engineering correctness or compliance. 

### **10.8 Stale result state** 

If inputs change after a calculation, the previous result must either be cleared or clearly marked as outdated until recalculation. 

The same behaviour must apply consistently across calculators. 

### **10.9 Empty state** 

An empty result area will contain a brief instruction explaining that valid inputs are required before a result can be displayed. 

It must not contain fabricated example results presented as current calculations. 

## **11. Responsive Design** 

The application will prioritise desktop use while remaining usable on tablets and mobile screens. 

The following breakpoints will be used as initial layout rules: 

|**Breakpoin**|**t**<br>**Width**|**Layout behaviour**|
|---|---|---|
|Small|Below 640 px|<sup>Single-column content, compact navigation, stacked input and</sup><br>result panels|
|Medium|640–1023 px|Flexible content width, compact navigation where necessary,<br>limited two-column layouts|
|Large|1024 px and<br>above|Desktop sidebar, wider calculator layouts, side-by-side panels<br>where useful|



These are design breakpoints, not assumptions about the physical devices users own. Actual layouts must be checked during implementation. 

### **11.1 Small screens** 

- The navigation will use a compact menu. 

- Calculator fields will use the available width. 

- Input and result sections will stack vertically. 

- Buttons must remain large enough for touch interaction. 

- Formula text must wrap without clipping. 

- Long numerical results and units must remain readable. 

- Tables must adapt or provide a contained horizontal scrolling region when necessary. 

### **11.2 Medium screens** 

- The content will use flexible widths. 

- The sidebar may be collapsed or replaced with a compact navigation control when it would reduce calculator usability. 

- Two-column layouts will be used only when both columns remain comfortably readable. 

### **11.3 Large screens** 

- The sidebar will remain visible. 

- Calculator content will be constrained to a readable maximum width. 

- Input and result panels may appear side by side. 

- Additional width must not be used as a reason to enlarge text or controls excessively. 

Responsive behaviour must be tested with actual calculator forms, validation messages, and long results rather than with an empty page alone. 

## **12. Accessibility Requirements** 

The interface must support users who rely on keyboard navigation, readable text, and assistive technologies. 

The implementation will follow these practical requirements. 

### **12.1 Labels and semantics** 

- Every input must have an associated visible label. 

- Buttons must have descriptive text or an accessible name. 

- Headings must follow a logical hierarchy. 

- Navigation must use meaningful links and controls. 

- Form errors must be associated with their corresponding fields where technically supported. 

### **12.2 Keyboard navigation** 

- All navigation links, inputs, buttons, selectors, and expandable sections must be keyboard accessible. 

- Focus order must follow the visual workflow. 

- Focus must remain visible. 

- Modal or drawer interactions, if used, must not trap users unexpectedly or prevent keyboard access to the close action. 

### **12.3 Contrast** 

Text and interactive elements must have sufficient contrast against their backgrounds. 

The target is WCAG 2.2 Level AA for applicable requirements, including a contrast ratio of at least 4.5:1 for ordinary text and 3:1 for large text. User-interface boundaries and focus indicators must also meet the relevant non-text contrast requirements. 

The selected colour palette must be checked rather than assumed to meet every contrast requirement. 

### **12.4 Error communication** 

Errors and warnings must include text. Colour and icons may reinforce the message but cannot replace it. 

### **12.5 Motion** 

The application will not use unnecessary animation. 

If transitions are implemented, they must be brief and must respect the user's reduced-motion preference where applicable. 

### **12.6 Touch targets** 

Frequently used interactive controls should aim for a target size of at least 44 × 44 CSS pixels where practical. Smaller controls must remain comfortably usable and comply with applicable accessibility requirements. 

Reference: W3C, _Web Content Accessibility Guidelines (WCAG) 2.2_ . The implementation must be tested against the relevant criteria; describing the theme as accessible does not itself establish compliance. 

## **13. Implementation Approach** 

The theme must be practical to implement using free and open-source technologies on Windows. 

The implementation will use reusable styling tokens and shared interface components rather than maintaining separate visual rules for every calculator. 

The exact frontend framework and styling method will be established in `docs/technical_specification.md` . This document does not independently select or introduce a new framework. 

Regardless of the selected implementation technology: 

- Colour, typography, spacing, radius, and layout values must be centrally defined. 

- Repeated calculator elements must use shared components or consistent templates. 

- Calculation logic must remain separate from purely visual components. 

- No remote font, icon, or styling service may be required for normal offline operation. 

- Dependencies must have a clear purpose and be compatible with the repository's free/open-source constraints. 

- The interface must not depend on a paid design system or proprietary component service. 

A small local SVG icon set may be used where icons materially improve navigation. Icons must be decorative when adjacent text already communicates the same meaning, unless an accessible name is needed for an icon-only control. 

## **14. Design Quality Checks** 

Before the interface is considered ready for release, verify the following. 

### **Visual consistency** 

- All calculator screens use the same typography, spacing, input styles, and button hierarchy. 

- Primary actions are visually distinct from secondary actions. 

- Result panels use a consistent structure. 

- Navigation clearly identifies the current section. 

- The interface contains no unnecessary decorative dashboards or simulated operational statistics. 

### **Calculation readability** 

- Every input displays its required unit. 

- Every output displays its result unit. 

- Primary results are visually prominent. 

- Formulas and assumptions are readable. 

- Long values, units, and formula expressions are not clipped. 

- Warnings remain visible when results require review. 

### **Interaction behaviour** 

- Hover, focus, pressed, disabled, and validation states are implemented consistently. 

- Input changes cannot leave a previous result appearing current. 

- Reset clears the active calculator state. 

- Error messages identify the issue and explain how to correct it. 

- Keyboard navigation works across the main workflow. 

### **Responsive behaviour** 

- The sidebar or compact navigation remains usable. 

- Calculator forms fit smaller screens. 

- Results remain readable on narrow displays. 

- Tables and formula expressions do not break the layout. 

- Touch controls remain practical to use. 

### **Accessibility** 

- Visible labels exist for all inputs. 

- Text and controls have sufficient contrast. 

- Keyboard focus is visible. 

- Colour is not the only means of conveying status. 

- Expandable content and navigation controls have appropriate accessible names and state information. 

## **15. Scope Boundaries and Unresolved Items** 

The visual design system is established by this document. The following items will be finalised during implementation or in the relevant technical documentation: 

- The exact frontend framework and styling mechanism, as specified in `docs/technical_specification.md` . 

- The final implementation of the mobile navigation drawer. 

- The exact reusable component structure, based on the selected framework. 

- The final decimal formatting and rounding rules for each calculator, as defined in `docs/textile_calculation_reference.md` . 

- The implementation of optional copy and export actions, which must not be shown as functional until verified. 

- Any theme changes required by actual accessibility testing. 

No additional theme variant is required for the initial release. A light theme is sufficient for the intended calculator workflows and reduces unnecessary implementation and testing work. 

## **16. Expected Outcome** 

The completed interface will provide a consistent, readable, and practical environment for textile engineering calculations. 

Users will be able to navigate to a calculator, enter measurements with explicit units, run a calculation, inspect the result, and understand its formula and limitations. 

The theme will support the project's central objective: useful, transparent, maintainable engineering utilities whose interface makes calculations easier to perform and verify without implying more certainty than the underlying data and formulas justify. 

