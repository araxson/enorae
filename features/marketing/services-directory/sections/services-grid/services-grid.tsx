import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { EmptyState } from './empty-state'
import { ServiceCard } from './service-card'

type Service = Database['public']['Views']['services_view']['Row']

interface ServicesGridProps {
  services: Service[]
  categoryName?: string
}

export function ServicesGrid({ services, categoryName }: ServicesGridProps) {
  if (services.length === 0) {
    return <EmptyState categoryName={categoryName} />
  }

  return (
    <ItemGroup className="gap-6">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>
            {services.length} service{services.length !== 1 ? 's' : ''}
            {categoryName && ` in ${categoryName}`}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Open a service card to see duration, pricing, and booking actions.</ItemDescription>
        </ItemContent>
      </Item>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service['id']} service={service} />
        ))}
      </div>
    </ItemGroup>
  )
}
