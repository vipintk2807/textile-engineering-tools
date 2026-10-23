import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { calculate, enter } from '../../test/helpers';
import { FabricConsumptionPage } from './FabricConsumptionPage';
import { GsmCalculator } from './GsmCalculator';

describe('GsmCalculator', () => {
  it('has labelled inputs with units and a neutral empty result', () => {
    render(<GsmCalculator />);
    expect(screen.getByLabelText('Sample mass (g)')).toBeInTheDocument();
    expect(screen.getByLabelText('Sample length (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Sample width (cm)')).toBeInTheDocument();
    expect(screen.getByText(/No result is shown until a valid calculation/)).toBeInTheDocument();
  });

  it('reports missing values and shows no result', async () => {
    const user = userEvent.setup();
    render(<GsmCalculator />);
    await calculate(user);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getAllByText(/is required/)).toHaveLength(3);
    expect(screen.getByLabelText('Sample mass (g)')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('g/m²')).not.toBeInTheDocument();
  });

  it('rejects zero, negative and non-numeric values with specific messages', async () => {
    const user = userEvent.setup();
    render(<GsmCalculator />);
    await enter(user, 'Sample mass (g)', '0');
    await enter(user, 'Sample length (cm)', '20');
    await enter(user, 'Sample width (cm)', '-5');
    await calculate(user);
    expect(screen.getByText(/Sample mass \(g\) must be greater than zero/)).toBeInTheDocument();
    expect(screen.getByText(/Sample width \(cm\) must be greater than zero/)).toBeInTheDocument();
    await enter(user, 'Sample mass (g)', '1,5');
    await calculate(user);
    expect(screen.getByText(/Sample mass \(g\) must be a plain number/)).toBeInTheDocument();
  });

  it('shows the reference result 240.00 g/m² with area and substituted formula', async () => {
    const user = userEvent.setup();
    render(<GsmCalculator />);
    await enter(user, 'Sample mass (g)', '9.6');
    await enter(user, 'Sample length (cm)', '20');
    await enter(user, 'Sample width (cm)', '20');
    await calculate(user);
    expect(screen.getByText('240.00')).toBeInTheDocument();
    expect(screen.getByText('400.00 cm²')).toBeInTheDocument();
    expect(screen.getByText(/GSM = 9.6 × 10,000 ÷ 400.00 = 240.00 g\/m²/)).toBeInTheDocument();
    expect(screen.getByText(/not a standards-compliant fabric test result/)).toBeInTheDocument();
  });

  it('clears the result when an input is edited (no stale result)', async () => {
    const user = userEvent.setup();
    render(<GsmCalculator />);
    await enter(user, 'Sample mass (g)', '9.6');
    await enter(user, 'Sample length (cm)', '20');
    await enter(user, 'Sample width (cm)', '20');
    await calculate(user);
    expect(screen.getByText('240.00')).toBeInTheDocument();
    await enter(user, 'Sample width (cm)', '21');
    expect(screen.queryByText('240.00')).not.toBeInTheDocument();
    expect(screen.getByText(/No result is shown until a valid calculation/)).toBeInTheDocument();
  });

  it('Reset clears inputs, errors and results', async () => {
    const user = userEvent.setup();
    render(<GsmCalculator />);
    await enter(user, 'Sample mass (g)', '9.6');
    await calculate(user);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Sample mass (g)')).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('exposes formula and assumption details', () => {
    render(<GsmCalculator />);
    expect(screen.getByText('Formula, units and assumptions')).toBeInTheDocument();
    expect(screen.getByText(/GSM \(g\/m²\) = Mass \(g\) × 10,000 ÷ Area \(cm²\)/)).toBeInTheDocument();
    expect(screen.getByText(/does not claim compliance/)).toBeInTheDocument();
  });
});

describe('FabricConsumptionPage', () => {
  it('shows base consumption only when no allowance is entered', async () => {
    const user = userEvent.setup();
    render(<FabricConsumptionPage />);
    await enter(user, 'Marker length', '6.2');
    await enter(user, 'Garments represented by the marker (garments)', '5');
    await calculate(user);
    expect(screen.getByText(/base, marker-based/)).toBeInTheDocument();
    expect(screen.queryByText(/Allowance-adjusted consumption per garment/)).not.toBeInTheDocument();
  });

  it('shows adjusted consumption, dozen length and order length for a 3% allowance', async () => {
    const user = userEvent.setup();
    render(<FabricConsumptionPage />);
    await enter(user, 'Marker length', '6.2');
    await enter(user, 'Garments represented by the marker (garments)', '5');
    await enter(user, 'Allowance (%) (optional)', '3');
    await enter(user, 'Order quantity (garments) (optional)', '100');
    await calculate(user);
    expect(screen.getAllByText(/1\.2772/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/15\.3264/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/127\.72/).length).toBeGreaterThan(0);
  });

  it('rejects a fractional garment count and a negative allowance', async () => {
    const user = userEvent.setup();
    render(<FabricConsumptionPage />);
    await enter(user, 'Marker length', '6.2');
    await enter(user, 'Garments represented by the marker (garments)', '2.5');
    await enter(user, 'Allowance (%) (optional)', '-1');
    await calculate(user);
    expect(screen.getByText(/must be a whole number/)).toBeInTheDocument();
    expect(screen.getByText(/Allowance \(%\) must be zero or greater/)).toBeInTheDocument();
  });

  it('switches to marker efficiency and reports 83.33 %', async () => {
    const user = userEvent.setup();
    render(<FabricConsumptionPage />);
    await user.click(screen.getByRole('radio', { name: 'Marker Efficiency' }));
    const region = screen.getByRole('region', { name: 'Marker Efficiency' });
    expect(region).toBeInTheDocument();
    await enter(user, 'Total pattern-piece area (m²)', '7.75');
    await enter(user, 'Marker length (m)', '6.2');
    await enter(user, 'Usable marker width (m)', '1.5');
    await calculate(user);
    expect(screen.getByText('83.33')).toBeInTheDocument();
    expect(screen.getByText('9.30 m²')).toBeInTheDocument();
  });

  it('rejects pattern area larger than the marker area', async () => {
    const user = userEvent.setup();
    render(<FabricConsumptionPage />);
    await user.click(screen.getByRole('radio', { name: 'Marker Efficiency' }));
    await enter(user, 'Total pattern-piece area (m²)', '9.5');
    await enter(user, 'Marker length (m)', '6.2');
    await enter(user, 'Usable marker width (m)', '1.5');
    await calculate(user);
    expect(screen.getByText(/must not exceed the marker area/)).toBeInTheDocument();
  });
});
