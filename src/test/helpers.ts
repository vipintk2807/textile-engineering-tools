import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

/** Replaces the content of the field with the given label. */
export async function enter(user: UserEvent, label: string, value: string): Promise<void> {
  const field = screen.getByLabelText(label);
  await user.clear(field);
  if (value !== '') {
    await user.type(field, value);
  }
}

export async function calculate(user: UserEvent): Promise<void> {
  await user.click(screen.getByRole('button', { name: 'Calculate' }));
}
