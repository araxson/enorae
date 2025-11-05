'use client'

import { useState, useMemo, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { deleteStaffSchedule, toggleScheduleActive } from '@/features/business/staff-schedules/api/mutations'
import type { StaffScheduleWithDetails } from '@/features/business/staff-schedules/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemGroup,
  ItemHeader,
  ItemTitle,
  ItemContent,
} from '@/components/ui/item'
import { StaffScheduleTable } from './staff-schedule-table'

type SchedulesGridProps = {
  schedules: StaffScheduleWithDetails[]
  onUpdate?: () => void
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

  const staffGroups = useMemo(() => {
    return schedules.reduce<Record<string, StaffGroup>>(
      (acc, schedule) => {
        const key = schedule['staff_id'] || 'unknown'

        if (!acc[key]) {
                  acc[key] = {
            staffId: schedule['staff_id'],
            staffName: schedule['staff_name'] || 'Unknown',
            staffTitle: schedule['staff_title'] || null,
            schedules: [schedule],
          }
          return acc
        }

              acc[key].schedules.push(schedule)
        return acc
      },
      {}
    )
  }, [schedules])

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

  if (Object.keys(staffGroups).length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No schedules configured</EmptyTitle>
          <EmptyDescription>Add a schedule above to get started.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="grid grid-cols-1 gap-4">
      {Object.values(staffGroups).map((group) => (
        <Item key={group.staffId || 'unknown'} variant="outline" className="flex-col gap-4">
          <ItemHeader>
            <div className="flex items-center gap-2">
              <ItemTitle>{group.staffName}</ItemTitle>
              {group.staffTitle ? <Badge variant="outline">{group.staffTitle}</Badge> : null}
            </div>
          </ItemHeader>
          <ItemContent>
            <StaffScheduleTable
              schedules={group.schedules}
              deletingId={deletingId}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
