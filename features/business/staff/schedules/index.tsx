import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to manage staff schedules'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SchedulesClient initialSchedules={schedules} staffMembers={staffMembers} />
      </Stack>
    </Section>
  )
}
