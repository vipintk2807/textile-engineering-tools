import { describe, expect, it } from 'vitest';
import { calculateConsumption } from './consumption';

const base = { markerLength: 6.2, markerLengthUnit: 'm' as const, garmentsInMarker: 5 };

describe('calculateConsumption', () => {
  it('base consumption: 6.20 m marker, 5 garments = 1.24 m/garment', () => {
    const result = calculateConsumption(base);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.baseConsumptionPerGarmentM).toBeCloseTo(1.24, 12);
      expect(result.value.basis).toBe('base');
      expect(result.value.adjustedConsumptionPerGarmentM).toBeNull();
      expect(result.value.allowancePercent).toBeNull();
      expect(result.value.lengthPerDozenM).toBeCloseTo(14.88, 10);
      expect(result.value.totalOrderLengthM).toBeNull();
    }
  });

  it('applies an entered 3% allowance: 1.2772 m/garment, 15.3264 m/dozen, 127.72 m/100', () => {
    const result = calculateConsumption({
      ...base,
      allowancePercent: 3,
      orderQuantity: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.baseConsumptionPerGarmentM).toBeCloseTo(1.24, 12);
      expect(result.value.adjustedConsumptionPerGarmentM).toBeCloseTo(1.2772, 12);
      expect(result.value.basis).toBe('allowance-adjusted');
      expect(result.value.lengthPerDozenM).toBeCloseTo(15.3264, 10);
      expect(result.value.totalOrderLengthM).toBeCloseTo(127.72, 10);
    }
  });

  it('treats an explicit 0% allowance as applied and equal to base', () => {
    const result = calculateConsumption({ ...base, allowancePercent: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.basis).toBe('allowance-adjusted');
      expect(result.value.adjustedConsumptionPerGarmentM).toBeCloseTo(1.24, 12);
    }
  });

  it('converts marker length units before dividing', () => {
    const cm = calculateConsumption({ ...base, markerLength: 620, markerLengthUnit: 'cm' });
    expect(cm.ok && cm.value.baseConsumptionPerGarmentM).toBeCloseTo(1.24, 12);
    const yd = calculateConsumption({ ...base, markerLength: 10, markerLengthUnit: 'yd' });
    expect(yd.ok && yd.value.baseConsumptionPerGarmentM).toBeCloseTo(1.8288, 12);
    const inch = calculateConsumption({
      markerLength: 100,
      markerLengthUnit: 'in',
      garmentsInMarker: 5,
    });
    expect(inch.ok && inch.value.baseConsumptionPerGarmentM).toBeCloseTo(0.508, 12);
  });

  it('gives zero total order length for a zero order quantity', () => {
    const result = calculateConsumption({ ...base, orderQuantity: 0 });
    expect(result.ok && result.value.totalOrderLengthM).toBe(0);
    expect(result.ok && result.value.baseConsumptionPerGarmentM).toBeCloseTo(1.24, 12);
  });

  it('rejects zero or negative marker length', () => {
    expect(calculateConsumption({ ...base, markerLength: 0 }).ok).toBe(false);
    expect(calculateConsumption({ ...base, markerLength: -6 }).ok).toBe(false);
  });

  it('rejects zero, negative and fractional garment counts', () => {
    for (const garmentsInMarker of [0, -1, 2.5]) {
      const result = calculateConsumption({ ...base, garmentsInMarker });
      expect(!result.ok && result.errors[0]?.field).toBe('garments');
    }
  });

  it('rejects a negative allowance', () => {
    const result = calculateConsumption({ ...base, allowancePercent: -1 });
    expect(!result.ok && result.errors[0]?.field).toBe('allowance');
  });

  it('rejects negative or fractional order quantities', () => {
    expect(calculateConsumption({ ...base, orderQuantity: -5 }).ok).toBe(false);
    expect(calculateConsumption({ ...base, orderQuantity: 1.5 }).ok).toBe(false);
  });

  it('rejects non-finite input and non-finite results', () => {
    expect(calculateConsumption({ ...base, markerLength: Infinity }).ok).toBe(false);
    expect(
      calculateConsumption({ ...base, markerLength: 1e308, allowancePercent: 1e10 }).ok,
    ).toBe(false);
  });
});
