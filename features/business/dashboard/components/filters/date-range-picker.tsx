'use client'

import { useMemo, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

type DateRangePickerProps = {
  dateRange: { from?: Date; to?: Date }
  onChange: (range: { from?: Date; to?: Date }) => void
}

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formattedRange = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
    }
    if (dateRange.from) {
      return dateRange.from.toLocaleDateString()
    }
    return null
  }, [dateRange])

  const handleSelect = (range: { from?: Date; to?: Date }) => {
    onChange(range)
    if (range.from && range.to) {
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="md:max-w-xs">
        <InputGroup>
          <InputGroupAddon>
            <CalendarIcon className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <PopoverTrigger asChild>
            <InputGroupInput
              readOnly
              role="combobox"
              aria-expanded={isOpen}
              placeholder="Pick a range"
              value={formattedRange ?? ''}
              onFocus={() => setIsOpen(true)}
            />
          </PopoverTrigger>
        </InputGroup>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => handleSelect(range ?? {})}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
