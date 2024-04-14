import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './server';

// since we do not use vitest globals we need to extend expect
expect.extend(matchers);

// needed for accessibility testing
expect.extend(toHaveNoViolations);

// add msw
beforeAll(() => {
  server.listen()
});

// clear environment after each test case
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

