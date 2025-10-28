import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { AdvancedSearchClient } from '.'
import type {
  getAvailableStates,
  getFeaturedSalons,
  getPopularCities,
  searchSalons,
} from '../api/queries'

type SalonSearchContentProps = {
  results: Awaited<ReturnType<typeof searchSalons>>
  popularCities: Awaited<ReturnType<typeof getPopularCities>>
  availableStates: Awaited<ReturnType<typeof getAvailableStates>>
  featuredSalons: Awaited<ReturnType<typeof getFeaturedSalons>>
}

export function SalonSearchContent({
  results,
  popularCities,
  availableStates,
  featuredSalons,
}: SalonSearchContentProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <Item variant="muted" className="mb-8 flex-col items-start gap-2">
        <ItemContent>
          <ItemTitle>Find Your Perfect Salon</ItemTitle>
          <ItemDescription>
            Advanced search with filters, fuzzy matching, and intelligent suggestions
          </ItemDescription>
        </ItemContent>
      </Item>
      <AdvancedSearchClient
        initialResults={results}
        popularCities={popularCities}
        availableStates={availableStates}
        featuredSalons={featuredSalons}
      />
    </section>
  )
}
