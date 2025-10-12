'use client'

import { useState } from 'react'
import { Stack } from '@/components/layout'
import { AuditLogsFilters, AuditLogFilters } from './audit-logs-filters'
import { AuditLogsTable } from './audit-logs-table'
import type { AuditLog } from '../api/queries'

interface AuditLogsClientProps {
  initialLogs: AuditLog[]
}

export function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const [filteredLogs, setFilteredLogs] = useState(initialLogs)

  const handleFilterChange = (filters: AuditLogFilters) => {
    let filtered = initialLogs

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    if (filters.entityType) {
      filtered = filtered.filter(log => log.entity_type === filters.entityType)
    }

    if (filters.startDate) {
      filtered = filtered.filter(log => log.created_at >= filters.startDate)
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate)
      endOfDay.setHours(23, 59, 59, 999)
      filtered = filtered.filter(log => new Date(log.created_at) <= endOfDay)
    }

    if (filters.isSuccess !== '') {
      const isSuccess = filters.isSuccess === 'true'
      filtered = filtered.filter(log => log.is_success === isSuccess)
    }

    setFilteredLogs(filtered)
  }

  return (
    <Stack gap="lg">
      <AuditLogsFilters onFilterChange={handleFilterChange} />
      <AuditLogsTable logs={filteredLogs} onExport={() => {}} />
    </Stack>
  )
}
