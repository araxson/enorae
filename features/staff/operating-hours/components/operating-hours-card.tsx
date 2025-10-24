import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import type { OperatingHours } from '@/features/staff/operating-hours/types'
import { cn } from "@/lib/utils";

interface OperatingHoursCardProps {
  hours: OperatingHours[]
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function OperatingHoursCard({ hours }: OperatingHoursCardProps) {
  const sortedHours = [...hours].sort((a, b) => {
    return dayOrder.indexOf(a.day_of_week || 'monday') - dayOrder.indexOf(b.day_of_week || 'monday')
  })

  const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || 'monday'

  return (
    <Card>
      <CardHeader>
        <div className="p-6 pb-4">
          <div className="flex gap-3 items-center">
            <Clock className="h-5 w-5" />
            <CardTitle>Operating Hours</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 p-6 pt-0">
          {sortedHours.map((hour) => {
            const isToday = hour.day_of_week === today

            return (
              <div
                key={hour.id}
                className={cn('flex gap-4 items-center justify-between', isToday ? 'font-semibold' : '')}
              >
                <div className="flex gap-3 items-center">
                  <p className="capitalize min-w-24">
                    {hour.day_of_week}
                  </p>
                  {isToday && <Badge variant="default">Today</Badge>}
                </div>

                {hour.is_closed ? (
                  <Badge variant="secondary">Closed</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">{hour.hours_display}</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      {sortedHours[0]?.salon_name && (
        <CardFooter>
          <div className="border-t p-6 pt-4">
            <p className="text-xs text-muted-foreground">{sortedHours[0].salon_name}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
