'use client'

import { useState } from 'react'
import {
  BusinessSearchInput,
  StatusFilter,
  DateRangeFilter,
} from '@/features/business/business-common/components'
import { Stack } from '@/components/layout'

interface AppointmentsFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  startDate?: Date
  endDate?: Date
  onDateChange: (start: Date | undefined, end: Date | undefined) => void
}

export function AppointmentsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  startDate,
  endDate,
  onDateChange,
}: AppointmentsFiltersProps) {
  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'No Show', value: 'no_show' },
  ]

  return (
    <Stack gap="md" className="flex-row flex-wrap items-center">
      <BusinessSearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by customer name or email..."
        className="min-w-[300px]"
      />
      <StatusFilter
        value={statusFilter}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="Filter by status"
        className="w-[180px]"
      />
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onDateChange={onDateChange}
        placeholder="Filter by date range"
      />
    </Stack>
  )
}
