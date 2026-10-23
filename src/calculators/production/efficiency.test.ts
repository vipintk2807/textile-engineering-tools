import { describe, expect, it } from 'vitest';
import { calculateProductionEfficiency } from './efficiency';

describe('calculateProductionEfficiency', () => {
  it('850 actual vs 800 expected = 106.25% (uncapped) with a review warning', () => {
    const result = calculateProductionEfficiency({ actualProduction: 850, expectedProduction: 800 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.efficiencyPercent).toBeCloseTo(106.25, 10);
      expect(result.warnings).toHaveLength(1);
    }
  });

  it('shows 100% and below without a warning', () => {
    const exact = calculateProductionEfficiency({ actualProduction: 800, expectedProduction: 800 });
    expect(exact.ok && exact.value.efficiencyPercent).toBeCloseTo(100, 10);
    expect(exact.ok && exact.warnings).toEqual([]);
    const below = calculateProductionEfficiency({ actualProduction: 600, expectedProduction: 800 });
    expect(below.ok && below.value.efficiencyPercent).toBeCloseTo(75, 10);
    expect(below.ok && below.warnings).toEqual([]);
  });

  it('accepts zero actual production (0%)', () => {
    const result = calculateProductionEfficiency({ actualProduction: 0, expectedProduction: 800 });
    expect(result.ok && result.value.efficiencyPercent).toBe(0);
  });

  it('rejects zero expected production (no division by zero)', () => {
    const result = calculateProductionEfficiency({ actualProduction: 10, expectedProduction: 0 });
    expect(!result.ok && result.errors[0]?.field).toBe('expected');
  });

  it('rejects negative and non-finite values', () => {
    expect(calculateProductionEfficiency({ actualProduction: -1, expectedProduction: 10 }).ok).toBe(false);
    expect(calculateProductionEfficiency({ actualProduction: 1, expectedProduction: -10 }).ok).toBe(false);
    expect(calculateProductionEfficiency({ actualProduction: Number.NaN, expectedProduction: 10 }).ok).toBe(false);
    expect(calculateProductionEfficiency({ actualProduction: 1e308, expectedProduction: 1e-10 }).ok).toBe(false);
  });
});
