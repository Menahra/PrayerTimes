/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [
        'tests/**/*'
      ]
    }
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    setupFiles: './tests/vitest.setup.ts',
    exclude: [
      ...configDefaults.exclude,
      'src/index.tsx'
    ],
    // @see https://github.com/marketplace/actions/vitest-coverage-report
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/index.tsx'
      ]
    },
  },
});
