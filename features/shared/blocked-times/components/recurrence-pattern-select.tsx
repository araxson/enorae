import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { RecurrenceDescription } from './recurrence-description'

interface RecurrencePatternSelectProps {
  value: string
  onChange: (value: string) => void
}

const RECURRENCE_PATTERNS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekdays', label: 'Weekdays only' },
  { value: 'weekends', label: 'Weekends only' },
]

export function RecurrencePatternSelect({ value, onChange }: RecurrencePatternSelectProps) {
  return (
    <Field>
      <FieldLabel htmlFor="recurrence_pattern">Recurrence pattern</FieldLabel>
      <FieldContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="recurrence_pattern">
            <SelectValue placeholder="Select pattern" />
          </SelectTrigger>
          <SelectContent>
            {RECURRENCE_PATTERNS.map((pattern) => (
              <SelectItem key={pattern.value} value={pattern.value}>
                {pattern.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <RecurrenceDescription pattern={value} />
      </FieldContent>
    </Field>
  )
}
