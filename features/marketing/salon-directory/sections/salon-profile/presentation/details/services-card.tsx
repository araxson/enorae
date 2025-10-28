import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import type { ServicesByCategory, Service } from '../types'

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
              <Item key={category} variant="outline">
                <ItemContent>
                  <div className="flex flex-col gap-4">
                    <ItemTitle>{category}</ItemTitle>
                    <div className="flex flex-col gap-2">
                      {categoryServices.map((service) => (
                        <ServiceRow key={service['id']} service={service} />
                      ))}
                    </div>
                  </div>
                </ItemContent>
              </Item>
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
  const duration = service['duration_minutes']
  const price = service['sale_price']

  return (
    <Item variant="muted">
      <ItemContent>
        <ItemTitle>{service['name']}</ItemTitle>
        {service['description'] && <ItemDescription>{service['description']}</ItemDescription>}
      </ItemContent>
      {(duration || price) && (
        <ItemActions>
          <div className="flex items-center gap-3">
            {duration ? <span className="text-muted-foreground">{duration}m</span> : null}
            {price ? <span className="whitespace-nowrap">${price}</span> : null}
          </div>
        </ItemActions>
      )}
    </Item>
  )
}
