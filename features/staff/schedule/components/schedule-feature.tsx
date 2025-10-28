import { requireAuth } from '@/lib/auth'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffMemberSchedule } from '../api/queries'
import { getBlockedTimesByStaff } from '@/features/shared/blocked-times/api/queries'
import { StaffScheduleClient } from './index'

export async function ScheduleFeature() {
  let staffProfile
  try {
    await requireAuth()
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Schedule unavailable</EmptyTitle>
            <EmptyDescription>
              {error instanceof Error ? error.message : 'Please log in to view your schedule'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  if (!staffProfile || !staffProfile['id'] || !staffProfile['salon_id']) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Profile not found</EmptyTitle>
            <EmptyDescription>Staff profile not found</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  const schedules = await getStaffMemberSchedule(staffProfile['id'])
  const blockedTimes = await getBlockedTimesByStaff(staffProfile['id'])

  return (
    <StaffScheduleClient
      schedules={schedules.map((schedule) => ({ ...schedule, staff: staffProfile }))}
      staffId={staffProfile['id']}
      salonId={staffProfile['salon_id']}
      blockedTimes={blockedTimes}
      staffName={staffProfile['title'] || 'Staff Member'}
    />
  )
}
