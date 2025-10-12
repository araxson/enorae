import { Section, Stack, Grid } from '@/components/layout'
import { Separator } from '@/components/ui/separator'
import type { SalonProfileViewProps } from './salon-profile/types'
import { buildSalonLocation, groupServicesByCategory } from './salon-profile/utils'
import { SalonHero } from './salon-profile/hero'
import { SalonDetails } from './salon-profile/details'
import { SalonSidebar } from './salon-profile/sidebar'

export function SalonProfileView({ salon, services = [] }: SalonProfileViewProps) {
  const location = buildSalonLocation(salon)
  const servicesByCategory = groupServicesByCategory(services)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SalonHero salon={salon} />
        <Separator />
        <Grid cols={{ base: 1, lg: 3 }} gap="xl">
          <div className="lg:col-span-2">
            <SalonDetails salon={salon} services={services} servicesByCategory={servicesByCategory} />
          </div>
          <SalonSidebar salon={salon} location={location} />
        </Grid>
      </Stack>
    </Section>
  )
}

export type { SalonProfileViewProps } from './salon-profile/types'
