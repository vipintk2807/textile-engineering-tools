interface FormulaDetailsProps {
  /** Formulas exactly as implemented. */
  formulas: readonly string[];
  /** Plain-language description of variables and units. */
  variables?: readonly string[];
  /** Assumptions and limitations that affect interpretation. */
  assumptions: readonly string[];
  /** Calculation with the entered values substituted (after a result). */
  substitution?: readonly string[];
}

/** Formula, variables, substituted values and assumptions for a calculator. */
export function FormulaDetails({ formulas, variables, assumptions, substitution }: FormulaDetailsProps) {
  return (
    <details className="details" open>
      <summary>Formula, units and assumptions</summary>
      <h4>Formula</h4>
      {formulas.map((formula) => (
        <pre className="formula" key={formula}>
          {formula}
        </pre>
      ))}
      {variables && variables.length > 0 ? (
        <>
          <h4>Variables and units</h4>
          <ul>
            {variables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
      {substitution && substitution.length > 0 ? (
        <>
          <h4>Your values substituted</h4>
          {substitution.map((line) => (
            <pre className="formula" key={line}>
              {line}
            </pre>
          ))}
        </>
      ) : null}
      <h4>Assumptions and limitations</h4>
      <ul>
        {assumptions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
