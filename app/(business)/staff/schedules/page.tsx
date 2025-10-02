import { Suspense } from 'react'
import { StaffScheduleManagement, StaffScheduleManagementSkeleton } from '@/features/staff-schedule'

export const metadata = {
  title: 'Staff Schedules',
  description: 'Manage staff working schedules',
}

export default async function StaffSchedulesPage() {
  return (
    <Suspense fallback={<StaffScheduleManagementSkeleton />}>
      <StaffScheduleManagement />
    </Suspense>
  )
}
