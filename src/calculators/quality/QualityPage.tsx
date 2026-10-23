import { DefectPercentageCalculator } from './DefectPercentageCalculator';
import { MeasurementCalculator } from './MeasurementCalculator';

/** Three small utilities, each with its own inputs, result and Reset. */
export function QualityPage() {
  return (
    <div className="stack">
      <DefectPercentageCalculator />
      <MeasurementCalculator variant="mean" />
      <MeasurementCalculator variant="extremes" />
    </div>
  );
}
