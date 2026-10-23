import { describe, expect, it } from 'vitest';
import {
  checkNumber,
  gatherIssues,
  parseChoice,
  parseInputs,
  parseMeasurementList,
  parseNumericInput,
  parseOptionalInput,
} from './validation';

describe('parseNumericInput', () => {
  it('parses plain decimal numbers', () => {
    expect(parseNumericInput('12.5')).toEqual({ ok: true, value: 12.5 });
    expect(parseNumericInput('  7 ')).toEqual({ ok: true, value: 7 });
    expect(parseNumericInput('.5')).toEqual({ ok: true, value: 0.5 });
    expect(parseNumericInput('-3')).toEqual({ ok: true, value: -3 });
  });

  it('never returns negative zero', () => {
    const parsed = parseNumericInput('-0');
    expect(parsed.ok && Object.is(parsed.value, 0)).toBe(true);
  });

  it('reports blank input', () => {
    expect(parseNumericInput('')).toEqual({ ok: false, reason: 'blank' });
    expect(parseNumericInput('   ')).toEqual({ ok: false, reason: 'blank' });
  });

  it('rejects text, commas, units and exponents instead of reinterpreting', () => {
    for (const bad of ['abc', '1,5', '1,000', '5 g', '1e3', '0x10', 'NaN', 'Infinity', '--1', '1.2.3']) {
      expect(parseNumericInput(bad)).toEqual({ ok: false, reason: 'invalid' });
    }
  });

  it('rejects digit strings that overflow to Infinity', () => {
    expect(parseNumericInput('9'.repeat(400))).toEqual({
      ok: false,
      reason: 'non-finite',
    });
  });
});

describe('checkNumber', () => {
  it('accepts valid values', () => {
    expect(checkNumber('a', 'A', 5, { rule: 'positive' })).toBeNull();
    expect(checkNumber('a', 'A', 0, { rule: 'nonNegative' })).toBeNull();
    expect(checkNumber('a', 'A', 4, { rule: 'positive', integer: true })).toBeNull();
  });

  it('rejects zero for positive and negatives for non-negative', () => {
    expect(checkNumber('a', 'A', 0, { rule: 'positive' })?.message).toMatch(/greater than zero/);
    expect(checkNumber('a', 'A', -1, { rule: 'nonNegative' })?.message).toMatch(/zero or greater/);
  });

  it('rejects non-finite values', () => {
    for (const bad of [Number.NaN, Infinity, -Infinity]) {
      expect(checkNumber('a', 'A', bad, { rule: 'nonNegative' })?.message).toMatch(/finite/);
    }
  });

  it('rejects fractions where a whole number is required', () => {
    expect(checkNumber('a', 'A', 2.5, { rule: 'positive', integer: true })?.message).toMatch(/whole number/);
    expect(checkNumber('a', 'A', 0.5, { rule: 'positive', integer: true })?.message).toMatch(/whole number/);
  });
});

describe('parseInputs and related helpers', () => {
  it('returns numbers for valid required fields', () => {
    const parsed = parseInputs({
      a: { raw: '2', label: 'A' },
      b: { raw: '3.5', label: 'B' },
    });
    expect(parsed).toEqual({ ok: true, value: { a: 2, b: 3.5 } });
  });

  it('returns one issue per bad field and never substitutes zero', () => {
    const parsed = parseInputs({
      a: { raw: '', label: 'Alpha' },
      b: { raw: 'x', label: 'Beta' },
      c: { raw: '1', label: 'Gamma' },
    });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.errors.map((e) => e.field)).toEqual(['a', 'b']);
      expect(parsed.errors[0]?.message).toMatch(/Alpha is required/);
      expect(parsed.errors[1]?.message).toMatch(/Beta must be a plain number/);
    }
  });

  it('treats a blank optional field as undefined but rejects bad text', () => {
    expect(parseOptionalInput('f', 'F', '')).toEqual({ ok: true, value: undefined });
    expect(parseOptionalInput('f', 'F', '3')).toEqual({ ok: true, value: 3 });
    expect(parseOptionalInput('f', 'F', 'oops').ok).toBe(false);
  });

  it('accepts only listed choices', () => {
    expect(parseChoice('u', 'Unit', 'cm', ['m', 'cm'] as const)).toEqual({ ok: true, value: 'cm' });
    expect(parseChoice('u', 'Unit', 'ft', ['m', 'cm'] as const).ok).toBe(false);
  });

  it('gathers issues from several parses', () => {
    const issues = gatherIssues(
      parseOptionalInput('x', 'X', 'bad'),
      parseOptionalInput('y', 'Y', '1'),
      parseChoice('u', 'Unit', 'zz', ['m'] as const),
    );
    expect(issues.map((i) => i.field)).toEqual(['x', 'u']);
  });
});

describe('parseMeasurementList', () => {
  it('parses newline and space separated values', () => {
    expect(parseMeasurementList('12\n15 18\n')).toEqual({ ok: true, value: [12, 15, 18] });
  });

  it('rejects an empty list', () => {
    const parsed = parseMeasurementList('  \n ');
    expect(parsed.ok).toBe(false);
  });

  it('rejects commas instead of guessing the separator', () => {
    const parsed = parseMeasurementList('12,5\n13');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.errors[0]?.message).toMatch(/comma/);
    }
  });

  it('reports invalid entries by position and does not skip them', () => {
    const parsed = parseMeasurementList('1\nabc\n3\nxyz');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.errors[0]?.message).toMatch(/Entry 2 \("abc"\)/);
      expect(parsed.errors[0]?.message).toMatch(/Entry 4 \("xyz"\)/);
    }
  });

  it('limits how many invalid entries are listed', () => {
    const parsed = parseMeasurementList('a b c d e f g');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.errors[0]?.message).toMatch(/2 more invalid entries/);
    }
  });
});
