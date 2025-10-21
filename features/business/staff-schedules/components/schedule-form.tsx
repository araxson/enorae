'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { upsertStaffSchedule } from '../api/mutations'
import { useScheduleFormState } from './form/use-schedule-form-state'
import { ScheduleFormFields } from './form/schedule-form-fields'
import type { SchedulePayload } from './form/schedule-options'

const DEFAULT_DAY = ''

type StaffMember = {
  id: string
  full_name: string | null
  title: string | null
}

type ScheduleFormProps = {
  staffMembers: StaffMember[]
  onSuccess?: () => void
}

type UpsertPayload = {
  staffId: string
  dayOfWeek: Exclude<SchedulePayload['dayOfWeek'], ''>
  startTime: string
  endTime: string
  breakStart: string | null
  breakEnd: string | null
  effectiveFrom: string | null
  effectiveUntil: string | null
}

const parsePayload = (values: SchedulePayload): UpsertPayload | null => {
  if (!values.staffId || values.dayOfWeek === DEFAULT_DAY) {
    return null
  }

  // Type guard - at this point dayOfWeek is not ''
  const dayOfWeek = values.dayOfWeek as Exclude<SchedulePayload['dayOfWeek'], ''>

  return {
    staffId: values.staffId,
    dayOfWeek,
    startTime: values.startTime,
    endTime: values.endTime,
    breakStart: values.breakStart || null,
    breakEnd: values.breakEnd || null,
    effectiveFrom: values.effectiveFrom || null,
    effectiveUntil: values.effectiveUntil || null,
  }
}

export function ScheduleForm({ staffMembers, onSuccess }: ScheduleFormProps) {
  const { values, update, reset, isSubmitting, setIsSubmitting } = useScheduleFormState()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload = parsePayload(values)
    if (!payload) {
      toast.error('Please select staff member and day')
      return
    }

    setIsSubmitting(true)

    const result = await upsertStaffSchedule(payload)

    setIsSubmitting(false)

    if (result.success) {
      toast.success('Schedule saved successfully')
      reset()
      onSuccess?.()
    } else if (result.error) {
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
          <div className="flex flex-col gap-4">
            <ScheduleFormFields
              values={values}
              onChange={update}
              staffMembers={staffMembers}
              disabled={isSubmitting}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
