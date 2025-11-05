'use client'

import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type TimeRangeFieldsProps = {
  startError?: string
  endError?: string
  defaultStartTime?: string
  defaultEndTime?: string
  firstErrorRef?: React.RefObject<HTMLInputElement | null>
}

export function TimeRangeFields({
  startError,
  endError,
  defaultStartTime,
  defaultEndTime,
  firstErrorRef,
}: TimeRangeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="start_time">
          Start Time
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <FieldContent>
          <Input
            ref={startError ? firstErrorRef : null}
            id="start_time"
            name="start_time"
            type="datetime-local"
            defaultValue={defaultStartTime}
            required
            aria-required="true"
            aria-invalid={!!startError}
            aria-describedby={startError ? 'start_time-error' : undefined}
          />
          {startError && (
            <FieldError id="start_time-error" role="alert">
              {startError}
            </FieldError>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="end_time">
          End Time
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="end_time"
            name="end_time"
            type="datetime-local"
            defaultValue={defaultEndTime}
            required
            aria-required="true"
            aria-invalid={!!endError}
            aria-describedby={endError ? 'end_time-error' : undefined}
          />
          {endError && (
            <FieldError id="end_time-error" role="alert">
              {endError}
            </FieldError>
          )}
        </FieldContent>
      </Field>
    </div>
  )
}
