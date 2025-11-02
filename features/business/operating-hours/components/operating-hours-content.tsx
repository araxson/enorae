import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { WeeklyScheduleForm } from '.'
import type { getOperatingHoursBySalon } from '../api/queries'
import type { Database } from '@/lib/types/database.types'

type OperatingHour = Database['public']['Views']['operating_hours_view']['Row']

type OperatingHoursContentProps = {
  salonId: string
  operatingHours: Awaited<ReturnType<typeof getOperatingHoursBySalon>>
}

// Type guard to transform database view row to component props
function transformOperatingHours(hours: OperatingHour[]): Array<{
  id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}> {
  return hours.map((hour) => ({
    id: hour.id ?? '',
    day_of_week: typeof hour.day_of_week === 'string'
      ? ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(hour.day_of_week)
      : 0,
    open_time: hour.open_time ?? '09:00',
    close_time: hour.close_time ?? '17:00',
    is_closed: hour.is_closed ?? false,
  }))
}

export function OperatingHoursContent({ salonId, operatingHours }: OperatingHoursContentProps) {
  const transformedHours = transformOperatingHours(operatingHours)

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Operating hours</CardTitle>
            <CardDescription>
              Configure your salon&apos;s weekly operating schedule.
            </CardDescription>
          </CardHeader>
        </Card>

        <WeeklyScheduleForm salonId={salonId} initialHours={transformedHours} />
      </div>
    </section>
  )
}
