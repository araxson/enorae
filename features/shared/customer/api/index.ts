// Barrel export for customer-common API
// Provides centralized access to all customer-common queries and mutations

// Queries
export {
  getCustomerSalonMeta,
  getCustomerFavoritesSummary,
  type FavoriteShortcut,
} from './queries'

// Mutations
// No mutations currently exported from mutations.ts
export * from './types'
