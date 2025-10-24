'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
type AssignedService = {
  id: string | null
  service_id: string | null
  service_name: string | null
}

type AssignedServicesListProps = {
  services: AssignedService[]
  onUnassign: (serviceId: string) => void
}

export function AssignedServicesList({ services, onUnassign }: AssignedServicesListProps) {
  if (services.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="leading-7 text-sm font-medium">Currently Assigned</p>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service.id} variant="outline">
            <span className="flex items-center gap-2">
              <span>{service.service_name}</span>
              {service.service_id && (
                <Button variant="ghost" size="sm" onClick={() => onUnassign(service.service_id!)}>
                  Remove
                </Button>
              )}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
