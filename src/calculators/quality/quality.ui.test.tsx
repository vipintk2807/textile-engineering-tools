import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QualityPage } from './QualityPage';

function regionNamed(name: string): HTMLElement {
  return screen.getByRole('region', { name });
}

async function type(user: ReturnType<typeof userEvent.setup>, region: HTMLElement, label: string, value: string) {
  const field = within(region).getByLabelText(label);
  await user.clear(field);
  if (value !== '') {
    await user.type(field, value);
  }
}

async function calc(user: ReturnType<typeof userEvent.setup>, region: HTMLElement) {
  await user.click(within(region).getByRole('button', { name: 'Calculate' }));
}

describe('QualityPage', () => {
  it('defect percentage: 12 of 600 gives 2.00 %', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const region = regionNamed('Defect Percentage');
    await type(user, region, 'Defective units (units)', '12');
    await type(user, region, 'Inspected units (units)', '600');
    await calc(user, region);
    expect(within(region).getByText('2.00')).toBeInTheDocument();
  });

  it('defect percentage rejects defective units above inspected units', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const region = regionNamed('Defect Percentage');
    await type(user, region, 'Defective units (units)', '601');
    await type(user, region, 'Inspected units (units)', '600');
    await calc(user, region);
    expect(within(region).getByText(/cannot exceed inspected units/)).toBeInTheDocument();
  });

  it('measurement average: 12, 15, 18 gives 15 from 3 measurements', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const region = regionNamed('Measurement Average');
    await type(user, region, 'Measurements (one per line)', '12 15 18');
    await calc(user, region);
    expect(within(region).getByText('15')).toBeInTheDocument();
    expect(within(region).getByText('Number of measurements')).toBeInTheDocument();
  });

  it('rejects a single measurement, commas and invalid entries', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const region = regionNamed('Measurement Average');
    await type(user, region, 'Measurements (one per line)', '12');
    await calc(user, region);
    expect(within(region).getByText(/at least 2/)).toBeInTheDocument();
    await type(user, region, 'Measurements (one per line)', '12 1,5');
    await calc(user, region);
    expect(within(region).getByText(/contains a comma/)).toBeInTheDocument();
    await type(user, region, 'Measurements (one per line)', '12 abc');
    await calc(user, region);
    expect(within(region).getByText(/Entry 2 \("abc"\) is not a valid number/)).toBeInTheDocument();
  });

  it('minimum, maximum and range for 12, 15, 18 with a unit label', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const region = regionNamed('Minimum, Maximum and Range');
    await type(user, region, 'Measurements (one per line)', '12 15 18');
    await type(user, region, 'Unit of measurement', 'mm');
    await calc(user, region);
    expect(within(region).getByText('12 mm')).toBeInTheDocument();
    expect(within(region).getByText('18 mm')).toBeInTheDocument();
    expect(within(region).getByText('Range (maximum − minimum)')).toBeInTheDocument();
  });

  it('Reset affects only its own calculator', async () => {
    const user = userEvent.setup();
    render(<QualityPage />);
    const defect = regionNamed('Defect Percentage');
    const mean = regionNamed('Measurement Average');
    await type(user, defect, 'Defective units (units)', '1');
    await type(user, defect, 'Inspected units (units)', '10');
    await calc(user, defect);
    await type(user, mean, 'Measurements (one per line)', '1 2');
    await user.click(within(mean).getByRole('button', { name: 'Reset' }));
    expect(within(mean).getByLabelText('Measurements (one per line)')).toHaveValue('');
    expect(within(defect).getByText('10.00')).toBeInTheDocument();
  });
});
