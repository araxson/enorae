import { FieldDescription } from '@/components/ui/field'

interface RecurrenceDescriptionProps {
  pattern: string
}

export function RecurrenceDescription({ pattern }: RecurrenceDescriptionProps) {
  const descriptions: Record<string, string> = {
    daily: 'Repeats every day at the same time.',
    weekly: 'Repeats every week on the same day.',
    biweekly: 'Repeats every two weeks on the same day.',
    monthly: 'Repeats every month on the same date.',
    yearly: 'Repeats every year on the same date.',
    weekdays: 'Repeats every weekday (Mon–Fri).',
    weekends: 'Repeats every weekend (Sat–Sun).',
  }

  const description = descriptions[pattern]
  if (!description) return null

  return <FieldDescription>{description}</FieldDescription>
}
