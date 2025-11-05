import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import type {
  StaffBreadcrumb,
  StaffFilter,
  StaffToggle,
} from '../api/types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { StaffPageBreadcrumbs } from './staff-page-breadcrumbs'
import { StaffPageToolbar } from './staff-page-toolbar'

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
  return (
    <div className="space-y-4">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <StaffPageBreadcrumbs breadcrumbs={breadcrumbs} />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ItemGroup className="gap-2">
          <Item className="items-center gap-2">
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <div className="hidden sm:flex">
              <ItemActions>
                <Sparkles className="size-3.5" aria-hidden="true" />
                <Badge variant="secondary">Staff Portal</Badge>
              </ItemActions>
            </div>
          </Item>
          {description ? (
            <Item>
              <ItemContent>
                <div className="max-w-2xl">
                  <ItemDescription>{description}</ItemDescription>
                </div>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>

        <StaffPageToolbar
          filters={filters}
          toggles={toggles}
          avatarUrl={avatarUrl}
          avatarFallback={avatarFallback}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          onOpenCommand={onOpenCommand}
          toolbarEnd={toolbarEnd}
        />
      </div>
    </div>
  )
}
