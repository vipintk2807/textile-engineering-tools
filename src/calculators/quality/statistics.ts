import {
  checkFiniteResults,
  failure,
  success,
  type Result,
} from '../../lib/validation';

export const MIN_MEASUREMENTS = 2;

export interface MeasurementSummary {
  /** Number of measurements used. */
  count: number;
  sum: number;
  /** Arithmetic mean = sum ÷ count (same unit as the measurements). */
  mean: number;
  minimum: number;
  maximum: number;
  /** Maximum − minimum (same unit as the measurements). */
  range: number;
}

/**
 * Descriptive statistics for a list of measurements that share one unit.
 * Requires at least two finite values; nothing is skipped or filtered.
 * Form-field key used in issues: measurements.
 */
export function summariseMeasurements(
  measurements: readonly number[],
): Result<MeasurementSummary> {
  if (measurements.length < MIN_MEASUREMENTS) {
    return failure([
      {
        field: 'measurements',
        message: `Enter at least ${MIN_MEASUREMENTS} measurements.`,
      },
    ]);
  }
  if (!measurements.every((value) => Number.isFinite(value))) {
    return failure([
      {
        field: 'measurements',
        message: 'Every measurement must be a finite number.',
      },
    ]);
  }

  const count = measurements.length;
  const sum = measurements.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const minimum = measurements.reduce((low, value) => Math.min(low, value));
  const maximum = measurements.reduce((high, value) => Math.max(high, value));
  const range = maximum - minimum;

  const nonFinite = checkFiniteResults(sum, mean, range);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({ count, sum, mean, minimum, maximum, range });
}
