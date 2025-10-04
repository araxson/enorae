import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffProfile } from '../appointments/api/queries'
import { getStaffClients } from './api/queries'
import { ClientsClient } from './components/clients-client'

export async function StaffClients() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your clients'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  const staff = staffProfile as { id: string }
  const clients = await getStaffClients(staff.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Clients</H1>
          <Lead>View your client relationships and appointment history</Lead>
        </div>

        <ClientsClient clients={clients} staffId={staff.id} />
      </Stack>
    </Section>
  )
}
