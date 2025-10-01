'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Badge } from '@enorae/ui'
import { toggleServiceActive } from '../actions/services.actions'
import type { Service } from '../types/service.types'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const handleToggle = async () => {
    if (service.id) {
      await toggleServiceActive(service.id, !service.is_active)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            {service.category_name && (
              <p className="text-sm text-muted-foreground mt-1">
                {service.category_name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {service.is_active ? (
              <Badge>Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {service.is_bookable && (
              <Badge variant="outline">Bookable</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {service.description && (
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
            >
              {service.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/business/services/${service.id}/edit`}>
                Edit
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}