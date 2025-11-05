'use client'

import { Field, FieldLabel } from '@/components/ui/field'

interface StaffSelectionProps {
  staff: Array<{
    id: string
    full_name: string
  }>
  isPending: boolean
  errors?: string[]
}

export function StaffSelection({ staff, isPending, errors }: StaffSelectionProps) {
  return (
    <Field>
      <FieldLabel htmlFor="staffId">
        Staff Member
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <select
        id="staffId"
        name="staffId"
        required
        aria-required="true"
        aria-invalid={!!errors}
        aria-describedby={errors ? 'staffId-error' : undefined}
        disabled={isPending}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select a staff member...</option>
        {staff.map((member) => (
          <option key={member.id} value={member.id}>
            {member.full_name}
          </option>
        ))}
      </select>
      {errors && (
        <p id="staffId-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
