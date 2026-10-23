import { describe, expect, it } from 'vitest';
import {
  areaToSquareMetres,
  areaUnitLabel,
  lengthToMetres,
  timeToSeconds,
} from './units';

describe('length conversion (exact definitions)', () => {
  it('converts to metres', () => {
    expect(lengthToMetres(2.5, 'm')).toBe(2.5);
    expect(lengthToMetres(620, 'cm')).toBeCloseTo(6.2, 12);
    expect(lengthToMetres(10, 'yd')).toBeCloseTo(9.144, 12);
    expect(lengthToMetres(100, 'in')).toBeCloseTo(2.54, 12);
  });
});

describe('area conversion', () => {
  it('converts squared units to square metres', () => {
    expect(areaToSquareMetres(10_000, 'cm')).toBeCloseTo(1, 12);
    expect(areaToSquareMetres(1, 'yd')).toBeCloseTo(0.83612736, 12);
    expect(areaToSquareMetres(5, 'm')).toBe(5);
  });

  it('labels squared units', () => {
    expect(areaUnitLabel('cm')).toBe('cm²');
  });
});

describe('time conversion', () => {
  it('converts to seconds', () => {
    expect(timeToSeconds(7.5, 'h')).toBe(27_000);
    expect(timeToSeconds(420, 'min')).toBe(25_200);
    expect(timeToSeconds(45, 's')).toBe(45);
  });
});
