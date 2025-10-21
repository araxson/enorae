'use client'

import { Checkbox } from '@/components/ui/checkbox'
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
    </div>
  )
}
