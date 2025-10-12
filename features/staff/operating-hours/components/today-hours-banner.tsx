import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock } from 'lucide-react'
import type { OperatingHours } from '../types'

interface TodayHoursBannerProps {
  hours: OperatingHours | null
}

export function TodayHoursBanner({ hours }: TodayHoursBannerProps) {
  if (!hours) return null

  return (
    <Alert>
      <Clock className="h-4 w-4" />
      <AlertDescription>
        {hours.is_closed ? (
          <span className="font-semibold">Salon is closed today</span>
        ) : (
          <>
            <span className="font-semibold">Today&apos;s hours: </span>
            {hours.hours_display}
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
