import type { Database } from '@/lib/types/database.types'
import { StaffServicesManager } from '@/features/business/staff/components'
import type { StaffWithServices } from '@/features/business/staff/api/queries'

type ServiceRow = Database['public']['Views']['services_view']['Row']

interface StaffServicesPanelProps {
  staff: StaffWithServices
  availableServices: ServiceRow[]
}

export function StaffServicesPanel({
  staff,
  availableServices,
}: StaffServicesPanelProps) {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <StaffServicesManager
          staff={[staff]}
          availableServices={availableServices}
        />
      </div>
    </section>
  )
}
