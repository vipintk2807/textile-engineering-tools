import { areaToSquareMetres, type LengthUnit } from '../../lib/units';
import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  RESULT_FIELD,
  success,
  type Result,
} from '../../lib/validation';

/** Inputs for marker efficiency. All lengths share `lengthUnit`. */
export interface MarkerEfficiencyInput {
  /**
   * Total area of every pattern piece in the marker, in `lengthUnit` squared
   * (for example cm² when `lengthUnit` is cm). Must be > 0.
   */
  patternAreaTotal: number;
  /** Marker length in `lengthUnit`. Must be > 0. */
  markerLength: number;
  /** Usable marker width in `lengthUnit`. Must be > 0. */
  markerWidth: number;
  lengthUnit: LengthUnit;
}

export interface MarkerEfficiencyResult {
  markerAreaM2: number;
  patternAreaM2: number;
  /** Pattern-piece area ÷ marker area × 100 (%). */
  efficiencyPercent: number;
  /** 100 − efficiency (%): geometric area not covered by pattern pieces. */
  unusedAreaPercent: number;
}

/**
 * Marker efficiency = pattern-piece area ÷ (marker length × usable width) × 100.
 * Form-field keys used in issues: patternArea, markerLength, markerWidth.
 *
 * The ratio is dimensionless, so it is computed in the entered units (all
 * inputs share one unit system). Areas are converted to m² for display only.
 */
export function calculateMarkerEfficiency(
  input: MarkerEfficiencyInput,
): Result<MarkerEfficiencyResult> {
  const issues = compactIssues([
    checkNumber('patternArea', 'Total pattern-piece area', input.patternAreaTotal, {
      rule: 'positive',
    }),
    checkNumber('markerLength', 'Marker length', input.markerLength, {
      rule: 'positive',
    }),
    checkNumber('markerWidth', 'Usable marker width', input.markerWidth, {
      rule: 'positive',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }

  const markerAreaInUnit = input.markerLength * input.markerWidth;
  if (!Number.isFinite(markerAreaInUnit) || !(markerAreaInUnit > 0)) {
    return failure([
      {
        field: RESULT_FIELD,
        message:
          'The marker area could not be calculated as a positive finite number. Check the marker length and width.',
      },
    ]);
  }
  if (input.patternAreaTotal > markerAreaInUnit) {
    return failure([
      {
        field: 'patternArea',
        message:
          'Total pattern-piece area must not exceed the marker area (marker length × usable width). Check that the area belongs to this marker and uses the same unit system.',
      },
    ]);
  }

  const efficiencyPercent = (input.patternAreaTotal / markerAreaInUnit) * 100;
  const unusedAreaPercent = 100 - efficiencyPercent;
  const markerAreaM2 = areaToSquareMetres(markerAreaInUnit, input.lengthUnit);
  const patternAreaM2 = areaToSquareMetres(input.patternAreaTotal, input.lengthUnit);

  const nonFinite = checkFiniteResults(
    efficiencyPercent,
    unusedAreaPercent,
    markerAreaM2,
    patternAreaM2,
  );
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({ markerAreaM2, patternAreaM2, efficiencyPercent, unusedAreaPercent });
}
