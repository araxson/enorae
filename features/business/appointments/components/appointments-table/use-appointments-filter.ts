'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import type { AppointmentWithDetails } from '@/features/business/appointments/api/queries'

type StatusFilter = string

type FilterResult = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  statusFilter: StatusFilter
  setStatusFilter: (value: StatusFilter) => void
  filteredAppointments: AppointmentWithDetails[]
}

const STATUS_ALL = 'all'

export function useAppointmentsFilter(appointments: AppointmentWithDetails[]): FilterResult {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_ALL)

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (statusFilter !== STATUS_ALL && appointment['status'] !== statusFilter) {
        return false
      }

      if (!searchQuery) {
        return true
      }

      const query = searchQuery.toLowerCase()
      // NOTE: customer_name, customer_email, staff_name don't exist in appointments_view
      // Search only by customer_id, staff_id, and date
      const customerMatch = appointment['customer_id']?.toLowerCase().includes(query)
      const staffMatch = appointment['staff_id']?.toLowerCase().includes(query)
      const dateMatch = appointment['start_time'] &&
        format(new Date(appointment['start_time']), 'MMM dd, yyyy').toLowerCase().includes(query)

      return customerMatch || staffMatch || dateMatch
    })
  }, [appointments, searchQuery, statusFilter])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredAppointments,
  }
}
