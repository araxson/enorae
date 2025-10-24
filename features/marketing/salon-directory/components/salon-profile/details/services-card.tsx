import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServicesByCategory, Service } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface ServicesCardProps {
  services: Service[]
  servicesByCategory: ServicesByCategory
}

export function ServicesCard({ services, servicesByCategory }: ServicesCardProps) {
  if (services.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
        <CardDescription>Browse offerings grouped by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {(Object.entries(servicesByCategory) as Array<[string, Service[]]>).map(
            ([category, categoryServices]) => (
              <div key={category} className="flex flex-col gap-4">
                <h3>{category}</h3>
                <div className="flex flex-col gap-3">
                  {categoryServices.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ServiceRowProps {
  service: Service
}

function ServiceRow({ service }: ServiceRowProps) {
  return (
    <div className="flex gap-4 items-start justify-between py-2">
      <div className="flex flex-col gap-2">
        <p className="leading-7">{service.name}</p>
        {service.description && <p className="text-muted-foreground">{service.description}</p>}
      </div>
      <div className="flex gap-3 items-center">
        {service.duration_minutes && <p className="text-muted-foreground">{service.duration_minutes}m</p>}
        {service.sale_price && (
          <p className="leading-7 whitespace-nowrap">${service.sale_price}</p>
        )}
      </div>
    </div>
  )
}
