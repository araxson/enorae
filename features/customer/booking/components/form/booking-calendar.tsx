"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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
    <Card className="overflow-hidden p-0">
      <CardContent className="relative grid gap-0 p-0 md:grid-cols-[auto_14rem]">
        <div className="p-4 md:p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate ?? today}
            disabled={[{ before: today }, ...(disabledDates ?? [])]}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => date.toLocaleString('en-US', { weekday: 'short' }),
            }}
          />
        </div>

        <div className="no-scrollbar flex max-h-72 flex-col gap-3 overflow-y-auto border-t p-4 md:max-h-none md:border-l md:border-t-0 md:p-6">
          <div className="grid gap-2">
            {TIME_SLOTS.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={timeValue === slot ? 'default' : 'outline'}
                onClick={() => onTimeChange(slot)}
                className="w-full shadow-none"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t px-4 py-5 text-sm md:flex-row md:items-center">
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
          className="w-full md:w-auto"
          disabled={!selectedDate || !timeValue}
          variant="outline"
        >
          {selectedDate && timeValue ? 'Looks good' : 'Pick a slot'}
        </Button>
      </CardFooter>
    </Card>
  )
}
