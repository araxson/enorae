import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import type { OperatingHours } from '@/features/staff/operating-hours/api/types'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface OperatingHoursCardProps {
  hours: OperatingHours[]
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function OperatingHoursCard({ hours }: OperatingHoursCardProps) {
  const sortedHours = [...hours].sort((a, b) => {
    return dayOrder.indexOf(a['day_of_week'] || 'monday') - dayOrder.indexOf(b['day_of_week'] || 'monday')
  })

  const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || 'monday'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-muted p-2">
            <Clock className="size-5" aria-hidden />
          </span>
          <CardTitle>Operating Hours</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-3">
          {sortedHours.map((hour) => {
            const isToday = hour['day_of_week'] === today

            return (
              <Item
                key={hour['id']}
                variant="outline"
                size="sm"
                className={cn(isToday ? 'border-primary/60' : '')}
              >
                <ItemContent>
                  <ItemTitle>
                    <span className="capitalize">{hour['day_of_week']}</span>
                  </ItemTitle>
                </ItemContent>
                <ItemActions>
                  <div className="flex items-center gap-2">
                    {isToday ? <Badge variant="default">Today</Badge> : null}
                    {hour['is_closed'] ? (
                      <Badge variant="secondary">Closed</Badge>
                    ) : (
                      <ItemDescription>{hour['hours_display']}</ItemDescription>
                    )}
                  </div>
                </ItemActions>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
      {sortedHours[0]?.['salon_name'] && (
        <>
          <Separator />
          <CardFooter>
            <CardDescription>{sortedHours[0]['salon_name']}</CardDescription>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
