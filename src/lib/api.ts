type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = RequestInit & {
  method?: ApiMethod;
  mockDelay?: number;
};

export async function apiFetch<T>(
  endpoint: string,
  { mockDelay = 320, ...options }: RequestOptions = {},
): Promise<T> {
  if (mockDelay) {
    await new Promise((resolve) => setTimeout(resolve, mockDelay));
  }

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with status ${response.status}`,
    );
  }

  return (await response.json()) as T;
}

export const API_ENDPOINTS = {
  feed: '/api/feed',
  forums: '/api/forums',
  messages: '/api/messages',
  directory: '/api/directory',
  groups: '/api/groups',
  mentoring: '/api/mentoring',
  careers: '/api/careers',
  events: '/api/events',
  fundraising: '/api/fundraising',
  analytics: '/api/analytics',
  admin: '/api/admin',
  premium: '/api/premium',
  perks: '/api/perks',
  podcast: '/api/podcast',
  volunteer: '/api/volunteer',
  challenges: '/api/challenges',
  leaderboards: '/api/leaderboards',
  integrations: '/api/integrations',
  auth: '/api/auth',
};
