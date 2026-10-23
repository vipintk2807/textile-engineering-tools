import { describe, expect, it } from 'vitest';
import { calculateOee, type OeeInput } from './oee';

const reference: OeeInput = {
  plannedTime: 420,
  includedDowntime: 47,
  timeUnit: 'min',
  idealCycleTimeSeconds: 1,
  totalUnits: 19_271,
  goodUnits: 18_848,
};

describe('calculateOee', () => {
  it('matches the reference example (420 min, 47 min, 1 s/unit, 19,271 / 18,848)', () => {
    const result = calculateOee(reference);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const v = result.value;
      expect(v.plannedTimeSeconds).toBe(25_200);
      expect(v.includedDowntimeSeconds).toBe(2_820);
      expect(v.runTimeSeconds).toBe(22_380);
      // Values calculated independently with exact rational arithmetic.
      expect(v.availabilityPercent).toBeCloseTo(88.8095238095, 8);
      expect(v.performancePercent).toBeCloseTo(86.1081322609, 8);
      expect(v.qualityPercent).toBeCloseTo(97.8049919568, 8);
      expect(v.oeePercent).toBeCloseTo(74.7936507937, 8);
      expect(result.warnings).toEqual([]);
      expect(v.unavailable).toEqual({});
    }
  });

  it('gives the same result when time is entered in seconds or hours', () => {
    const seconds = calculateOee({ ...reference, plannedTime: 25_200, includedDowntime: 2_820, timeUnit: 's' });
    const hours = calculateOee({ ...reference, plannedTime: 7, includedDowntime: 0.7833333333333333, timeUnit: 'h' });
    expect(seconds.ok && seconds.value.oeePercent).toBeCloseTo(74.7936507937, 8);
    expect(hours.ok && hours.value.oeePercent).toBeCloseTo(74.7936507937, 6);
  });

  it('checks a second independently calculated case (8 h, 1 h down, 30 s/unit, 700 / 679)', () => {
    const result = calculateOee({
      plannedTime: 8,
      includedDowntime: 1,
      timeUnit: 'h',
      idealCycleTimeSeconds: 30,
      totalUnits: 700,
      goodUnits: 679,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.availabilityPercent).toBeCloseTo(87.5, 9);
      expect(result.value.performancePercent).toBeCloseTo(83.3333333333, 8);
      expect(result.value.qualityPercent).toBeCloseTo(97, 9);
      expect(result.value.oeePercent).toBeCloseTo(70.7291666667, 8);
    }
  });

  it('warns, without capping or altering, when Performance exceeds 100%', () => {
    const result = calculateOee({ ...reference, idealCycleTimeSeconds: 2 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.performancePercent).toBeCloseTo(172.2162645219, 8);
      expect(result.value.oeePercent).toBeCloseTo(149.5873015873, 8);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toMatch(/above 100%/);
    }
  });

  it('does not warn when Performance is exactly 100%', () => {
    const result = calculateOee({
      plannedTime: 8,
      includedDowntime: 0,
      timeUnit: 'h',
      idealCycleTimeSeconds: 30,
      totalUnits: 960,
      goodUnits: 960,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.performancePercent).toBeCloseTo(100, 9);
      expect(result.value.oeePercent).toBeCloseTo(100, 9);
      expect(result.warnings).toEqual([]);
    }
  });

  it('downtime equal to planned time: Availability 0%, Performance and OEE unavailable', () => {
    const result = calculateOee({ ...reference, includedDowntime: 420 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.runTimeSeconds).toBe(0);
      expect(result.value.availabilityPercent).toBe(0);
      expect(result.value.performancePercent).toBeNull();
      expect(result.value.oeePercent).toBeNull();
      expect(result.value.unavailable.performance).toMatch(/Run time is zero/);
      expect(result.value.unavailable.oee).toBeDefined();
      expect(result.value.qualityPercent).toBeCloseTo(97.8049919568, 8);
    }
  });

  it('zero total units: Performance 0%, Quality and OEE unavailable (not a fabricated zero)', () => {
    const result = calculateOee({ ...reference, totalUnits: 0, goodUnits: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.performancePercent).toBe(0);
      expect(result.value.qualityPercent).toBeNull();
      expect(result.value.oeePercent).toBeNull();
      expect(result.value.unavailable.quality).toMatch(/zero/);
      expect(result.value.unavailable.oee).toBeDefined();
    }
  });

  it('zero downtime and zero good units give Quality 0% and OEE 0%', () => {
    const result = calculateOee({ ...reference, includedDowntime: 0, goodUnits: 0 });
    expect(result.ok && result.value.qualityPercent).toBe(0);
    expect(result.ok && result.value.oeePercent).toBe(0);
  });

  it('rejects zero planned time and zero ideal cycle time', () => {
    expect(calculateOee({ ...reference, plannedTime: 0 }).ok).toBe(false);
    expect(calculateOee({ ...reference, idealCycleTimeSeconds: 0 }).ok).toBe(false);
  });

  it('rejects downtime greater than planned time', () => {
    const result = calculateOee({ ...reference, includedDowntime: 421 });
    expect(!result.ok && result.errors[0]?.field).toBe('downtime');
  });

  it('rejects good units greater than total units', () => {
    const result = calculateOee({ ...reference, goodUnits: 19_272 });
    expect(!result.ok && result.errors[0]?.field).toBe('goodUnits');
  });

  it('rejects negative and fractional counts and negative time', () => {
    expect(calculateOee({ ...reference, totalUnits: -1 }).ok).toBe(false);
    expect(calculateOee({ ...reference, goodUnits: -1 }).ok).toBe(false);
    expect(calculateOee({ ...reference, totalUnits: 10.5, goodUnits: 5 }).ok).toBe(false);
    expect(calculateOee({ ...reference, includedDowntime: -1 }).ok).toBe(false);
    expect(calculateOee({ ...reference, plannedTime: -420 }).ok).toBe(false);
  });

  it('rejects non-finite input and overflowing results', () => {
    expect(calculateOee({ ...reference, plannedTime: Infinity }).ok).toBe(false);
    expect(
      calculateOee({ ...reference, idealCycleTimeSeconds: 1e308, totalUnits: 1e300, goodUnits: 1 }).ok,
    ).toBe(false);
  });
});
