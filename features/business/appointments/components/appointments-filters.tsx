'use client'

import { useState } from 'react'
import {
  BusinessSearchInput,
  StatusFilter,
  DateRangeFilter,
} from '@/features/business/business-common/components'

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
    <div className="flex flex-col gap-4 flex-row flex-wrap items-center">
      <BusinessSearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by customer name or email..."
        className="w-full lg:w-80"
      />
      <StatusFilter
        value={statusFilter}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="Filter by status"
        className="w-44"
      />
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onDateChange={onDateChange}
        placeholder="Filter by date range"
      />
    </div>
  )
}
