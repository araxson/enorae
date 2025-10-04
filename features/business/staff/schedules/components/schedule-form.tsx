'use client'

import { useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { toast } from 'sonner'
import { upsertStaffSchedule } from '../api/mutations'

type ScheduleFormProps = {
  staffMembers: Array<{ id: string; full_name: string | null; title: string | null }>
  onSuccess?: () => void
}

const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

export function ScheduleForm({ staffMembers, onSuccess }: ScheduleFormProps) {
  const [staffId, setStaffId] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')
  const [effectiveFrom, setEffectiveFrom] = useState('')
  const [effectiveUntil, setEffectiveUntil] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!staffId || dayOfWeek === '') {
      toast.error('Please select staff member and day')
      return
    }

    setIsSubmitting(true)

    const result = await upsertStaffSchedule({
      staffId,
      dayOfWeek: dayOfWeek as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
      startTime,
      endTime,
      breakStart: breakStart || null,
      breakEnd: breakEnd || null,
      effectiveFrom: effectiveFrom || null,
      effectiveUntil: effectiveUntil || null,
    })

    setIsSubmitting(false)

    if (result.success) {
      toast.success('Schedule saved successfully')
      // Reset form
      setStaffId('')
      setDayOfWeek('')
      setStartTime('09:00')
      setEndTime('17:00')
      setBreakStart('')
      setBreakEnd('')
      setEffectiveFrom('')
      setEffectiveUntil('')
      onSuccess?.()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add/Update Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div className="grid gap-4 md:grid-cols-2">
              <Stack gap="sm">
                <Label htmlFor="staff">Staff Member</Label>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name || 'Unknown'} {staff.title ? `- ${staff.title}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Stack gap="sm">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </Stack>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Stack gap="sm">
                <Label htmlFor="breakStart">Break Start (optional)</Label>
                <Input
                  id="breakStart"
                  type="time"
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="breakEnd">Break End (optional)</Label>
                <Input
                  id="breakEnd"
                  type="time"
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                />
              </Stack>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Stack gap="sm">
                <Label htmlFor="effectiveFrom">Effective From (optional)</Label>
                <Input
                  id="effectiveFrom"
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  placeholder="Leave empty for permanent"
                />
                <p className="text-xs text-muted-foreground">
                  Start date for this schedule override
                </p>
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="effectiveUntil">Effective Until (optional)</Label>
                <Input
                  id="effectiveUntil"
                  type="date"
                  value={effectiveUntil}
                  onChange={(e) => setEffectiveUntil(e.target.value)}
                  placeholder="Leave empty for permanent"
                  min={effectiveFrom || undefined}
                />
                <p className="text-xs text-muted-foreground">
                  End date for this schedule override
                </p>
              </Stack>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Schedule'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
