import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarDays, Command as CommandIcon, Filter } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/ui/kbd'
import { ButtonGroup } from '@/components/ui/button-group'
import { StaffFiltersDropdown } from './staff-filters-dropdown'
import type { StaffFilter, StaffToggle } from './types'

interface StaffPageToolbarProps {
  filters?: readonly StaffFilter[]
  toggles?: readonly StaffToggle[]
  avatarUrl?: string | null
  avatarFallback?: string
  dateRange: DateRange | null
  onDateRangeChange: (range: DateRange | null) => void
  onOpenCommand: () => void
  toolbarEnd?: React.ReactNode
}

export function StaffPageToolbar({
  filters,
  toggles,
  avatarUrl,
  avatarFallback,
  dateRange,
  onDateRangeChange,
  onOpenCommand,
  toolbarEnd,
}: StaffPageToolbarProps) {
  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} – ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : 'All time'

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
        <ButtonGroup aria-label="Toolbar actions">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onOpenCommand} aria-label="Quick navigator">
                <CommandIcon className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              <span>Quick navigator</span>
              <Kbd>⌘K</Kbd>
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2" aria-label="Select date range">
                <CalendarDays className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline-flex">{dateLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange ?? undefined}
                onSelect={(range) => onDateRangeChange(range ?? null)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <StaffFiltersDropdown filters={filters} toggles={toggles} />

          {toolbarEnd}
        </ButtonGroup>

        <Avatar className="size-9">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>
            {cn(avatarFallback?.slice(0, 2).toUpperCase() || 'ST')}
          </AvatarFallback>
        </Avatar>
      </div>
    </TooltipProvider>
  )
}
