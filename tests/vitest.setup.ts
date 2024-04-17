import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './server';
import { useStore } from '../src/store';
import type { PropsWithChildren } from 'react';

// since we do not use vitest globals we need to extend expect
expect.extend(matchers);

// needed for accessibility testing
expect.extend(toHaveNoViolations);

// mock internationalization
vi.mock('talkr', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    Talkr: ({children}: PropsWithChildren) => children,
    useT: () => ({
      T: (str: string) => str 
    }),
  }
});

// add msw
beforeAll(() => {
  server.listen()
});

// clear environment after each test case
const initialState = useStore.getState();
afterEach(() => {
  cleanup();
  server.resetHandlers();
  useStore.setState(initialState, true);
});

afterAll(() => {
  server.close();
});

