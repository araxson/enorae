'use client'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="gap-4 pb-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText>
            <div className="space-y-1">
              <ItemTitle>Recent Bookings</ItemTitle>
              <ItemDescription>
                {isEmpty ? 'No appointments yet' : `${appointments.length} appointments`}
              </ItemDescription>
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
      </ItemHeader>
      {!isEmpty && <Separator />}
      <ItemContent className={isEmpty ? '' : 'p-0'}>
        {isEmpty ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Calendar className="h-6 w-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No recent bookings</EmptyTitle>
              <EmptyDescription>Recent appointments will appear here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Use marketing campaigns to drive new bookings.</EmptyContent>
          </Empty>
        ) : (
          <ScrollArea className="h-96">
            <div className="p-6 space-y-3">
              {appointments.map((appointment) => {
                const statusConfig = getStatusConfig(appointment.status)
                const customerInitials = getInitials('Guest')

                return (
                  <Item
                    key={appointment.id}
                    variant="outline"
                    className="group items-start gap-4 border border-border/60 p-4"
                  >
                    <ItemMedia>
                      <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {customerInitials}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <ItemTitle>
                          <span className="truncate">Customer ID: {appointment.customer_id}</span>
                        </ItemTitle>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
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

                      {appointment.staff_id ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Staff ID: {appointment.staff_id}</span>
                        </div>
                      ) : null}
                    </ItemContent>
                    <ItemActions className="flex-none">
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
                    </ItemActions>
                  </Item>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </ItemContent>
    </Item>
  )
}
