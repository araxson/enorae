'use client'

import { useState } from 'react'
import { Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Grid } from '@/components/layout'
import { Muted, P } from '@/components/ui/typography'
import { toast } from 'sonner'
import { deleteStaffSchedule, toggleScheduleActive } from '../api/mutations'
import type { StaffScheduleWithDetails } from '../api/queries'

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
  const staffGroups = schedules.reduce(
    (acc, schedule) => {
      const key = schedule.staff_id || 'unknown'
      if (!acc[key]) {
        acc[key] = {
          staffId: schedule.staff_id,
          staffName: schedule.staff_name || 'Unknown',
          staffTitle: schedule.staff_title || null,
          schedules: [],
        }
      }
      acc[key].schedules.push(schedule)
      return acc
    },
    {} as Record<
      string,
      {
        staffId: string | null
        staffName: string
        staffTitle: string | null
        schedules: StaffScheduleWithDetails[]
      }
    >
  )

  const handleDelete = async (scheduleId: string) => {
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
  }

  const handleToggleActive = async (scheduleId: string, isActive: boolean | null) => {
    const result = await toggleScheduleActive(scheduleId, !isActive)
    if (result.success) {
      toast.success(isActive ? 'Schedule deactivated' : 'Schedule activated')
      onUpdate?.()
    } else {
      toast.error(result.error)
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return ''
    // Remove seconds if present
    return time.substring(0, 5)
  }

  if (Object.keys(staffGroups).length === 0) {
    return (
      <Card>
        <CardContent>
          <Muted>No schedules configured yet. Add a schedule above to get started.</Muted>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid cols={{ base: 1 }} gap="md">
      {Object.values(staffGroups).map((group) => (
        <Card key={group.staffId || 'unknown'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {group.staffName}
              {group.staffTitle && <Badge variant="outline">{group.staffTitle}</Badge>}
            </CardTitle>
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
                  .sort((a, b) => (DAY_ORDER[a.day_of_week || 'monday'] || 0) - (DAY_ORDER[b.day_of_week || 'monday'] || 0))
                  .map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        {DAY_NAMES[schedule.day_of_week || 'monday'] || schedule.day_of_week}
                      </TableCell>
                      <TableCell>{formatTime(schedule.start_time)}</TableCell>
                      <TableCell>{formatTime(schedule.end_time)}</TableCell>
                      <TableCell>
                        {schedule.break_start && schedule.break_end ? (
                          <P className="text-sm">
                            {formatTime(schedule.break_start)} - {formatTime(schedule.break_end)}
                          </P>
                        ) : (
                          <Muted className="text-sm">No break</Muted>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                          {schedule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => schedule.id && handleToggleActive(schedule.id, schedule.is_active)}
                          >
                            {schedule.is_active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => schedule.id && handleDelete(schedule.id)}
                            disabled={deletingId === schedule.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </Grid>
  )
}
