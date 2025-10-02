import { getServices, getUserSalon } from './dal/services.queries'
import { ServicesGrid } from './components/services-grid'
import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'

export async function ServicesManagement() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
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

  const services = await getServices(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Services</H1>
          <Lead>Manage your salon services</Lead>
        </div>
        <ServicesGrid services={services} />
      </Stack>
    </Section>
  )
}
