import { OperatingHoursCard, TodayHoursBanner } from './components'
import type { OperatingHours } from './api/types'

interface OperatingHoursFeatureProps {
  hours: OperatingHours[]
  todayHours: OperatingHours | null
}

export function OperatingHoursFeature({ hours, todayHours }: OperatingHoursFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <TodayHoursBanner hours={todayHours} />
      <OperatingHoursCard hours={hours} />
    </div>
  )
}
export type * from './api/types'
