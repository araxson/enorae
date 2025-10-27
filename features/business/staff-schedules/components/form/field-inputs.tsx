import type React from 'react'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

export function TimeInput({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input id={id} type="time" value={value} onChange={onChange} disabled={disabled} required />
      </FieldContent>
    </Field>
  )
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  helper,
  min,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  helper: string
  min?: string
  disabled: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input id={id} type="date" value={value} onChange={onChange} min={min} disabled={disabled} />
      </FieldContent>
      <FieldDescription>{helper}</FieldDescription>
    </Field>
  )
}
