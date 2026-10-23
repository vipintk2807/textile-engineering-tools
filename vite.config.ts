import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// `base: './'` makes the production build use relative asset paths, so the
// static files work from any folder or sub-path (for example GitHub Pages
// project sites). Navigation uses URL hashes, so no server rewrite is needed.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
