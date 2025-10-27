import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffClients } from './api/queries'
import { ClientsClient } from './components/clients-client'

export async function StaffClients() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Clients unavailable</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error ? error.message : 'Please log in to view your clients'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!staffProfile) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Profile not found</EmptyTitle>
                <EmptyDescription>Staff profile not found</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  const staff = staffProfile as { id: string }
  const clients = await getStaffClients(staff.id)

  return <ClientsClient clients={clients} staffId={staff.id} />
}
