import { getServices, getUserSalon } from './api/queries'
import { ServicesManagementClient } from './components/services-management-client'
import { ServicesAuthError, ServicesNoSalonError } from './components/services-error-state'

export type * from './types'

export async function ServicesManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return <ServicesAuthError />
  }

  if (!salon || !salon.id) {
    return <ServicesNoSalonError />
  }

  const services = await getServices(salon.id!)

  return <ServicesManagementClient salon={{ id: salon.id! }} services={services} />
}
