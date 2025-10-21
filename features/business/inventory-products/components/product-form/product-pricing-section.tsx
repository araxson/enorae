'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProductPricingSectionProps {
  costPrice: string
  retailPrice: string
  onCostPriceChange: (value: string) => void
  onRetailPriceChange: (value: string) => void
}

export function ProductPricingSection({
  costPrice,
  retailPrice,
  onCostPriceChange,
  onRetailPriceChange,
}: ProductPricingSectionProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cost_price">Cost Price ($)</Label>
        <Input
          id="cost_price"
          type="number"
          step="0.01"
          min="0"
          value={costPrice}
          onChange={(event) => onCostPriceChange(event.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="retail_price">Retail Price ($)</Label>
        <Input
          id="retail_price"
          type="number"
          step="0.01"
          min="0"
          value={retailPrice}
          onChange={(event) => onRetailPriceChange(event.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  )
}
