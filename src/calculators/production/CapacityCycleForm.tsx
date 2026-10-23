import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { TIME_OPTIONS } from '../../components/unitOptions';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatCount, formatInput, formatTheoretical } from '../../lib/formatting';
import { TIME_UNITS } from '../../lib/units';
import {
  failure,
  gatherIssues,
  parseChoice,
  parseInputs,
  success,
  type Result,
} from '../../lib/validation';
import {
  calculateCycleTimeCapacity,
  type CycleTimeCapacityInput,
  type CycleTimeCapacityResult,
} from './capacity';

const INITIAL = { operatingTime: '', operatingTimeUnit: 'h', cycleTime: '' };
type Values = typeof INITIAL;

interface CycleView {
  input: CycleTimeCapacityInput;
  result: CycleTimeCapacityResult;
}

export function computeCycleCapacity(values: Values): Result<CycleView> {
  const required = parseInputs({
    operatingTime: { raw: values.operatingTime, label: 'Available operating time' },
    cycleTime: { raw: values.cycleTime, label: 'Cycle time (s/unit)' },
  });
  const unit = parseChoice('operatingTimeUnit', 'Operating time unit', values.operatingTimeUnit, TIME_UNITS);
  if (!required.ok || !unit.ok) {
    return failure(gatherIssues(required, unit));
  }
  const input: CycleTimeCapacityInput = {
    operatingTime: required.value.operatingTime,
    operatingTimeUnit: unit.value,
    cycleTimeSeconds: required.value.cycleTime,
  };
  const calculation = calculateCycleTimeCapacity(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function CapacityCycleForm() {
  const form = useCalculatorForm<keyof Values, CycleView>(INITIAL, computeCycleCapacity);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Operating time = ${formatInput(outcome.result.input.operatingTime)} ${outcome.result.input.operatingTimeUnit} = ${formatInput(outcome.result.result.operatingTimeSeconds)} s`,
          `Theoretical output = ${formatInput(outcome.result.result.operatingTimeSeconds)} s ÷ ${formatInput(outcome.result.input.cycleTimeSeconds)} s/unit = ${formatTheoretical(outcome.result.result.theoreticalOutput)} units`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Cycle Time"
      title="Cycle Time"
      description="Estimates theoretical output from an available operating time and a cycle time per unit."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Available operating time"
            value={form.values.operatingTime}
            onChange={(v) => form.setValue('operatingTime', v)}
            error={form.errorFor('operatingTime')}
            placeholder="e.g. 7.5"
            unit={{
              label: 'Operating time unit',
              value: form.values.operatingTimeUnit,
              options: TIME_OPTIONS,
              onChange: (v) => form.setValue('operatingTimeUnit', v),
            }}
          />
          <NumberField
            label="Cycle time (s/unit)"
            value={form.values.cycleTime}
            onChange={(v) => form.setValue('cycleTime', v)}
            error={form.errorFor('cycleTime')}
            helper="Seconds per unit. Must be greater than zero. Ideal or measured; the calculator treats it as given."
            placeholder="e.g. 45"
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
                label="Theoretical output (estimate)"
                value={formatTheoretical(outcome.result.result.theoreticalOutput)}
                unit="units"
              />
              <ResultList
                items={[
                  {
                    label: 'Whole-unit output',
                    value: `${formatCount(outcome.result.result.wholeUnitOutput)} units`,
                    note: 'rounded down to complete units',
                  },
                  {
                    label: 'Operating time used',
                    value: `${formatInput(outcome.result.result.operatingTimeSeconds)} s`,
                  },
                ]}
              />
              <InfoNote>
                This is theoretical capacity. Downtime, changeovers and other losses are not
                subtracted unless you already excluded them from the operating time.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Operating time (s) = Operating time × seconds per selected unit (1 min = 60 s, 1 h = 3,600 s)',
          'Theoretical output (units) = Operating time (s) ÷ Cycle time (s/unit)',
          'Whole-unit output = floor(Theoretical output)',
        ]}
        substitution={substitution}
        assumptions={[
          'The cycle time is assumed to apply to every unit for the whole operating time.',
          'Downtime, changeovers, operator availability and material shortages are not included.',
          'Values within 1e-9 (relative) of a whole number are treated as that whole number so binary floating-point error does not drop a complete unit.',
        ]}
      />
    </CalculatorCard>
  );
}
