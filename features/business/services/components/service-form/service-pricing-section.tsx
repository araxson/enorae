'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

interface ServicePricingSectionProps {
  basePrice: string
  salePrice: string
  onBasePriceChange: (value: string) => void
  onSalePriceChange: (value: string) => void
}

export function ServicePricingSection({
  basePrice,
  salePrice,
  onBasePriceChange,
  onSalePriceChange,
}: ServicePricingSectionProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Pricing</FieldLegend>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="basePrice">Base price * ($)</FieldLabel>
          <FieldContent>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              min="0"
              value={basePrice}
              onChange={(event) => onBasePriceChange(event.target.value)}
              required
              placeholder="49.99"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="salePrice">Sale price ($)</FieldLabel>
          <FieldContent>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              min="0"
              value={salePrice}
              onChange={(event) => onSalePriceChange(event.target.value)}
              placeholder="39.99"
            />
            <FieldDescription>Optional promotional price</FieldDescription>
          </FieldContent>
        </Field>
      </div>
    </FieldSet>
  )
}
