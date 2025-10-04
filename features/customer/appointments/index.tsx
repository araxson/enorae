import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getCustomerAppointments } from './api/queries'
import { AppointmentsList } from './components/appointments-list'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export { AppointmentsSkeleton } from './components/appointments-skeleton'

export async function CustomerAppointments() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const appointments = await getCustomerAppointments()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Appointments</H1>
          <P className="text-muted-foreground">
            View and manage your salon appointments
          </P>
        </div>

        <Separator />

        <AppointmentsList appointments={appointments} />
      </Stack>
    </Section>
  )
}
