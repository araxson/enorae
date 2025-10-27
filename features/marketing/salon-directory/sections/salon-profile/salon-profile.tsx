import { Separator } from '@/components/ui/separator'
import { ItemGroup } from '@/components/ui/item'
import type { SalonProfileViewProps } from './presentation/types'
import { buildSalonLocation, groupServicesByCategory } from './presentation/utils'
import { SalonHero } from './presentation/hero'
import { SalonDetails } from './presentation/details'
import { SalonSidebar } from './presentation/sidebar'

export function SalonProfileView({ salon, services = [] }: SalonProfileViewProps) {
  const location = buildSalonLocation(salon)
  const servicesByCategory = groupServicesByCategory(services)

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="gap-8">
        <SalonHero salon={salon} />
        <Separator />
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalonDetails salon={salon} services={services} servicesByCategory={servicesByCategory} />
          </div>
          <SalonSidebar salon={salon} location={location} />
        </div>
      </ItemGroup>
    </section>
  )
}

export type { SalonProfileViewProps } from './presentation/types'
