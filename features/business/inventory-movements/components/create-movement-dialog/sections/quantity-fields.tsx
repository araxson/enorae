'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function QuantityFields() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Label htmlFor="quantity">Quantity</Label>
        <Input type="number" id="quantity" name="quantity" required min="1" placeholder="e.g., 10" />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="costPrice">Cost Price (optional)</Label>
        <Input
          type="number"
          id="costPrice"
          name="costPrice"
          min="0"
          step="0.01"
          placeholder="e.g., 25.50"
        />
      </div>
    </div>
  )
}
