import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { calculate, enter } from '../../test/helpers';
import { CapacityPage } from './CapacityPage';
import { EfficiencyCalculator } from './EfficiencyCalculator';
import { OeeCalculator } from './OeeCalculator';

describe('CapacityPage', () => {
  it('rate mode: 120 units/hour for 7.5 h gives 900 theoretical units', async () => {
    const user = userEvent.setup();
    render(<CapacityPage />);
    await enter(user, 'Production rate (units/hour)', '120');
    await enter(user, 'Operating time (h)', '7.5');
    await calculate(user);
    expect(screen.getAllByText('900').length).toBeGreaterThan(0);
    expect(screen.getByText(/not a\s+prediction or guarantee of actual production/)).toBeInTheDocument();
  });

  it('rate mode keeps fractional theoretical output separate from whole units', async () => {
    const user = userEvent.setup();
    render(<CapacityPage />);
    await enter(user, 'Production rate (units/hour)', '1.2');
    await enter(user, 'Operating time (h)', '9');
    await calculate(user);
    expect(screen.getByText('10.8')).toBeInTheDocument();
    expect(screen.getByText('10 units')).toBeInTheDocument();
  });

  it('cycle-time mode: 7.5 h at 45 s/unit gives 600 units and rejects zero cycle time', async () => {
    const user = userEvent.setup();
    render(<CapacityPage />);
    await user.click(screen.getByRole('radio', { name: 'Cycle Time' }));
    await enter(user, 'Available operating time', '7.5');
    await enter(user, 'Cycle time (s/unit)', '45');
    await calculate(user);
    expect(screen.getAllByText('600').length).toBeGreaterThan(0);
    await enter(user, 'Cycle time (s/unit)', '0');
    await calculate(user);
    expect(screen.getByText(/Cycle time \(s\/unit\) must be greater than zero/)).toBeInTheDocument();
  });
});

describe('EfficiencyCalculator', () => {
  it('shows 106.25 % uncapped with a review warning', async () => {
    const user = userEvent.setup();
    render(<EfficiencyCalculator />);
    await enter(user, 'Actual production (units)', '850');
    await enter(user, 'Expected production (units)', '800');
    await calculate(user);
    expect(screen.getByText('106.25')).toBeInTheDocument();
    expect(screen.getByText(/Actual production exceeds the expected production/)).toBeInTheDocument();
  });

  it('rejects zero expected production', async () => {
    const user = userEvent.setup();
    render(<EfficiencyCalculator />);
    await enter(user, 'Actual production (units)', '10');
    await enter(user, 'Expected production (units)', '0');
    await calculate(user);
    expect(screen.getByText(/Expected production \(units\) must be greater than zero/)).toBeInTheDocument();
  });
});

describe('OeeCalculator', () => {
  async function fillOee(
    user: ReturnType<typeof userEvent.setup>,
    values: [string, string, string, string, string],
  ) {
    await enter(user, 'Planned production time (min)', values[0]);
    await enter(user, 'Included downtime (min)', values[1]);
    await enter(user, 'Ideal cycle time (s/unit)', values[2]);
    await enter(user, 'Total units produced (units)', values[3]);
    await enter(user, 'Good units produced (units)', values[4]);
  }

  it('reproduces the reference example: OEE 74.79 %', async () => {
    const user = userEvent.setup();
    render(<OeeCalculator />);
    await fillOee(user, ['420', '47', '1', '19271', '18848']);
    await calculate(user);
    expect(screen.getByText('74.79')).toBeInTheDocument();
    expect(screen.getByText('88.81 %')).toBeInTheDocument();
    expect(screen.getByText('86.11 %')).toBeInTheDocument();
    expect(screen.getByText('97.80 %')).toBeInTheDocument();
    expect(screen.getByText('22,380 s')).toBeInTheDocument();
    expect(screen.queryByText(/Performance is above 100%/)).not.toBeInTheDocument();
  });

  it('warns, without capping, when Performance exceeds 100 %', async () => {
    const user = userEvent.setup();
    render(<OeeCalculator />);
    await fillOee(user, ['420', '47', '2', '19271', '18848']);
    await calculate(user);
    expect(screen.getByText('172.22 %')).toBeInTheDocument();
    expect(screen.getByText(/Performance is above 100%/)).toBeInTheDocument();
  });

  it('marks Performance and OEE as not available when run time is zero', async () => {
    const user = userEvent.setup();
    render(<OeeCalculator />);
    await fillOee(user, ['420', '420', '1', '19271', '18848']);
    await calculate(user);
    expect(screen.getAllByText('Not available').length).toBeGreaterThan(0);
    expect(screen.getByText(/Run time is zero/)).toBeInTheDocument();
  });

  it('rejects inconsistent counts and downtime greater than planned time', async () => {
    const user = userEvent.setup();
    render(<OeeCalculator />);
    await fillOee(user, ['420', '421', '1', '10', '11']);
    await calculate(user);
    expect(screen.getByText(/must not exceed planned production time/)).toBeInTheDocument();
    expect(screen.getByText(/cannot exceed total units/)).toBeInTheDocument();
  });

  it('updates input labels when the time unit changes', async () => {
    const user = userEvent.setup();
    render(<OeeCalculator />);
    await user.selectOptions(screen.getByLabelText('Time unit (planned time and downtime)'), 'h');
    expect(screen.getByLabelText('Planned production time (h)')).toBeInTheDocument();
    expect(screen.getByLabelText('Included downtime (h)')).toBeInTheDocument();
  });
});
