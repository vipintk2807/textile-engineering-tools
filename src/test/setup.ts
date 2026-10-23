import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom does not implement scrolling; the app scrolls to the top on navigation.
window.scrollTo = vi.fn();

// Globals are not enabled, so register Testing Library cleanup explicitly.
afterEach(() => {
  cleanup();
});
