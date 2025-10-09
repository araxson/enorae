export const CACHE_CONFIGS = {
  DASHBOARD: {
    revalidate: 60,
    tags: ['dashboard'],
  },
  METRICS: {
    revalidate: 30,
    tags: ['metrics'],
  },
  USER_DATA: {
    revalidate: 300,
    tags: ['user-data'],
  },
  SALON_DATA: {
    revalidate: 600,
    tags: ['salon-data'],
  },
  STATIC: {
    revalidate: 3600,
    tags: ['static'],
  },
} as const
