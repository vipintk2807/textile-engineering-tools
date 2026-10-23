/**
 * Shared validation helpers and the result convention used by every
 * calculation function.
 *
 * Convention:
 * - A calculation returns `{ ok: true, value, warnings }` or
 *   `{ ok: false, errors }`.
 * - An error means no valid result exists under the documented rules.
 * - A warning means a result exists but needs review (for example OEE
 *   Performance above 100%). Warnings never alter the result.
 * - `ValidationIssue.field` matches the form-field key of the offending
 *   input. Issues about a result or a relationship with no single field use
 *   `RESULT_FIELD`.
 */

export interface ValidationIssue {
  field: string;
  message: string;
}

export type Result<T> =
  | { ok: true; value: T; warnings: string[] }
  | { ok: false; errors: ValidationIssue[] };

export const RESULT_FIELD = 'result';

export function success<T>(value: T, warnings: string[] = []): Result<T> {
  return { ok: true, value, warnings };
}

export function failure(errors: ValidationIssue[]): Result<never> {
  return { ok: false, errors };
}

/** Result of parsing form input into one or more numbers. */
export type Parsed<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationIssue[] };

/** Collects the issues of every failed parse into one list. */
export function gatherIssues(...parsed: Parsed<unknown>[]): ValidationIssue[] {
  return parsed.flatMap((item) => (item.ok ? [] : item.errors));
}

// ---------------------------------------------------------------------------
// Numeric rules (used by calculation functions)
// ---------------------------------------------------------------------------

export interface NumberCheckOptions {
  /** `positive` means > 0; `nonNegative` means >= 0. */
  rule: 'positive' | 'nonNegative';
  /** Require a whole number (counts). */
  integer?: boolean;
}

/**
 * Checks one numeric value against the documented rule. Returns an issue or
 * null. NaN and +/-Infinity are always rejected.
 */
export function checkNumber(
  field: string,
  label: string,
  value: number,
  options: NumberCheckOptions,
): ValidationIssue | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { field, message: `${label} must be a finite number.` };
  }
  if (options.rule === 'positive' && !(value > 0)) {
    return { field, message: `${label} must be greater than zero.` };
  }
  if (options.rule === 'nonNegative' && value < 0) {
    return { field, message: `${label} must be zero or greater.` };
  }
  if (options.integer && !Number.isInteger(value)) {
    return { field, message: `${label} must be a whole number.` };
  }
  return null;
}

/** Drops null entries so checks can be listed and filtered in one step. */
export function compactIssues(
  checks: ReadonlyArray<ValidationIssue | null>,
): ValidationIssue[] {
  return checks.filter((check): check is ValidationIssue => check !== null);
}

/** Issue for a calculated value that is NaN or infinite. */
export function nonFiniteResultIssue(): ValidationIssue {
  return {
    field: RESULT_FIELD,
    message:
      'The calculated result is not a finite number. Check for extremely large or small input values.',
  };
}

/** Returns an issue when any calculated value is not finite. */
export function checkFiniteResults(
  ...values: number[]
): ValidationIssue | null {
  return values.every((value) => Number.isFinite(value))
    ? null
    : nonFiniteResultIssue();
}

// ---------------------------------------------------------------------------
// Parsing raw form text (used by the interface layer)
// ---------------------------------------------------------------------------

export type NumericParseOutcome =
  | { ok: true; value: number }
  | { ok: false; reason: 'blank' | 'invalid' | 'non-finite' };

/** Plain decimal notation only: optional sign, digits, optional decimal point. */
const DECIMAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * Parses text as a plain decimal number using a decimal point. Commas,
 * units, exponents and other text are rejected rather than reinterpreted.
 */
export function parseNumericInput(raw: string): NumericParseOutcome {
  const text = raw.trim();
  if (text === '') {
    return { ok: false, reason: 'blank' };
  }
  if (!DECIMAL_PATTERN.test(text)) {
    return { ok: false, reason: 'invalid' };
  }
  const value = Number(text);
  if (!Number.isFinite(value)) {
    return { ok: false, reason: 'non-finite' };
  }
  // Normalise negative zero so it is never displayed as "-0".
  return { ok: true, value: value === 0 ? 0 : value };
}

