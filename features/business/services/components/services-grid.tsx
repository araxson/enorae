'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Scissors, Edit, DollarSign, Clock } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

interface ServicesGridProps {
  services: Service[]
  onEditService?: (service: Service) => void
  isFiltered?: boolean
}

export function ServicesGrid({ services, onEditService, isFiltered = false }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Scissors className="size-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{isFiltered ? 'No services found' : 'No services available'}</EmptyTitle>
          <EmptyDescription>
            {isFiltered ? 'Try adjusting your search or filters.' : 'Add services to start accepting bookings.'}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Use the “Add Service” action to build your catalog.</EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Item key={service['id']} variant="outline" className="flex-col gap-4">
          <ItemHeader>
            <ItemContent>
              <ItemTitle>{service['name']}</ItemTitle>
              {service['category_name'] ? (
                <ItemDescription>{service['category_name']}</ItemDescription>
              ) : null}
            </ItemContent>
            <ItemActions>
              <Badge variant={service['is_active'] ? 'default' : 'secondary'}>
                {service['is_active'] ? 'Active' : 'Inactive'}
              </Badge>
            </ItemActions>
          </ItemHeader>

          <ItemContent className="space-y-4">
            {service['description'] ? (
              <p className="text-sm leading-7 text-muted-foreground line-clamp-2">
                {service['description']}
              </p>
            ) : (
              <span className="text-sm text-muted-foreground">No description provided</span>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {service['current_price'] ? (
                <div className="flex items-center gap-1">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span>{service['current_price']}</span>
                  {service['sale_price'] && service['price'] && service['sale_price'] < service['price'] && (
                    <span className="ml-1 line-through text-muted-foreground">{service['price']}</span>
                  )}
                </div>
              ) : null}
              {service['duration_minutes'] ? (
                <div className="flex items-center gap-1">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>{service['duration_minutes']}min</span>
                </div>
              ) : null}
            </div>
          </ItemContent>

          {onEditService && (
            <ItemFooter>
              <ItemActions>
                <Button variant="outline" size="sm" onClick={() => onEditService(service)}>
                  <Edit className="mr-2 size-4" />
                  Edit Service
                </Button>
              </ItemActions>
            </ItemFooter>
          )}
        </Item>
      ))}
    </div>
  )
}
