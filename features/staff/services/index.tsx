import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffServices } from './api/queries'
import { ServicesClient } from './components/services-client'

export async function StaffServices() {
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
                <EmptyTitle>Services unavailable</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error
                    ? error.message
                    : 'Please log in to view your services'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!staffProfile || !staffProfile['id']) {
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

  const rawServices = await getStaffServices(staffProfile['id'])
  const services = rawServices.filter(
    (service): service is typeof rawServices[number] & { id: string; service_name: string } =>
      service['id'] !== null && service['service_name'] !== null
  )

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ServicesClient services={services} />
    </div>
  )
}
