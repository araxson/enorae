'use client'

import { DollarSign } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { PricingFormState } from './use-pricing-form'

type ServiceSelectionProps = {
  services: Array<{ id: string; name: string }>
  state: PricingFormState
  editing: boolean
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function ServiceSelection({ services, state, editing, onChange }: ServiceSelectionProps) {
  return (
    <div className="flex flex-col gap-6">
      {!editing && (
        <Field>
          <FieldLabel htmlFor="service">
            Service <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Select
              value={state.serviceId}
              onValueChange={(value) => onChange('serviceId', value)}
              required
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services
                  .filter((service) => service.id)
                  .map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      )}

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <div className="flex items-center gap-2">
            <ItemMedia variant="icon">
              <DollarSign className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemTitle>Base Pricing</ItemTitle>
          </div>
        </ItemHeader>
        <ItemContent>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="basePrice">
                Base Price <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={state.basePrice}
                  onChange={(event) => onChange('basePrice', parseFloat(event.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </FieldContent>
              <FieldDescription>Regular service price.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="salePrice">Sale Price</FieldLabel>
              <FieldContent>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={state.salePrice}
                  onChange={(event) => onChange('salePrice', parseFloat(event.target.value) || 0)}
                  placeholder="0.00"
                />
              </FieldContent>
              <FieldDescription>Discounted price (optional).</FieldDescription>
            </Field>
          </FieldGroup>
        </ItemContent>
      </Item>
    </div>
  )
}
