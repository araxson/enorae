import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { AppointmentWithDetails } from '@/features/shared/appointments/types'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { Clock, User, CheckCircle } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface TodayScheduleProps {
  appointments: AppointmentWithDetails[]
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
          <CardDescription>Your appointments for today will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock className="size-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No Appointments Today</EmptyTitle>
              <EmptyDescription>No appointments scheduled for today</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const completedCount = appointments.filter(a => a.status === 'completed').length

  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>{appointments.length} appointments</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-3" aria-hidden />
            <Badge variant="secondary">
              {completedCount}/{appointments.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <ScrollArea className="max-h-96">
          <ItemGroup className="p-6 gap-3">
            {appointments.map((appointment, index) => {
              const customerLabel = appointment.customer_id || 'Customer'
              const customerInitials = getInitials(customerLabel)
              const isCompleted = appointment.status === 'completed'
              const statusConfig = {
                variant: getStatusVariant(appointment.status ?? 'pending'),
                label: appointment.status || 'pending',
              }

              return (
                <Fragment key={appointment.id ?? index}>
                  <Item
                    variant={isCompleted ? 'muted' : 'outline'}
                    size="sm"
                    className={isCompleted ? 'opacity-75' : ''}
                  >
                    <ItemMedia variant="icon">
                      <Clock className="size-4" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs font-semibold">
                            {customerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <ItemTitle>{customerLabel}</ItemTitle>
                          <ItemDescription>{formatAppointmentTime(appointment.start_time)}</ItemDescription>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="size-3" />
                            <span className="truncate">Customer ID</span>
                          </div>
                        </div>
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={statusConfig.variant}>{formatStatus(statusConfig.label)}</Badge>
                    </ItemActions>
                  </Item>
                  {index < appointments.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              )
            })}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
