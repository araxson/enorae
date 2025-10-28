import { Card, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
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
            <ItemGroup>
              <Item className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle>Operating hours</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Configure your salon&apos;s weekly operating schedule.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
        </Card>

        <WeeklyScheduleForm salonId={salonId} initialHours={operatingHours as any} />
      </div>
    </section>
  )
}
