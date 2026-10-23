import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatInput, formatQuantity } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import { calculateChemicalQuantity, type ChemicalInput, type ChemicalResult } from './chemical';

const INITIAL = { batchMass: '', percentOwf: '' };
type Values = typeof INITIAL;

interface ChemicalView {
  input: ChemicalInput;
  result: ChemicalResult;
}

export function computeChemical(values: Values): Result<ChemicalView> {
  const parsed = parseInputs({
    batchMass: { raw: values.batchMass, label: 'Textile batch mass (kg)' },
    percentOwf: { raw: values.percentOwf, label: 'Chemical amount (% owf)' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: ChemicalInput = {
    batchMassKg: parsed.value.batchMass,
    percentOwf: parsed.value.percentOwf,
  };
  const calculation = calculateChemicalQuantity(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function ChemicalForm() {
  const form = useCalculatorForm<keyof Values, ChemicalView>(INITIAL, computeChemical);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Chemical mass = ${formatInput(outcome.result.input.batchMassKg)} kg × ${formatInput(outcome.result.input.percentOwf)} ÷ 100 = ${formatQuantity(outcome.result.result.chemicalMassKg)} kg`,
          `In grams = ${formatQuantity(outcome.result.result.chemicalMassKg)} kg × 1,000 = ${formatQuantity(outcome.result.result.chemicalMassG)} g`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Recipe Chemical Quantity"
      title="Recipe Chemical Quantity"
      description="Calculates the mass of a chemical from a percentage on weight of fabric (owf) that you enter."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Textile batch mass (kg)"
            value={form.values.batchMass}
            onChange={(v) => form.setValue('batchMass', v)}
            error={form.errorFor('batchMass')}
            placeholder="e.g. 250"
          />
          <NumberField
            label="Chemical amount (% owf)"
            value={form.values.percentOwf}
            onChange={(v) => form.setValue('percentOwf', v)}
            error={form.errorFor('percentOwf')}
            helper="Percentage on weight of fabric: percent of the textile batch mass, not of the bath volume. Enter 2 for 2%. Zero or more."
            placeholder="e.g. 2"
          />
        </CalculatorForm>

        <ResultPanel
          status={outcome.status}
          generalErrors={form.generalErrors}
          warnings={outcome.status === 'ok' ? outcome.warnings : []}
        >
          {outcome.status === 'ok' ? (
            <>
              <PrimaryResult
                label="Chemical mass"
                value={formatQuantity(outcome.result.result.chemicalMassKg)}
                unit="kg"
              />
              <ResultList
                items={[
                  { label: 'Chemical mass', value: `${formatQuantity(outcome.result.result.chemicalMassG)} g` },
                  { label: 'Concentration basis', value: `${formatInput(outcome.result.input.percentOwf)} % owf` },
                ]}
              />
              <InfoNote>
                This is arithmetic on the percentage you entered. It is not a recommended recipe or
                dosage, and it says nothing about chemical suitability or safety.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Chemical mass (kg) = Textile batch mass (kg) × Percentage owf ÷ 100',
          'Chemical mass (g) = Chemical mass (kg) × 1,000',
        ]}
        variables={['owf: on weight of fabric, the percentage is taken relative to the textile batch mass.']}
        substitution={substitution}
        assumptions={[
          'A percentage owf is not a percentage of liquor volume and is not a g/L concentration.',
          'Commercial strength, active content and stock-solution concentration are not considered.',
          'Chemical selection, dosage, compatibility and process safety are outside the scope of this calculator.',
        ]}
      />
    </CalculatorCard>
  );
}
