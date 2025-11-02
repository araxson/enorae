'use client'

import { Calendar } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'

type RescheduleFormFieldsProps = {
  currentStartTime: string
  minDateTime: Date
}

export function RescheduleFormFields({ currentStartTime, minDateTime }: RescheduleFormFieldsProps) {
  const currentDate = new Date(currentStartTime)

  return (
    <FieldSet className="py-4">
      <FieldLegend>Request details</FieldLegend>
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="current-time">Current appointment</FieldLabel>
          <FieldContent>
            <InputGroup data-disabled>
              <InputGroupAddon>
                <Calendar className="size-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="current-time"
                value={currentDate.toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                disabled
              />
            </InputGroup>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="newStartTime">Requested new time *</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Calendar className="size-4" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="newStartTime"
                name="newStartTime"
                type="datetime-local"
                min={minDateTime.toISOString().slice(0, 16)}
                required
                aria-describedby="new-start-time-help"
                autoComplete="off"
              />
            </InputGroup>
            <p id="new-start-time-help" className="text-xs text-muted-foreground">
              Must be at least 24 hours from now
            </p>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupTextarea
                id="reason"
                name="reason"
                placeholder="Let the salon know why you need to reschedule..."
                rows={3}
              />
            </InputGroup>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
