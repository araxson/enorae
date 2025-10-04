'use client'

import { useState, useMemo } from 'react'
import { Stack } from '@/components/layout'
import type { Database } from '@/lib/types/database.types'
import { SalonsStats } from './salons-stats'
import { SalonsFilters } from './salons-filters'
import { SalonsTable } from './salons-table'

type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']

type SalonsClientProps = {
  salons: AdminSalon[]
  stats: {
    total: number
    active: number
    byTier: Record<string, number>
    byType: Record<string, number>
  }
}

export function SalonsClient({ salons, stats }: SalonsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')

  const filteredSalons = useMemo(() => {
    return salons.filter((salon) => {
      const matchesSearch =
        !searchQuery ||
        salon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.slug?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTier =
        tierFilter === 'all' || salon.subscription_tier === tierFilter

      return matchesSearch && matchesTier
    })
  }, [salons, searchQuery, tierFilter])

  return (
    <Stack gap="xl">
      <SalonsStats stats={stats} />

      <SalonsFilters onSearchChange={setSearchQuery} onTierChange={setTierFilter} />

      <SalonsTable salons={filteredSalons} />
    </Stack>
  )
}
