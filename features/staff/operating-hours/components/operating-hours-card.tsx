import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
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
    <Card className="p-6">
      <Stack gap="md">
        <Flex align="center" gap="sm">
          <Clock className="h-5 w-5" />
          <H3>Operating Hours</H3>
        </Flex>

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
                  <P className="capitalize min-w-[100px]">
                    {hour.day_of_week}
                  </P>
                  {isToday && (
                    <Badge variant="default" className="text-xs">
                      Today
                    </Badge>
                  )}
                </Flex>

                {hour.is_closed ? (
                  <Badge variant="secondary">Closed</Badge>
                ) : (
                  <Muted>{hour.hours_display}</Muted>
                )}
              </Flex>
            )
          })}
        </Stack>

        {sortedHours[0]?.salon_name && (
          <Muted className="text-xs border-t pt-2">
            {sortedHours[0].salon_name}
          </Muted>
        )}
      </Stack>
    </Card>
  )
}
