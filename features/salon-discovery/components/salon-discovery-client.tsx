'use client'

import { useState } from 'react'
import { SalonGrid } from './salon-grid'
import { SearchFilters } from './search-filters'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

interface SalonDiscoveryClientProps {
  initialSalons: Salon[]
}

export function SalonDiscoveryClient({ initialSalons }: SalonDiscoveryClientProps) {
  const [salons, setSalons] = useState(initialSalons)

  function handleSearch(query: string, priceRange?: [number, number]) {
    let filtered = initialSalons

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (salon) =>
          salon.name?.toLowerCase().includes(lowerQuery) ||
          salon.business_type?.toLowerCase().includes(lowerQuery) ||
          salon.business_name?.toLowerCase().includes(lowerQuery)
      )
    }

    // Note: Price range filtering would require price data from services
    // This is a placeholder for when that data is available

    setSalons(filtered)
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Discover Salons</H1>
          <Lead>Find the perfect salon for your beauty needs</Lead>
        </Box>
        <SearchFilters onSearch={handleSearch} />
        <SalonGrid salons={salons} />
      </Stack>
    </Section>
  )
}
