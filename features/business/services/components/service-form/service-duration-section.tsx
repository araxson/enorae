'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

interface ServiceDurationSectionProps {
  duration: string
  buffer: string
  onDurationChange: (value: string) => void
  onBufferChange: (value: string) => void
}

export function ServiceDurationSection({
  duration,
  buffer,
  onDurationChange,
  onBufferChange,
}: ServiceDurationSectionProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Duration &amp; booking</FieldLegend>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="duration">Duration * (minutes)</FieldLabel>
          <FieldContent>
            <Input
              id="duration"
              type="number"
              min="5"
              max="480"
              value={duration}
              onChange={(event) => onDurationChange(event.target.value)}
              required
              placeholder="60"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="buffer">Buffer time (minutes)</FieldLabel>
          <FieldContent>
            <Input
              id="buffer"
              type="number"
              min="0"
              max="60"
              value={buffer}
              onChange={(event) => onBufferChange(event.target.value)}
              placeholder="15"
            />
            <FieldDescription>Time between appointments</FieldDescription>
          </FieldContent>
        </Field>
      </div>
    </FieldSet>
  )
}
