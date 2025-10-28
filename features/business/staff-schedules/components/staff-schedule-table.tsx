'use client'

import { useCallback } from 'react'
import { Trash2, Power, PowerOff } from 'lucide-react'
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
import {
  ItemDescription,
} from '@/components/ui/item'
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
        {schedules
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
                <ButtonGroup className="ml-auto justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => schedule['id'] && onToggleActive(schedule['id'], schedule['is_active'])}
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
                    onClick={() => schedule['id'] && onDelete(schedule['id'])}
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
  )
}
