'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import type { ServiceRow } from './types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
      <Field orientation="responsive">
        <FieldLabel>Select services</FieldLabel>
        <FieldContent>
          <FieldDescription>{selectedServices.size} selected</FieldDescription>
          <ButtonGroup>
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
          </ButtonGroup>
        </FieldContent>
      </Field>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <FieldSet>
              <ItemGroup className="grid grid-cols-2 gap-2 p-4">
              {availableServices.map((service) => (
                <Item key={service.id} variant="outline" className="items-center gap-3">
                  <ItemContent>
                    <label
                      htmlFor={`service-${service.id}`}
                      className="flex w-full cursor-pointer items-center gap-3"
                    >
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.has(service.id!)}
                        onCheckedChange={() => onToggleService(service.id!)}
                      />
                      <div className="flex flex-1 items-center gap-2">
                        <ItemTitle>{service.name}</ItemTitle>
                        {assignedServiceIds.has(service.id) && <Badge variant="outline">Assigned</Badge>}
                      </div>
                    </label>
                  </ItemContent>
                </Item>
              ))}
              </ItemGroup>
            </FieldSet>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
