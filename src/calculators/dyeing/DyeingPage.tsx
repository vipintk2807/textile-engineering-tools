import { useState } from 'react';
import { ModeSwitch } from '../../components/ModeSwitch';
import { ChemicalForm } from './ChemicalForm';
import { LiquorForm } from './LiquorForm';

type Mode = 'liquor' | 'chemical';

const MODES = [
  { value: 'liquor', label: 'Liquor Quantity' },
  { value: 'chemical', label: 'Recipe Chemical Quantity' },
] as const;

/** Two independent arithmetic modes; this page never builds a recipe. */
export function DyeingPage() {
  const [mode, setMode] = useState<Mode>('liquor');
  return (
    <div className="stack">
      <ModeSwitch legend="Calculation mode" name="dyeing-mode" options={MODES} value={mode} onChange={setMode} />
      <div hidden={mode !== 'liquor'}>
        <LiquorForm />
      </div>
      <div hidden={mode !== 'chemical'}>
        <ChemicalForm />
      </div>
    </div>
  );
}
