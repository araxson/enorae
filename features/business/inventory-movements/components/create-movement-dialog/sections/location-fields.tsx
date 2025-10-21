'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { InventoryLocationOption, MovementType } from '../types'

const requiresSingleLocation = (movementType: MovementType) => movementType !== 'transfer'

type Props = {
  movementType: MovementType
  locations: InventoryLocationOption[]
  locationId: string
  fromLocationId: string
  toLocationId: string
  onLocationChange: (value: string) => void
  onFromLocationChange: (value: string) => void
  onToLocationChange: (value: string) => void
}

export function LocationFields({
  movementType,
  locations,
  locationId,
  fromLocationId,
  toLocationId,
  onLocationChange,
  onFromLocationChange,
  onToLocationChange,
}: Props) {
  if (requiresSingleLocation(movementType)) {
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor="locationId">Location</Label>
        <Select value={locationId} onValueChange={onLocationChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Label htmlFor="fromLocationId">From Location</Label>
        <Select value={fromLocationId} onValueChange={onFromLocationChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="toLocationId">To Location</Label>
        <Select value={toLocationId} onValueChange={onToLocationChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
