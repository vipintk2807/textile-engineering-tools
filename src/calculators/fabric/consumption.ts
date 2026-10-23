import { lengthToMetres, type LengthUnit } from '../../lib/units';
import {
  checkFiniteResults,
  checkNumber,
  compactIssues,
  failure,
  success,
  type Result,
} from '../../lib/validation';

export const GARMENTS_PER_DOZEN = 12;

/** Inputs for marker-based fabric consumption. */
export interface ConsumptionInput {
  /** Marker length, expressed in `markerLengthUnit`. Must be > 0. */
  markerLength: number;
  markerLengthUnit: LengthUnit;
  /** Garments represented by the marker. Positive whole number. */
  garmentsInMarker: number;
  /**
   * Allowance in percent, entered by the user. Omit when none is entered.
   * Must be >= 0. No default allowance is ever assumed.
   */
  allowancePercent?: number;
  /** Order quantity in garments (whole number >= 0). Omit to skip the total. */
  orderQuantity?: number;
}

export interface ConsumptionResult {
  markerLengthM: number;
  garmentsInMarker: number;
  /** Base consumption: marker length ÷ garments (m/garment). */
  baseConsumptionPerGarmentM: number;
  /** Null when no allowance was entered. */
  allowancePercent: number | null;
  /** Base × (1 + allowance ÷ 100) (m/garment); null when no allowance. */
  adjustedConsumptionPerGarmentM: number | null;
  /** Which consumption figure the dozen and order lengths use. */
  basis: 'base' | 'allowance-adjusted';
  /** The consumption (m/garment) used for the dozen and order lengths. */
  selectedConsumptionPerGarmentM: number;
  /** Selected consumption × 12 (m per dozen garments). */
  lengthPerDozenM: number;
  /** Null when no order quantity was entered. */
  orderQuantity: number | null;
  /** Selected consumption × order quantity (m); null when not requested. */
  totalOrderLengthM: number | null;
}

/**
 * Marker-based consumption (calculation reference 4.1 to 4.4).
 * Form-field keys used in issues: markerLength, garments, allowance,
 * orderQuantity.
 */
export function calculateConsumption(
  input: ConsumptionInput,
): Result<ConsumptionResult> {
  const issues = compactIssues([
    checkNumber(
      'markerLength',
      'Marker length',
      input.markerLength,
      { rule: 'positive' },
    ),
    checkNumber(
      'garments',
      'Garments represented by the marker',
      input.garmentsInMarker,
      { rule: 'positive', integer: true },
    ),
    input.allowancePercent === undefined
      ? null
      : checkNumber('allowance', 'Allowance (%)', input.allowancePercent, {
          rule: 'nonNegative',
        }),
    input.orderQuantity === undefined
      ? null
      : checkNumber(
          'orderQuantity',
          'Order quantity (garments)',
          input.orderQuantity,
          { rule: 'nonNegative', integer: true },
        ),
  ]);
  if (issues.length > 0) {
    return failure(issues);
  }

  const markerLengthM = lengthToMetres(
    input.markerLength,
    input.markerLengthUnit,
  );
  const baseConsumptionPerGarmentM = markerLengthM / input.garmentsInMarker;

  const adjustedConsumptionPerGarmentM =
    input.allowancePercent === undefined
      ? null
      : baseConsumptionPerGarmentM * (1 + input.allowancePercent / 100);

  const selectedConsumptionPerGarmentM =
    adjustedConsumptionPerGarmentM ?? baseConsumptionPerGarmentM;
  const lengthPerDozenM = selectedConsumptionPerGarmentM * GARMENTS_PER_DOZEN;
  const totalOrderLengthM =
    input.orderQuantity === undefined
      ? null
      : selectedConsumptionPerGarmentM * input.orderQuantity;

  const nonFinite = checkFiniteResults(
    markerLengthM,
    baseConsumptionPerGarmentM,
    selectedConsumptionPerGarmentM,
    lengthPerDozenM,
    ...(totalOrderLengthM === null ? [] : [totalOrderLengthM]),
  );
  if (nonFinite) {
    return failure([nonFinite]);
  }

  return success({
    markerLengthM,
    garmentsInMarker: input.garmentsInMarker,
    baseConsumptionPerGarmentM,
    allowancePercent: input.allowancePercent ?? null,
    adjustedConsumptionPerGarmentM,
    basis:
      adjustedConsumptionPerGarmentM === null ? 'base' : 'allowance-adjusted',
    selectedConsumptionPerGarmentM,
    lengthPerDozenM,
    orderQuantity: input.orderQuantity ?? null,
    totalOrderLengthM,
  });
}
