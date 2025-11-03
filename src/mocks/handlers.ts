import { http, HttpResponse } from 'msw';
import { demoData } from './fixtures/demo-data';

const baseDelay = 450;

const toResponse = (data: unknown) => {
  const warningMessages = [
    'Demo warning: network latency simulated.',
    'Demo warning: Using cached dataset.',
    'Demo warning: Non-production environment.',
  ];
  const includeWarning = Math.random() < 0.25;
  return HttpResponse.json(
    {
      data,
      meta: includeWarning
        ? {
            warning:
              warningMessages[
                Math.floor(Math.random() * warningMessages.length)
              ],
          }
        : {},
    },
    { status: 200 },
  );
};

export const handlers = [
  http.get('/api/health', async () => {
    await new Promise((resolve) => setTimeout(resolve, baseDelay / 2));
    return HttpResponse.json({ status: 'ok' });
  }),
  http.get('/api/bootstrap', async () => {
    await new Promise((resolve) => setTimeout(resolve, baseDelay));
    return toResponse(demoData);
  }),
  http.post('/api/log', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, baseDelay / 3));
    const payload = await request.json();
    console.info('Mock analytics log:', payload);
    return toResponse({ accepted: true });
  }),
];
