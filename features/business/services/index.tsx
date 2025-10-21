import { getServices, getUserSalon } from './api/queries'
import { ServicesManagementClient } from './components/services-management-client'
import { EmptyState } from '@/components/shared'
import { AlertCircle, Scissors } from 'lucide-react'

export async function ServicesManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to manage services"
        />
      </section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <EmptyState
          icon={Scissors}
          title="No Salon Found"
          description="Please create a salon to manage services"
        />
      </section>
    )
  }

  const services = await getServices(salon.id!)

  return <ServicesManagementClient salon={{ id: salon.id! }} services={services} />
}
