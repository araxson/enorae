'use client'

import type React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SchedulePayload } from './schedule-options'
import { DAYS } from './schedule-options'
import { DateInput } from './field-inputs'

type StaffMember = { id: string; full_name: string | null; title: string | null }

type ScheduleFormFieldsProps = {
  values: SchedulePayload
  onChange: <K extends keyof SchedulePayload>(key: K, value: SchedulePayload[K]) => void
  staffMembers: StaffMember[]
  disabled: boolean
}

export function ScheduleFormFields({ values, onChange, staffMembers, disabled }: ScheduleFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor="staff">Staff Member</Label>
          <Select value={values.staffId} onValueChange={(value) => onChange('staffId', value)} disabled={disabled}>
            <SelectTrigger id="staff">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.full_name || 'Unknown'} {staff.title ? `- ${staff.title}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="day">Day of Week</Label>
          <Select value={values.dayOfWeek} onValueChange={(value) => onChange('dayOfWeek', value as SchedulePayload['dayOfWeek'])} disabled={disabled}>
            <SelectTrigger id="day">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <TimeInput
          id="startTime"
          label="Start Time"
          value={values.startTime}
          onChange={(event) => onChange('startTime', event.target.value)}
          disabled={disabled}
        />
        <TimeInput
          id="endTime"
          label="End Time"
          value={values.endTime}
          onChange={(event) => onChange('endTime', event.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <TimeInput
          id="breakStart"
          label="Break Start (optional)"
          value={values.breakStart}
          onChange={(event) => onChange('breakStart', event.target.value)}
          disabled={disabled}
        />
        <TimeInput
          id="breakEnd"
          label="Break End (optional)"
          value={values.breakEnd}
          onChange={(event) => onChange('breakEnd', event.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <DateInput
          id="effectiveFrom"
          label="Effective From (optional)"
          value={values.effectiveFrom}
          onChange={(event) => onChange('effectiveFrom', event.target.value)}
          helper="Start date for this schedule override"
          disabled={disabled}
        />
        <DateInput
          id="effectiveUntil"
          label="Effective Until (optional)"
          value={values.effectiveUntil}
          onChange={(event) => onChange('effectiveUntil', event.target.value)}
          helper="End date for this schedule override"
          min={values.effectiveFrom || undefined}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

function TimeInput({
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
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="time" value={value} onChange={onChange} disabled={disabled} required />
    </div>
  )
}
