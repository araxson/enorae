import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStaffProfile } from '../appointments/api/queries'
import { getStaffServices } from './api/queries'
import { ServicesClient } from './components/services-client'

export async function StaffServices() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your services'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile || !staffProfile.id) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  const rawServices = await getStaffServices(staffProfile.id)
  // Filter out services with null ids or service_name (shouldn't happen but satisfies type system)
  const services = rawServices.filter((s): s is typeof s & { id: string; service_name: string } =>
    s.id !== null && s.service_name !== null
  )

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Services</H1>
          <Lead>Services you&apos;re qualified to provide</Lead>
        </div>

        <ServicesClient services={services} />
      </Stack>
    </Section>
  )
}
