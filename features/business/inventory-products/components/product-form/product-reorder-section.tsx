'use client'

import { Package } from 'lucide-react'

import { Grid } from '@/components/layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProductReorderSectionProps {
  reorderPoint: string
  reorderQuantity: string
  onReorderPointChange: (value: string) => void
  onReorderQuantityChange: (value: string) => void
}

export function ProductReorderSection({
  reorderPoint,
  reorderQuantity,
  onReorderPointChange,
  onReorderQuantityChange,
}: ProductReorderSectionProps) {
  return (
    <section className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        <Label className="font-semibold">Automatic Reorder Settings</Label>
      </div>
      <p className="text-sm text-muted-foreground text-sm">
        Set thresholds to automatically track when products need reordering
      </p>

      <Grid cols={{ base: 1, md: 2 }} gap="md">
        <div className="space-y-2">
          <Label htmlFor="reorder_point">Reorder Point</Label>
          <Input
            id="reorder_point"
            type="number"
            step="1"
            min="0"
            value={reorderPoint}
            onChange={(event) => onReorderPointChange(event.target.value)}
            placeholder="e.g., 10"
          />
          <p className="text-sm text-muted-foreground text-xs">Alert when stock falls below this level</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
          <Input
            id="reorder_quantity"
            type="number"
            step="1"
            min="0"
            value={reorderQuantity}
            onChange={(event) => onReorderQuantityChange(event.target.value)}
            placeholder="e.g., 50"
          />
          <p className="text-sm text-muted-foreground text-xs">Suggested quantity to reorder</p>
        </div>
      </Grid>
    </section>
  )
}
