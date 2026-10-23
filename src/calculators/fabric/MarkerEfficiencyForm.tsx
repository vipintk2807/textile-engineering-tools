import { CalculatorCard } from '../../components/CalculatorCard';
import { CalculatorForm } from '../../components/CalculatorForm';
import { FormulaDetails } from '../../components/FormulaDetails';
import { InfoNote } from '../../components/InfoNote';
import { NumberField, SelectField } from '../../components/FormField';
import { PrimaryResult, ResultList, ResultPanel } from '../../components/ResultPanel';
import { LENGTH_OPTIONS } from '../../components/unitOptions';
import { useCalculatorForm } from '../../components/useCalculatorForm';
import { formatFixed2, formatInput, formatQuantity } from '../../lib/formatting';
import { areaUnitLabel, LENGTH_UNITS } from '../../lib/units';
import {
  failure,
  gatherIssues,
  parseChoice,
  parseInputs,
  success,
  type Result,
} from '../../lib/validation';
import {
  calculateMarkerEfficiency,
  type MarkerEfficiencyInput,
  type MarkerEfficiencyResult,
} from './markerEfficiency';

const INITIAL = { lengthUnit: 'm', patternArea: '', markerLength: '', markerWidth: '' };
type Values = typeof INITIAL;

interface MarkerEfficiencyView {
  input: MarkerEfficiencyInput;
  result: MarkerEfficiencyResult;
}

export function computeMarkerEfficiency(values: Values): Result<MarkerEfficiencyView> {
  const unit = parseChoice('lengthUnit', 'Length unit', values.lengthUnit, LENGTH_UNITS);
  const unitLabel = unit.ok ? areaUnitLabel(unit.value) : 'area';
  const required = parseInputs({
    patternArea: { raw: values.patternArea, label: `Total pattern-piece area (${unitLabel})` },
    markerLength: { raw: values.markerLength, label: 'Marker length' },
    markerWidth: { raw: values.markerWidth, label: 'Usable marker width' },
  });
  if (!required.ok || !unit.ok) {
    return failure(gatherIssues(required, unit));
  }
  const input: MarkerEfficiencyInput = {
    patternAreaTotal: required.value.patternArea,
    markerLength: required.value.markerLength,
    markerWidth: required.value.markerWidth,
    lengthUnit: unit.value,
  };
  const calculation = calculateMarkerEfficiency(input);
  if (!calculation.ok) {
    return calculation;
  }
  return success({ input, result: calculation.value }, calculation.warnings);
}

export function MarkerEfficiencyForm() {
  const form = useCalculatorForm<keyof Values, MarkerEfficiencyView>(INITIAL, computeMarkerEfficiency);
  const { outcome } = form;
  const unit = LENGTH_UNITS.find((candidate) => candidate === form.values.lengthUnit) ?? 'm';
  const areaUnit = areaUnitLabel(unit);

  const substitution =
    outcome.status === 'ok'
      ? [
          `Marker area = ${formatInput(outcome.result.input.markerLength)} × ${formatInput(outcome.result.input.markerWidth)} = ${formatQuantity(outcome.result.result.markerAreaM2)} m²`,
          `Efficiency = ${formatQuantity(outcome.result.result.patternAreaM2)} ÷ ${formatQuantity(outcome.result.result.markerAreaM2)} × 100 = ${formatFixed2(outcome.result.result.efficiencyPercent)} %`,
        ]
      : undefined;

  return (
    <CalculatorCard
      label="Marker Efficiency"
      title="Marker Efficiency"
      description="Calculates the percentage of the marker area occupied by pattern pieces."
    >
      <div className="calculator-grid">
        <CalculatorForm onCalculate={form.calculate} onReset={form.reset}>
          <SelectField
            label="Length unit (marker length and width)"
            value={form.values.lengthUnit}
            onChange={(v) => form.setValue('lengthUnit', v)}
            options={LENGTH_OPTIONS}
            helper={`Lengths use this unit and the pattern-piece area uses its square (${areaUnit}).`}
          />
          <NumberField
            label={`Total pattern-piece area (${areaUnit})`}
            value={form.values.patternArea}
            onChange={(v) => form.setValue('patternArea', v)}
            error={form.errorFor('patternArea')}
            helper="Area of all pattern pieces in the marker, not one garment (unless the marker has one garment)."
            placeholder="e.g. 7.75"
          />
          <NumberField
            label={`Marker length (${unit})`}
            value={form.values.markerLength}
            onChange={(v) => form.setValue('markerLength', v)}
            error={form.errorFor('markerLength')}
            placeholder="e.g. 6.2"
          />
          <NumberField
            label={`Usable marker width (${unit})`}
            value={form.values.markerWidth}
            onChange={(v) => form.setValue('markerWidth', v)}
            error={form.errorFor('markerWidth')}
            placeholder="e.g. 1.5"
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
                label="Marker efficiency"
                value={formatFixed2(outcome.result.result.efficiencyPercent)}
                unit="%"
              />
              <ResultList
                items={[
                  { label: 'Marker area', value: `${formatQuantity(outcome.result.result.markerAreaM2)} m²` },
                  { label: 'Pattern-piece area', value: `${formatQuantity(outcome.result.result.patternAreaM2)} m²` },
                  { label: 'Unused marker area', value: `${formatFixed2(outcome.result.result.unusedAreaPercent)} %`, note: '100 − efficiency' },
                ]}
              />
              <InfoNote>
                Unused area is the geometric area not covered by pattern pieces inside the marker
                rectangle. It is not a measure of total fabric loss.
              </InfoNote>
            </>
          ) : null}
        </ResultPanel>
      </div>

      <FormulaDetails
        formulas={[
          'Marker area = Marker length × Usable marker width',
          'Marker efficiency (%) = Pattern-piece area ÷ Marker area × 100',
          'Unused marker area (%) = 100 − Marker efficiency',
        ]}
        variables={[
          'All inputs share the selected length unit; the area is in that unit squared.',
          'Areas are shown in m² (1 yd² = 0.83612736 m², 1 in² = 0.00064516 m², 10,000 cm² = 1 m²).',
        ]}
        substitution={substitution}
        assumptions={[
          'The pattern-piece area must be the total for the whole marker and must come from the same marker.',
          'The pattern-piece area must not exceed the marker area; the value is rejected rather than capped.',
          'The calculation does not optimise the marker layout or judge whether it is suitable for cutting.',
        ]}
      />
    </CalculatorCard>
  );
}
