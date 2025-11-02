'use client'

import { memo, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, User, Clock, MoreHorizontal, ChevronRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getStatusConfig } from '@/lib/constants/appointment-statuses'
import { formatAppointmentDate, formatAppointmentTime } from '@/lib/utils/dates'

import type { AppointmentWithDetails } from '@/features/business/dashboard/api/types'
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

// PERFORMANCE FIX: Memoize getInitials to prevent recreation on every render
const getInitials = (name: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const RecentBookings = memo(function RecentBookings({ appointments }: RecentBookingsProps) {
  const isEmpty = appointments.length === 0

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Recent Bookings</ItemTitle>
          <ItemDescription>
            {isEmpty ? 'No appointments yet' : `${appointments.length} appointments`}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/business/appointments">
                  View all
                  <ChevronRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open appointment schedule</TooltipContent>
          </Tooltip>
        </ItemActions>
      </ItemHeader>
      {!isEmpty && <Separator />}
      <ItemContent>
        {isEmpty ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Calendar className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No recent bookings</EmptyTitle>
              <EmptyDescription>Recent appointments will appear here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Use marketing campaigns to drive new bookings.
            </EmptyContent>
          </Empty>
        ) : (
          <ScrollArea className="h-96">
            <div className="p-6 space-y-3">
              {appointments.map((appointment) => {
                const statusConfig = getStatusConfig(appointment.status)
                const customerInitials = getInitials('Guest')

                return (
                  <Item key={appointment.id} variant="outline">
                    <ItemMedia>
                      <Avatar className="size-10 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {customerInitials}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <div className="min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <ItemTitle>
                            <span className="truncate">Customer ID: {appointment.customer_id}</span>
                          </ItemTitle>
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" aria-hidden="true" />
                            <span>{formatAppointmentDate(appointment.start_time)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" aria-hidden="true" />
                            <span>{formatAppointmentTime(appointment.start_time)}</span>
                          </div>
                        </div>

                        {appointment.staff_id ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="size-3" aria-hidden="true" />
                            <span>Staff ID: {appointment.staff_id}</span>
                          </div>
                        ) : null}
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
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
})
