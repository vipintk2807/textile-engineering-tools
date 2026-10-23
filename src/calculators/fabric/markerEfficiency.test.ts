import { describe, expect, it } from 'vitest';
import { calculateMarkerEfficiency } from './markerEfficiency';

const base = {
  patternAreaTotal: 7.75,
  markerLength: 6.2,
  markerWidth: 1.5,
  lengthUnit: 'm' as const,
};

describe('calculateMarkerEfficiency', () => {
  it('matches the reference example: 7.75 m² in 6.20 m x 1.50 m = 83.33%', () => {
    const result = calculateMarkerEfficiency(base);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.markerAreaM2).toBeCloseTo(9.3, 12);
      expect(result.value.patternAreaM2).toBeCloseTo(7.75, 12);
      expect(result.value.efficiencyPercent).toBeCloseTo(83.333333333, 8);
      expect(result.value.unusedAreaPercent).toBeCloseTo(16.666666667, 8);
    }
  });

  it('gives the same efficiency in centimetres and reports m² areas', () => {
    const result = calculateMarkerEfficiency({
      patternAreaTotal: 77_500,
      markerLength: 620,
      markerWidth: 150,
      lengthUnit: 'cm',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.efficiencyPercent).toBeCloseTo(83.333333333, 8);
      expect(result.value.markerAreaM2).toBeCloseTo(9.3, 10);
      expect(result.value.patternAreaM2).toBeCloseTo(7.75, 10);
    }
  });

  it('accepts pattern area equal to marker area (100%, 0% unused)', () => {
    const result = calculateMarkerEfficiency({ ...base, patternAreaTotal: 9.3 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.efficiencyPercent).toBeCloseTo(100, 10);
      expect(result.value.unusedAreaPercent).toBeCloseTo(0, 10);
    }
  });

  it('rejects pattern area larger than marker area and does not cap it', () => {
    const result = calculateMarkerEfficiency({ ...base, patternAreaTotal: 9.31 });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.errors[0]?.field).toBe('patternArea');
  });

  it('rejects zero or negative dimensions and area', () => {
    for (const patch of [
      { patternAreaTotal: 0 },
      { markerLength: 0 },
      { markerWidth: 0 },
      { markerWidth: -1 },
    ]) {
      expect(calculateMarkerEfficiency({ ...base, ...patch }).ok).toBe(false);
    }
  });

  it('rejects non-finite input and overflowing marker area', () => {
    expect(calculateMarkerEfficiency({ ...base, patternAreaTotal: Number.NaN }).ok).toBe(false);
    expect(
      calculateMarkerEfficiency({ ...base, markerLength: 1e200, markerWidth: 1e200 }).ok,
    ).toBe(false);
  });
});
