import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/shared'
import type { AppointmentWithDetails } from '@/lib/types/app.types'
import { formatAppointmentTime } from '@/lib/utils/dates'
import { getStatusVariant } from '@/lib/constants/appointment-statuses'
import { Clock, User, CheckCircle } from 'lucide-react'

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
          <EmptyState
            icon={Clock}
            title="No Appointments Today"
            description="No appointments scheduled for today"
          />
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>{appointments.length} appointments</CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {completedCount}/{appointments.length}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="max-h-96">
          <div className="p-6 space-y-3">
            {appointments.map((appointment, index) => {
              const customerInitials = getInitials(appointment.customer_name || 'Unknown')
              const isCompleted = appointment.status === 'completed'
              const statusConfig = { variant: getStatusVariant(appointment.status), label: appointment.status || 'pending' }

              return (
                <div key={appointment.id}>
                  <Card className={isCompleted ? 'opacity-75' : undefined}>
                    <CardContent
                      className={`flex items-center gap-3 p-3 transition-all ${
                        isCompleted ? 'bg-muted/50' : 'bg-background hover:bg-accent/50'
                      }`}
                    >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex w-16 flex-none flex-col items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">{formatAppointmentTime(appointment.start_time)}</p>
                      </div>

                      <Separator orientation="vertical" className="h-10" />

                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {customerInitials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {appointment.customer_name || 'Unknown Customer'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate">Customer</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant={statusConfig.variant} className="text-xs shrink-0">
                      {statusConfig.label}
                    </Badge>
                    </CardContent>
                  </Card>

                  {index < appointments.length - 1 && <Separator className="my-3" />}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
