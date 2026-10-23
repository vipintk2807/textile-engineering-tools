import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatCount, formatFixed2 } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import {
  calculateDefectPercentage,
  type DefectPercentageInput,
  type DefectPercentageResult,
} from './defect';

const INITIAL = { defective: '', inspected: '' };
type Values = typeof INITIAL;

interface DefectView {
  input: DefectPercentageInput;
  result: DefectPercentageResult;
}

export function computeDefect(values: Values): Result<DefectView> {
  const parsed = parseInputs({
    defective: { raw: values.defective, label: 'Defective units (units)' },
    inspected: { raw: values.inspected, label: 'Inspected units (units)' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: DefectPercentageInput = {
    defectiveUnits: parsed.value.defective,
    inspectedUnits: parsed.value.inspected,
  };
  const calculation = calculateDefectPercentage(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function DefectPercentageCalculator() {
  const form = useCalculatorForm<keyof Values, DefectView>(INITIAL, computeDefect);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Defect percentage = ${formatCount(outcome.result.input.defectiveUnits)} ÷ ${formatCount(outcome.result.input.inspectedUnits)} × 100 = ${formatFixed2(outcome.result.result.defectPercent)} %`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Defect Percentage"
      title="Defect Percentage"
      description="Calculates the percentage of inspected units that are defective."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Defective units (units)"
            value={form.values.defective}
            onChange={(v) => form.setValue('defective', v)}
            error={form.errorFor('defective')}
            helper="Count of defective units (whole number), not the number of individual defects."
            placeholder="e.g. 12"
          />
          <NumberField
            label="Inspected units (units)"
            value={form.values.inspected}
            onChange={(v) => form.setValue('inspected', v)}
            error={form.errorFor('inspected')}
            helper="Whole number greater than zero, not less than the defective units."
            placeholder="e.g. 600"
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
                label="Defective units as a percentage of inspected units"
                value={formatFixed2(outcome.result.result.defectPercent)}
                unit="%"
              />
              <ResultList
                items={[
                  { label: 'Defective units', value: `${formatCount(outcome.result.input.defectiveUnits)} units` },
                  { label: 'Inspected units', value: `${formatCount(outcome.result.input.inspectedUnits)} units` },
                ]}
              />
              <InfoNote>
                This describes the supplied counts only. It does not decide lot acceptance and is
                not a sampling plan.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={['Defect percentage (%) = Defective units ÷ Inspected units × 100']}
        substitution={substitution}
        assumptions={[
          'Counts defective units, not defects per unit or defects per hundred units.',
          'Acceptance limits, defect classes and sampling plans must be established separately.',
        ]}
      />
    </CalculatorCard>
  );
}
