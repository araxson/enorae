import 'server-only'

// Re-export types
export type { SalonSearchResult, SearchFilters } from './types'

// Re-export search functions
export { searchSalons, getFeaturedSalons } from './basic'
export { searchSalonsWithFuzzyMatch, getNearbyServices } from './advanced'
export { getSalonSearchSuggestions } from './suggestions'
export { getPopularCities, getAvailableStates } from './filters'
