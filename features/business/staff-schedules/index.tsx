import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getStaffSchedules, getStaffForScheduling } from './api/queries'
import { SchedulesClient } from './components/schedules-client'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function StaffSchedulesManagement() {
  let schedules
  let staffMembers

  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    ;[schedules, staffMembers] = await Promise.all([getStaffSchedules(), getStaffForScheduling()])
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>Schedules unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to manage staff schedules'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <SchedulesClient initialSchedules={schedules} staffMembers={staffMembers} />
      </div>
    </section>
  )
}
