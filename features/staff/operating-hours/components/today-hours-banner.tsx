import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock } from 'lucide-react'
import type { OperatingHours } from '@/features/staff/operating-hours/types'

interface TodayHoursBannerProps {
  hours: OperatingHours | null
}

export function TodayHoursBanner({ hours }: TodayHoursBannerProps) {
  if (!hours) return null

  return (
    <Alert>
      <Clock className="size-4" />
      <AlertTitle>Today&apos;s hours</AlertTitle>
      <AlertDescription>
        {hours['is_closed'] ? (
          <>Salon is closed today</>
        ) : (
          <>
            Today&apos;s hours: {hours['hours_display']}
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}
