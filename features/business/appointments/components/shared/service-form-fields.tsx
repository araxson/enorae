'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type StaffOption = {
  id: string
  name: string
}

type StaffSelectorProps = {
  value: string
  onChange: (value: string) => void
  staff: StaffOption[]
  isLoading: boolean
  required?: boolean
}

export function StaffSelector({
  value,
  onChange,
  staff,
  isLoading,
  required = false,
}: StaffSelectorProps) {
  return (
    <Field>
      <FieldLabel htmlFor="staff">Staff {!required && '(Optional)'}</FieldLabel>
      <FieldContent>
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue
              placeholder={isLoading ? 'Loading staff...' : 'Select staff member'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any available</SelectItem>
            {staff.length > 0 ? (
              staff.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-staff" disabled>
                {isLoading ? 'Loading staff...' : 'No staff available'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )
}

type TimeRangeFieldsProps = {
  startTime: string
  endTime: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}

export function TimeRangeFields({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}: TimeRangeFieldsProps) {
  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
        <FieldContent>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="endTime">End Time</FieldLabel>
        <FieldContent>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => onEndChange(e.target.value)}
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

type DurationFieldProps = {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function DurationField({ value, onChange, required = false }: DurationFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="duration">Duration (minutes) {required && '*'}</FieldLabel>
      <FieldContent>
        <Input
          id="duration"
          type="number"
          min="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 60"
        />
      </FieldContent>
    </Field>
  )
}
