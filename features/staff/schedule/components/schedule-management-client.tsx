'use client'

import { useState, useTransition } from 'react'
import { ScheduleCalendar } from './schedule-calendar'
import { ScheduleFormDialog, type ScheduleFormData } from './schedule-form-dialog'
import { createStaffSchedule, updateStaffSchedule, deleteStaffSchedule } from '@/features/staff/schedule/api/mutations'
import type { StaffScheduleWithStaff } from '@/features/staff/schedule/api/queries'
import type { DayOfWeek } from '@/features/staff/schedule/api/constants'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ScheduleManagementClientProps {
  schedules: StaffScheduleWithStaff[]
  staffId: string
  salonId: string
}

export function ScheduleManagementClient({ schedules, staffId, salonId }: ScheduleManagementClientProps) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<StaffScheduleWithStaff | null>(null)
  const [scheduleToDelete, setScheduleToDelete] = useState<StaffScheduleWithStaff | null>(null)

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

  const handleAdd = (day?: DayOfWeek) => {
    setEditingSchedule(null)
    setFormData({
      ...DEFAULT_FORM_STATE,
      day_of_week: day ?? DEFAULT_FORM_STATE.day_of_week,
    })
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

  const handleDelete = (schedule: StaffScheduleWithStaff) => {
    setScheduleToDelete(schedule)
  }

  const formatDayName = (day?: string | null) => {
    if (!day) return 'selected'
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const formatTime = (time?: string | null) => {
    if (!time) return '--:--'
    return time.slice(0, 5)
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

      <AlertDialog
        open={!!scheduleToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setScheduleToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {scheduleToDelete
                ? `This will remove the ${formatDayName(scheduleToDelete.day_of_week)} schedule starting at ${formatTime(scheduleToDelete.start_time)} for ${scheduleToDelete.staff?.profiles?.username ?? 'this staff member'}.`
                : 'This will remove the selected schedule entry.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Keep schedule</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                if (!scheduleToDelete?.id) {
                  return
                }

                startTransition(async () => {
                  await deleteStaffSchedule(scheduleToDelete.id)
                  setScheduleToDelete(null)
                })
              }}
            >
              {isPending ? 'Removing…' : 'Delete schedule'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
