'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type ServiceOption = { id: string; name: string; price?: number }

type BulkPricingServiceSelectorProps = {
  services: ServiceOption[]
  selectedServices: string[]
  onToggleService: (serviceId: string) => void
}

export function BulkPricingServiceSelector({
  services,
  selectedServices,
  onToggleService,
}: BulkPricingServiceSelectorProps) {
  return (
    <Field>
      <FieldLabel>Choose Services</FieldLabel>
      <FieldContent>
        <Item variant="outline" className="mt-2 flex-col p-0">
          <ScrollArea className="max-h-40">
            <ItemGroup className="space-y-1 p-2">
              {services.map((service) => {
                const isActive = selectedServices.includes(service.id)
                return (
                  <Item
                    key={service.id}
                    asChild
                    variant={isActive ? 'muted' : 'outline'}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => onToggleService(service.id)}
                      aria-pressed={isActive}
                    >
                      <ItemContent>
                        <ItemTitle>{service.name}</ItemTitle>
                      </ItemContent>
                      {service.price !== undefined ? (
                        <ItemActions>
                          <Badge variant="secondary">
                            ${service.price.toFixed(2)}
                          </Badge>
                        </ItemActions>
                      ) : null}
                    </button>
                  </Item>
                )
              })}
            </ItemGroup>
          </ScrollArea>
        </Item>
      </FieldContent>
      {selectedServices.length > 0 ? (
        <FieldDescription>
          {selectedServices.length} services selected.
        </FieldDescription>
      ) : null}
    </Field>
  )
}
