'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/features/shared/ui-components'
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
      <EmptyState
        icon={Scissors}
        title={isFiltered ? 'No services found' : 'No services available'}
        description={
          isFiltered
            ? 'Try adjusting your search or filters'
            : 'Add services to start accepting bookings'
        }
      />
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service['id']}>
          <CardHeader>
            <div className="flex gap-3 items-start justify-between">
              <CardTitle>{service['name']}</CardTitle>
              <Badge variant={service['is_active'] ? 'default' : 'secondary'}>
                {service['is_active'] ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              {service['description'] && (
                <p className="leading-7 text-muted-foreground text-sm line-clamp-2">{service['description']}</p>
              )}

              <div className="flex gap-4 text-sm">
                {service['current_price'] && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{service['current_price']}</span>
                    {service['sale_price'] && service['price'] && service['sale_price'] < service['price'] && (
                      <span className="text-muted-foreground line-through ml-1">{service['price']}</span>
                    )}
                  </div>
                )}
                {service['duration_minutes'] && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service['duration_minutes']}min</span>
                  </div>
                )}
              </div>

              {service['category_name'] && <p className="text-xs text-muted-foreground">{service['category_name']}</p>}
            </div>
          </CardContent>

          {onEditService && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onEditService(service)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Service
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
