import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField, SelectField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { TIME_OPTIONS } from '../../components/unitOptions';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import {
  formatCount,
  formatFixed2,
  formatInput,
  NOT_AVAILABLE,
} from '../../lib/formatting';
import { TIME_UNITS } from '../../lib/units';
import {
  failure,
  gatherIssues,
  parseChoice,
  parseInputs,
  success,
  type Result,
} from '../../lib/validation';
import { calculateOee, type OeeInput, type OeeResult } from './oee';

const INITIAL = {
  timeUnit: 'min',
  plannedTime: '',
  downtime: '',
  idealCycleTime: '',
  totalUnits: '',
  goodUnits: '',
};
type Values = typeof INITIAL;

interface OeeView {
  input: OeeInput;
  result: OeeResult;
}

export function computeOee(values: Values): Result<OeeView> {
  const unit = parseChoice('timeUnit', 'Time unit', values.timeUnit, TIME_UNITS);
  const unitName = unit.ok ? unit.value : 'time unit';
  const required = parseInputs({
    plannedTime: { raw: values.plannedTime, label: `Planned production time (${unitName})` },
    downtime: { raw: values.downtime, label: `Included downtime (${unitName})` },
    idealCycleTime: { raw: values.idealCycleTime, label: 'Ideal cycle time (s/unit)' },
    totalUnits: { raw: values.totalUnits, label: 'Total units produced (units)' },
    goodUnits: { raw: values.goodUnits, label: 'Good units produced (units)' },
  });
  if (!required.ok || !unit.ok) {
    return failure(gatherIssues(required, unit));
  }
  const input: OeeInput = {
    plannedTime: required.value.plannedTime,
    includedDowntime: required.value.downtime,
    timeUnit: unit.value,
    idealCycleTimeSeconds: required.value.idealCycleTime,
    totalUnits: required.value.totalUnits,
    goodUnits: required.value.goodUnits,
  };
  const calculation = calculateOee(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

function percentOrUnavailable(value: number | null): string {
  return value === null ? NOT_AVAILABLE : `${formatFixed2(value)} %`;
}

export function OeeCalculator() {
  const form = useCalculatorForm<keyof Values, OeeView>(INITIAL, computeOee);
  const { outcome } = form;
  const unit = TIME_UNITS.find((candidate) => candidate === form.values.timeUnit) ?? 'min';

  let substitution: string[] | undefined;
  if (outcome.status === 'ok') {
    const { input, result } = outcome.result;
    substitution = [
      `Run time = ${formatInput(result.plannedTimeSeconds)} s − ${formatInput(result.includedDowntimeSeconds)} s = ${formatInput(result.runTimeSeconds)} s`,
      `Availability = ${formatInput(result.runTimeSeconds)} ÷ ${formatInput(result.plannedTimeSeconds)} × 100 = ${formatFixed2(result.availabilityPercent)} %`,
      result.performancePercent === null
        ? 'Performance = not available (run time is zero)'
        : `Performance = ${formatInput(input.idealCycleTimeSeconds)} × ${formatCount(input.totalUnits)} ÷ ${formatInput(result.runTimeSeconds)} × 100 = ${formatFixed2(result.performancePercent)} %`,
      result.qualityPercent === null
        ? 'Quality = not available (total units is zero)'
        : `Quality = ${formatCount(input.goodUnits)} ÷ ${formatCount(input.totalUnits)} × 100 = ${formatFixed2(result.qualityPercent)} %`,
      result.oeePercent === null
        ? 'OEE = not available'
        : `OEE = ${formatFixed2(result.availabilityPercent)} × ${formatFixed2(result.performancePercent ?? 0)} × ${formatFixed2(result.qualityPercent ?? 0)} ÷ 10,000 = ${formatFixed2(result.oeePercent)} % (calculated from unrounded factors)`,
    ];
  }

  return (
    <CalculatorCard
      label="OEE calculator"
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <SelectField
            label="Time unit (planned time and downtime)"
            value={form.values.timeUnit}
            onChange={(v) => form.setValue('timeUnit', v)}
            options={TIME_OPTIONS}
            helper="Both time inputs below use this unit."
          />
          <NumberField
            label={`Planned production time (${unit})`}
            value={form.values.plannedTime}
            onChange={(v) => form.setValue('plannedTime', v)}
            error={form.errorFor('plannedTime')}
            helper="Greater than zero. Define what counts as planned time before comparing OEE values."
            placeholder="e.g. 420"
          />
          <NumberField
            label={`Included downtime (${unit})`}
            value={form.values.downtime}
            onChange={(v) => form.setValue('downtime', v)}
            error={form.errorFor('downtime')}
            helper="Only the downtime categories your OEE definition includes. Zero up to the planned time."
            placeholder="e.g. 47"
          />
          <NumberField
            label="Ideal cycle time (s/unit)"
            value={form.values.idealCycleTime}
            onChange={(v) => form.setValue('idealCycleTime', v)}
            error={form.errorFor('idealCycleTime')}
            helper="Seconds per unit, greater than zero."
            placeholder="e.g. 1"
          />
          <NumberField
            label="Total units produced (units)"
            value={form.values.totalUnits}
            onChange={(v) => form.setValue('totalUnits', v)}
            error={form.errorFor('totalUnits')}
            helper="A whole number, zero or more, including any rejected units."
            placeholder="e.g. 19271"
          />
          <NumberField
            label="Good units produced (units)"
            value={form.values.goodUnits}
            onChange={(v) => form.setValue('goodUnits', v)}
            error={form.errorFor('goodUnits')}
            helper="A whole number, not more than total units."
            placeholder="e.g. 18848"
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
                label="Overall Equipment Effectiveness (OEE)"
                value={
                  outcome.result.result.oeePercent === null
                    ? NOT_AVAILABLE
                    : formatFixed2(outcome.result.result.oeePercent)
                }
                unit={outcome.result.result.oeePercent === null ? '' : '%'}
              />
              {outcome.result.result.unavailable.oee ? (
                <p>{outcome.result.result.unavailable.oee}</p>
              ) : null}
              <ResultList
                items={[
                  {
                    label: 'Run time',
                    value: `${formatInput(outcome.result.result.runTimeSeconds)} s`,
                    note: `${formatInput(outcome.result.result.runTimeSeconds / 60)} min · planned time − included downtime`,
                  },
                  {
                    label: 'Availability',
                    value: percentOrUnavailable(outcome.result.result.availabilityPercent),
                  },
                  {
                    label: 'Performance',
                    value: percentOrUnavailable(outcome.result.result.performancePercent),
                    ...(outcome.result.result.unavailable.performance
                      ? { note: outcome.result.result.unavailable.performance }
                      : {}),
                  },
                  {
                    label: 'Quality',
                    value: percentOrUnavailable(outcome.result.result.qualityPercent),
                    ...(outcome.result.result.unavailable.quality
                      ? { note: outcome.result.result.unavailable.quality }
                      : {}),
                  },
                ]}
              />
              <InfoNote>
                OEE depends on how planned time, downtime, ideal cycle time and good output are
                defined. Compare values only when those definitions are consistent. No target or
                benchmark is implied.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Run time = Planned production time − Included downtime',
          'Availability (%) = Run time ÷ Planned production time × 100',
          'Performance (%) = Ideal cycle time × Total units ÷ Run time × 100',
          'Quality (%) = Good units ÷ Total units × 100',
          'OEE (%) = Availability × Performance × Quality ÷ 10,000',
        ]}
        variables={[
          'Times are converted to seconds (1 min = 60 s, 1 h = 3,600 s). Ideal cycle time is in seconds per unit.',
          'Factors are percentages; the division by 10,000 converts their product to a percentage.',
        ]}
        substitution={substitution}
        assumptions={[
          'Performance is not calculated when run time is zero; Quality is not calculated when total units is zero. OEE is then shown as not available, never as a made-up zero.',
          'Performance above 100% is shown uncapped with a warning; review the ideal cycle time and counts.',
          'Which downtime is included and what the ideal cycle time should be are your decisions and are not verified here.',
          'This follows a conventional three-factor model; no OEE standard compliance is claimed.',
        ]}
      />
    </CalculatorCard>
  );
}
