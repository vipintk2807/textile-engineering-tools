import { CM2_PER_M2 } from '../../lib/units';
import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  RESULT_FIELD,
  success,
  type Result,
} from '../../lib/validation';

/** Inputs for GSM from a rectangular fabric sample. */
export interface GsmInput {
  /** Sample mass in grams (g). Must be > 0. */
  sampleMassG: number;
  /** Sample length in centimetres (cm). Must be > 0. */
  sampleLengthCm: number;
  /** Sample width in centimetres (cm). Must be > 0. */
  sampleWidthCm: number;
}

export interface GsmResult {
  /** Sample area in cm². */
  sampleAreaCm2: number;
  /** Sample area in m² (cm² ÷ 10,000). */
  sampleAreaM2: number;
  /** Fabric mass per unit area in g/m². */
  gsm: number;
}

/**
 * GSM = mass (g) ÷ area (cm²) × 10,000, where area = length × width.
 * Form-field keys used in issues: sampleMass, sampleLength, sampleWidth.
 *
 * This is the arithmetic only; it does not implement ASTM D3776/D3776M or
 * IS 1964 sampling, conditioning or reporting requirements.
 */
export function calculateGsm(input: GsmInput): Result<GsmResult> {
  const issues = compactIssues([
    checkNumber('sampleMass', 'Sample mass (g)', input.sampleMassG, {
      rule: 'positive',
    }),
    checkNumber('sampleLength', 'Sample length (cm)', input.sampleLengthCm, {
      rule: 'positive',
    }),
    checkNumber('sampleWidth', 'Sample width (cm)', input.sampleWidthCm, {
      rule: 'positive',
    }),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }

  const sampleAreaCm2 = input.sampleLengthCm * input.sampleWidthCm;
  if (!Number.isFinite(sampleAreaCm2) || !(sampleAreaCm2 > 0)) {
    return failure([
      {
        field: RESULT_FIELD,
        message:
          'The sample area could not be calculated as a positive finite number. Check the length and width.',
      },
    ]);
  }

  const gsm = (input.sampleMassG / sampleAreaCm2) * CM2_PER_M2;
  const sampleAreaM2 = sampleAreaCm2 / CM2_PER_M2;
  const nonFinite = checkFiniteResults(gsm, sampleAreaM2);
  if (nonFinite) {
    return failure([nonFinite]);
  }
  return success({ sampleAreaCm2, sampleAreaM2, gsm });
}
