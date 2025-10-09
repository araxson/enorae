import type React from 'react'
import { Stack } from '@/components/layout'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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
    <Stack gap="sm">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="time" value={value} onChange={onChange} disabled={disabled} required />
    </Stack>
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
    <Stack gap="sm">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="date" value={value} onChange={onChange} min={min} disabled={disabled} />
      <p className="text-xs text-muted-foreground">{helper}</p>
    </Stack>
  )
}
