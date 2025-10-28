'use client'

import { useMemo } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

type DateRangePickerProps = {
  dateRange: { from?: Date; to?: Date }
  onChange: (range: { from?: Date; to?: Date }) => void
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const formattedRange = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
    }
    if (dateRange.from) {
      return dateRange.from.toLocaleDateString()
    }
    return 'Pick a range'
  }, [dateRange])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 md:w-auto">
          <CalendarIcon className="h-4 w-4" />
          {formattedRange}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => onChange(range ?? {})}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
