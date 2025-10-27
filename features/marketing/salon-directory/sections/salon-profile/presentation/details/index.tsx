import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import type { Salon, Service, ServicesByCategory } from '../types'
import { AboutCard } from './about-card'
import { ServicesCard } from './services-card'
import { AmenitiesCard } from './amenities-card'
import { GalleryCard } from './gallery-card'

interface SalonDetailsProps {
  salon: Salon
  services: Service[]
  servicesByCategory: ServicesByCategory
}

export function SalonDetails({ salon, services, servicesByCategory }: SalonDetailsProps) {
  return (
    <ItemGroup className="gap-6">
      <Item className="flex-col" variant="muted">
        <ItemContent>
          <ItemDescription>Learn more about the salon story, offerings, and amenities.</ItemDescription>
        </ItemContent>
      </Item>
      <AboutCard salon={salon} />
      <ServicesCard services={services} servicesByCategory={servicesByCategory} />
      <AmenitiesCard salon={salon} />
      <GalleryCard salon={salon} />
    </ItemGroup>
  )
}
