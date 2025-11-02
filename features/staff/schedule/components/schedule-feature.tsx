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
import type { Staff } from '../api/types'
import { StaffScheduleClient } from './schedule-client'

interface StaffProfileData {
  ['id']: string
  ['user_id']: string | null
  ['salon_id']: string
  ['full_name']: string | null
  ['email']: string | null
  ['title']: string | null
  ['status']: string | null
}

function isStaffProfileData(value: unknown): value is StaffProfileData {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['salon_id'] === 'string' &&
    (obj['user_id'] === null || typeof obj['user_id'] === 'string') &&
    (obj['full_name'] === null || typeof obj['full_name'] === 'string') &&
    (obj['email'] === null || typeof obj['email'] === 'string') &&
    (obj['title'] === null || typeof obj['title'] === 'string') &&
    (obj['status'] === null || typeof obj['status'] === 'string')
  )
}

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

  if (!isStaffProfileData(staffProfile)) {
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

  // Construct Staff object from profile data
  const staff: Staff = {
    id: staffProfile['id'],
    user_id: staffProfile['user_id'],
    salon_id: staffProfile['salon_id'],
    full_name: staffProfile['full_name'],
    email: staffProfile['email'],
    title: staffProfile['title'],
    status: staffProfile['status'],
  }

  return (
    <StaffScheduleClient
      schedules={schedules.map((schedule) => ({ ...schedule, staff }))}
      staffId={staffProfile['id']}
      salonId={staffProfile['salon_id']}
      blockedTimes={blockedTimes}
      staffName={staffProfile['title'] || 'Staff Member'}
    />
  )
}
