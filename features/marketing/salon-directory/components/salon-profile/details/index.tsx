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
    <div className="flex flex-col gap-6">
      <AboutCard salon={salon} />
      <ServicesCard services={services} servicesByCategory={servicesByCategory} />
      <AmenitiesCard salon={salon} />
      <GalleryCard salon={salon} />
    </div>
  )
}
