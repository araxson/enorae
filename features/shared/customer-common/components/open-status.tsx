import { Clock } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { formatHourTo12Hour } from '@/lib/utils/date-time'

interface OpenStatusProps {
  isOpen: boolean
  nextOpenTime?: string
  className?: string
}

export function OpenStatus({ isOpen, nextOpenTime, className }: OpenStatusProps) {
  return (
    <Item
      variant={isOpen ? 'muted' : 'outline'}
      className={cn('w-fit gap-2', className)}
    >
      <ItemMedia variant="icon">
        <Clock className="size-3" aria-hidden="true" />
      </ItemMedia>
      <ItemContent>
        <ItemDescription>
          {isOpen ? 'Open Now' : nextOpenTime ? `Opens ${nextOpenTime}` : 'Closed'}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

// Helper function to determine if salon is currently open
export function isCurrentlyOpen(operatingHours: {
  day_of_week: string
  is_closed: boolean | null
  open_time: string | null
  close_time: string | null
}[]): boolean {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday

  const SUNDAY_INDEX = 0
  const MONDAY_INDEX = 1
  const TUESDAY_INDEX = 2
  const WEDNESDAY_INDEX = 3
  const THURSDAY_INDEX = 4
  const FRIDAY_INDEX = 5
  const SATURDAY_INDEX = 6

  const dayMap: Record<number, string> = {
    [SUNDAY_INDEX]: 'sunday',
    [MONDAY_INDEX]: 'monday',
    [TUESDAY_INDEX]: 'tuesday',
    [WEDNESDAY_INDEX]: 'wednesday',
    [THURSDAY_INDEX]: 'thursday',
    [FRIDAY_INDEX]: 'friday',
    [SATURDAY_INDEX]: 'saturday',
  }

  const todayHours = operatingHours.find(
    (h) => h.day_of_week === dayMap[dayOfWeek]
  )

  if (!todayHours || todayHours.is_closed) {
    return false
  }

  if (!todayHours.open_time || !todayHours.close_time) {
    return false
  }

  const MINUTES_PER_HOUR = 60
  const FIRST_TIME_PART_INDEX = 0
  const SECOND_TIME_PART_INDEX = 1

  const currentTime = now.getHours() * MINUTES_PER_HOUR + now.getMinutes()
  const openParts = todayHours.open_time.split(':').map(Number)
  const closeParts = todayHours.close_time.split(':').map(Number)

  const openHour = openParts[FIRST_TIME_PART_INDEX]
  const openMinute = openParts[SECOND_TIME_PART_INDEX]
  const closeHour = closeParts[FIRST_TIME_PART_INDEX]
  const closeMinute = closeParts[SECOND_TIME_PART_INDEX]

  // Ensure all parts are valid numbers
  if (
    openHour === undefined || openMinute === undefined ||
    closeHour === undefined || closeMinute === undefined ||
    isNaN(openHour) || isNaN(openMinute) ||
    isNaN(closeHour) || isNaN(closeMinute)
  ) {
    return false
  }

  const openTime = openHour * MINUTES_PER_HOUR + openMinute
  const closeTime = closeHour * MINUTES_PER_HOUR + closeMinute

  return currentTime >= openTime && currentTime < closeTime
}

// Helper function to get next opening time
export function getNextOpenTime(operatingHours: {
  day_of_week: string
  is_closed: boolean | null
  open_time: string | null
}[]): string | undefined {
  const now = new Date()
  const dayOfWeek = now.getDay()

  const SUNDAY_INDEX = 0
  const MONDAY_INDEX = 1
  const TUESDAY_INDEX = 2
  const WEDNESDAY_INDEX = 3
  const THURSDAY_INDEX = 4
  const FRIDAY_INDEX = 5
  const SATURDAY_INDEX = 6
  const DAYS_IN_WEEK = 7

  const dayMap: Record<number, string> = {
    [SUNDAY_INDEX]: 'sunday',
    [MONDAY_INDEX]: 'monday',
    [TUESDAY_INDEX]: 'tuesday',
    [WEDNESDAY_INDEX]: 'wednesday',
    [THURSDAY_INDEX]: 'thursday',
    [FRIDAY_INDEX]: 'friday',
    [SATURDAY_INDEX]: 'saturday',
  }

  // Check next 7 days
  for (let i = 1; i <= DAYS_IN_WEEK; i++) {
    const checkDay = (dayOfWeek + i) % DAYS_IN_WEEK
    const dayHours = operatingHours.find(
      (h) => h.day_of_week === dayMap[checkDay]
    )

    if (dayHours && !dayHours.is_closed && dayHours.open_time) {
      const timeParts = dayHours.open_time.split(':').map(Number)
      const hour = timeParts[0]
      const minute = timeParts[1]

      if (hour === undefined || minute === undefined || isNaN(hour) || isNaN(minute)) {
        continue
      }

      const formattedTime = formatHourTo12Hour(hour, minute)

      if (i === 1) {
        return `tomorrow at ${formattedTime}`
      } else {
        return `${dayMap[checkDay]} at ${formattedTime}`
      }
    }
  }

  return undefined
}
