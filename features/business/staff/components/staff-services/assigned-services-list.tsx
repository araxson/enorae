'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { P } from '@/components/ui/typography'

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
      <P className="text-sm font-medium">Currently Assigned</P>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service.id} variant="outline" className="flex items-center gap-2">
            {service.service_name}
            {service.service_id && (
              <Button variant="ghost" size="sm" onClick={() => onUnassign(service.service_id!)}>
                Remove
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  )
}
