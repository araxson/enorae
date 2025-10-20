import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { Clock } from 'lucide-react'
import type { OperatingHours } from '../types'

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
      <CardHeader className="p-6 pb-4">
        <Flex align="center" gap="sm">
          <Clock className="h-5 w-5" />
          <CardTitle>Operating Hours</CardTitle>
        </Flex>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Stack gap="sm">
          {sortedHours.map((hour) => {
            const isToday = hour.day_of_week === today

            return (
              <Flex
                key={hour.id}
                justify="between"
                align="center"
                className={isToday ? 'font-semibold' : ''}
              >
                <Flex align="center" gap="sm">
                  <p className="leading-7 capitalize min-w-24">
                    {hour.day_of_week}
                  </p>
                  {isToday && (
                    <Badge variant="default" className="text-xs">
                      Today
                    </Badge>
                  )}
                </Flex>

                {hour.is_closed ? (
                  <Badge variant="secondary">Closed</Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">{hour.hours_display}</p>
                )}
              </Flex>
            )
          })}
        </Stack>
      </CardContent>
      {sortedHours[0]?.salon_name && (
        <CardFooter className="border-t p-6 pt-4">
          <p className="text-xs text-muted-foreground">{sortedHours[0].salon_name}</p>
        </CardFooter>
      )}
    </Card>
  )
}
