import { useState } from 'react';
import { ModeSwitch } from '../../components/ModeSwitch';
import { ConsumptionForm } from './ConsumptionForm';
import { MarkerEfficiencyForm } from './MarkerEfficiencyForm';

type Mode = 'consumption' | 'efficiency';

const MODES = [
  { value: 'consumption', label: 'Fabric Consumption' },
  { value: 'efficiency', label: 'Marker Efficiency' },
] as const;

/**
 * Two modes share a screen but keep separate inputs and results. Both stay
 * mounted so entered values survive switching modes.
 */
export function FabricConsumptionPage() {
  const [mode, setMode] = useState<Mode>('consumption');
  return (
    <div className="stack">
      <ModeSwitch legend="Calculation mode" name="fabric-mode" options={MODES} value={mode} onChange={setMode} />
      <div hidden={mode !== 'consumption'}>
        <ConsumptionForm />
      </div>
      <div hidden={mode !== 'efficiency'}>
        <MarkerEfficiencyForm />
      </div>
    </div>
  );
}
