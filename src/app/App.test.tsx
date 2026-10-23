import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { CATEGORIES } from './navigation';

beforeEach(() => {
  window.location.hash = '';
});

describe('Home screen', () => {
  it('describes the application and links to every implemented calculator', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Textile Engineering Tools' }),
    ).toBeInTheDocument();
    const tools = CATEGORIES.flatMap((category) => category.tools);
    expect(tools).toHaveLength(7);
    for (const tool of tools) {
      expect(screen.getAllByRole('link', { name: tool.title }).length).toBeGreaterThan(0);
    }
  });

  it('shows the accuracy and assumptions notice and no fabricated statistics', () => {
    render(<App />);
    expect(screen.getByText(/depend on the accuracy of the values you enter/)).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  it('lists the main navigation items and marks the current page', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toHaveTextContent('Home');
    expect(nav).toHaveTextContent('About and Limitations');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens a category and then a calculator from the links', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('link', { name: 'Fabric Calculators' })[0]!);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Fabric Calculators' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Fabric GSM Calculator' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Fabric GSM Calculator' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Sample mass (g)')).toBeInTheDocument();
  });

  it('opens the calculator named in the URL hash', () => {
    window.location.hash = '#/oee';
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'OEE Calculator' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ideal cycle time (s/unit)')).toBeInTheDocument();
  });

  it('shows a clear message for an unknown address', () => {
    window.location.hash = '#/nothing-here';
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });

  it('shows the About and Limitations page', () => {
    window.location.hash = '#/about';
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'About and Limitations' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not replace laboratory testing/)).toBeInTheDocument();
  });

  it('toggles the compact menu with an accurate expanded state', async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
