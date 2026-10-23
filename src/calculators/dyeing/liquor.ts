import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

/** Assumed density of an aqueous liquor, in kg/L (approximation). */
export const LIQUOR_DENSITY_ASSUMPTION_KG_PER_L = 1;

export interface LiquorInput {
  /** Textile batch mass in kilograms (kg). Must be > 0. */
  batchMassKg: number;
  /**
   * Liquor-ratio multiplier R for a ratio of 1:R (dimensionless).
   * Must be > 0. Enter 8 for 1:8, not the text "1:8".
   */
  liquorRatio: number;
}

export interface LiquorResult {
  /** Liquor mass in kg = batch mass × R. */
  liquorMassKg: number;
  /** Approximate liquor volume in litres = mass ÷ assumed density. */
  approximateLiquorVolumeL: number;
  densityAssumptionKgPerL: number;
}

/** Form-field keys used in issues: batchMass, liquorRatio. */
export function calculateLiquorQuantity(input: LiquorInput): Result<LiquorResult> {
  const issues = compactIssues([
    checkNumber('batchMass', 'Textile batch mass (kg)', input.batchMassKg, {
      rule: 'positive',
    }),
    checkNumber('liquorRatio', 'Liquor-ratio multiplier R', input.liquorRatio, {
      rule: 'positive',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }

  const liquorMassKg = input.batchMassKg * input.liquorRatio;
  const approximateLiquorVolumeL =
    liquorMassKg / LIQUOR_DENSITY_ASSUMPTION_KG_PER_L;
  const nonFinite = checkFiniteResults(liquorMassKg, approximateLiquorVolumeL);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({
    liquorMassKg,
    approximateLiquorVolumeL,
    densityAssumptionKgPerL: LIQUOR_DENSITY_ASSUMPTION_KG_PER_L,
  });
}
