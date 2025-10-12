import { Section, Stack } from '@/components/layout'
import type { Database } from '@/lib/types/database.types'
import { StaffServicesManager } from '@/features/business/staff/components/staff-services-manager'
import type { StaffWithServices } from '@/features/business/staff/api/queries'

type ServiceRow = Database['public']['Views']['services']['Row']

interface StaffServicesPanelProps {
  staff: StaffWithServices
  availableServices: ServiceRow[]
}

export function StaffServicesPanel({
  staff,
  availableServices,
}: StaffServicesPanelProps) {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <StaffServicesManager
          staff={[staff]}
          availableServices={availableServices}
        />
      </Stack>
    </Section>
  )
}
