'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
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

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="grid grid-cols-2 gap-2 p-4">
              {availableServices.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={selectedServices.has(service.id!)}
                    onCheckedChange={() => onToggleService(service.id!)}
                  />
                  <Label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="truncate">{service.name}</span>
                      {assignedServiceIds.has(service.id) && <Badge variant="outline">Assigned</Badge>}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
