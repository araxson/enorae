import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getCustomerAppointments } from './api/queries'
import { AppointmentsList } from './components/appointments-list'
import { Separator } from '@/components/ui/separator'

export async function CustomerAppointments() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const appointments = await getCustomerAppointments()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <p className="leading-7 text-muted-foreground">
          View and manage your salon appointments
        </p>

        <Separator />

        <AppointmentsList appointments={appointments} />
      </div>
    </div>
  )
}
