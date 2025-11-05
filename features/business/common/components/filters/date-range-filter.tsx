'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

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

  const effectiveInputValue = displayText === placeholder ? '' : displayText

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="md:max-w-xs">
        <InputGroup>
          <InputGroupAddon>
            <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
          </InputGroupAddon>
          <PopoverTrigger asChild>
            <InputGroupInput
              value={effectiveInputValue}
              readOnly
              placeholder={placeholder}
              role="combobox"
              aria-expanded={isOpen}
              aria-label="Select date range"
              onFocus={() => setIsOpen(true)}
            />
          </PopoverTrigger>
        </InputGroup>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <FieldSet className="flex flex-col gap-4 p-4">
          <Field>
            <FieldLabel>Start date</FieldLabel>
            <FieldContent>
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => handleSelect(date, 'start')}
                initialFocus
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>End date</FieldLabel>
            <FieldContent>
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => handleSelect(date, 'end')}
                disabled={(date) => (startDate ? date < startDate : false)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldContent className="flex gap-2">
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
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Apply
              </Button>
            </FieldContent>
          </Field>
        </FieldSet>
      </PopoverContent>
    </Popover>
  )
}
