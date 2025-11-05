'use client'

import { useCallback } from 'react'
import { Trash2, Power, PowerOff, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ButtonGroup } from '@/components/ui/button-group'
import { ItemDescription } from '@/components/ui/item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import type { StaffScheduleWithDetails } from '@/features/business/staff-schedules/api/queries'

const DAY_NAMES: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const DAY_ORDER: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
}

type StaffScheduleTableProps = {
  schedules: StaffScheduleWithDetails[]
  deletingId: string | null
  onDelete: (scheduleId: string) => void
  onToggleActive: (scheduleId: string, isActive: boolean | null) => void
}

export function StaffScheduleTable({
  schedules,
  deletingId,
  onDelete,
  onToggleActive,
}: StaffScheduleTableProps) {
  const formatTime = useCallback((time: string | null) => {
    if (!time) return ''
    return time.substring(0, 5)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Break</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Calendar className="size-5" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No schedules configured</EmptyTitle>
                  <EmptyDescription>
                    Add working hours for this staff member to see them listed here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        ) : (
          schedules
            .sort(
              (a: StaffScheduleWithDetails, b: StaffScheduleWithDetails) =>
                (DAY_ORDER[a['day_of_week'] || 'monday'] || 0) -
                (DAY_ORDER[b['day_of_week'] || 'monday'] || 0),
            )
            .map((schedule: StaffScheduleWithDetails) => (
              <TableRow key={schedule['id']}>
              <TableCell className="font-medium">
                {DAY_NAMES[schedule['day_of_week'] || 'monday'] || schedule['day_of_week']}
              </TableCell>
              <TableCell>{formatTime(schedule['start_time'])}</TableCell>
              <TableCell>{formatTime(schedule['end_time'])}</TableCell>
              <TableCell>
                {schedule['break_start'] && schedule['break_end'] ? (
                  <ItemDescription>
                    {formatTime(schedule['break_start'])}
                    {' '}
                    -
                    {' '}
                    {formatTime(schedule['break_end'])}
                  </ItemDescription>
                ) : (
                  <ItemDescription>No break</ItemDescription>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={schedule['is_active'] ? 'default' : 'secondary'}>
                  {schedule['is_active'] ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <ButtonGroup aria-label="Schedule actions">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => schedule['id'] && onToggleActive(schedule['id'], schedule['is_active'])}
                  >
                    {schedule['is_active'] ? (
                      <PowerOff className="size-4" />
                    ) : (
                      <Power className="size-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={deletingId === schedule['id']}
                        aria-label="Delete schedule"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove schedule?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete the selected schedule slot for the staff member.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => schedule['id'] && onDelete(schedule['id'])}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ButtonGroup>
              </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}
