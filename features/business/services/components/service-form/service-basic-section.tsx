'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

interface ServiceBasicSectionProps {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function ServiceBasicSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: ServiceBasicSectionProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Basic information</FieldLegend>

      <Field>
        <FieldLabel htmlFor="name">Service name *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
            placeholder="e.g., Women's Haircut"
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Brief description of the service..."
            rows={3}
          />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
