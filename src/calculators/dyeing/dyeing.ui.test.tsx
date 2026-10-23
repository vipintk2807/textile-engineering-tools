import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { calculate, enter } from '../../test/helpers';
import { ChemicalForm } from './ChemicalForm';
import { LiquorForm } from './LiquorForm';

describe('LiquorForm', () => {
  const ratioLabel = 'Liquor-ratio multiplier R (dimensionless, for a ratio of 1:R)';

  it('explains the ratio convention next to the input', () => {
    render(<LiquorForm />);
    expect(screen.getByText(/Do not type 1:8/)).toBeInTheDocument();
  });

  it('calculates liquor mass and labels the volume as an approximation', async () => {
    const user = userEvent.setup();
    render(<LiquorForm />);
    await enter(user, 'Textile batch mass (kg)', '250');
    await enter(user, ratioLabel, '8');
    await calculate(user);
    expect(screen.getByText('2,000.00')).toBeInTheDocument();
    expect(screen.getByText('≈ 2,000.00 L')).toBeInTheDocument();
    expect(screen.getByText(/estimate, assumes density/)).toBeInTheDocument();
  });

  it('rejects the text "1:8" and a zero multiplier', async () => {
    const user = userEvent.setup();
    render(<LiquorForm />);
    await enter(user, 'Textile batch mass (kg)', '250');
    await enter(user, ratioLabel, '1:8');
    await calculate(user);
    expect(screen.getByText(/must be a plain number/)).toBeInTheDocument();
    await enter(user, ratioLabel, '0');
    await calculate(user);
    expect(screen.getByText(/must be greater than zero/)).toBeInTheDocument();
  });
});

describe('ChemicalForm', () => {
  it('calculates 5.00 kg and 5,000.00 g for 2 % owf on 250 kg', async () => {
    const user = userEvent.setup();
    render(<ChemicalForm />);
    await enter(user, 'Textile batch mass (kg)', '250');
    await enter(user, 'Chemical amount (% owf)', '2');
    await calculate(user);
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.getByText('5,000.00 g')).toBeInTheDocument();
    expect(screen.getByText(/not a recommended recipe or dosage/)).toBeInTheDocument();
  });

  it('accepts 0 % and rejects a negative percentage', async () => {
    const user = userEvent.setup();
    render(<ChemicalForm />);
    await enter(user, 'Textile batch mass (kg)', '250');
    await enter(user, 'Chemical amount (% owf)', '0');
    await calculate(user);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await enter(user, 'Chemical amount (% owf)', '-2');
    await calculate(user);
    expect(screen.getByText(/must be zero or greater/)).toBeInTheDocument();
  });
});
