import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { BookingCalendar } from './booking-calendar'

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
    <Field className="flex w-full flex-col gap-3">
      <FieldLabel>Select date &amp; time</FieldLabel>
      <FieldDescription className="text-sm text-muted-foreground">
        Choose the day that works best, then pick an available time slot.
      </FieldDescription>
      <BookingCalendar
        dateValue={dateValue}
        timeValue={timeValue}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
      />
    </Field>
  )
}
