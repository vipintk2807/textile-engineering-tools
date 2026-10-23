import { KG_TO_G } from '../../lib/units';
import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

export interface ChemicalInput {
  /** Textile batch mass in kilograms (kg). Must be > 0. */
  batchMassKg: number;
  /** Chemical amount as a percentage on weight of fabric (% owf). Must be >= 0. */
  percentOwf: number;
}

export interface ChemicalResult {
  /** Chemical mass in kg = batch mass × percentage ÷ 100. */
  chemicalMassKg: number;
  /** Chemical mass in g = chemical mass in kg × 1,000. */
  chemicalMassG: number;
}

/**
 * Chemical quantity at a user-entered % owf. Arithmetic only: no recipe,
 * dosage or suitability is determined.
 * Form-field keys used in issues: batchMass, percentOwf.
 */
export function calculateChemicalQuantity(
  input: ChemicalInput,
): Result<ChemicalResult> {
  const issues = compactIssues([
    checkNumber('batchMass', 'Textile batch mass (kg)', input.batchMassKg, {
      rule: 'positive',
    }),
    checkNumber('percentOwf', 'Chemical amount (% owf)', input.percentOwf, {
      rule: 'nonNegative',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }

  const chemicalMassKg = input.batchMassKg * (input.percentOwf / 100);
  const chemicalMassG = chemicalMassKg * KG_TO_G;
  const nonFinite = checkFiniteResults(chemicalMassKg, chemicalMassG);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({ chemicalMassKg, chemicalMassG });
}
