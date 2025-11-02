import 'server-only'

export interface SalonSearchResult {
  id: string
  name: string
  slug: string
  address: {
    street?: string
    city?: string
    state?: string
    zip_code?: string
  } | null
  rating_average: number
  is_verified: boolean
  is_featured: boolean
  similarity_score?: number
}

export interface SearchFilters {
  searchTerm?: string
  city?: string
  state?: string
  isVerified?: boolean
  minRating?: number
  limit?: number
}
