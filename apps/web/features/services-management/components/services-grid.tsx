import { ServiceCard } from './service-card'
import type { Service } from '../types/service.types'

interface ServicesGridProps {
  services: Service[]
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No services yet. Add your first service to get started.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}