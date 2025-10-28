'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database.types'
import { MarketingSection } from '@/features/marketing/common-components'
import { SearchHeader } from './search-header'
import { EmptyState } from './empty-state'
import { SalonCard } from './salon-card'

type Salon = Database['public']['Views']['salons_view']['Row']

export interface ExploreListingProps {
  salons: Salon[]
}

export function ExploreListing({ salons }: ExploreListingProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filteredSalons = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return salons

    return salons.filter((salon) => {
      const haystack = [
        salon['name'],
        salon['city'],
        salon['state_province'],
        salon['short_description'],
        salon['full_description'],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [query, salons])

  function handleBook(slug?: string | null) {
    if (!slug) {
      router.push('/signup')
      return
    }

    router.push(`/signup?redirect=/customer/salons/${slug}`)
  }

  return (
    <MarketingSection className="pb-16 pt-6" spacing="none" groupClassName="gap-8">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onSearch={() => setQuery(query.trim())}
      />

      {filteredSalons.length === 0 ? (
        <EmptyState onReset={() => setQuery('')} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSalons.map((salon, index) => (
            <SalonCard key={salon.id ?? index} salon={salon} index={index} onBook={handleBook} />
          ))}
        </div>
      )}
    </MarketingSection>
  )
}
