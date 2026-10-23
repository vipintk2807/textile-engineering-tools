import type { ReactNode } from 'react';

interface CalculatorCardProps {
  /** Accessible name of the calculator region. */
  label: string;
  /** Visible heading (omit when the page heading already names the tool). */
  title?: string;
  description?: string;
  children: ReactNode;
}

/** White panel that wraps one calculator (inputs, result and details). */
export function CalculatorCard({ label, title, description, children }: CalculatorCardProps) {
  return (
    <section className="panel calculator-card" aria-label={label}>
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="calculator-card__description">{description}</p> : null}
      {children}
    </section>
  );
}
