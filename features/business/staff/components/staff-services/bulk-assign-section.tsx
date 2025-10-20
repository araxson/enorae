'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { ServiceRow } from './types'

type BulkAssignSectionProps = {
  availableServices: ServiceRow[]
  selectedServices: Set<string>
  onToggleService: (serviceId: string) => void
  onSelectedServicesChange: (services: Set<string>) => void
  assignedServiceIds: Set<string | null>
}

export function BulkAssignSection({
  availableServices,
  selectedServices,
  onToggleService,
  onSelectedServicesChange,
  assignedServiceIds,
}: BulkAssignSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="leading-7 text-sm font-medium">
          Select services ({selectedServices.size} selected)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allIds = availableServices
                .map((service) => service.id)
                .filter((id): id is string => Boolean(id))
              onSelectedServicesChange(new Set(allIds))
            }}
          >
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelectedServicesChange(new Set())}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border rounded-md p-4">
        {availableServices.map((service) => (
          <div key={service.id} className="flex items-center gap-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={selectedServices.has(service.id!)}
              onCheckedChange={() => onToggleService(service.id!)}
            />
            <Label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer flex-1">
              {service.name}
              {assignedServiceIds.has(service.id) && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Assigned
                </Badge>
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
