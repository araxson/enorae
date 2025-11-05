import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'
import type { SalonProfileViewProps } from './presentation/types'
import { buildSalonLocation, groupServicesByCategory } from './presentation/utils'
import { SalonHero } from './presentation/hero'
import { SalonDetails } from './presentation/details'
import { SalonSidebar } from './presentation/sidebar'

export function SalonProfileView({ salon, services = [] }: SalonProfileViewProps) {
  const location = buildSalonLocation(salon)
  const servicesByCategory = groupServicesByCategory(services)

  return (
    <MarketingSection
      spacing="normal"
      containerClassName="max-w-6xl"
      groupClassName="gap-8"
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/salons">Salons</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{salon['name'] || 'Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MarketingPanel
        variant="muted"
        description={`Overview of ${salon['name'] || 'this salon'}, services, and booking details.`}
      />
      <SalonHero salon={salon} />
      <Separator />
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalonDetails salon={salon} services={services} servicesByCategory={servicesByCategory} />
        </div>
        <SalonSidebar salon={salon} location={location} />
      </div>
    </MarketingSection>
  )
}

export type { SalonProfileViewProps } from './presentation/types'
