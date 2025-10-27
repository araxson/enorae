'use client'

import { DollarSign } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <CardTitle>Base Pricing</CardTitle>
        </CardHeader>
        <CardContent>
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
                  onChange={(event) => onChange('basePrice', event.target.value)}
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
                  onChange={(event) => onChange('salePrice', event.target.value)}
                  placeholder="0.00"
                />
              </FieldContent>
              <FieldDescription>Discounted price (optional).</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
