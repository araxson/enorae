import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getAppointmentSnapshot } from './api/queries'
import { AppointmentsDashboard } from './components/appointments-dashboard'

export async function AdminAppointments() {
  try {
    const snapshot = await getAppointmentSnapshot()
    return (
      <Section size="lg">
        <Stack gap="xl">
          <AppointmentsDashboard snapshot={snapshot} />
        </Stack>
      </Section>
    )
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load appointment oversight data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }
}
