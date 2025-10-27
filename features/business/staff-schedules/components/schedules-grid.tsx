'use client'

import { useState, useMemo, useCallback } from 'react'
import { Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { deleteStaffSchedule, toggleScheduleActive } from '@/features/business/staff-schedules/api/mutations'
import type { StaffScheduleWithDetails } from '@/features/business/staff-schedules/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'

type SchedulesGridProps = {
  schedules: StaffScheduleWithDetails[]
  onUpdate?: () => void
}

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

export function SchedulesGrid({ schedules, onUpdate }: SchedulesGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Group schedules by staff member
  type StaffGroup = {
    staffId: string | null
    staffName: string
    staffTitle: string | null
    schedules: StaffScheduleWithDetails[]
  }

  // PERFORMANCE: Memoize grouping logic to prevent re-computation on every render
  const staffGroups = useMemo(() => {
    return schedules.reduce<Record<string, StaffGroup>>(
      (acc, schedule) => {
        const key = schedule['staff_id'] || 'unknown'

        if (!acc[key]) {
          // PERFORMANCE: Mutate accumulator instead of spreading to reduce object creation
          acc[key] = {
            staffId: schedule['staff_id'],
            staffName: schedule['staff_name'] || 'Unknown',
            staffTitle: schedule['staff_title'] || null,
            schedules: [schedule],
          }
          return acc
        }

        // PERFORMANCE: Mutate array instead of spreading
        acc[key].schedules.push(schedule)
        return acc
      },
      {}
    )
  }, [schedules])

  // PERFORMANCE: Wrap callbacks in useCallback to prevent re-creation on every render
  const handleDelete = useCallback(async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    setDeletingId(scheduleId)
    const result = await deleteStaffSchedule(scheduleId)
    setDeletingId(null)

    if (result.success) {
      toast.success('Schedule deleted')
      onUpdate?.()
    } else {
      toast.error(result.error)
    }
  }, [onUpdate])

  const handleToggleActive = useCallback(async (scheduleId: string, isActive: boolean | null) => {
    const result = await toggleScheduleActive(scheduleId, !isActive)
    if (result.success) {
      toast.success(isActive ? 'Schedule deactivated' : 'Schedule activated')
      onUpdate?.()
    } else {
      toast.error(result.error)
    }
  }, [onUpdate])

  const formatTime = useCallback((time: string | null) => {
    if (!time) return ''
    // Remove seconds if present
    return time.substring(0, 5)
  }, [])

  if (Object.keys(staffGroups).length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No schedules configured</EmptyTitle>
              <EmptyDescription>Add a schedule above to get started.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1">
      {Object.values(staffGroups).map((group) => (
        <Card key={group.staffId || 'unknown'}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{group.staffName}</CardTitle>
              {group.staffTitle && <Badge variant="outline">{group.staffTitle}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
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
                {group.schedules
                  .sort((a: StaffScheduleWithDetails, b: StaffScheduleWithDetails) => (DAY_ORDER[a['day_of_week'] || 'monday'] || 0) - (DAY_ORDER[b['day_of_week'] || 'monday'] || 0))
                  .map((schedule: StaffScheduleWithDetails) => (
                    <TableRow key={schedule['id']}>
                      <TableCell className="font-medium">
                        {DAY_NAMES[schedule['day_of_week'] || 'monday'] || schedule['day_of_week']}
                      </TableCell>
                      <TableCell>{formatTime(schedule['start_time'])}</TableCell>
                      <TableCell>{formatTime(schedule['end_time'])}</TableCell>
                      <TableCell>
                        {schedule['break_start'] && schedule['break_end'] ? (
                          <CardDescription>
                            {formatTime(schedule['break_start'])} - {formatTime(schedule['break_end'])}
                          </CardDescription>
                        ) : (
                          <CardDescription>No break</CardDescription>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={schedule['is_active'] ? 'default' : 'secondary'}>
                          {schedule['is_active'] ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ButtonGroup className="ml-auto justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => schedule['id'] && handleToggleActive(schedule['id'], schedule['is_active'])}
                          >
                            {schedule['is_active'] ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => schedule['id'] && handleDelete(schedule['id'])}
                            disabled={deletingId === schedule['id']}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
