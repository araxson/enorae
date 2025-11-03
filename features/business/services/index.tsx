import { getServices, getUserSalon } from './api/queries'
import { ServicesManagementClient, ServicesAuthError, ServicesNoSalonError } from './components'

export type * from './api/types'

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
