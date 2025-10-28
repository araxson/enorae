'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { DayOfWeek } from '@/features/staff/schedule/api/constants'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

export interface ScheduleFormData {
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  break_start: string
  break_end: string
  is_active: boolean
}

interface ScheduleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  initialData: ScheduleFormData
  isPending: boolean
  onSubmit: (data: ScheduleFormData) => void
}

const dayOptions: readonly DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const isDayOfWeek = (value: string): value is DayOfWeek => dayOptions.some((option) => option === value)

export function ScheduleFormDialog({
  open,
  onOpenChange,
  isEditing,
  initialData,
  isPending,
  onSubmit,
}: ScheduleFormDialogProps) {
  const [formData, setFormData] = useState<ScheduleFormData>(initialData)

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
        </DialogHeader>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="day_of_week">Day of week</FieldLabel>
            <FieldContent>
              <Select
                value={formData.day_of_week}
                onValueChange={(value) => {
                  if (isDayOfWeek(value)) {
                    setFormData({ ...formData, day_of_week: value })
                  }
                }}
              >
                <SelectTrigger id="day_of_week">
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
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="start_time">Start time</FieldLabel>
              <FieldContent>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="end_time">End time</FieldLabel>
              <FieldContent>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="break_start">Break start</FieldLabel>
              <FieldContent>
                <FieldDescription>Optional</FieldDescription>
                <Input
                  id="break_start"
                  type="time"
                  value={formData.break_start}
                  onChange={(e) => setFormData({ ...formData, break_start: e.target.value })}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="break_end">Break end</FieldLabel>
              <FieldContent>
                <FieldDescription>Optional</FieldDescription>
                <Input
                  id="break_end"
                  type="time"
                  value={formData.break_end}
                  onChange={(e) => setFormData({ ...formData, break_end: e.target.value })}
                />
              </FieldContent>
            </Field>
          </div>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="is_active">Active</FieldLabel>
            <FieldContent>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </FieldContent>
          </Field>

          <div className="flex justify-end">
            <ButtonGroup>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </ButtonGroup>
          </div>
        </FieldSet>
      </DialogContent>
    </Dialog>
  )
}
