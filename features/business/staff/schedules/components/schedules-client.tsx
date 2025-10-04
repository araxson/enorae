'use client'

import { useState } from 'react'
import { Stack } from '@/components/layout'
import { ScheduleForm } from './schedule-form'
import { SchedulesGrid } from './schedules-grid'
import type { StaffScheduleWithDetails } from '../api/queries'

type SchedulesClientProps = {
  initialSchedules: StaffScheduleWithDetails[]
  staffMembers: Array<{ id: string; full_name: string | null; title: string | null }>
}

export function SchedulesClient({ initialSchedules, staffMembers }: SchedulesClientProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1)
    // Trigger a full page refresh to get updated data
    window.location.reload()
  }

  return (
    <Stack gap="xl">
      <ScheduleForm staffMembers={staffMembers} onSuccess={handleUpdate} />
      <SchedulesGrid schedules={initialSchedules} onUpdate={handleUpdate} key={refreshKey} />
    </Stack>
  )
}
