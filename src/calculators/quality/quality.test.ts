import { describe, expect, it } from 'vitest';
import { calculateDefectPercentage } from './defect';
import { summariseMeasurements } from './statistics';

describe('calculateDefectPercentage', () => {
  it('12 defective of 600 inspected = 2.00%', () => {
    const result = calculateDefectPercentage({ defectiveUnits: 12, inspectedUnits: 600 });
    expect(result.ok && result.value.defectPercent).toBeCloseTo(2, 10);
  });

  it('handles 0% and 100% boundaries', () => {
    const none = calculateDefectPercentage({ defectiveUnits: 0, inspectedUnits: 50 });
    expect(none.ok && none.value.defectPercent).toBe(0);
    const all = calculateDefectPercentage({ defectiveUnits: 50, inspectedUnits: 50 });
    expect(all.ok && all.value.defectPercent).toBeCloseTo(100, 10);
  });

  it('rejects zero inspected units (undefined percentage)', () => {
    const result = calculateDefectPercentage({ defectiveUnits: 0, inspectedUnits: 0 });
    expect(!result.ok && result.errors[0]?.field).toBe('inspected');
  });

  it('rejects defective units above inspected units', () => {
    const result = calculateDefectPercentage({ defectiveUnits: 601, inspectedUnits: 600 });
    expect(!result.ok && result.errors[0]?.message).toMatch(/cannot exceed/);
  });

  it('rejects negative, fractional and non-finite counts', () => {
    expect(calculateDefectPercentage({ defectiveUnits: -1, inspectedUnits: 10 }).ok).toBe(false);
    expect(calculateDefectPercentage({ defectiveUnits: 1.5, inspectedUnits: 10 }).ok).toBe(false);
    expect(calculateDefectPercentage({ defectiveUnits: 1, inspectedUnits: 10.5 }).ok).toBe(false);
    expect(calculateDefectPercentage({ defectiveUnits: 1, inspectedUnits: Infinity }).ok).toBe(false);
  });
});

describe('summariseMeasurements', () => {
  it('12, 15, 18: mean 15, min 12, max 18, range 6, count 3', () => {
    const result = summariseMeasurements([12, 15, 18]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.count).toBe(3);
      expect(result.value.sum).toBe(45);
      expect(result.value.mean).toBeCloseTo(15, 12);
      expect(result.value.minimum).toBe(12);
      expect(result.value.maximum).toBe(18);
      expect(result.value.range).toBe(6);
    }
  });

  it('gives a valid zero range for equal measurements', () => {
    const result = summariseMeasurements([5, 5]);
    expect(result.ok && result.value.range).toBe(0);
    expect(result.ok && result.value.mean).toBe(5);
  });

  it('handles negative and decimal measurements', () => {
    const negative = summariseMeasurements([-3, 3]);
    expect(negative.ok && negative.value.mean).toBe(0);
    expect(negative.ok && negative.value.range).toBe(6);
    const decimals = summariseMeasurements([0.1, 0.2]);
    expect(decimals.ok && decimals.value.mean).toBeCloseTo(0.15, 12);
  });

  it('does not mutate or reorder the input list', () => {
    const input = [18, 12, 15];
    summariseMeasurements(input);
    expect(input).toEqual([18, 12, 15]);
  });

  it('rejects an empty list and a single measurement', () => {
    expect(summariseMeasurements([]).ok).toBe(false);
    expect(summariseMeasurements([4]).ok).toBe(false);
  });

  it('rejects non-finite measurements', () => {
    expect(summariseMeasurements([1, Number.NaN]).ok).toBe(false);
    expect(summariseMeasurements([1, Infinity]).ok).toBe(false);
  });

  it('rejects an overflowing sum', () => {
    expect(summariseMeasurements([1e308, 1e308]).ok).toBe(false);
  });
});
