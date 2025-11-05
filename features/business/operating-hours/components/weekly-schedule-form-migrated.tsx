'use client'

import { useActionState, useRef, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion } from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { ScheduleDayRow } from './schedule-day-row-migrated'
import { bulkUpdateOperatingHoursAction } from '../api/mutations'

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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function SubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      Save Operating Hours
    </button>
  )
}

export function WeeklyScheduleForm({ salonId, initialHours }: WeeklyScheduleFormProps) {
  const [state, formAction] = useActionState(bulkUpdateOperatingHoursAction, null)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Operating Hours</CardTitle>
        <CardDescription>
          Set your salon&apos;s operating hours for each day of the week
        </CardDescription>
      </CardHeader>
      <form action={formAction} noValidate aria-describedby={hasErrors ? 'form-errors' : undefined}>
        <input type="hidden" name="salonId" value={salonId} />

        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Screen reader announcement for form status */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {state?.message}
            </div>

            {/* Error summary for screen readers and keyboard users */}
            {hasErrors && state?.errors && (
              <div
                id="form-errors"
                role="alert"
                className="bg-destructive/10 border border-destructive p-4 rounded-md"
                tabIndex={-1}
              >
                <h2 className="font-semibold text-destructive mb-2">
                  There are errors in the form
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(state.errors).map(([field, messages]) => (
                    <li key={field}>
                      <a
                        href={`#${field}`}
                        className="text-destructive underline hover:no-underline"
                      >
                        {field}: {(messages as string[])[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Server error message */}
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Failed to save hours</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* Success message */}
            {state?.success && (
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Operating hours saved successfully!</AlertDescription>
              </Alert>
            )}

            <Accordion type="multiple" defaultValue={['0', '1', '2', '3', '4', '5', '6']} className="w-full">
              {DAYS.map((day, index) => {
                const dayHours = initialHours.find((h) => h.day_of_week === index) || {
                  id: '',
                  day_of_week: index,
                  open_time: '09:00',
                  close_time: '17:00',
                  is_closed: false,
                }
                return (
                  <ScheduleDayRow
                    key={index}
                    day={day}
                    dayIndex={index}
                    dayHours={dayHours}
                    errors={state?.errors}
                    ref={index === 0 && state?.errors ? firstErrorRef : null}
                  />
                )
              })}
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <ButtonGroup aria-label="Form actions">
            <SubmitButton />
          </ButtonGroup>
        </CardFooter>
      </form>
    </Card>
  )
}
