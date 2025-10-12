'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { Label } from '@/components/ui/label'
import type { MovementType } from '../types'

const MOVEMENT_OPTIONS: { value: MovementType; label: string }[] = [
  { value: 'in', label: 'Stock In (Receive)' },
  { value: 'out', label: 'Stock Out (Issue)' },
  { value: 'adjustment', label: 'Adjustment (Count)' },
  { value: 'transfer', label: 'Transfer (Between Locations)' },
  { value: 'return', label: 'Return (From Customer)' },
  { value: 'damage', label: 'Damage/Spoilage' },
  { value: 'theft', label: 'Theft/Loss' },
  { value: 'other', label: 'Other' },
]

type Props = {
  value: MovementType
  onChange: (value: MovementType) => void
}

export function MovementTypeSelect({ value, onChange }: Props) {
  return (
    <Stack gap="sm">
      <Label htmlFor="movementType">Movement Type</Label>
      <Select value={value} onValueChange={(next) => onChange(next as MovementType)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MOVEMENT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Stack>
  )
}
