import type { FormEvent, ReactNode } from 'react';

interface CalculatorFormProps {
  onCalculate: () => void;
  onReset: () => void;
  children: ReactNode;
}

/** Form wrapper with the shared Calculate and Reset actions. */
export function CalculatorForm({ onCalculate, onReset, children }: CalculatorFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCalculate();
  };
  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      {children}
      <div className="button-row">
        <button type="submit" className="button button--primary">
          Calculate
        </button>
        <button type="button" className="button button--secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
