import { requireAuth } from '@/lib/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffMemberSchedule } from './api/queries'
import { getBlockedTimesByStaff } from '@/features/shared/blocked-times/api/queries'
import { StaffScheduleClient } from './components/schedule-client'

export async function StaffSchedule() {
  let staffProfile
  try {
    await requireAuth()
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Schedule unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your schedule'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!staffProfile || !staffProfile['id'] || !staffProfile['salon_id']) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
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
      staffName={staffProfile['full_name']}
    />
  )
}
