import { getAppointments, getUserSalon } from './api/queries'
import { AppointmentsTableClient } from './components/appointments-table-client'
import { EmptyState } from '@/features/shared/ui-components'
import { AlertCircle, Calendar } from 'lucide-react'

// Export types
export type * from './types'

export async function AppointmentsManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to view appointments"
        />
      </section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={Calendar}
          title="No Salon Found"
          description="Please create a salon to manage appointments"
        />
      </section>
    )
  }

  const appointments = await getAppointments(salon.id)

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <AppointmentsTableClient appointments={appointments} />
      </div>
    </section>
  )
}
