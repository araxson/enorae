'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

interface SalonSelectorProps {
  salons: Array<{ id: string; name: string }>
  value: string
  onChange: (id: string) => void
  required?: boolean
}

export function SalonSelector({ salons, value, onChange, required }: SalonSelectorProps) {
  return (
    <Field>
      <FieldLabel htmlFor="salonId">Salon *</FieldLabel>
      <FieldContent>
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
        <FieldDescription>Required for business and staff roles.</FieldDescription>
      </FieldContent>
    </Field>
  )
}
