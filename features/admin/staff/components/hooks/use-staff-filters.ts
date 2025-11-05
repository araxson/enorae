'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BackgroundStatus } from '@/features/admin/staff/api/queries'
import type { RiskFilter } from '../staff-filters-types'

declare global {
  interface WindowEventMap {
    'admin:clearFilters': CustomEvent<void>
  }
}

type StaffFiltersState = {
  search: string
  riskFilter: RiskFilter
  roleFilter: string
  backgroundFilter: BackgroundStatus | 'all'
}

const initialState: StaffFiltersState = {
  search: '',
  riskFilter: 'all',
  roleFilter: 'all',
  backgroundFilter: 'all',
}

export function useStaffFilters(): StaffFiltersState & {
  setSearch: (search: string) => void
  setRiskFilter: (riskFilter: RiskFilter) => void
  setRoleFilter: (roleFilter: string) => void
  setBackgroundFilter: (backgroundFilter: BackgroundStatus | 'all') => void
  clearFilters: () => void
} {
  const [filters, setFilters] = useState<StaffFiltersState>(initialState)

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const setRiskFilter = useCallback((riskFilter: RiskFilter) => {
    setFilters((prev) => ({ ...prev, riskFilter }))
  }, [])

  const setRoleFilter = useCallback((roleFilter: string) => {
    setFilters((prev) => ({ ...prev, roleFilter }))
  }, [])

  const setBackgroundFilter = useCallback((backgroundFilter: BackgroundStatus | 'all') => {
    setFilters((prev) => ({ ...prev, backgroundFilter }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => {
      window.removeEventListener('admin:clearFilters', handleClear)
    }
  }, [clearFilters])

  return {
    ...filters,
    setSearch,
    setRiskFilter,
    setRoleFilter,
    setBackgroundFilter,
    clearFilters,
  }
}
