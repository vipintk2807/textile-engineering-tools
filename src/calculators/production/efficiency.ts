import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

export interface EfficiencyInput {
  /** Actual production in the same unit and period as expected. Must be >= 0. */
  actualProduction: number;
  /** Expected production for the same period and scope. Must be > 0. */
  expectedProduction: number;
}

export interface EfficiencyResult {
  /** Actual ÷ expected × 100 (%). Not capped at 100%. */
  efficiencyPercent: number;
}

/** Form-field keys used in issues: actual, expected. */
export function calculateProductionEfficiency(
  input: EfficiencyInput,
): Result<EfficiencyResult> {
  const issues = compactIssues([
    checkNumber('actual', 'Actual production', input.actualProduction, {
      rule: 'nonNegative',
    }),
    checkNumber('expected', 'Expected production', input.expectedProduction, {
      rule: 'positive',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }
  const efficiencyPercent =
    (input.actualProduction / input.expectedProduction) * 100;
  const nonFinite = checkFiniteResults(efficiencyPercent);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  const warnings =
    efficiencyPercent > 100
      ? [
          'Actual production exceeds the expected production you entered. The result is shown uncapped; review how the expected quantity was defined (same period, scope and unit).',
        ]
      : [];
  return success({ efficiencyPercent }, warnings);
}
