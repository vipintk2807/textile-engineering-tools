import type { ReactNode } from 'react';
import { WarningMessage } from './WarningMessage';

interface ResultPanelProps {
  status: 'idle' | 'invalid' | 'ok';
  /** Errors that are not attached to a visible field. */
  generalErrors?: readonly string[];
  warnings?: readonly string[];
  /** Result content, shown only when status is "ok". */
  children?: ReactNode;
}

/**
 * Result area. Before a valid calculation it shows only a neutral
 * instruction; it never shows example or default results.
 */
export function ResultPanel({ status, generalErrors = [], warnings = [], children }: ResultPanelProps) {
  return (
    <div className="result-panel" aria-live="polite">
      <h3>Result</h3>
      {status === 'idle' ? (
        <p className="result-panel__empty">
          Enter the required values and select Calculate. No result is shown until a valid
          calculation has been performed.
        </p>
      ) : null}
      {status === 'invalid' ? (
        <div className="message message--error" role="alert">
          <p>
            <strong>Cannot calculate. </strong>
            Correct the input marked with an error and select Calculate again.
          </p>
          {generalErrors.length > 0 ? (
            <ul>
              {generalErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {status === 'ok' ? (
        <>
          <WarningMessage messages={warnings} />
          {children}
        </>
      ) : null}
    </div>
  );
}

interface PrimaryResultProps {
  label: string;
  value: string;
  unit: string;
}

export function PrimaryResult({ label, value, unit }: PrimaryResultProps) {
  return (
    <div className="primary-result">
      <p className="primary-result__label">{label}</p>
      <p className="primary-result__value">
        <span>{value}</span>
        <span className="primary-result__unit">{unit}</span>
      </p>
    </div>
  );
}

export interface ResultItem {
  label: string;
  value: string;
  /** Short qualifier shown under the label, for example "approximate". */
  note?: string;
}

/** Supporting values as a labelled list (units are part of `value`). */
export function ResultList({ items }: { items: readonly ResultItem[] }) {
  return (
    <dl className="result-list">
      {items.map((item) => (
        <div key={item.label} className="result-list__item">
          <dt>
            {item.label}
            {item.note ? <span className="result-list__note">{item.note}</span> : null}
          </dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
