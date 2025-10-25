import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffClients } from './api/queries'
import { ClientsClient } from './components/clients-client'

export async function StaffClients() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Clients unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your clients'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!staffProfile) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const staff = staffProfile as { id: string }
  const clients = await getStaffClients(staff.id)

  return <ClientsClient clients={clients} staffId={staff.id} />
}
