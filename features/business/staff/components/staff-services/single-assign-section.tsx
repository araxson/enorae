'use client'

import { useMemo } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { ServiceRow } from '@/features/business/staff/api/types'

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
    <FieldSet className="space-y-4">
      <Field>
        <FieldLabel htmlFor="service">Service</FieldLabel>
        <FieldContent>
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
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="proficiency">Proficiency Level</FieldLabel>
        <FieldContent>
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
        </FieldContent>
      </Field>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="price">Price Override (optional)</FieldLabel>
          <FieldContent>
            <Input
              id="price"
              placeholder="Enter custom price"
              value={priceOverride}
              onChange={(event) => onPriceChange(event.target.value)}
            />
          </FieldContent>
          <FieldDescription>Leave blank to use the service default pricing.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="duration">Duration Override (optional)</FieldLabel>
          <FieldContent>
            <Input
              id="duration"
              placeholder="Enter custom duration"
              value={durationOverride}
              onChange={(event) => onDurationChange(event.target.value)}
            />
          </FieldContent>
          <FieldDescription>Default duration applies when no override is provided.</FieldDescription>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Add notes about this assignment"
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
