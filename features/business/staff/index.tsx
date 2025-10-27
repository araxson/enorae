import { getUserSalon, getStaffWithServices, getAvailableServices } from './api/queries'
import { StaffManagementClient } from './components/staff-management-client'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AlertCircle, Users } from 'lucide-react'

export async function StaffManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Empty>
          <EmptyMedia variant="icon">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Authentication required</EmptyTitle>
            <EmptyDescription>Please log in to manage staff.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Sign in to assign roles and services to your team.</EmptyContent>
        </Empty>
      </section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Empty>
          <EmptyMedia variant="icon">
            <Users className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No salon found</EmptyTitle>
            <EmptyDescription>Please create a salon to manage staff.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Complete salon onboarding to add team members.</EmptyContent>
        </Empty>
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
