/**
 * Supported units and their exact conversion factors.
 *
 * Only conversions with a defined, exact relationship are provided:
 * - 1 m = 100 cm
 * - 1 in = 0.0254 m (international inch, exact by definition)
 * - 1 yd = 0.9144 m (international yard, exact by definition)
 * - 1 min = 60 s, 1 h = 3,600 s
 */

export const LENGTH_UNITS = ['m', 'cm', 'yd', 'in'] as const;
export type LengthUnit = (typeof LENGTH_UNITS)[number];

const METRES_PER_LENGTH_UNIT: Record<LengthUnit, number> = {
  m: 1,
  cm: 0.01,
  yd: 0.9144,
  in: 0.0254,
};

export const LENGTH_UNIT_NAMES: Record<LengthUnit, string> = {
  m: 'metres (m)',
  cm: 'centimetres (cm)',
  yd: 'yards (yd)',
  in: 'inches (in)',
};

export const TIME_UNITS = ['s', 'min', 'h'] as const;
export type TimeUnit = (typeof TIME_UNITS)[number];

const SECONDS_PER_TIME_UNIT: Record<TimeUnit, number> = {
  s: 1,
  min: 60,
  h: 3600,
};

export const TIME_UNIT_NAMES: Record<TimeUnit, string> = {
  s: 'seconds (s)',
  min: 'minutes (min)',
  h: 'hours (h)',
};

export const CM2_PER_M2 = 10_000;
export const KG_TO_G = 1000;
export const SECONDS_PER_HOUR = 3600;

export function lengthToMetres(value: number, unit: LengthUnit): number {
  return value * METRES_PER_LENGTH_UNIT[unit];
}

/** Converts an area expressed in `unit` squared (for example cm²) to m². */
export function areaToSquareMetres(value: number, unit: LengthUnit): number {
  const factor = METRES_PER_LENGTH_UNIT[unit];
  return value * factor * factor;
}

export function timeToSeconds(value: number, unit: TimeUnit): number {
  return value * SECONDS_PER_TIME_UNIT[unit];
}

/** Unit label for an area in `unit` squared, for example `cm²`. */
export function areaUnitLabel(unit: LengthUnit): string {
  return `${unit}²`;
}
