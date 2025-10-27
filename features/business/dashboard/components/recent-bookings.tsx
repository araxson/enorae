'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/features/shared/ui-components'
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AppointmentWithDetails } from '@/features/business/dashboard/api/types'
import { getStatusConfig } from '@/lib/constants/appointment-statuses'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/utils/dates'
import { Calendar, User, Clock, MoreHorizontal, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type RecentBookingsProps = {
  appointments: AppointmentWithDetails[]
}

export function RecentBookings({ appointments }: RecentBookingsProps) {
  const isEmpty = appointments.length === 0

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="gap-4 pb-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText>
            <div className="space-y-1">
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                {isEmpty ? 'No appointments yet' : `${appointments.length} appointments`}
              </CardDescription>
            </div>
          </ButtonGroupText>
          <ButtonGroupSeparator />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/business/appointments">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open appointment schedule</TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </CardHeader>
      {!isEmpty && <Separator />}
      <CardContent className={isEmpty ? '' : 'p-0'}>
        {isEmpty ? (
          <EmptyState
            icon={Calendar}
            title="No Recent Bookings"
            description="Recent appointments will appear here"
          />
        ) : (
          <ScrollArea className="h-96">
            <div className="p-6 space-y-3">
              {appointments.map((appointment) => {
                const statusConfig = getStatusConfig(appointment.status)
                const customerInitials = getInitials('Guest')

                return (
                  <Card key={appointment.id} className="group border border-border/60">
                    <CardContent className="flex items-start gap-4 p-4">
                      <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {customerInitials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            Customer ID: {appointment.customer_id}
                          </p>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatAppointmentDate(appointment.start_time)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatAppointmentTime(appointment.start_time)}</span>
                          </div>
                        </div>

                        {appointment.staff_id && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Staff ID: {appointment.staff_id}</span>
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
