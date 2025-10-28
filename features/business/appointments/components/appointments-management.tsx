import { getAppointments, getUserSalon } from '../api/queries'
import { AppointmentsTableClient } from './index'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AlertCircle, Calendar } from 'lucide-react'

export async function AppointmentsManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Empty>
          <EmptyMedia variant="icon">
            <AlertCircle className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Authentication Required</EmptyTitle>
            <EmptyDescription>Please log in to view appointments.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Sign in with an admin or staff account to continue.</EmptyContent>
        </Empty>
      </section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Empty>
          <EmptyMedia variant="icon">
            <Calendar className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No salon found</EmptyTitle>
            <EmptyDescription>Please create a salon to manage appointments.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Set up your first location to unlock scheduling tools.</EmptyContent>
        </Empty>
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
