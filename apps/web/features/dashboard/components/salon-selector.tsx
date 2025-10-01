import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@enorae/ui'
import type { Salon } from '../types/dashboard.types'

interface SalonSelectorProps {
  salons: Salon[]
  selectedSalonId?: string
}

export function SalonSelector({ salons, selectedSalonId }: SalonSelectorProps) {
  if (salons.length === 0) {
    return (
      <div className="text-muted-foreground">
        No salons found. Create your first salon to get started.
      </div>
    )
  }

  if (salons.length === 1) {
    return (
      <h1 className="text-3xl font-bold">{salons[0].name}</h1>
    )
  }

  return (
    <Select defaultValue={selectedSalonId || salons[0].id || undefined}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a salon" />
      </SelectTrigger>
      <SelectContent>
        {salons.map((salon) => (
          <SelectItem key={salon.id} value={salon.id!}>
            {salon.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}