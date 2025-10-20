'use client'

import { DollarSign } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import type { PricingFormState } from './use-pricing-form'

type ServiceSelectionProps = {
  services: Array<{ id: string; name: string }>
  state: PricingFormState
  editing: boolean
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function ServiceSelection({ services, state, editing, onChange }: ServiceSelectionProps) {
  return (
    <Stack gap="lg">
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
        <CardContent>
          <Stack gap="lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Label className="font-semibold">Base Pricing</Label>
            </div>

            <Grid cols={{ base: 1, md: 2 }} gap="md">
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
                <p className="text-sm text-muted-foreground text-xs">Regular service price</p>
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
                <p className="text-sm text-muted-foreground text-xs">Discounted price (optional)</p>
              </div>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
