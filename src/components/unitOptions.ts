import {
  LENGTH_UNIT_NAMES,
  LENGTH_UNITS,
  TIME_UNIT_NAMES,
  TIME_UNITS,
} from '../lib/units';
import type { UnitOption } from './FormField';

export const LENGTH_OPTIONS: readonly UnitOption[] = LENGTH_UNITS.map((unit) => ({
  value: unit,
  label: LENGTH_UNIT_NAMES[unit],
}));

export const TIME_OPTIONS: readonly UnitOption[] = TIME_UNITS.map((unit) => ({
  value: unit,
  label: TIME_UNIT_NAMES[unit],
}));
