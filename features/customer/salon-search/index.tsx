import {
  searchSalons,
  getPopularCities,
  getAvailableStates,
  getFeaturedSalons,
} from './api/queries'
import { AdvancedSearchClient } from './components/advanced-search-client'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

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
        <H1>Find Your Perfect Salon</H1>
        <P className="text-muted-foreground">
          Advanced search with filters, fuzzy matching, and intelligent suggestions
        </P>
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
