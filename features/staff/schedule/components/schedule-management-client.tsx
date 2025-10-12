'use client'

import { useState, useTransition } from 'react'
import { ScheduleCalendar } from './schedule-calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createStaffSchedule, updateStaffSchedule, deleteStaffSchedule } from '../api/mutations'
import type { StaffScheduleWithStaff } from '../api/queries'
import type { DayOfWeek } from '../api/staff-schedules/constants'

interface ScheduleManagementClientProps {
  schedules: StaffScheduleWithStaff[]
  staffId: string
  salonId: string
}

export function ScheduleManagementClient({ schedules, staffId, salonId }: ScheduleManagementClientProps) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<StaffScheduleWithStaff | null>(null)

  type ScheduleFormState = {
    day_of_week: DayOfWeek
    start_time: string
    end_time: string
    break_start: string
    break_end: string
    is_active: boolean
  }

  const dayOptions: readonly DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
  const isDayOfWeek = (value: string): value is DayOfWeek => dayOptions.some((option) => option === value)

  const DEFAULT_FORM_STATE: ScheduleFormState = {
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    break_start: '',
    break_end: '',
    is_active: true,
  }

  const [formData, setFormData] = useState<ScheduleFormState>({ ...DEFAULT_FORM_STATE })

  const handleAdd = () => {
    setEditingSchedule(null)
    setFormData({ ...DEFAULT_FORM_STATE })
    setIsDialogOpen(true)
  }

  const handleEdit = (schedule: StaffScheduleWithStaff) => {
    setEditingSchedule(schedule)
    const nextDay = schedule.day_of_week ?? ''
    setFormData({
      day_of_week: isDayOfWeek(nextDay) ? nextDay : 'monday',
      start_time: schedule.start_time || '09:00',
      end_time: schedule.end_time || '17:00',
      break_start: schedule.break_start || '',
      break_end: schedule.break_end || '',
      is_active: schedule.is_active ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      startTransition(async () => {
        await deleteStaffSchedule(scheduleId)
      })
    }
  }

  const handleSubmit = () => {
    startTransition(async () => {
      if (editingSchedule?.id) {
        await updateStaffSchedule(editingSchedule.id, {
          day_of_week: formData.day_of_week,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_start: formData.break_start || null,
          break_end: formData.break_end || null,
          is_active: formData.is_active,
        })
      } else {
        await createStaffSchedule(salonId, {
          staff_id: staffId,
          day_of_week: formData.day_of_week,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_start: formData.break_start || undefined,
          break_end: formData.break_end || undefined,
          is_active: formData.is_active,
        })
      }
      setIsDialogOpen(false)
    })
  }

  return (
    <>
      <ScheduleCalendar
        schedules={schedules}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="day_of_week">Day of Week</Label>
              <Select
                value={formData.day_of_week}
                onValueChange={(value) => {
                  if (isDayOfWeek(value)) {
                    setFormData({ ...formData, day_of_week: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="break_start">Break Start (Optional)</Label>
                <Input
                  id="break_start"
                  type="time"
                  value={formData.break_start}
                  onChange={(e) => setFormData({ ...formData, break_start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="break_end">Break End (Optional)</Label>
                <Input
                  id="break_end"
                  type="time"
                  value={formData.break_end}
                  onChange={(e) => setFormData({ ...formData, break_end: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {editingSchedule ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
