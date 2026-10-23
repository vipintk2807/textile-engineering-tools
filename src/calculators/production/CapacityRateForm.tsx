import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatCount, formatInput, formatTheoretical } from '../../lib/formatting';
import { failure, parseInputs, success, type Result } from '../../lib/validation';
import { calculateRateCapacity, type CapacityResult, type RateCapacityInput } from './capacity';

const INITIAL = { rate: '', operatingTime: '' };
type Values = typeof INITIAL;

interface RateView {
  input: RateCapacityInput;
  result: CapacityResult;
}

export function computeRateCapacity(values: Values): Result<RateView> {
  const parsed = parseInputs({
    rate: { raw: values.rate, label: 'Production rate (units/hour)' },
    operatingTime: { raw: values.operatingTime, label: 'Operating time (h)' },
  });
  if (!parsed.ok) {
    return failure(parsed.errors);
  }
  const input: RateCapacityInput = {
    productionRatePerHour: parsed.value.rate,
    operatingHours: parsed.value.operatingTime,
  };
  const calculation = calculateRateCapacity(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function CapacityRateForm() {
  const form = useCalculatorForm<keyof Values, RateView>(INITIAL, computeRateCapacity);
  const { outcome } = form;

  const substitution =
    outcome.status === 'ok'
      ? [
          `Theoretical output = ${formatInput(outcome.result.input.productionRatePerHour)} units/h × ${formatInput(outcome.result.input.operatingHours)} h = ${formatTheoretical(outcome.result.result.theoreticalOutput)} units`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Production Rate"
      title="Production Rate"
      description="Estimates theoretical output from a production rate and an operating time."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Production rate (units/hour)"
            value={form.values.rate}
            onChange={(v) => form.setValue('rate', v)}
            error={form.errorFor('rate')}
            helper="Say in your own records whether this is an ideal, observed or planning rate; the calculator treats it as given."
            placeholder="e.g. 120"
          />
          <NumberField
            label="Operating time (h)"
            value={form.values.operatingTime}
            onChange={(v) => form.setValue('operatingTime', v)}
            error={form.errorFor('operatingTime')}
            helper="Time available for production, in hours. Downtime is not subtracted."
            placeholder="e.g. 7.5"
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
                ]}
              />
              <InfoNote>
                This is theoretical capacity from the rate and time you entered. It is not a
                prediction or guarantee of actual production.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Theoretical output (units) = Production rate (units/h) × Operating time (h)',
          'Whole-unit output = floor(Theoretical output)',
        ]}
        substitution={substitution}
        assumptions={[
          'The rate is assumed to be sustained for the whole operating time.',
          'Downtime, changeovers, material shortages, defects and line balancing are not included.',
          'A rate measured on one machine, line or product does not necessarily apply to another.',
          'Values within 1e-9 (relative) of a whole number are treated as that whole number so binary floating-point error does not drop a complete unit.',
        ]}
      />
    </CalculatorCard>
  );
}
