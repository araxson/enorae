import { getAppointments, getUserSalon } from './api/queries'
import { AppointmentsTableClient } from './components/appointments-table-client'
import { Section, Stack } from '@/components/layout'
import { EmptyState } from '@/components/shared'
import { AlertCircle, Calendar } from 'lucide-react'

export async function AppointmentsManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to view appointments"
        />
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <EmptyState
          icon={Calendar}
          title="No Salon Found"
          description="Please create a salon to manage appointments"
        />
      </Section>
    )
  }

  const appointments = await getAppointments(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <AppointmentsTableClient appointments={appointments} />
      </Stack>
    </Section>
  )
}
