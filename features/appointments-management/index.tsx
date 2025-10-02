import { getAppointments, getUserSalon } from './dal/appointments-management.queries'
import { AppointmentsTable } from './components/appointments-table'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function AppointmentsManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <H1>Please log in to view appointments</H1>
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <H1>No salon found</H1>
        <Lead>Please create a salon to manage appointments</Lead>
      </Section>
    )
  }

  const appointments = await getAppointments(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Appointments</H1>
          <Lead>Manage your salon appointments</Lead>
        </Box>
        <AppointmentsTable appointments={appointments} />
      </Stack>
    </Section>
  )
}
