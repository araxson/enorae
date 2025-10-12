'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Grid } from '@/components/layout'
import { Label } from '@/components/ui/label'

interface ProductStatusSectionProps {
  isActive: boolean
  isTracked: boolean
  onActiveChange: (value: boolean) => void
  onTrackedChange: (value: boolean) => void
}

export function ProductStatusSection({
  isActive,
  isTracked,
  onActiveChange,
  onTrackedChange,
}: ProductStatusSectionProps) {
  return (
    <Grid cols={{ base: 1, md: 2 }} gap="md">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => onActiveChange(Boolean(checked))}
        />
        <Label htmlFor="is_active" className="cursor-pointer">
          Active Product
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_tracked"
          checked={isTracked}
          onCheckedChange={(checked) => onTrackedChange(Boolean(checked))}
        />
        <Label htmlFor="is_tracked" className="cursor-pointer">
          Track Inventory
        </Label>
      </div>
    </Grid>
  )
}
