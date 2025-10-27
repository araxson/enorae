import { format } from 'date-fns'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CalendarDays, Command as CommandIcon, Filter, Sparkles } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import type {
  StaffBreadcrumb,
  StaffFilter,
  StaffToggle,
} from './types'

interface StaffPageHeadingProps {
  title: string
  description?: string
  breadcrumbs?: readonly StaffBreadcrumb[]
  filters?: readonly StaffFilter[]
  toggles?: readonly StaffToggle[]
  avatarUrl?: string | null
  avatarFallback?: string
  dateRange: DateRange | null
  onDateRangeChange: (range: DateRange | null) => void
  onOpenCommand: () => void
  toolbarEnd?: React.ReactNode
}

export function StaffPageHeading({
  title,
  description,
  breadcrumbs,
  filters,
  toggles,
  avatarUrl,
  avatarFallback,
  dateRange,
  onDateRangeChange,
  onOpenCommand,
  toolbarEnd,
}: StaffPageHeadingProps) {
  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} – ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : 'All time'

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-4">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <BreadcrumbItem key={`${crumb.label}-${index}`}>
                    {crumb.href && !isLast ? (
                      <>
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{title}</h1>
              <div className="hidden items-center gap-2 sm:flex">
                <Sparkles className="h-3.5 w-3.5" />
                <Badge variant="secondary">Staff Portal</Badge>
              </div>
            </div>
            {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onOpenCommand}>
                  <CommandIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick navigator</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Display options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters && filters.length > 0 ? (
                  <div className="space-y-2 px-2 py-1.5">
                    {filters.map((filter) => (
                      <Label key={filter.id} className="flex items-start gap-3">
                        <Checkbox defaultChecked={filter.defaultChecked} className="mt-1" />
                        <div className="text-sm leading-6">
                          <span>{filter.label}</span>
                          {filter.description ? (
                            <span className="block text-xs text-muted-foreground">{filter.description}</span>
                          ) : null}
                        </div>
                      </Label>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 text-sm text-muted-foreground">No quick filters available.</p>
                )}

                {toggles && toggles.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <div className="space-y-3 px-2 py-1.5">
                      {toggles.map((toggle) => (
                        <div key={toggle.id} className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-sm font-medium">{toggle.label}</span>
                            {toggle.helper ? (
                              <span className="text-xs text-muted-foreground">{toggle.helper}</span>
                            ) : null}
                          </div>
                          <Switch defaultChecked={toggle.defaultOn} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            {toolbarEnd}

            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback>
                {cn(avatarFallback?.slice(0, 2).toUpperCase() || 'ST')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
