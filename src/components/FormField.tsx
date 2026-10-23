import { useId } from 'react';
import type { ReactNode } from 'react';
import { ValidationMessage } from './ValidationMessage';

interface FieldFrameProps {
  id: string;
  label: string;
  optional?: boolean;
  helper?: string;
  error?: string | undefined;
  children: ReactNode;
}

function FieldFrame({ id, label, optional, helper, error, children }: FieldFrameProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {optional ? <span className="field__optional"> (optional)</span> : null}
      </label>
      {children}
      {helper ? (
        <p className="field__helper" id={`${id}-helper`}>
          {helper}
        </p>
      ) : null}
      {error ? <ValidationMessage id={`${id}-error`} message={error} /> : null}
    </div>
  );
}

function describedBy(id: string, helper?: string, error?: string): string | undefined {
  const ids = [helper ? `${id}-helper` : '', error ? `${id}-error` : ''].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export interface UnitOption {
  value: string;
  label: string;
}

interface NumberFieldProps {
  /** Visible label, including the unit, for example "Sample mass (g)". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  helper?: string;
  error?: string | undefined;
  placeholder?: string;
  /** Optional unit selector shown next to the input. */
  unit?: {
    label: string;
    value: string;
    options: readonly UnitOption[];
    onChange: (value: string) => void;
  };
}

/**
 * Text input for a plain decimal number. A text input (not type="number") is
 * used so that blank, malformed and out-of-range values can be told apart and
 * reported with specific messages.
 */
export function NumberField({
  label,
  value,
  onChange,
  optional,
  helper,
  error,
  placeholder,
  unit,
}: NumberFieldProps) {
  const id = useId();
  const unitId = `${id}-unit`;
  return (
    <FieldFrame id={id} label={label} optional={optional} helper={helper} error={error}>
      <div className="field__row">
        <input
          id={id}
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          onChange={(event) => onChange(event.target.value)}
        />
        {unit ? (
          <>
            <label className="visually-hidden" htmlFor={unitId}>
              {unit.label}
            </label>
            <select
              id={unitId}
              className="select"
              value={unit.value}
              onChange={(event) => unit.onChange(event.target.value)}
            >
              {unit.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>
    </FieldFrame>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string | undefined;
  placeholder?: string;
}

/** Multi-line entry, used for measurement lists. */
export function TextAreaField({
  label,
  value,
  onChange,
  helper,
  error,
  placeholder,
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} helper={helper} error={error}>
      <textarea
        id={id}
        className="textarea"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldFrame>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly UnitOption[];
  helper?: string;
}

export function SelectField({ label, value, onChange, options, helper }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} helper={helper}>
      <select
        id={id}
        className="select"
        value={value}
        aria-describedby={describedBy(id, helper)}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  placeholder?: string;
  maxLength?: number;
}

/** Plain text input for labels that are never parsed as numbers. */
export function TextField({ label, value, onChange, helper, placeholder, maxLength }: TextFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} optional helper={helper}>
      <input
        id={id}
        className="input"
        type="text"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={describedBy(id, helper)}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldFrame>
  );
}
