import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AppointmentsList } from './components/appointments-list'
import { getAllAppointments } from './api/queries'

export async function AdminAppointments() {
  let appointments

  try {
    appointments = await getAllAppointments(100)
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load appointments'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>All Appointments</H1>
          <Lead>Platform-wide appointments overview</Lead>
        </div>
        <AppointmentsList appointments={appointments} />
      </Stack>
    </Section>
  )
}
