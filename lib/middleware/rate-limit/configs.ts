export const RATE_LIMITS = {
  DASHBOARD: {
    limit: 100,
    windowSeconds: 60,
    namespace: 'dashboard',
  },
  ADMIN: {
    limit: 50,
    windowSeconds: 60,
    namespace: 'admin',
  },
  MUTATIONS: {
    limit: 30,
    windowSeconds: 60,
    namespace: 'mutations',
  },
  AUTH: {
    limit: 5,
    windowSeconds: 15 * 60,
    namespace: 'auth',
  },
} as const
