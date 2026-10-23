import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

export interface DefectPercentageInput {
  /** Number of defective units (whole number >= 0). Not the number of defects. */
  defectiveUnits: number;
  /** Number of units inspected (whole number > 0). */
  inspectedUnits: number;
}

export interface DefectPercentageResult {
  /** Defective ÷ inspected × 100 (%). */
  defectPercent: number;
}

/** Form-field keys used in issues: defective, inspected. */
export function calculateDefectPercentage(
  input: DefectPercentageInput,
): Result<DefectPercentageResult> {
  const issues = compactIssues([
    checkNumber('defective', 'Defective units', input.defectiveUnits, {
      rule: 'nonNegative',
      integer: true,
    }),
    checkNumber('inspected', 'Inspected units', input.inspectedUnits, {
      rule: 'positive',
      integer: true,
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }
  if (input.defectiveUnits > input.inspectedUnits) {
    return failure([
      {
        field: 'defective',
        message: 'Defective units cannot exceed inspected units.',
      },
    ]);
  }
  const defectPercent = (input.defectiveUnits / input.inspectedUnits) * 100;
  const nonFinite = checkFiniteResults(defectPercent);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({ defectPercent });
}
