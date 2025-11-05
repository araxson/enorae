'use client'

import { Field, FieldLabel } from '@/components/ui/field'

interface DateTimeSelectionProps {
  isPending: boolean
  dateErrors?: string[]
  timeErrors?: string[]
}

export function DateTimeSelection({ isPending, dateErrors, timeErrors }: DateTimeSelectionProps) {
  return (
    <>
      {/* Date Selection */}
      <Field>
        <FieldLabel htmlFor="date">
          Date
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <input
          id="date"
          name="date"
          type="date"
          required
          aria-required="true"
          aria-invalid={!!dateErrors}
          aria-describedby={dateErrors ? 'date-error' : undefined}
          disabled={isPending}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        />
        {dateErrors && (
          <p id="date-error" className="text-sm text-destructive mt-1" role="alert">
            {dateErrors[0]}
          </p>
        )}
      </Field>

      {/* Time Selection */}
      <Field>
        <FieldLabel htmlFor="time">
          Time
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <input
          id="time"
          name="time"
          type="time"
          required
          aria-required="true"
          aria-invalid={!!timeErrors}
          aria-describedby={timeErrors ? 'time-error' : undefined}
          disabled={isPending}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        />
        {timeErrors && (
          <p id="time-error" className="text-sm text-destructive mt-1" role="alert">
            {timeErrors[0]}
          </p>
        )}
      </Field>
    </>
  )
}
