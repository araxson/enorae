import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
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
    <div
      className="group/item-group flex flex-col gap-6"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>Salon overview</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Learn more about the salon story, offerings, and amenities.</ItemDescription>
        </ItemContent>
      </Item>
      <AboutCard salon={salon} />
      <ServicesCard services={services} servicesByCategory={servicesByCategory} />
      <AmenitiesCard salon={salon} />
      <GalleryCard salon={salon} />
    </div>
  )
}
