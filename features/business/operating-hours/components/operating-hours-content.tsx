import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { WeeklyScheduleForm } from '.'
import type { getOperatingHoursBySalon } from '../api/queries'

type OperatingHoursContentProps = {
  salonId: string
  operatingHours: Awaited<ReturnType<typeof getOperatingHoursBySalon>>
}

export function OperatingHoursContent({ salonId, operatingHours }: OperatingHoursContentProps) {
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

        <WeeklyScheduleForm salonId={salonId} initialHours={operatingHours as any} />
      </div>
    </section>
  )
}
