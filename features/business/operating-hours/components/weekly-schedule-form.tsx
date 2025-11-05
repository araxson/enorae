'use client'

import { useState, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { bulkUpdateOperatingHoursAction } from '@/features/business/operating-hours/api/mutations/operating-hours-migrated'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion } from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { ScheduleDayRow } from './schedule-day-row'

interface OperatingHour {
  id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface WeeklyScheduleFormProps {
  salonId: string
  initialHours: OperatingHour[]
}

interface FormState {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" disabled={disabled}>
      <span>Save Operating Hours</span>
    </Button>
  )
}

export function WeeklyScheduleForm({ salonId, initialHours }: WeeklyScheduleFormProps) {
  // Initialize state with existing hours or defaults
  const [hours, setHours] = useState<
    Array<{
      day_of_week: number
      open_time: string
      close_time: string
      is_closed: boolean
    }>
  >(
    DAYS.map((_, index) => {
      const existing = initialHours.find((h) => h.day_of_week === index)
      return {
        day_of_week: index,
        open_time: existing?.open_time || '09:00',
        close_time: existing?.close_time || '17:00',
        is_closed: existing?.is_closed || false,
      }
    })
  )

  const [state, formAction, isPending] = useActionState(
    bulkUpdateOperatingHoursAction,
    {} as FormState
  )

  // Show toast notifications based on state
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Operating hours saved successfully!')
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  function updateDay(
    dayIndex: number,
    field: 'open_time' | 'close_time' | 'is_closed',
    value: string | boolean
  ) {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h))
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Operating Hours</CardTitle>
        <CardDescription>
          Set your salon&apos;s operating hours for each day of the week
        </CardDescription>
      </CardHeader>
      <form action={formAction} aria-describedby={state?.error ? 'form-error' : undefined}>
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Form is submitting, please wait'}
          {state?.success && 'Operating hours saved successfully'}
        </div>

        {/* Hidden input for salon ID */}
        <input type="hidden" name="salonId" value={salonId} />

        {/* Hidden inputs for hours data */}
        {hours.map((dayHours, index) => (
          <div key={index}>
            <input type="hidden" name={`day_${index}_open_time`} value={dayHours.open_time} />
            <input type="hidden" name={`day_${index}_close_time`} value={dayHours.close_time} />
            <input type="hidden" name={`day_${index}_is_closed`} value={String(dayHours.is_closed)} />
          </div>
        ))}

        <CardContent>
          <div className="flex flex-col gap-4">
            {state?.error && (
              <Alert variant="destructive" role="alert" id="form-error">
                <AlertCircle className="size-4" />
                <AlertTitle>Failed to save hours</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state?.message && !state?.success && (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="size-4" />
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <Accordion type="multiple" defaultValue={['0', '1', '2', '3', '4', '5', '6']} className="w-full">
              {DAYS.map((day, index) => {
                const dayHours = hours.find((h) => h.day_of_week === index)!
                return (
                  <ScheduleDayRow
                    key={index}
                    day={day}
                    dayIndex={index}
                    dayHours={dayHours}
                    onUpdate={updateDay}
                    disabled={isPending}
                  />
                )
              })}
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <ButtonGroup aria-label="Form actions">
            <SubmitButton disabled={isPending} />
          </ButtonGroup>
        </CardFooter>
      </form>
    </Card>
  )
}
