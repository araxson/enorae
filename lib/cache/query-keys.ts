/**
 * Centralized query key factory for React Query
 * Provides consistent cache keys across the application
 */

export const queryKeys = {
  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    upcoming: () => [...queryKeys.appointments.all, 'upcoming'] as const,
    byStatus: (status: string) => [...queryKeys.appointments.all, 'status', status] as const,
  },

  // Customers
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
    insights: (id: string) => [...queryKeys.customers.detail(id), 'insights'] as const,
    clv: (id: string) => [...queryKeys.customers.detail(id), 'clv'] as const,
    churnRisk: (id: string) => [...queryKeys.customers.detail(id), 'churn-risk'] as const,
  },

  // Staff
  staff: {
    all: ['staff'] as const,
    lists: () => [...queryKeys.staff.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.staff.lists(), filters] as const,
    details: () => [...queryKeys.staff.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.staff.details(), id] as const,
    schedule: (id: string) => [...queryKeys.staff.detail(id), 'schedule'] as const,
    availability: (id: string, date: string) =>
      [...queryKeys.staff.detail(id), 'availability', date] as const,
  },

  // Services
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
    pricing: (id: string) => [...queryKeys.services.detail(id), 'pricing'] as const,
  },

  // Inventory
  inventory: {
    all: ['inventory'] as const,
    products: () => [...queryKeys.inventory.all, 'products'] as const,
    product: (id: string) => [...queryKeys.inventory.products(), id] as const,
    stockLevels: () => [...queryKeys.inventory.all, 'stock-levels'] as const,
    stockLevel: (productId: string, locationId: string) =>
      [...queryKeys.inventory.stockLevels(), productId, locationId] as const,
    lowStock: () => [...queryKeys.inventory.all, 'low-stock'] as const,
    movements: () => [...queryKeys.inventory.all, 'movements'] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    daily: (date: string) => [...queryKeys.analytics.all, 'daily', date] as const,
    retention: (startDate: string, endDate: string) =>
      [...queryKeys.analytics.all, 'retention', startDate, endDate] as const,
    cohorts: () => [...queryKeys.analytics.all, 'cohorts'] as const,
    segments: () => [...queryKeys.analytics.all, 'segments'] as const,
    topCustomers: (limit: number) =>
      [...queryKeys.analytics.all, 'top-customers', limit] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    unreadCounts: () => [...queryKeys.notifications.all, 'unread-counts'] as const,
    recent: (limit: number) => [...queryKeys.notifications.all, 'recent', limit] as const,
    preferences: () => [...queryKeys.notifications.all, 'preferences'] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.reviews.lists(), filters] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.reviews.details(), id] as const,
    bySalon: (salonId: string) => [...queryKeys.reviews.all, 'salon', salonId] as const,
  },

  // Salons
  salons: {
    all: ['salons'] as const,
    current: () => [...queryKeys.salons.all, 'current'] as const,
    settings: () => [...queryKeys.salons.current(), 'settings'] as const,
    locations: () => [...queryKeys.salons.current(), 'locations'] as const,
  },
} as const

/**
 * Cache time constants (in milliseconds)
 */
export const CACHE_TIME = {
  SHORT: 30 * 1000, // 30 seconds - for frequently changing data
  MEDIUM: 5 * 60 * 1000, // 5 minutes - for moderately stable data
  LONG: 30 * 60 * 1000, // 30 minutes - for stable data
  VERY_LONG: 60 * 60 * 1000, // 1 hour - for rarely changing data
} as const

/**
 * Stale time constants (in milliseconds)
 * Data is considered fresh during this time
 */
export const STALE_TIME = {
  INSTANT: 0, // Always stale, always refetch
  SHORT: 10 * 1000, // 10 seconds
  MEDIUM: 60 * 1000, // 1 minute
  LONG: 5 * 60 * 1000, // 5 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const
