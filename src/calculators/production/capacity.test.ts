import { describe, expect, it } from 'vitest';
import {
  calculateCycleTimeCapacity,
  calculateRateCapacity,
  toWholeUnits,
} from './capacity';

describe('calculateRateCapacity', () => {
  it('120 units/hour for 7.5 hours = 900 units', () => {
    const result = calculateRateCapacity({ productionRatePerHour: 120, operatingHours: 7.5 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.theoreticalOutput).toBeCloseTo(900, 9);
      expect(result.value.wholeUnitOutput).toBe(900);
    }
  });

  it('keeps fractional theoretical output separate from whole units', () => {
    const result = calculateRateCapacity({ productionRatePerHour: 1.2, operatingHours: 9 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.theoreticalOutput).toBeCloseTo(10.8, 9);
      expect(result.value.wholeUnitOutput).toBe(10);
    }
  });

  it('does not lose a unit to floating-point error (4.35 x 100 = 435)', () => {
    const result = calculateRateCapacity({ productionRatePerHour: 4.35, operatingHours: 100 });
    expect(result.ok && result.value.wholeUnitOutput).toBe(435);
  });

  it('allows zero rate or zero time with zero output', () => {
    expect(calculateRateCapacity({ productionRatePerHour: 0, operatingHours: 5 }).ok).toBe(true);
    const zeroTime = calculateRateCapacity({ productionRatePerHour: 10, operatingHours: 0 });
    expect(zeroTime.ok && zeroTime.value.theoreticalOutput).toBe(0);
  });

  it('rejects negative values and non-finite results', () => {
    expect(calculateRateCapacity({ productionRatePerHour: -1, operatingHours: 5 }).ok).toBe(false);
    expect(calculateRateCapacity({ productionRatePerHour: 5, operatingHours: -1 }).ok).toBe(false);
    expect(calculateRateCapacity({ productionRatePerHour: 1e308, operatingHours: 1e10 }).ok).toBe(false);
  });
});

describe('calculateCycleTimeCapacity', () => {
  it('7.5 hours at 45 s/unit = 600 units', () => {
    const result = calculateCycleTimeCapacity({
      operatingTime: 7.5,
      operatingTimeUnit: 'h',
      cycleTimeSeconds: 45,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.operatingTimeSeconds).toBe(27_000);
      expect(result.value.theoreticalOutput).toBeCloseTo(600, 9);
      expect(result.value.wholeUnitOutput).toBe(600);
    }
  });

  it('converts minutes and seconds before dividing', () => {
    const minutes = calculateCycleTimeCapacity({
      operatingTime: 3,
      operatingTimeUnit: 'min',
      cycleTimeSeconds: 20,
    });
    expect(minutes.ok && minutes.value.theoreticalOutput).toBeCloseTo(9, 9);
    const seconds = calculateCycleTimeCapacity({
      operatingTime: 100,
      operatingTimeUnit: 's',
      cycleTimeSeconds: 8,
    });
    expect(seconds.ok && seconds.value.theoreticalOutput).toBeCloseTo(12.5, 9);
    expect(seconds.ok && seconds.value.wholeUnitOutput).toBe(12);
  });

  it('treats 0.3 s at 0.1 s/unit as exactly 3 whole units', () => {
    const result = calculateCycleTimeCapacity({
      operatingTime: 0.3,
      operatingTimeUnit: 's',
      cycleTimeSeconds: 0.1,
    });
    expect(result.ok && result.value.wholeUnitOutput).toBe(3);
  });

  it('rejects zero or negative cycle time (no division by zero)', () => {
    for (const cycleTimeSeconds of [0, -5]) {
      const result = calculateCycleTimeCapacity({
        operatingTime: 10,
        operatingTimeUnit: 'h',
        cycleTimeSeconds,
      });
      expect(!result.ok && result.errors[0]?.field).toBe('cycleTime');
    }
  });

  it('allows zero operating time and rejects negative or overflowing values', () => {
    const zero = calculateCycleTimeCapacity({ operatingTime: 0, operatingTimeUnit: 'h', cycleTimeSeconds: 45 });
    expect(zero.ok && zero.value.theoreticalOutput).toBe(0);
    expect(
      calculateCycleTimeCapacity({ operatingTime: -1, operatingTimeUnit: 'h', cycleTimeSeconds: 45 }).ok,
    ).toBe(false);
    expect(
      calculateCycleTimeCapacity({ operatingTime: 1e308, operatingTimeUnit: 'h', cycleTimeSeconds: 1 }).ok,
    ).toBe(false);
  });
});

describe('toWholeUnits', () => {
  it('floors fractions and never rounds up', () => {
    expect(toWholeUnits(10.8)).toBe(10);
    expect(toWholeUnits(10.999)).toBe(10);
    expect(toWholeUnits(0.4)).toBe(0);
  });

  it('returns an exact integer unchanged', () => {
    expect(toWholeUnits(600)).toBe(600);
    expect(toWholeUnits(0)).toBe(0);
  });
});
