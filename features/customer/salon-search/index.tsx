import {
  searchSalons,
  getPopularCities,
  getAvailableStates,
  getFeaturedSalons,
} from './api/queries'
import { AdvancedSearchClient } from './components/advanced-search-client'
import { Stack } from '@/components/layout'

interface SalonSearchProps {
  searchParams: {
    q?: string
    city?: string
    state?: string
    verified?: string
    rating?: string
  }
}

export async function SalonSearch({ searchParams }: SalonSearchProps) {
  const filters = {
    searchTerm: searchParams.q,
    city: searchParams.city,
    state: searchParams.state,
    isVerified: searchParams.verified === 'true',
    minRating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
  }

  const [results, popularCities, availableStates, featuredSalons] = await Promise.all([
    searchSalons(filters),
    getPopularCities(),
    getAvailableStates(),
    getFeaturedSalons(),
  ])

  return (
    <Stack gap="xl">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Find Your Perfect Salon</h1>
        <p className="leading-7 text-muted-foreground">
          Advanced search with filters, fuzzy matching, and intelligent suggestions
        </p>
      </div>

      <AdvancedSearchClient
        initialResults={results}
        popularCities={popularCities}
        availableStates={availableStates}
        featuredSalons={featuredSalons}
      />
    </Stack>
  )
}
