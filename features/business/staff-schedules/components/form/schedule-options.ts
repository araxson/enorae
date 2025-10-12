export const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

type DayValue = (typeof DAYS)[number]['value']

export type SchedulePayload = {
  staffId: string
  dayOfWeek: DayValue | ''
  startTime: string
  endTime: string
  breakStart: string
  breakEnd: string
  effectiveFrom: string
  effectiveUntil: string
}
