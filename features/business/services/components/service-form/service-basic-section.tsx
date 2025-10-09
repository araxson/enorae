'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Basic Information</h3>

      <div>
        <Label htmlFor="name">Service Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          required
          placeholder="e.g., Women's Haircut"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Brief description of the service..."
          rows={3}
        />
      </div>
    </section>
  )
}
