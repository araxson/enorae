'use client'

import { Field, FieldLabel } from '@/components/ui/field'

interface NotesFieldProps {
  isPending: boolean
  errors?: string[]
}

export function NotesField({ isPending, errors }: NotesFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
      <textarea
        id="notes"
        name="notes"
        rows={3}
        maxLength={500}
        aria-invalid={!!errors}
        aria-describedby={errors ? 'notes-error' : 'notes-hint'}
        disabled={isPending}
        placeholder="Any special requests or notes..."
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      />
      <p id="notes-hint" className="text-sm text-muted-foreground mt-1">
        Maximum 500 characters
      </p>
      {errors && (
        <p id="notes-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
