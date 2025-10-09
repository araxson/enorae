import { getServices, getUserSalon } from './api/queries'
import { ServicesManagementClient } from './components/services-management-client'
import { Section } from '@/components/layout'
import { EmptyState } from '@/components/shared'
import { AlertCircle, Scissors } from 'lucide-react'

export async function ServicesManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Authentication Required"
          description="Please log in to manage services"
        />
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <EmptyState
          icon={Scissors}
          title="No Salon Found"
          description="Please create a salon to manage services"
        />
      </Section>
    )
  }

  const services = await getServices(salon.id!)

  return <ServicesManagementClient salon={{ id: salon.id! }} services={services} />
}
