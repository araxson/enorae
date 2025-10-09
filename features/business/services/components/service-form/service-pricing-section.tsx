'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Pricing</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="basePrice">Base Price * ($)</Label>
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
        </div>

        <div>
          <Label htmlFor="salePrice">Sale Price ($)</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            min="0"
            value={salePrice}
            onChange={(event) => onSalePriceChange(event.target.value)}
            placeholder="39.99"
          />
          <p className="text-xs text-muted-foreground mt-1">Optional promotional price</p>
        </div>
      </div>
    </section>
  )
}
