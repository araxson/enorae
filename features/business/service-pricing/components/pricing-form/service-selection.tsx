'use client'

import { DollarSign } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div className="space-y-2">
          <Label htmlFor="service">
            Service <span className="text-destructive">*</span>
          </Label>
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
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <CardTitle>Base Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="basePrice">
                Base Price <span className="text-destructive">*</span>
              </Label>
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
              <p className="text-xs text-muted-foreground">Regular service price</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={state.salePrice}
                onChange={(event) => onChange('salePrice', event.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Discounted price (optional)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
