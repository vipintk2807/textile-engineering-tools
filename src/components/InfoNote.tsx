import type { ReactNode } from 'react';

/** Short, always-visible note about a convention, assumption or limitation. */
export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <p className="message message--info">
      <strong>Note: </strong>
      {children}
    </p>
  );
}
