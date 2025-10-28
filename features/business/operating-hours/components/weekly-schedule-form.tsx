'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { bulkUpdateOperatingHours } from '@/features/business/operating-hours/api/mutations'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function WeeklyScheduleForm({ salonId, initialHours }: WeeklyScheduleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function updateDay(
    dayIndex: number,
    field: 'open_time' | 'close_time' | 'is_closed',
    value: string | boolean
  ) {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await bulkUpdateOperatingHours(salonId, hours)

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error(result.error)
    } else {
      toast.success('Operating hours saved successfully!')
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Operating Hours</CardTitle>
        <CardDescription>
          Set your salon&apos;s operating hours for each day of the week
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to save hours</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
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
                  />
                )
              })}
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <ButtonGroup className="justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Operating Hours</span>
              )}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </form>
    </Card>
  )
}
