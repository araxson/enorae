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

// Constants for day-of-week mapping (JavaScript Date.getDay() returns 0-6)
const SUNDAY_INDEX = 0
const MONDAY_INDEX = 1
const TUESDAY_INDEX = 2
const WEDNESDAY_INDEX = 3
const THURSDAY_INDEX = 4
const FRIDAY_INDEX = 5
const SATURDAY_INDEX = 6
const DAYS_IN_WEEK = 7

const DAY_INDEX_TO_NAME: Record<number, string> = {
  [SUNDAY_INDEX]: 'sunday',
  [MONDAY_INDEX]: 'monday',
  [TUESDAY_INDEX]: 'tuesday',
  [WEDNESDAY_INDEX]: 'wednesday',
  [THURSDAY_INDEX]: 'thursday',
  [FRIDAY_INDEX]: 'friday',
  [SATURDAY_INDEX]: 'saturday',
}

// Constants for time calculations
const MINUTES_PER_HOUR = 60
const FIRST_TIME_PART_INDEX = 0
const SECOND_TIME_PART_INDEX = 1

/**
 * Determine if a salon is currently open based on operating hours.
 * Compares current time against today's operating hours.
 *
 * @param operatingHours - Array of operating hours by day of week
 * @returns true if salon is currently open, false otherwise
 */
export function isCurrentlyOpen(operatingHours: {
  day_of_week: string
  is_closed: boolean | null
  open_time: string | null
  close_time: string | null
}[]): boolean {
  const now = new Date()
  const dayOfWeek = now.getDay()

  const todayHours = operatingHours.find(
    (hours) => hours.day_of_week === DAY_INDEX_TO_NAME[dayOfWeek]
  )

  if (!todayHours || todayHours.is_closed) {
    return false
  }

  if (!todayHours.open_time || !todayHours.close_time) {
    return false
  }

  const currentTimeInMinutes = now.getHours() * MINUTES_PER_HOUR + now.getMinutes()
  const openTimeParts = todayHours.open_time.split(':').map(Number)
  const closeTimeParts = todayHours.close_time.split(':').map(Number)

  const openHour = openTimeParts[FIRST_TIME_PART_INDEX]
  const openMinute = openTimeParts[SECOND_TIME_PART_INDEX]
  const closeHour = closeTimeParts[FIRST_TIME_PART_INDEX]
  const closeMinute = closeTimeParts[SECOND_TIME_PART_INDEX]

  // Validate all time components are valid numbers
  if (
    openHour === undefined || openMinute === undefined ||
    closeHour === undefined || closeMinute === undefined ||
    isNaN(openHour) || isNaN(openMinute) ||
    isNaN(closeHour) || isNaN(closeMinute)
  ) {
    return false
  }

  const openTimeInMinutes = openHour * MINUTES_PER_HOUR + openMinute
  const closeTimeInMinutes = closeHour * MINUTES_PER_HOUR + closeMinute

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes
}

/**
 * Get the next opening time for a salon.
 * Checks up to 7 days ahead to find when the salon will next open.
 *
 * @param operatingHours - Array of operating hours by day of week
 * @returns Formatted string like "tomorrow at 9:00 AM" or "monday at 10:00 AM"
 */
export function getNextOpenTime(operatingHours: {
  day_of_week: string
  is_closed: boolean | null
  open_time: string | null
}[]): string | undefined {
  const now = new Date()
  const currentDayOfWeek = now.getDay()

  const TOMORROW_DAY_OFFSET = 1

  // Check next 7 days for an opening time
  for (let daysAhead = 1; daysAhead <= DAYS_IN_WEEK; daysAhead++) {
    const checkDayIndex = (currentDayOfWeek + daysAhead) % DAYS_IN_WEEK
    const dayHours = operatingHours.find(
      (hours) => hours.day_of_week === DAY_INDEX_TO_NAME[checkDayIndex]
    )

    if (dayHours && !dayHours.is_closed && dayHours.open_time) {
      const openTimeParts = dayHours.open_time.split(':').map(Number)
      const openHour = openTimeParts[FIRST_TIME_PART_INDEX]
      const openMinute = openTimeParts[SECOND_TIME_PART_INDEX]

      if (openHour === undefined || openMinute === undefined || isNaN(openHour) || isNaN(openMinute)) {
        continue
      }

      const formattedTime = formatHourTo12Hour(openHour, openMinute)

      if (daysAhead === TOMORROW_DAY_OFFSET) {
        return `tomorrow at ${formattedTime}`
      } else {
        return `${DAY_INDEX_TO_NAME[checkDayIndex]} at ${formattedTime}`
      }
    }
  }

  return undefined
}
