import { describe, expect, it } from 'vitest';
import { calculateGsm } from './gsm';

const base = { sampleMassG: 9.6, sampleLengthCm: 20, sampleWidthCm: 20 };

describe('calculateGsm', () => {
  it('matches the reference example: 9.60 g, 20 cm x 20 cm = 240 g/m²', () => {
    const result = calculateGsm(base);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sampleAreaCm2).toBeCloseTo(400, 9);
      expect(result.value.sampleAreaM2).toBeCloseTo(0.04, 12);
      expect(result.value.gsm).toBeCloseTo(240, 9);
      expect(result.warnings).toEqual([]);
    }
  });

  it('checks other independently calculated samples', () => {
    const a = calculateGsm({ sampleMassG: 5, sampleLengthCm: 10, sampleWidthCm: 10 });
    expect(a.ok && a.value.gsm).toBeCloseTo(500, 9);
    const b = calculateGsm({ sampleMassG: 0.5, sampleLengthCm: 5, sampleWidthCm: 5 });
    expect(b.ok && b.value.gsm).toBeCloseTo(200, 9);
  });

  it('rejects zero and negative mass, length and width', () => {
    for (const patch of [
      { sampleMassG: 0 },
      { sampleMassG: -1 },
      { sampleLengthCm: 0 },
      { sampleWidthCm: -2 },
    ]) {
      const result = calculateGsm({ ...base, ...patch });
      expect(result.ok).toBe(false);
    }
  });

  it('reports the offending field', () => {
    const result = calculateGsm({ ...base, sampleLengthCm: 0 });
    expect(!result.ok && result.errors.map((e) => e.field)).toEqual(['sampleLength']);
  });

  it('rejects non-finite values', () => {
    for (const bad of [Number.NaN, Infinity, -Infinity]) {
      expect(calculateGsm({ ...base, sampleMassG: bad }).ok).toBe(false);
    }
  });

  it('rejects an area that overflows or underflows', () => {
    expect(calculateGsm({ sampleMassG: 1, sampleLengthCm: 1e200, sampleWidthCm: 1e200 }).ok).toBe(false);
    expect(calculateGsm({ sampleMassG: 1, sampleLengthCm: 1e-200, sampleWidthCm: 1e-200 }).ok).toBe(false);
  });

  it('rejects a non-finite GSM from extreme mass', () => {
    const result = calculateGsm({ sampleMassG: 1e305, sampleLengthCm: 1, sampleWidthCm: 1 });
    expect(result.ok).toBe(false);
  });
});
