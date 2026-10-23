import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatFixed2, formatInput } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import {
  calculateProductionEfficiency,
  type EfficiencyInput,
  type EfficiencyResult,
} from './efficiency';

const INITIAL = { actual: '', expected: '' };
type Values = typeof INITIAL;

interface EfficiencyView {
  input: EfficiencyInput;
  result: EfficiencyResult;
}

export function computeEfficiency(values: Values): Result<EfficiencyView> {
  const parsed = parseInputs({
    actual: { raw: values.actual, label: 'Actual production (units)' },
    expected: { raw: values.expected, label: 'Expected production (units)' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: EfficiencyInput = {
    actualProduction: parsed.value.actual,
    expectedProduction: parsed.value.expected,
  };
  const calculation = calculateProductionEfficiency(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function EfficiencyCalculator() {
  const form = useCalculatorForm<keyof Values, EfficiencyView>(INITIAL, computeEfficiency);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Efficiency = ${formatInput(outcome.result.input.actualProduction)} ÷ ${formatInput(outcome.result.input.expectedProduction)} × 100 = ${formatFixed2(outcome.result.result.efficiencyPercent)} %`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Production efficiency calculator"
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Actual production (units)"
            value={form.values.actual}
            onChange={(v) => form.setValue('actual', v)}
            error={form.errorFor('actual')}
            helper="Zero or more. Use the same unit (pieces, kg, metres…) and period as the expected production."
            placeholder="e.g. 850"
          />
          <NumberField
            label="Expected production (units)"
            value={form.values.expected}
            onChange={(v) => form.setValue('expected', v)}
            error={form.errorFor('expected')}
            helper="Greater than zero, for the same period and production scope as the actual production."
            placeholder="e.g. 800"
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
                label="Production efficiency"
                value={formatFixed2(outcome.result.result.efficiencyPercent)}
                unit="%"
              />
              <ResultList
                items={[
                  { label: 'Actual production', value: `${formatInput(outcome.result.input.actualProduction)} units` },
                  { label: 'Expected production', value: `${formatInput(outcome.result.input.expectedProduction)} units` },
                ]}
              />
              <InfoNote>
                The result depends entirely on how the expected production was defined. It is not
                labour efficiency, machine efficiency, utilisation or OEE, and it is not rated as
                good or bad.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={['Production efficiency (%) = Actual production ÷ Expected production × 100']}
        substitution={substitution}
        assumptions={[
          'Actual and expected quantities must use compatible units and cover the same period and scope; the calculator cannot check this.',
          'Results above 100% are valid and are never capped.',
          'No expected production target is assumed or supplied.',
        ]}
      />
    </CalculatorCard>
  );
}
