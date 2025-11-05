import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel } from '@/features/marketing/components/common'
import type { ServicesByCategory, Service } from '../types'

interface ServicesCardProps {
  services: Service[]
  servicesByCategory: ServicesByCategory
}

export function ServicesCard({ services, servicesByCategory }: ServicesCardProps) {
  if (services.length === 0) return null

  return (
    <MarketingPanel
      variant="outline"
      title="Services"
      description="Browse offerings grouped by category."
      align="start"
    >
      <ItemGroup className="gap-6">
        {Object.entries(servicesByCategory).map(
          ([category, categoryServices]: [string, Service[]]) => (
            <Item key={category} variant="outline">
              <ItemContent>
                <div className="flex flex-col gap-3">
                  <ItemTitle>{category}</ItemTitle>
                  <ItemGroup className="gap-2">
                    {categoryServices.map((service) => (
                      <ServiceRow key={service['id']} service={service} />
                    ))}
                  </ItemGroup>
                </div>
              </ItemContent>
            </Item>
          ),
        )}
      </ItemGroup>
    </MarketingPanel>
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
