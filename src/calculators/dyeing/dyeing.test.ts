import { describe, expect, it } from 'vitest';
import { calculateChemicalQuantity } from './chemical';
import { calculateLiquorQuantity } from './liquor';

describe('calculateLiquorQuantity', () => {
  it('250 kg at 1:8 gives 2,000 kg liquor and about 2,000 L at 1 kg/L', () => {
    const result = calculateLiquorQuantity({ batchMassKg: 250, liquorRatio: 8 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.liquorMassKg).toBeCloseTo(2000, 9);
      expect(result.value.approximateLiquorVolumeL).toBeCloseTo(2000, 9);
      expect(result.value.densityAssumptionKgPerL).toBe(1);
    }
  });

  it('supports fractional batch mass and ratio (12.5 kg x 7.5 = 93.75 kg)', () => {
    const result = calculateLiquorQuantity({ batchMassKg: 12.5, liquorRatio: 7.5 });
    expect(result.ok && result.value.liquorMassKg).toBeCloseTo(93.75, 10);
  });

  it('rejects zero or negative batch mass and ratio', () => {
    for (const patch of [
      { batchMassKg: 0 },
      { batchMassKg: -5 },
      { liquorRatio: 0 },
      { liquorRatio: -8 },
    ]) {
      expect(calculateLiquorQuantity({ batchMassKg: 250, liquorRatio: 8, ...patch }).ok).toBe(false);
    }
  });

  it('rejects non-finite input and overflowing results', () => {
    expect(calculateLiquorQuantity({ batchMassKg: Number.NaN, liquorRatio: 8 }).ok).toBe(false);
    expect(calculateLiquorQuantity({ batchMassKg: 1e308, liquorRatio: 1e10 }).ok).toBe(false);
  });
});

describe('calculateChemicalQuantity', () => {
  it('250 kg at 2% owf gives 5 kg and 5,000 g', () => {
    const result = calculateChemicalQuantity({ batchMassKg: 250, percentOwf: 2 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.chemicalMassKg).toBeCloseTo(5, 10);
      expect(result.value.chemicalMassG).toBeCloseTo(5000, 8);
    }
  });

  it('converts the percentage by dividing by 100, not using 0.02 as 2%', () => {
    const result = calculateChemicalQuantity({ batchMassKg: 250, percentOwf: 0.05 });
    expect(result.ok && result.value.chemicalMassG).toBeCloseTo(125, 8);
  });

  it('allows zero percentage and returns zero quantity', () => {
    const result = calculateChemicalQuantity({ batchMassKg: 250, percentOwf: 0 });
    expect(result.ok && result.value.chemicalMassKg).toBe(0);
  });

  it('rejects negative percentage and non-positive batch mass', () => {
    expect(calculateChemicalQuantity({ batchMassKg: 250, percentOwf: -1 }).ok).toBe(false);
    expect(calculateChemicalQuantity({ batchMassKg: 0, percentOwf: 2 }).ok).toBe(false);
  });

  it('rejects non-finite results', () => {
    expect(calculateChemicalQuantity({ batchMassKg: 1e308, percentOwf: 1e10 }).ok).toBe(false);
  });
});
