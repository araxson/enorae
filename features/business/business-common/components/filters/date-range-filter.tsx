'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Stack } from '@/components/layout'

interface DateRangeFilterProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (start: Date | undefined, end: Date | undefined) => void
  placeholder?: string
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  placeholder = 'Select date range',
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (type === 'start') {
      onDateChange(date, endDate)
    } else {
      onDateChange(startDate, date)
    }
  }

  const displayText = startDate && endDate
    ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
    : placeholder

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Stack gap="md" className="p-4">
          <div>
            <p className="text-sm font-medium mb-2">Start Date</p>
            <CalendarComponent
              mode="single"
              selected={startDate}
              onSelect={(date) => handleSelect(date, 'start')}
              initialFocus
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">End Date</p>
            <CalendarComponent
              mode="single"
              selected={endDate}
              onSelect={(date) => handleSelect(date, 'end')}
              disabled={(date) => startDate ? date < startDate : false}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDateChange(undefined, undefined)
                setIsOpen(false)
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
