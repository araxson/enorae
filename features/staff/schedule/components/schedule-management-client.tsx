'use client'

import { useState, useTransition } from 'react'
import { ScheduleCalendar } from './schedule-calendar'
import { ScheduleFormDialog, type ScheduleFormData } from './schedule-form-dialog'
import { createStaffSchedule, updateStaffSchedule, deleteStaffSchedule } from '@/features/staff/schedule/api/mutations'
import type { StaffScheduleWithStaff } from '@/features/staff/schedule/api/queries'
import type { DayOfWeek } from '@/features/staff/schedule/api/constants'

interface ScheduleManagementClientProps {
  schedules: StaffScheduleWithStaff[]
  staffId: string
  salonId: string
}

export function ScheduleManagementClient({ schedules, staffId, salonId }: ScheduleManagementClientProps) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<StaffScheduleWithStaff | null>(null)

  const dayOptions: readonly DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
  const isDayOfWeek = (value: string): value is DayOfWeek => dayOptions.some((option) => option === value)

  const DEFAULT_FORM_STATE: ScheduleFormData = {
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    break_start: '',
    break_end: '',
    is_active: true,
  }

  const [formData, setFormData] = useState<ScheduleFormData>({ ...DEFAULT_FORM_STATE })

  const handleAdd = () => {
    setEditingSchedule(null)
    setFormData({ ...DEFAULT_FORM_STATE })
    setIsDialogOpen(true)
  }

  const handleEdit = (schedule: StaffScheduleWithStaff) => {
    setEditingSchedule(schedule)
    const nextDay = schedule['day_of_week'] ?? ''
    setFormData({
      day_of_week: isDayOfWeek(nextDay) ? nextDay : 'monday',
      start_time: schedule['start_time'] || '09:00',
      end_time: schedule['end_time'] || '17:00',
      break_start: schedule['break_start'] || '',
      break_end: schedule['break_end'] || '',
      is_active: schedule['is_active'] ?? true,
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

  const handleSubmit = (data: ScheduleFormData) => {
    startTransition(async () => {
      if (editingSchedule?.id) {
        await updateStaffSchedule(editingSchedule.id, {
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          break_start: data.break_start || null,
          break_end: data.break_end || null,
          is_active: data.is_active,
        })
      } else {
        await createStaffSchedule(salonId, {
          staff_id: staffId,
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          break_start: data.break_start || undefined,
          break_end: data.break_end || undefined,
          is_active: data.is_active,
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

      <ScheduleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={!!editingSchedule}
        initialData={formData}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </>
  )
}
