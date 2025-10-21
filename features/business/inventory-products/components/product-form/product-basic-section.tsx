'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProductBasicSectionProps {
  name: string
  description: string
  sku: string
  unitOfMeasure: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSkuChange: (value: string) => void
  onUnitOfMeasureChange: (value: string) => void
}

export function ProductBasicSection({
  name,
  description,
  sku,
  unitOfMeasure,
  onNameChange,
  onDescriptionChange,
  onSkuChange,
  onUnitOfMeasureChange,
}: ProductBasicSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g., Shampoo, Hair Color, Styling Gel"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Product description (optional)"
          rows={3}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={sku}
            onChange={(event) => onSkuChange(event.target.value)}
            placeholder="e.g., SHP-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_of_measure">Unit of Measure</Label>
          <Input
            id="unit_of_measure"
            value={unitOfMeasure}
            onChange={(event) => onUnitOfMeasureChange(event.target.value)}
            placeholder="e.g., bottle, tube, pack"
          />
        </div>
      </div>
    </section>
  )
}
