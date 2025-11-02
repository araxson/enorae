'use client'

import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type TimeFieldsProps = {
  startTime: string
  endTime: string
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
}

export function TimeFields({ startTime, endTime, onStartTimeChange, onEndTimeChange }: TimeFieldsProps) {
  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
        <FieldContent>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(event) => onStartTimeChange(event.target.value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="endTime">End Time</FieldLabel>
        <FieldContent>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(event) => onEndTimeChange(event.target.value)}
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
