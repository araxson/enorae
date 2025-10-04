import { getSalonBySlug, getSalonServices, getSalonStaff, getSalonReviews } from './api/queries'
import { SalonHeader } from './components/salon-header'
import { ServiceList } from './components/service-list'
import { StaffGrid } from './components/staff-grid'
import { SalonReviews } from './components/salon-reviews'
import { Section, Stack } from '@/components/layout'

interface SalonDetailProps {
  slug: string
}

export async function SalonDetail({ slug }: SalonDetailProps) {
  const salon = await getSalonBySlug(slug)
  const [services, staff, reviews] = await Promise.all([
    getSalonServices(salon.id || ''),
    getSalonStaff(salon.id || ''),
    getSalonReviews(salon.id || '', 20),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SalonHeader salon={salon} />
        <ServiceList services={services} />
        <StaffGrid staff={staff} />
        <SalonReviews reviews={reviews} />
      </Stack>
    </Section>
  )
}
