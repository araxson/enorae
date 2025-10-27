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
        <Clock className="h-3 w-3" aria-hidden="true" />
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

  const dayMap: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
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

  const currentTime = now.getHours() * 60 + now.getMinutes()
  const openParts = todayHours.open_time.split(':').map(Number)
  const closeParts = todayHours.close_time.split(':').map(Number)

  const openHour = openParts[0]
  const openMin = openParts[1]
  const closeHour = closeParts[0]
  const closeMin = closeParts[1]

  // Ensure all parts are valid numbers
  if (
    openHour === undefined || openMin === undefined ||
    closeHour === undefined || closeMin === undefined ||
    isNaN(openHour) || isNaN(openMin) ||
    isNaN(closeHour) || isNaN(closeMin)
  ) {
    return false
  }

  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin

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

  const dayMap: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const checkDay = (dayOfWeek + i) % 7
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
