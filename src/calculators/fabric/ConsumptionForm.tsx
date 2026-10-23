import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel, type ResultItem } from '../../components/ResultPanel';
import { LENGTH_OPTIONS } from '../../components/unitOptions';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatCount, formatInput, formatQuantity } from '../../lib/formatting';
import { LENGTH_UNITS } from '../../lib/units';
import {
  failure,
  gatherIssues,
  parseChoice,
  parseInputs,
  parseOptionalInput,
  success,
  type Result,
} from '../../lib/validation';
import {
  calculateConsumption,
  GARMENTS_PER_DOZEN,
  type ConsumptionInput,
  type ConsumptionResult,
} from './consumption';

const INITIAL = {
  markerLength: '',
  markerLengthUnit: 'm',
  garments: '',
  allowance: '',
  orderQuantity: '',
};
type Values = typeof INITIAL;

interface ConsumptionView {
  input: ConsumptionInput;
  result: ConsumptionResult;
}

export function computeConsumption(values: Values): Result<ConsumptionView> {
  const required = parseInputs({
    markerLength: { raw: values.markerLength, label: 'Marker length' },
    garments: { raw: values.garments, label: 'Garments represented by the marker' },
  });
  const unit = parseChoice('markerLengthUnit', 'Marker length unit', values.markerLengthUnit, LENGTH_UNITS);
  const allowance = parseOptionalInput('allowance', 'Allowance (%)', values.allowance);
  const orderQuantity = parseOptionalInput('orderQuantity', 'Order quantity (garments)', values.orderQuantity);
  if (!required.ok || !unit.ok || !allowance.ok || !orderQuantity.ok) {
    return failure(gatherIssues(required, unit, allowance, orderQuantity));
  }
  const input: ConsumptionInput = {
    markerLength: required.value.markerLength,
    markerLengthUnit: unit.value,
    garmentsInMarker: required.value.garments,
    ...(allowance.value === undefined ? {} : { allowancePercent: allowance.value }),
    ...(orderQuantity.value === undefined ? {} : { orderQuantity: orderQuantity.value }),
  };
  const calculation = calculateConsumption(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function ConsumptionForm() {
  const form = useCalculatorForm<keyof Values, ConsumptionView>(INITIAL, computeConsumption);
  const { outcome } = form;

  let items: ResultItem[] = [];
  let substitution: string[] | undefined;
  if (outcome.status === 'ok') {
    const { input, result } = outcome.result;
    items = [
      { label: 'Marker length (m)', value: `${formatQuantity(result.markerLengthM)} m`, note: input.markerLengthUnit === 'm' ? undefined : `converted from ${formatInput(input.markerLength)} ${input.markerLengthUnit}` },
      { label: 'Garments in marker', value: formatCount(result.garmentsInMarker) },
      { label: 'Base consumption per garment', value: `${formatQuantity(result.baseConsumptionPerGarmentM)} m/garment`, note: 'marker length ÷ garments' },
    ];
    if (result.adjustedConsumptionPerGarmentM !== null && result.allowancePercent !== null) {
      items.push({
        label: 'Allowance-adjusted consumption per garment',
        value: `${formatQuantity(result.adjustedConsumptionPerGarmentM)} m/garment`,
        note: `entered allowance ${formatInput(result.allowancePercent)}%`,
      });
    }
    items.push({
      label: `Length per dozen garments (${result.basis})`,
      value: `${formatQuantity(result.lengthPerDozenM)} m`,
    });
    if (result.totalOrderLengthM !== null && result.orderQuantity !== null) {
      items.push({
        label: `Total order length (${formatCount(result.orderQuantity)} garments, ${result.basis})`,
        value: `${formatQuantity(result.totalOrderLengthM)} m`,
      });
    }
    substitution = [
      `Base = ${formatQuantity(result.markerLengthM)} m ÷ ${formatCount(result.garmentsInMarker)} = ${formatQuantity(result.baseConsumptionPerGarmentM)} m/garment`,
    ];
    if (result.adjustedConsumptionPerGarmentM !== null && result.allowancePercent !== null) {
      substitution.push(
        `Adjusted = ${formatQuantity(result.baseConsumptionPerGarmentM)} × (1 + ${formatInput(result.allowancePercent)} ÷ 100) = ${formatQuantity(result.adjustedConsumptionPerGarmentM)} m/garment`,
      );
    }
    substitution.push(
      `Per dozen = ${formatQuantity(result.selectedConsumptionPerGarmentM)} × ${GARMENTS_PER_DOZEN} = ${formatQuantity(result.lengthPerDozenM)} m`,
    );
  }

  return (
    <CalculatorCard
      label="Fabric Consumption"
      title="Fabric Consumption"
      description="Estimates fabric length per garment from a completed marker, with an optional allowance that you enter."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <NumberField
            label="Marker length"
            value={form.values.markerLength}
            onChange={(v) => form.setValue('markerLength', v)}
            error={form.errorFor('markerLength')}
            placeholder="e.g. 6.2"
            unit={{
              label: 'Marker length unit',
              value: form.values.markerLengthUnit,
              options: LENGTH_OPTIONS,
              onChange: (v) => form.setValue('markerLengthUnit', v),
            }}
          />
          <NumberField
            label="Garments represented by the marker (garments)"
            value={form.values.garments}
            onChange={(v) => form.setValue('garments', v)}
            error={form.errorFor('garments')}
            helper="A whole number of garments laid out in this marker."
            placeholder="e.g. 5"
          />
          <NumberField
            label="Allowance (%)"
            optional
            value={form.values.allowance}
            onChange={(v) => form.setValue('allowance', v)}
            error={form.errorFor('allowance')}
            helper="Your own percentage, 0 or more. Leave blank to use base consumption only. No allowance is assumed."
            placeholder="e.g. 3"
          />
          <NumberField
            label="Order quantity (garments)"
            optional
            value={form.values.orderQuantity}
            onChange={(v) => form.setValue('orderQuantity', v)}
            error={form.errorFor('orderQuantity')}
            helper="A whole number. Leave blank if you do not need a total order length."
            placeholder="e.g. 100"
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
                label={
                  outcome.result.result.basis === 'base'
                    ? 'Fabric length per garment (base, marker-based)'
                    : 'Fabric length per garment (allowance-adjusted estimate)'
                }
                value={formatQuantity(outcome.result.result.selectedConsumptionPerGarmentM)}
                unit="m/garment"
              />
              <ResultList items={items} />
              <InfoNote>
                {outcome.result.result.basis === 'base'
                  ? 'No allowance was entered, so these figures are marker-based theoretical consumption.'
                  : 'These figures include only the allowance you entered; no other losses are added.'}
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Base consumption (m/garment) = Marker length (m) ÷ Garments in marker',
          'Adjusted consumption (m/garment) = Base × (1 + Allowance % ÷ 100)',
          'Length per dozen (m) = Selected consumption × 12',
          'Total order length (m) = Selected consumption × Order quantity',
        ]}
        variables={[
          'Marker length is converted to metres (1 yd = 0.9144 m, 1 in = 0.0254 m, 1 cm = 0.01 m).',
          'Selected consumption is the adjusted value when an allowance is entered, otherwise the base value.',
        ]}
        substitution={substitution}
        assumptions={[
          'The allowance is your own input; it is not a standard value and is not assumed to cover shrinkage, spreading loss, defects or roll ends.',
          'Marker efficiency is not applied to consumption: the marker length already represents the fabric used.',
          'The result is a calculated estimate, not a purchase recommendation.',
        ]}
      />
    </CalculatorCard>
  );
}
