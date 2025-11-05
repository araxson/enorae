'use client'

import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BlockTypeFieldProps = {
  defaultValue?: string
  error?: string
}

export function BlockTypeField({ defaultValue, error }: BlockTypeFieldProps) {
  const blockTypeDescriptionId = error ? 'block_type-error' : undefined

  return (
    <Field>
      <FieldLabel htmlFor="block_type">
        Block Type
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <FieldContent>
        <Select
          name="block_type"
          defaultValue={defaultValue ?? 'break'}
          required
        >
          <SelectTrigger
            id="block_type"
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={blockTypeDescriptionId}
          >
            <SelectValue placeholder="Select block type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="break">Break</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="vacation">Vacation</SelectItem>
            <SelectItem value="sick_leave">Sick Leave</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {error && (
          <FieldError id="block_type-error" role="alert">
            {error}
          </FieldError>
        )}
      </FieldContent>
    </Field>
  )
}
