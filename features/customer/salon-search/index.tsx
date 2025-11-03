import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { getAvailableStates, getFeaturedSalons, getPopularCities, searchSalons } from './api/queries'
import { SalonSearchContent } from './components/salon-search-content'

interface SalonSearchProps {
  searchParams: { q?: string; city?: string; state?: string; verified?: string; rating?: string }
}

async function SalonSearch({ searchParams }: SalonSearchProps) {
  const [results, popularCities, availableStates, featuredSalons] = await Promise.all([
    searchSalons({
      searchTerm: searchParams.q,
      city: searchParams.city,
      state: searchParams.state,
      isVerified: searchParams.verified === 'true',
      minRating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
    }),
    getPopularCities(),
    getAvailableStates(),
    getFeaturedSalons(),
  ])

  return (
    <SalonSearchContent
      results={results}
      popularCities={popularCities}
      availableStates={availableStates}
      featuredSalons={featuredSalons}
    />
  )
}

export async function SalonSearchFeature(props: {
  searchParams: Promise<SalonSearchProps['searchParams']> | SalonSearchProps['searchParams']
}) {
  const params = await props.searchParams
  return (
    <Suspense fallback={<Spinner />}>
      <SalonSearch searchParams={params} />
    </Suspense>
  )
}
export * from './api/types'
