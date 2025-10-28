'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

export function StaffAssignmentsFilter() {
  return (
    <Field className="min-w-[240px]">
      <FieldLabel>Staff assignments</FieldLabel>
      <FieldContent className="flex flex-col gap-2">
        <Field orientation="horizontal" className="items-center gap-2">
          <Checkbox id="assignment-balanced" defaultChecked />
          <FieldLabel htmlFor="assignment-balanced">Balanced workload</FieldLabel>
        </Field>
        <Field orientation="horizontal" className="items-center gap-2">
          <Checkbox id="assignment-specialist" />
          <FieldLabel htmlFor="assignment-specialist">Highlight specialists</FieldLabel>
        </Field>
      </FieldContent>
    </Field>
  )
}
