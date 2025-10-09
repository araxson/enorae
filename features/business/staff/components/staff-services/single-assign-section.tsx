'use client'

import { useMemo } from 'react'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ServiceRow } from './types'

type SingleAssignSectionProps = {
  availableServices: ServiceRow[]
  assignedServiceIds: Set<string | null>
  selectedService: string
  onSelectService: (serviceId: string) => void
  proficiencyLevel: string
  onSelectProficiency: (level: string) => void
  priceOverride: string
  onPriceChange: (value: string) => void
  durationOverride: string
  onDurationChange: (value: string) => void
  notes: string
  onNotesChange: (value: string) => void
}

export function SingleAssignSection({
  availableServices,
  assignedServiceIds,
  selectedService,
  onSelectService,
  proficiencyLevel,
  onSelectProficiency,
  priceOverride,
  onPriceChange,
  durationOverride,
  onDurationChange,
  notes,
  onNotesChange,
}: SingleAssignSectionProps) {
  const unassignedServices = useMemo(
    () => availableServices.filter((service) => !assignedServiceIds.has(service.id)),
    [availableServices, assignedServiceIds],
  )

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="service">Service</Label>
        <Select value={selectedService} onValueChange={onSelectService}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {unassignedServices.map((service) => (
              <SelectItem key={service.id} value={service.id!}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="proficiency">Proficiency Level</Label>
        <Select value={proficiencyLevel} onValueChange={onSelectProficiency}>
          <SelectTrigger>
            <SelectValue placeholder="Select level (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price Override (optional)</Label>
          <Input
            id="price"
            placeholder="Enter custom price"
            value={priceOverride}
            onChange={(event) => onPriceChange(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration Override (optional)</Label>
          <Input
            id="duration"
            placeholder="Enter custom duration"
            value={durationOverride}
            onChange={(event) => onDurationChange(event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add notes about this assignment"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </div>
    </div>
  )
}
