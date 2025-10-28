import { Calendar, Clock } from 'lucide-react'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface DateTimeFieldsProps {
  dateValue: string
  timeValue: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
}

export function DateTimeFields({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
}: DateTimeFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="date">Date</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon>
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="date"
              name="date"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={dateValue}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </InputGroup>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="time">Time</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon>
              <Clock className="h-4 w-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="time"
              name="time"
              type="time"
              required
              value={timeValue}
              onChange={(event) => onTimeChange(event.target.value)}
            />
          </InputGroup>
        </FieldContent>
      </Field>
    </>
  )
}
