'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { ButtonGroup } from '@/components/ui/button-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'

interface DateRangeFilterProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (start: Date | undefined, end: Date | undefined) => void
  placeholder?: string
  className?: string
  label?: string
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  placeholder = 'Select date range',
  className,
  label,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (type === 'start') {
      onDateChange(date, endDate)
    } else {
      onDateChange(startDate, date)
    }
  }

  const displayText =
    startDate && endDate
      ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
      : placeholder

  return (
    <Field className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <FieldContent>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="w-full justify-start">
              <Calendar className="mr-2 size-4" aria-hidden="true" />
              <span className="truncate text-left">{displayText}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <FieldSet>
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
                <FieldContent>
                  <div className="flex justify-end">
                    <ButtonGroup aria-label="Date range actions">
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
                    </ButtonGroup>
                  </div>
                </FieldContent>
              </Field>
            </FieldSet>
          </PopoverContent>
        </Popover>
      </FieldContent>
    </Field>
  )
}
