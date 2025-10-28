import { getStaffProfile } from '@/features/staff/appointments/api/queries'
import { getStaffServices } from './api/queries'
import { ServicesClient } from './components'
import { ServicesUnavailableError, ProfileNotFoundError } from './components/services-error-state'

export async function StaffServices() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return <ServicesUnavailableError error={error} />
  }

  if (!staffProfile || !staffProfile['id']) {
    return <ProfileNotFoundError />
  }

  const rawServices = await getStaffServices(staffProfile['id'])
  const services = rawServices.filter(
    (service): service is typeof rawServices[number] & { id: string; service_name: string } =>
      service['id'] !== null && service['service_name'] !== null,
  )

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ServicesClient services={services} />
    </div>
  )
}
