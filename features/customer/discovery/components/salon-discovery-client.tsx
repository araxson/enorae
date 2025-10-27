'use client'

import { useState } from 'react'
import { SalonGrid } from './salon-grid'
import { SearchFilters } from './search-filters'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonDiscoveryClientProps {
  initialSalons: Salon[]
}

export function SalonDiscoveryClient({ initialSalons }: SalonDiscoveryClientProps) {
  const [salons, setSalons] = useState(initialSalons)

  function handleSearch(query: string) {
    let filtered = initialSalons

    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (salon) =>
          salon['name']?.toLowerCase().includes(lowerQuery) ||
          salon['short_description']?.toLowerCase().includes(lowerQuery) ||
          salon['full_description']?.toLowerCase().includes(lowerQuery)
      )
    }

    setSalons(filtered)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SearchFilters onSearch={handleSearch} />
      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemContent>
            <ItemTitle>Results</ItemTitle>
            <ItemDescription>
              {salons.length}{' '}
              {salons.length === 1 ? 'salon found' : 'salons found'}
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <SalonGrid salons={salons} />
    </div>
  )
}
