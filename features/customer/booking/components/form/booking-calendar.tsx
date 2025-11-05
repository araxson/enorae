"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type BookingCalendarProps = {
  dateValue: string
  timeValue: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  disabledDates?: Date[]
}

const TIME_RANGE_MINUTES = {
  start: 9 * 60, // 9:00 AM
  end: 19 * 60, // 7:00 PM
  step: 30,
}

function generateTimeSlots() {
  const slots: string[] = []
  for (let minutes = TIME_RANGE_MINUTES.start; minutes <= TIME_RANGE_MINUTES.end; minutes += TIME_RANGE_MINUTES.step) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export function BookingCalendar({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabledDates,
}: BookingCalendarProps) {
  const selectedDate = React.useMemo(() => {
    if (!dateValue) return undefined
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return undefined
    return parsed
  }, [dateValue])

  const handleSelect = React.useCallback(
    (date?: Date) => {
      if (!date) return
      const [isoDate] = date.toISOString().split('T')
      if (!isoDate) return
      onDateChange(isoDate)
    },
    [onDateChange]
  )

  const today = React.useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  return (
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate ?? today}
            disabled={[{ before: today }, ...(disabledDates ?? [])]}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString('en-US', { weekday: 'short' }),
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Available times
          </span>
          <ButtonGroup orientation="vertical" className="w-full">
            {TIME_SLOTS.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={timeValue === slot ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeChange(slot)}
                aria-pressed={timeValue === slot}
              >
                {slot}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-3 text-sm md:flex-row md:items-center">
        <p className="flex-1 text-center md:text-left">
          {selectedDate && timeValue ? (
            <>
              Appointment set for{' '}
              <span className="font-medium">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>{' '}
              at <span className="font-medium">{timeValue}</span>
            </>
          ) : (
            <>Select your preferred date and time.</>
          )}
        </p>
        <input type="hidden" name="date" value={dateValue} />
        <input type="hidden" name="time" value={timeValue} />
        <Button
          type="button"
          variant="outline"
          disabled={!selectedDate || !timeValue}
        >
          {selectedDate && timeValue ? 'Looks good' : 'Pick a slot'}
        </Button>
      </CardFooter>
    </Card>
  )
}
