import { describe, expect, it } from 'vitest';
import {
  formatCount,
  formatFixed2,
  formatNumber,
  formatQuantity,
  formatTheoretical,
  NOT_AVAILABLE,
} from './formatting';

describe('formatting', () => {
  it('uses two decimals for percentages and GSM', () => {
    expect(formatFixed2(240)).toBe('240.00');
    expect(formatFixed2(83.33333333)).toBe('83.33');
    expect(formatFixed2(106.25)).toBe('106.25');
  });

  it('shows quantities with 2 to 4 decimals and thousands grouping', () => {
    expect(formatQuantity(1.2772)).toBe('1.2772');
    expect(formatQuantity(1.24)).toBe('1.24');
    expect(formatQuantity(2000)).toBe('2,000.00');
    expect(formatQuantity(127.72)).toBe('127.72');
  });

  it('formats counts and theoretical output', () => {
    expect(formatCount(19271)).toBe('19,271');
    expect(formatTheoretical(10.8)).toBe('10.8');
    expect(formatTheoretical(900)).toBe('900');
  });

  it('keeps significant digits for very small non-zero values', () => {
    expect(formatQuantity(0.00001234)).toBe('0.0000123');
    expect(formatQuantity(0)).toBe('0.00');
  });

  it('never prints NaN or Infinity as a result', () => {
    expect(formatFixed2(Number.NaN)).toBe(NOT_AVAILABLE);
    expect(formatFixed2(Infinity)).toBe(NOT_AVAILABLE);
    expect(
      formatNumber(-Infinity, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
    ).toBe(NOT_AVAILABLE);
  });
});
