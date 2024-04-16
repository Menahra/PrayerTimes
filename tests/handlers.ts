import { http } from 'msw';

export const handlers = [
  http.all('*', (responseResolver) => {
    console.log(`Warning: You did not provide a mock for the ${responseResolver.request.method.toUpperCase()} request to ${responseResolver.request.url}`);
  })
];