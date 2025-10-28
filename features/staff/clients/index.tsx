import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffClients } from './api/queries'
import { ClientsClient } from './components'

export async function StaffClients() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Clients unavailable</EmptyTitle>
            <EmptyDescription>
              {error instanceof Error ? error.message : 'Please log in to view your clients'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  if (!staffProfile) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Profile not found</EmptyTitle>
            <EmptyDescription>Staff profile not found</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  const staff = staffProfile as { id: string }
  const clients = await getStaffClients(staff.id)

  return <ClientsClient clients={clients} staffId={staff.id} />
}
