import { requireAuth } from '@/lib/auth'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffProfile } from '../appointments/api/queries'
import { getStaffMemberSchedule } from './api/queries'
import { ScheduleCalendar } from './components/schedule-calendar'

export async function StaffSchedule() {
  let staffProfile
  try {
    await requireAuth()
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your schedule'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile || !staffProfile.id) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  const schedules = await getStaffMemberSchedule(staffProfile.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Schedule</H1>
          <Lead>View and manage your weekly availability</Lead>
        </div>

        <ScheduleCalendar
          schedules={schedules.map((s) => ({ ...s, staff: staffProfile }))}
        />
      </Stack>
    </Section>
  )
}
