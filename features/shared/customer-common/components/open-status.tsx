import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OpenStatusProps {
  isOpen: boolean
  nextOpenTime?: string
  className?: string
}

export function OpenStatus({ isOpen, nextOpenTime, className }: OpenStatusProps) {
  return (
    <Badge
      variant={isOpen ? 'default' : 'secondary'}
      className={cn('gap-1', className)}
    >
      <Clock className="h-3 w-3" />
      {isOpen ? 'Open Now' : nextOpenTime ? `Opens ${nextOpenTime}` : 'Closed'}
    </Badge>
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
  const [openHour, openMin] = todayHours.open_time.split(':').map(Number)
  const [closeHour, closeMin] = todayHours.close_time.split(':').map(Number)

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
      const [hour, minute] = dayHours.open_time.split(':').map(Number)
      const formattedTime = formatTime(hour, minute)

      if (i === 1) {
        return `tomorrow at ${formattedTime}`
      } else {
        return `${dayMap[checkDay]} at ${formattedTime}`
      }
    }
  }

  return undefined
}

function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const displayMinute = minute.toString().padStart(2, '0')
  return `${displayHour}:${displayMinute} ${ampm}`
}
