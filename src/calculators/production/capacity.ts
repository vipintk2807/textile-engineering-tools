import { timeToSeconds, type TimeUnit } from '../../lib/units';
import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

/**
 * Whole complete units contained in a theoretical (possibly fractional)
 * output, using the floor operation. Values within 1e-9 (relative) of a whole
 * number are treated as that whole number so that binary floating-point
 * representation error (for example 0.3 ÷ 0.1 = 2.9999999999999996) does not
 * drop a complete unit. A partly completed unit is never rounded up.
 */
export function toWholeUnits(theoreticalOutput: number): number {
  const nearest = Math.round(theoreticalOutput);
  const tolerance = 1e-9 * Math.max(1, Math.abs(theoreticalOutput));
  if (Math.abs(theoreticalOutput - nearest) <= tolerance) {
    return nearest;
  }
  return Math.floor(theoreticalOutput);
}

// ---------------------------------------------------------------------------
// Rate-based mode
// ---------------------------------------------------------------------------

export interface RateCapacityInput {
  /** Production rate in units per hour. Must be >= 0. */
  productionRatePerHour: number;
  /** Operating duration in hours (h). Must be >= 0. */
  operatingHours: number;
}

export interface CapacityResult {
  /** Direct mathematical result of the selected formula (units). */
  theoreticalOutput: number;
  /** floor(theoretical output): complete units only. */
  wholeUnitOutput: number;
}

/** Theoretical output = rate (units/h) × operating time (h). */
export function calculateRateCapacity(
  input: RateCapacityInput,
): Result<CapacityResult> {
  const issues = compactIssues([
    checkNumber('rate', 'Production rate (units/hour)', input.productionRatePerHour, {
      rule: 'nonNegative',
    }),
    checkNumber('operatingTime', 'Operating time (h)', input.operatingHours, {
      rule: 'nonNegative',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }
  const theoreticalOutput = input.productionRatePerHour * input.operatingHours;
  const nonFinite = checkFiniteResults(theoreticalOutput);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({
    theoreticalOutput,
    wholeUnitOutput: toWholeUnits(theoreticalOutput),
  });
}

// ---------------------------------------------------------------------------
// Cycle-time mode
// ---------------------------------------------------------------------------

export interface CycleTimeCapacityInput {
  /** Available operating time, expressed in `operatingTimeUnit`. Must be >= 0. */
  operatingTime: number;
  operatingTimeUnit: TimeUnit;
  /** Cycle time in seconds per unit. Must be > 0. */
  cycleTimeSeconds: number;
}

export interface CycleTimeCapacityResult extends CapacityResult {
  operatingTimeSeconds: number;
}

/** Theoretical output = operating time (s) ÷ cycle time (s/unit). */
export function calculateCycleTimeCapacity(
  input: CycleTimeCapacityInput,
): Result<CycleTimeCapacityResult> {
  const issues = compactIssues([
    checkNumber('operatingTime', 'Available operating time', input.operatingTime, {
      rule: 'nonNegative',
    }),
    checkNumber('cycleTime', 'Cycle time (s/unit)', input.cycleTimeSeconds, {
      rule: 'positive',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }
  const operatingTimeSeconds = timeToSeconds(
    input.operatingTime,
    input.operatingTimeUnit,
  );
  const theoreticalOutput = operatingTimeSeconds / input.cycleTimeSeconds;
  const nonFinite = checkFiniteResults(operatingTimeSeconds, theoreticalOutput);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({
    operatingTimeSeconds,
    theoreticalOutput,
    wholeUnitOutput: toWholeUnits(theoreticalOutput),
  });
}
