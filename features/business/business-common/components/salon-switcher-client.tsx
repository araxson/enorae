'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

type SalonOption = {
  id: string
  name: string | null
}

interface SalonSwitcherClientProps {
  salons: SalonOption[]
  defaultSalonId: string
  name: string
  triggerId?: string
}

export function SalonSwitcherClient({
  salons,
  defaultSalonId,
  name,
  triggerId,
}: SalonSwitcherClientProps) {
  const [value, setValue] = useState(defaultSalonId)

  useEffect(() => {
    setValue(defaultSalonId)
  }, [defaultSalonId])

  useEffect(() => {
    if (!value && salons.length > 0) {
      setValue(salons[0].id)
    }
  }, [salons, value])

  return (
    <div className="w-64">
      <Input type="hidden" name={name} value={value} className="hidden" />
      <Select value={value || undefined} onValueChange={setValue}>
        <SelectTrigger id={triggerId}>
          <SelectValue placeholder="Select a salon" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {salons.map((salon) => (
              <SelectItem key={salon.id} value={salon.id}>
                {salon.name || 'Untitled Salon'}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
