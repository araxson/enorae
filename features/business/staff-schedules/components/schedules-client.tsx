'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScheduleForm } from './schedule-form'
import { SchedulesGrid } from './schedules-grid'
import type { StaffScheduleWithDetails } from '../api/queries'

type SchedulesClientProps = {
  initialSchedules: StaffScheduleWithDetails[]
  staffMembers: Array<{ id: string; full_name: string | null; title: string | null }>
}

export function SchedulesClient({ initialSchedules, staffMembers }: SchedulesClientProps) {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <ScheduleForm staffMembers={staffMembers} onSuccess={handleUpdate} />
      <SchedulesGrid schedules={initialSchedules} onUpdate={handleUpdate} key={refreshKey} />
    </div>
  )
}
