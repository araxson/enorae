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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <SalonHero salon={salon} />
        <Separator />
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalonDetails salon={salon} services={services} servicesByCategory={servicesByCategory} />
          </div>
          <SalonSidebar salon={salon} location={location} />
        </div>
      </div>
    </section>
  )
}

export type { SalonProfileViewProps } from './salon-profile/types'
