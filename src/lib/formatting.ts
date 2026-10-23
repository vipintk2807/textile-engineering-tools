/**
 * Presentation-only number formatting. Values passed here are never fed back
 * into calculations. Numbers use a decimal point and comma thousands
 * grouping (en-US) consistently across the application.
 */

export const NOT_AVAILABLE = 'Not available';

export interface FormatOptions {
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export function formatNumber(value: number, options: FormatOptions): string {
  if (!Number.isFinite(value)) {
    return NOT_AVAILABLE;
  }
  const { minimumFractionDigits, maximumFractionDigits } = options;
  // Very small non-zero values would display as 0.00; keep significant digits.
  if (value !== 0 && Math.abs(value) < 10 ** -maximumFractionDigits) {
    return new Intl.NumberFormat('en-US', {
      maximumSignificantDigits: 3,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/** Percentages and GSM: two decimal places (calculation reference 2.3). */
export function formatFixed2(value: number): string {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Lengths, areas and masses: 2 to 4 decimal places. */
export function formatQuantity(value: number): string {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

/** Counts that should read as whole numbers when they are whole. */
export function formatCount(value: number): string {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Theoretical (possibly fractional) output: up to 4 decimal places. */
export function formatTheoretical(value: number): string {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

/** Echoes an entered value in a formula (up to 6 decimal places). */
export function formatInput(value: number): string {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}
