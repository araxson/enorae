'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import type { ServiceRow } from './types'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'

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
      <Field orientation="responsive" className="items-center justify-between gap-3">
        <FieldLabel>Select services ({selectedServices.size} selected)</FieldLabel>
        <FieldContent className="flex gap-2">
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
        </FieldContent>
      </Field>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <FieldSet className="grid grid-cols-2 gap-2 p-4">
              {availableServices.map((service) => (
                <Field key={service.id} orientation="horizontal" className="items-center gap-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={selectedServices.has(service.id!)}
                    onCheckedChange={() => onToggleService(service.id!)}
                  />
                  <FieldLabel htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="truncate">{service.name}</span>
                      {assignedServiceIds.has(service.id) && <Badge variant="outline">Assigned</Badge>}
                    </span>
                  </FieldLabel>
                </Field>
              ))}
            </FieldSet>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
