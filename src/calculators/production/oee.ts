import { timeToSeconds, type TimeUnit } from '../../lib/units';
import {
  checkNumber,
  compactIssues,
  failure,
  nonFiniteResultIssue,
  success,
  type Result,
} from '../../lib/validation';

export interface OeeInput {
  /** Planned production time in `timeUnit`. Must be > 0. */
  plannedTime: number;
  /** Downtime included in this OEE definition, in `timeUnit`. 0 <= value <= planned. */
  includedDowntime: number;
  /** Unit shared by planned time and included downtime. */
  timeUnit: TimeUnit;
  /** Ideal cycle time in seconds per unit. Must be > 0. */
  idealCycleTimeSeconds: number;
  /** Total units produced (whole number >= 0). */
  totalUnits: number;
  /** Good units produced (whole number, 0 <= value <= total units). */
  goodUnits: number;
}

export interface OeeResult {
  plannedTimeSeconds: number;
  includedDowntimeSeconds: number;
  /** Planned time − included downtime (s). */
  runTimeSeconds: number;
  /** Run time ÷ planned time × 100 (%). */
  availabilityPercent: number;
  /** Ideal cycle time × total units ÷ run time × 100 (%); null if undefined. */
  performancePercent: number | null;
  /** Good units ÷ total units × 100 (%); null if undefined. */
  qualityPercent: number | null;
  /** A × P × Q ÷ 10,000 (%); null unless all three factors are available. */
  oeePercent: number | null;
  /** Reasons for any unavailable value (never shown as a fabricated zero). */
  unavailable: {
    performance?: string;
    quality?: string;
    oee?: string;
  };
}

/**
 * Three-factor OEE (calculation reference section 8). Factors are kept as
 * unrounded percentages; OEE = A × P × Q ÷ 10,000.
 * Form-field keys used in issues: plannedTime, downtime, idealCycleTime,
 * totalUnits, goodUnits.
 */
export function calculateOee(input: OeeInput): Result<OeeResult> {
  const issues = compactIssues([
    checkNumber('plannedTime', 'Planned production time', input.plannedTime, {
      rule: 'positive',
    }),
    checkNumber('downtime', 'Included downtime', input.includedDowntime, {
      rule: 'nonNegative',
    }),
    checkNumber(
      'idealCycleTime',
      'Ideal cycle time (s/unit)',
      input.idealCycleTimeSeconds,
      { rule: 'positive' },
    ),
    checkNumber('totalUnits', 'Total units produced', input.totalUnits, {
      rule: 'nonNegative',
      integer: true,
    }),
    checkNumber('goodUnits', 'Good units produced', input.goodUnits, {
      rule: 'nonNegative',
      integer: true,
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }
  // Relationship checks run only when the individual values are valid.
  if (input.includedDowntime > input.plannedTime) {
    issues.push({
      field: 'downtime',
      message:
        'Included downtime must not exceed planned production time (use the same time unit for both).',
    });
  }
  if (input.goodUnits > input.totalUnits) {
    issues.push({
      field: 'goodUnits',
      message: 'Good units cannot exceed total units produced.',
    });
  }
  if (issues.length > 0) {
    return failure(issues);
  }

  const plannedTimeSeconds = timeToSeconds(input.plannedTime, input.timeUnit);
  const includedDowntimeSeconds = timeToSeconds(
    input.includedDowntime,
    input.timeUnit,
  );
  const runTimeSeconds = plannedTimeSeconds - includedDowntimeSeconds;
  const availabilityPercent = (runTimeSeconds / plannedTimeSeconds) * 100;

  const unavailable: OeeResult['unavailable'] = {};
  const warnings: string[] = [];

  let performancePercent: number | null = null;
  if (runTimeSeconds > 0) {
    performancePercent =
      ((input.idealCycleTimeSeconds * input.totalUnits) / runTimeSeconds) * 100;
  } else {
    unavailable.performance =
      'Run time is zero (downtime equals planned time), so Performance cannot be calculated.';
  }

  let qualityPercent: number | null = null;
  if (input.totalUnits > 0) {
    qualityPercent = (input.goodUnits / input.totalUnits) * 100;
  } else {
    unavailable.quality =
      'Total units produced is zero, so Quality cannot be calculated.';
  }

  let oeePercent: number | null = null;
  if (performancePercent !== null && qualityPercent !== null) {
    oeePercent =
      (availabilityPercent * performancePercent * qualityPercent) / 10_000;
  } else {
    unavailable.oee =
      'OEE is not available because at least one of Performance and Quality could not be calculated.';
  }

  const calculated = [
    plannedTimeSeconds,
    includedDowntimeSeconds,
    runTimeSeconds,
    availabilityPercent,
    ...(performancePercent === null ? [] : [performancePercent]),
    ...(qualityPercent === null ? [] : [qualityPercent]),
    ...(oeePercent === null ? [] : [oeePercent]),
  ];
  if (!calculated.every((value) => Number.isFinite(value))) {
    return failure([nonFiniteResultIssue()]);
  }

  if (performancePercent !== null && performancePercent > 100) {
    warnings.push(
      'Performance is above 100%. Review the ideal cycle time, the time basis and the unit counts; the value is shown uncapped and the inputs have not been changed.',
    );
  }

  return success(
    {
      plannedTimeSeconds,
      includedDowntimeSeconds,
      runTimeSeconds,
      availabilityPercent,
      performancePercent,
      qualityPercent,
      oeePercent,
      unavailable,
    },
    warnings,
  );
}
