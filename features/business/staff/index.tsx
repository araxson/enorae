import { getUserSalon } from './api/queries'
import { getStaffWithServices, getAvailableServices } from './api/staff-services-queries'
import { StaffServicesManager } from './components/staff-services-manager'
import { StaffPerformanceSummary } from './components/staff-performance-summary'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function StaffManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <Section size="lg">
        <H1>Please log in to manage staff</H1>
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <H1>No salon found</H1>
        <Lead>Please create a salon to manage staff</Lead>
      </Section>
    )
  }

  const [staffWithServices, availableServices] = await Promise.all([
    getStaffWithServices(salon.id),
    getAvailableServices(salon.id),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Staff Management</H1>
          <Lead>Manage your salon team and assign services</Lead>
        </Box>

        <StaffPerformanceSummary staff={staffWithServices} />

        <StaffServicesManager
          staff={staffWithServices}
          availableServices={availableServices}
        />
      </Stack>
    </Section>
  )
}