function describeParseFailure(
  label: string,
  reason: 'blank' | 'invalid' | 'non-finite',
): string {
  switch (reason) {
    case 'blank':
      return `${label} is required.`;
    case 'invalid':
      return `${label} must be a plain number such as 12.5 (use a decimal point; commas, units and text are not accepted).`;
    case 'non-finite':
      return `${label} is too large to be processed.`;
  }
}

export interface FieldInput {
  raw: string;
  label: string;
}

/** Parses every required field; fails with one issue per bad field. */
export function parseInputs<K extends string>(
  fields: Record<K, FieldInput>,
): Parsed<Record<K, number>> {
  const errors: ValidationIssue[] = [];
  const values: Partial<Record<K, number>> = {};
  for (const key of Object.keys(fields) as K[]) {
    const input = fields[key];
    const parsed = parseNumericInput(input.raw);
    if (parsed.ok) {
      values[key] = parsed.value;
    } else {
      errors.push({
        field: key,
        message: describeParseFailure(input.label, parsed.reason),
      });
    }
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  // Every key was populated above because no error was recorded.
  return { ok: true, value: values as Record<K, number> };
}

/** Parses an optional field: blank gives `undefined`, bad text is an error. */
export function parseOptionalInput(
  field: string,
  label: string,
  raw: string,
): Parsed<number | undefined> {
  const parsed = parseNumericInput(raw);
  if (parsed.ok) {
    return { ok: true, value: parsed.value };
  }
  if (parsed.reason === 'blank') {
    return { ok: true, value: undefined };
  }
  return {
    ok: false,
    errors: [{ field, message: describeParseFailure(label, parsed.reason) }],
  };
}

/** Accepts only a value from the supported list (used for unit selectors). */
export function parseChoice<U extends string>(
  field: string,
  label: string,
  raw: string,
  allowed: readonly U[],
): Parsed<U> {
  const match = allowed.find((option) => option === raw);
  if (match === undefined) {
    return {
      ok: false,
      errors: [{ field, message: `${label}: choose one of the listed units.` }],
    };
  }
  return { ok: true, value: match };
}

const MAX_LISTED_BAD_ENTRIES = 5;

function shorten(token: string): string {
  return token.length > 20 ? `${token.slice(0, 20)}…` : token;
}

/**
 * Parses a list of measurements separated by line breaks or spaces. Commas
 * are rejected because they are ambiguous (decimal comma or separator).
 * Invalid entries are reported, never skipped.
 */
export function parseMeasurementList(
  raw: string,
  field = 'measurements',
): Parsed<number[]> {
  const tokens = raw.split(/\s+/).filter((token) => token !== '');
  if (tokens.length === 0) {
    return {
      ok: false,
      errors: [
        {
          field,
          message:
            'Enter at least two measurements, one per line (or separated by spaces).',
        },
      ],
    };
  }

  const values: number[] = [];
  const problems: string[] = [];
  tokens.forEach((token, index) => {
    const position = index + 1;
    if (token.includes(',')) {
      problems.push(
        `Entry ${position} ("${shorten(token)}") contains a comma; separate measurements with line breaks or spaces and use a decimal point.`,
      );
      return;
    }
    const parsed = parseNumericInput(token);
    if (parsed.ok) {
      values.push(parsed.value);
    } else {
      problems.push(
        `Entry ${position} ("${shorten(token)}") is not a valid number.`,
      );
    }
  });

  if (problems.length > 0) {
    const listed = problems.slice(0, MAX_LISTED_BAD_ENTRIES);
    const extra = problems.length - listed.length;
    const suffix = extra > 0 ? ` (${extra} more invalid entries not listed.)` : '';
    return {
      ok: false,
      errors: [{ field, message: `${listed.join(' ')}${suffix}` }],
    };
  }
  return { ok: true, value: values };
}
