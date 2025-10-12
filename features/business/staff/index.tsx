import { getUserSalon, getStaffWithServices, getAvailableServices } from './api/queries'
import { StaffManagementClient } from './components/staff-management-client'
import { Section, Stack } from '@/components/layout'
import { EmptyState } from '@/components/shared'
import { AlertCircle, Users } from 'lucide-react'

export async function StaffManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to manage staff"
        />
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <EmptyState
          icon={Users}
          title="No Salon Found"
          description="Please create a salon to manage staff"
        />
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
        <StaffManagementClient
          staffWithServices={staffWithServices}
          availableServices={availableServices}
        />
      </Stack>
    </Section>
  )
}
