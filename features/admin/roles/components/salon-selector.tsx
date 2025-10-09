'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SalonSelectorProps {
  salons: Array<{ id: string; name: string }>
  value: string
  onChange: (id: string) => void
  required?: boolean
}

export function SalonSelector({ salons, value, onChange, required }: SalonSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="salonId">Salon *</Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger id="salonId">
          <SelectValue placeholder="Select a salon" />
        </SelectTrigger>
        <SelectContent>
          {salons.map((salon) => (
            <SelectItem key={salon.id} value={salon.id}>
              {salon.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Required for business and staff roles</p>
    </div>
  )
}
