import { getAppointments, getUserSalon } from '../api/queries'
import { AppointmentsTableClient } from './appointments-table-client'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import { AlertCircle, Calendar } from 'lucide-react'

export async function AppointmentsManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <ItemGroup>
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
        </ItemGroup>
      </div>
    )
  }

  if (!salon || !salon.id) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <ItemGroup>
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
        </ItemGroup>
      </div>
    )
  }

  const appointments = await getAppointments(salon.id)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <ItemGroup className="gap-8">
        <AppointmentsTableClient appointments={appointments} />
      </ItemGroup>
    </div>
  )
}
