import { getServices, getUserSalon } from './api/queries'
import { ServicesManagementClient } from './components/services-management-client'
import { Section } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function ServicesManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    return (
      <Section size="lg">
        <H1>Please log in to manage services</H1>
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <H1>No salon found</H1>
        <Lead>Please create a salon to manage services</Lead>
      </Section>
    )
  }

  const services = await getServices(salon.id!)

  return <ServicesManagementClient salon={{ id: salon.id! }} services={services} />
}
