'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import type { StaffScheduleWithStaff } from '@/features/staff/schedule/api/queries'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

type ScheduleCalendarProps = {
  schedules: StaffScheduleWithStaff[]
  onEdit?: (schedule: StaffScheduleWithStaff) => void
  onDelete?: (scheduleId: string) => void
  onAdd?: () => void
}

export function ScheduleCalendar({ schedules, onEdit, onDelete, onAdd }: ScheduleCalendarProps) {
  // Group schedules by day of week - immutably
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    const day = schedule['day_of_week']
    if (!day) return acc // Skip schedules without day_of_week

    return {
      ...acc,
      [day]: [...(acc[day] || []), schedule]
    }
  }, {} as Record<string, StaffScheduleWithStaff[]>)

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const formatTime = (time: string | null) => {
    if (!time) return 'N/A'
    return time.slice(0, 5) // HH:MM
  }

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        )}
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No schedules found</EmptyTitle>
                <EmptyDescription>Click &quot;Add Schedule&quot; to create weekly schedules.</EmptyDescription>
              </EmptyHeader>
              {onAdd && (
                <EmptyContent>
                  <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {daysOfWeek.map(day => {
            const daySchedules = schedulesByDay[day] || []
            if (daySchedules.length === 0) return null

            return (
              <Card key={day}>
                <CardHeader>
                  <ItemGroup>
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <CardTitle>{formatDayName(day)}</CardTitle>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent>
                  <ItemGroup className="gap-3">
                    {daySchedules.map((schedule, index) => (
                      <Fragment key={schedule['id']}>
                        <Item variant="outline" size="sm">
                          <ItemContent>
                            <div className="flex flex-wrap items-center gap-2">
                              <ItemTitle>{schedule.staff?.['title'] || 'Unknown Staff'}</ItemTitle>
                              <Badge variant={schedule['is_active'] ? 'default' : 'secondary'}>
                                {schedule['is_active'] ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <ItemDescription>
                              {formatTime(schedule['start_time'])} - {formatTime(schedule['end_time'])}
                              {schedule.staff?.['title'] ? ` • ${schedule.staff['title']}` : ''}
                            </ItemDescription>
                            {schedule['break_start'] && schedule['break_end'] ? (
                              <ItemDescription>
                                Break: {formatTime(schedule['break_start'])} - {formatTime(schedule['break_end'])}
                              </ItemDescription>
                            ) : null}
                          </ItemContent>
                          {(onEdit || onDelete) ? (
                            <ItemActions>
                              <ButtonGroup>
                                {onEdit ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(schedule)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                ) : null}
                                {onDelete && schedule['id'] ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(schedule['id']!)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                ) : null}
                              </ButtonGroup>
                            </ItemActions>
                          ) : null}
                        </Item>
                        {index < daySchedules.length - 1 ? <ItemSeparator /> : null}
                      </Fragment>
                    ))}
                  </ItemGroup>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
