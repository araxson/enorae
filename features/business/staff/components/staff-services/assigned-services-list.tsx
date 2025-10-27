'use client'

import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
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
    <Field className="gap-3">
      <FieldLabel>Currently assigned</FieldLabel>
      <FieldContent>
        <ItemGroup className="gap-2">
          {services.map((service) => (
            <Item key={service.id} variant="outline" size="sm" className="items-center">
              <ItemContent>
                <ItemTitle>{service.service_name || 'Unassigned service'}</ItemTitle>
              </ItemContent>
              {service.service_id ? (
                <ItemActions>
                  <Button variant="ghost" size="sm" onClick={() => onUnassign(service.service_id!)}>
                    Remove
                  </Button>
                </ItemActions>
              ) : null}
            </Item>
          ))}
        </ItemGroup>
      </FieldContent>
    </Field>
  )
}
