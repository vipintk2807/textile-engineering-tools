import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatInput, formatQuantity } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import { calculateLiquorQuantity, type LiquorInput, type LiquorResult } from './liquor';

const INITIAL = { batchMass: '', liquorRatio: '' };
type Values = typeof INITIAL;

interface LiquorView {
  input: LiquorInput;
  result: LiquorResult;
}

export function computeLiquor(values: Values): Result<LiquorView> {
  const parsed = parseInputs({
    batchMass: { raw: values.batchMass, label: 'Textile batch mass (kg)' },
    liquorRatio: { raw: values.liquorRatio, label: 'Liquor-ratio multiplier R' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: LiquorInput = {
    batchMassKg: parsed.value.batchMass,
    liquorRatio: parsed.value.liquorRatio,
  };
  const calculation = calculateLiquorQuantity(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function LiquorForm() {
  const form = useCalculatorForm<keyof Values, LiquorView>(INITIAL, computeLiquor);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Liquor mass = ${formatInput(outcome.result.input.batchMassKg)} kg × ${formatInput(outcome.result.input.liquorRatio)} = ${formatQuantity(outcome.result.result.liquorMassKg)} kg`,
          `Approximate volume = ${formatQuantity(outcome.result.result.liquorMassKg)} kg ÷ ${outcome.result.result.densityAssumptionKgPerL} kg/L ≈ ${formatQuantity(outcome.result.result.approximateLiquorVolumeL)} L`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Liquor Quantity"
      title="Liquor Quantity"
      description="Calculates liquor mass and an approximate liquor volume from the batch mass and an entered liquor ratio."
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
            label="Liquor-ratio multiplier R (dimensionless, for a ratio of 1:R)"
            value={form.values.liquorRatio}
            onChange={(v) => form.setValue('liquorRatio', v)}
            error={form.errorFor('liquorRatio')}
            helper="Enter only R. For a 1:8 liquor ratio enter 8 (1 kg of textile to 8 kg of liquor). Do not type 1:8."
            placeholder="e.g. 8"
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
                label="Liquor mass"
                value={formatQuantity(outcome.result.result.liquorMassKg)}
                unit="kg"
              />
              <ResultList
                items={[
                  {
                    label: 'Approximate liquor volume',
                    value: `≈ ${formatQuantity(outcome.result.result.approximateLiquorVolumeL)} L`,
                    note: `estimate, assumes density ≈ ${outcome.result.result.densityAssumptionKgPerL} kg/L`,
                  },
                ]}
              />
              <InfoNote>
                The volume is an estimate, not an exact tank fill volume. Machine hold-up, residual
                liquor and additions are not included.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Liquor mass (kg) = Textile batch mass (kg) × R',
          'Approximate liquor volume (L) = Liquor mass (kg) ÷ 1 kg/L',
        ]}
        variables={[
          'R: liquor-ratio multiplier. A ratio of 1:R means 1 unit of textile mass to R equivalent units of liquor mass.',
        ]}
        substitution={substitution}
        assumptions={[
          'Aqueous liquor density is assumed to be approximately 1 kg/L. Actual density varies with composition and temperature.',
          'The batch-weight and liquor-ratio conventions must match your factory practice; this has not been verified for any particular process.',
          'This calculator does not recommend liquor ratios or process conditions.',
        ]}
      />
    </CalculatorCard>
  );
}
