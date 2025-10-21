import { getUserSalon, getStaffWithServices, getAvailableServices } from './api/queries'
import { StaffManagementClient } from './components/staff-management-client'
import { EmptyState } from '@/components/shared'
import { AlertCircle, Users } from 'lucide-react'

export async function StaffManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to manage staff"
        />
      </section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={Users}
          title="No Salon Found"
          description="Please create a salon to manage staff"
        />
      </section>
    )
  }

  const [staffWithServices, availableServices] = await Promise.all([
    getStaffWithServices(salon.id),
    getAvailableServices(salon.id),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <StaffManagementClient
          staffWithServices={staffWithServices}
          availableServices={availableServices}
        />
      </div>
    </section>
  )
}
