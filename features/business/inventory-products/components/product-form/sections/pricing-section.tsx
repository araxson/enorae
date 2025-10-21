"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { ProductFormState } from '../types'

export function PricingSection({
  formState,
  onChange,
}: {
  formState: ProductFormState
  onChange: (state: ProductFormState) => void
}) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cost_price">Cost Price ($)</Label>
        <Input
          id="cost_price"
          type="number"
          step="0.01"
          min="0"
          value={formState.cost_price}
          onChange={(event) => onChange({ ...formState, cost_price: event.target.value })}
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
          value={formState.retail_price}
          onChange={(event) => onChange({ ...formState, retail_price: event.target.value })}
          placeholder="0.00"
        />
      </div>
    </div>
  )
}
