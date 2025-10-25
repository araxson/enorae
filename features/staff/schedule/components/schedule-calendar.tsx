'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import type { StaffScheduleWithStaff } from '@/features/staff/schedule/api/queries'

type ScheduleCalendarProps = {
  schedules: StaffScheduleWithStaff[]
  onEdit?: (schedule: StaffScheduleWithStaff) => void
  onDelete?: (scheduleId: string) => void
  onAdd?: () => void
}

export function ScheduleCalendar({ schedules, onEdit, onDelete, onAdd }: ScheduleCalendarProps) {
  // Group schedules by day of week
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    const day = schedule['day_of_week']
    if (!day) return acc // Skip schedules without day_of_week
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(schedule)
    return acc
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
            <div className="py-12 text-center text-muted-foreground">
              <p>No schedules found</p>
              <p className="text-sm text-muted-foreground">Click &quot;Add Schedule&quot; to create weekly schedules</p>
            </div>
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
                  <CardTitle>{formatDayName(day)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {daySchedules.map(schedule => (
                      <div
                        key={schedule['id']}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {schedule.staff?.['title'] || 'Unknown Staff'}
                            </span>
                            <Badge variant={schedule['is_active'] ? 'default' : 'secondary'}>
                              {schedule['is_active'] ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(schedule['start_time'])} - {formatTime(schedule['end_time'])}
                            {schedule.staff?.['title'] && ` • ${schedule.staff['title']}`}
                          </p>
                          {schedule['break_start'] && schedule['break_end'] && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Break: {formatTime(schedule['break_start'])} - {formatTime(schedule['break_end'])}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(schedule)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          {onDelete && schedule['id'] && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(schedule['id']!)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
