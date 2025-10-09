"use client"

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Grid } from '@/components/layout'

import type { ProductFormState } from '../types'

type BasicInfoSectionProps = {
  formState: ProductFormState
  onChange: (state: ProductFormState) => void
}

export function BasicInfoSection({ formState, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formState.name}
          onChange={(event) => onChange({ ...formState, name: event.target.value })}
          placeholder="e.g., Shampoo, Hair Color, Styling Gel"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formState.description}
          onChange={(event) => onChange({ ...formState, description: event.target.value })}
          placeholder="Product description (optional)"
          rows={3}
        />
      </div>

      <Grid cols={{ base: 1, md: 2 }} gap="md">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formState.sku}
            onChange={(event) => onChange({ ...formState, sku: event.target.value })}
            placeholder="e.g., SHP-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_of_measure">Unit of Measure</Label>
          <Input
            id="unit_of_measure"
            value={formState.unit_of_measure}
            onChange={(event) =>
              onChange({ ...formState, unit_of_measure: event.target.value })
            }
            placeholder="e.g., bottle, tube, pack"
          />
        </div>
      </Grid>
    </div>
  )
}
