import { useState } from 'react';
import type { Result, ValidationIssue } from '../lib/validation';

/**
 * Calculator state shared by every calculator.
 *
 * Stale-result rule (docs/app_workflow.md 4.4), applied consistently:
 * changing ANY input clears the previous result and validation messages, so
 * a result on screen always belongs to the inputs currently shown.
 */
export type Outcome<R> =
  | { status: 'idle' }
  | { status: 'invalid'; errors: ValidationIssue[] }
  | { status: 'ok'; result: R; warnings: string[] };

export interface CalculatorForm<K extends string, R> {
  values: Record<K, string>;
  outcome: Outcome<R>;
  setValue: (key: K, value: string) => void;
  calculate: () => void;
  reset: () => void;
  /** Error message for one field, if the last calculation failed on it. */
  errorFor: (key: K) => string | undefined;
  /** Errors that do not belong to a visible field (relationships, overflow). */
  generalErrors: string[];
}

export function useCalculatorForm<K extends string, R>(
  initialValues: Record<K, string>,
  compute: (values: Record<K, string>) => Result<R>,
): CalculatorForm<K, R> {
  const [values, setValues] = useState<Record<K, string>>(initialValues);
  const [outcome, setOutcome] = useState<Outcome<R>>({ status: 'idle' });

  const setValue = (key: K, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setOutcome({ status: 'idle' });
  };

  const calculate = () => {
    const result = compute(values);
    setOutcome(
      result.ok
        ? { status: 'ok', result: result.value, warnings: result.warnings }
        : { status: 'invalid', errors: result.errors },
    );
  };

  const reset = () => {
    setValues(initialValues);
    setOutcome({ status: 'idle' });
  };

  const isField = (field: string): boolean =>
    Object.prototype.hasOwnProperty.call(initialValues, field);

  const errorFor = (key: K): string | undefined =>
    outcome.status === 'invalid'
      ? outcome.errors.find((issue) => issue.field === key)?.message
      : undefined;

  const generalErrors =
    outcome.status === 'invalid'
      ? outcome.errors
          .filter((issue) => !isField(issue.field))
          .map((issue) => issue.message)
      : [];

  return { values, outcome, setValue, calculate, reset, errorFor, generalErrors };
}
