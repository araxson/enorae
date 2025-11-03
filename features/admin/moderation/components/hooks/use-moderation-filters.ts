'use client'

import { useState, useEffect, useCallback } from 'react'

declare global {
  interface WindowEventMap {
    'admin:clearFilters': CustomEvent<void>
  }
}

type ModerationFiltersState = {
  searchQuery: string
  statusFilter: string
  riskFilter: string
  sentimentFilter: string
  reputationFilter: string
}

const initialState: ModerationFiltersState = {
  searchQuery: '',
  statusFilter: 'all',
  riskFilter: 'all',
  sentimentFilter: 'all',
  reputationFilter: 'all',
}

export function useModerationFilters() {
  const [filters, setFilters] = useState<ModerationFiltersState>(initialState)

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }))
  }, [])

  const setStatusFilter = useCallback((statusFilter: string) => {
    setFilters((prev) => ({ ...prev, statusFilter }))
  }, [])

  const setRiskFilter = useCallback((riskFilter: string) => {
    setFilters((prev) => ({ ...prev, riskFilter }))
  }, [])

  const setSentimentFilter = useCallback((sentimentFilter: string) => {
    setFilters((prev) => ({ ...prev, sentimentFilter }))
  }, [])

  const setReputationFilter = useCallback((reputationFilter: string) => {
    setFilters((prev) => ({ ...prev, reputationFilter }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => window.removeEventListener('admin:clearFilters', handleClear)
  }, [clearFilters])

  return {
    ...filters,
    setSearchQuery,
    setStatusFilter,
    setRiskFilter,
    setSentimentFilter,
    setReputationFilter,
    clearFilters,
  }
}
