import { Stack } from '@/components/layout'
import { OperatingHoursCard } from './components/operating-hours-card'
import { TodayHoursBanner } from './components/today-hours-banner'
import type { OperatingHours } from './types'

interface OperatingHoursFeatureProps {
  hours: OperatingHours[]
  todayHours: OperatingHours | null
}

export function OperatingHoursFeature({ hours, todayHours }: OperatingHoursFeatureProps) {
  return (
    <Stack gap="lg">
      <TodayHoursBanner hours={todayHours} />
      <OperatingHoursCard hours={hours} />
    </Stack>
  )
}
