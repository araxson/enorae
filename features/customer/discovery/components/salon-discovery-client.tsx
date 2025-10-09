'use client'

import { useState } from 'react'
import { SalonGrid } from './salon-grid'
import { SearchFilters } from './search-filters'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

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
          salon.name?.toLowerCase().includes(lowerQuery) ||
          salon.business_type?.toLowerCase().includes(lowerQuery) ||
          salon.business_name?.toLowerCase().includes(lowerQuery)
      )
    }

    setSalons(filtered)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SearchFilters onSearch={handleSearch} />
      <SalonGrid salons={salons} />
    </div>
  )
}
