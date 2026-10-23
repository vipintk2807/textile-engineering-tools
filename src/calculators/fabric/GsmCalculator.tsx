import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatFixed2, formatInput, formatQuantity } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import { calculateGsm, type GsmInput, type GsmResult } from './gsm';

const INITIAL = { sampleMass: '', sampleLength: '', sampleWidth: '' };
type Values = typeof INITIAL;

interface GsmView {
  input: GsmInput;
  result: GsmResult;
}

export function computeGsm(values: Values): Result<GsmView> {
  const parsed = parseInputs({
    sampleMass: { raw: values.sampleMass, label: 'Sample mass (g)' },
    sampleLength: { raw: values.sampleLength, label: 'Sample length (cm)' },
    sampleWidth: { raw: values.sampleWidth, label: 'Sample width (cm)' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: GsmInput = {
    sampleMassG: parsed.value.sampleMass,
    sampleLengthCm: parsed.value.sampleLength,
    sampleWidthCm: parsed.value.sampleWidth,
  };
  const calculation = calculateGsm(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function GsmCalculator() {
  const form = useCalculatorForm<keyof Values, GsmView>(INITIAL, computeGsm);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Area = ${formatInput(outcome.result.input.sampleLengthCm)} × ${formatInput(outcome.result.input.sampleWidthCm)} = ${formatQuantity(outcome.result.result.sampleAreaCm2)} cm²`,
          `GSM = ${formatInput(outcome.result.input.sampleMassG)} × 10,000 ÷ ${formatQuantity(outcome.result.result.sampleAreaCm2)} = ${formatFixed2(outcome.result.result.gsm)} g/m²`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Fabric GSM calculator"
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Sample mass (g)"
            value={form.values.sampleMass}
            onChange={(v) => form.setValue('sampleMass', v)}
            error={form.errorFor('sampleMass')}
            placeholder="e.g. 9.6"
          />
          <NumberField
            label="Sample length (cm)"
            value={form.values.sampleLength}
            onChange={(v) => form.setValue('sampleLength', v)}
            error={form.errorFor('sampleLength')}
            placeholder="e.g. 20"
          />
          <NumberField
            label="Sample width (cm)"
            value={form.values.sampleWidth}
            onChange={(v) => form.setValue('sampleWidth', v)}
            error={form.errorFor('sampleWidth')}
            helper="Length and width must describe the same rectangular sample that was weighed."
            placeholder="e.g. 20"
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
                label="Fabric mass per unit area (GSM)"
                value={formatFixed2(outcome.result.result.gsm)}
                unit="g/m²"
              />
              <ResultList
                items={[
                  { label: 'Sample area (cm²)', value: `${formatQuantity(outcome.result.result.sampleAreaCm2)} cm²` },
                  { label: 'Sample area (m²)', value: `${formatQuantity(outcome.result.result.sampleAreaM2)} m²`, note: '10,000 cm² = 1 m²' },
                ]}
              />
              <InfoNote>
                This is a calculation from the entered sample mass and dimensions. It is not a
                standards-compliant fabric test result.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={['Area (cm²) = Length (cm) × Width (cm)', 'GSM (g/m²) = Mass (g) × 10,000 ÷ Area (cm²)']}
        variables={[
          'Mass: weighed mass of the sample, in grams.',
          'Length and width: sample dimensions, in centimetres.',
          '10,000: square centimetres in one square metre.',
        ]}
        substitution={substitution}
        assumptions={[
          'GSM is mass per area, not a thickness measurement.',
          'The accuracy of weighing, measuring, conditioning and sampling is not assessed.',
          'ASTM D3776/D3776M and IS 1964 define test procedures; this calculator does not implement them and does not claim compliance.',
        ]}
      />
    </CalculatorCard>
  );
}
