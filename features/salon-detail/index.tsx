import { getSalonBySlug, getSalonServices, getSalonStaff } from './dal/salon-detail.queries'
import { SalonHeader } from './components/salon-header'
import { ServiceList } from './components/service-list'
import { StaffGrid } from './components/staff-grid'
import { Section, Stack } from '@/components/layout'

interface SalonDetailProps {
  slug: string
}

export async function SalonDetail({ slug }: SalonDetailProps) {
  const salon = await getSalonBySlug(slug)
  const services = await getSalonServices(salon.id || '')
  const staff = await getSalonStaff(salon.id || '')

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SalonHeader salon={salon} />
        <ServiceList services={services} />
        <StaffGrid staff={staff} />
      </Stack>
    </Section>
  )
}
