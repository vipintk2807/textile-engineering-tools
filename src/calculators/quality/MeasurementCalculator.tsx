import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { TextAreaField, TextField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatCount, formatInput } from '../../lib/formatting';
import { failure, parseMeasurementList, success, type Result } from '../../lib/validation';
import { summariseMeasurements, type MeasurementSummary } from './statistics';

const INITIAL = { measurements: '', unit: '' };
type Values = typeof INITIAL;

interface MeasurementView {
  summary: MeasurementSummary;
  /** Label typed by the user; display only, never used for conversion. */
  unit: string;
}

export function computeMeasurements(values: Values): Result<MeasurementView> {
  const parsed = parseMeasurementList(values.measurements);
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const calculation = summariseMeasurements(parsed.value);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ summary: calculation.value, unit: values.unit.trim() }, calculation.warnings);
}

interface MeasurementCalculatorProps {
  variant: 'mean' | 'extremes';
}

const COPY = {
  mean: {
    label: 'Measurement Average',
    description: 'Calculates the arithmetic mean of two or more measurements that share one unit.',
    formulas: ['Arithmetic mean = Sum of measurements ÷ Number of measurements'],
  },
  extremes: {
    label: 'Minimum, Maximum and Range',
    description: 'Finds the smallest and largest of two or more measurements and their range.',
    formulas: [
      'Minimum = smallest measurement',
      'Maximum = largest measurement',
      'Range = Maximum − Minimum',
    ],
  },
} as const;

export function MeasurementCalculator({ variant }: MeasurementCalculatorProps) {
  const form = useCalculatorForm<keyof Values, MeasurementView>(INITIAL, computeMeasurements);
  const { outcome } = form;
  const copy = COPY[variant];

  const withUnit = (value: number, unit: string): string =>
    unit === '' ? formatInput(value) : `${formatInput(value)} ${unit}`;

  let substitution: string[] | undefined;
  if (outcome.status === 'ok') {
    const { summary, unit } = outcome.result;
    substitution =
      variant === 'mean'
        ? [
            `Mean = ${formatInput(summary.sum)} ÷ ${formatCount(summary.count)} = ${withUnit(summary.mean, unit)}`,
          ]
        : [
            `Range = ${formatInput(summary.maximum)} − ${formatInput(summary.minimum)} = ${withUnit(summary.range, unit)}`,
          ];
  }

  return (
    <CalculatorCard label={copy.label} title={copy.label} description={copy.description}>
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <TextAreaField
            label="Measurements (one per line)"
            value={form.values.measurements}
            onChange={(v) => form.setValue('measurements', v)}
            error={form.errorFor('measurements')}
            helper="At least two numbers, one per line or separated by spaces. Use a decimal point; commas are not accepted. All values must already be in the same unit."
            placeholder={'12\n15\n18'}
          />
          <TextField
            label="Unit of measurement"
            value={form.values.unit}
            onChange={(v) => form.setValue('unit', v)}
            helper="A label for the results only (for example mm or %). The calculator does not convert units."
            maxLength={20}
            placeholder="e.g. mm"
          />
        </CalculatorForm>

        <ResultPanel
          status={outcome.status}
          generalErrors={form.generalErrors}
          warnings={outcome.status === 'ok' ? outcome.warnings : []}
        >
          {outcome.status === 'ok' ? (
            <>
              {variant === 'mean' ? (
                <PrimaryResult
                  label="Arithmetic mean"
                  value={formatInput(outcome.result.summary.mean)}
                  unit={outcome.result.unit}
                />
              ) : (
                <PrimaryResult
                  label="Range (maximum − minimum)"
                  value={formatInput(outcome.result.summary.range)}
                  unit={outcome.result.unit}
                />
              )}
              <ResultList
                items={
                  variant === 'mean'
                    ? [
                        { label: 'Number of measurements', value: formatCount(outcome.result.summary.count) },
                        { label: 'Sum', value: withUnit(outcome.result.summary.sum, outcome.result.unit) },
                      ]
                    : [
                        { label: 'Number of measurements', value: formatCount(outcome.result.summary.count) },
                        { label: 'Minimum', value: withUnit(outcome.result.summary.minimum, outcome.result.unit) },
                        { label: 'Maximum', value: withUnit(outcome.result.summary.maximum, outcome.result.unit) },
                      ]
                }
              />
              <InfoNote>
                These are descriptive statistics only. They do not show that a product meets a
                specification and no outliers are removed.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={copy.formulas}
        substitution={substitution}
        assumptions={[
          'All measurements must be in the same unit and represent comparable quantities.',
          'Invalid entries are reported, never skipped, and nothing is excluded automatically.',
          'No control charts, capability indices, sampling plans or acceptance decisions are provided.',
        ]}
      />
    </CalculatorCard>
  );
}
