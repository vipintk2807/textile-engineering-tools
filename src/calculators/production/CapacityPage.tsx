import { useState } from 'react';
import { ModeSwitch } from '../../components/ModeSwitch';
import { CapacityCycleForm } from './CapacityCycleForm';
import { CapacityRateForm } from './CapacityRateForm';

type Mode = 'rate' | 'cycle';

const MODES = [
  { value: 'rate', label: 'Production Rate' },
  { value: 'cycle', label: 'Cycle Time' },
] as const;

export function CapacityPage() {
  const [mode, setMode] = useState<Mode>('rate');
  return (
    <div className="stack">
      <ModeSwitch legend="Calculation mode" name="capacity-mode" options={MODES} value={mode} onChange={setMode} />
      <div hidden={mode !== 'rate'}>
        <CapacityRateForm />
      </div>
      <div hidden={mode !== 'cycle'}>
        <CapacityCycleForm />
      </div>
    </div>
  );
}
