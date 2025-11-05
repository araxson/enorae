'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Command as CommandIcon, MoreHorizontal, CalendarDays } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import type { StaffQuickAction, StaffTab } from '../api/types'

interface StaffPageNavigationProps {
  searchPlaceholder: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  quickActions?: readonly StaffQuickAction[]
  tabs?: readonly StaffTab[]
  onOpenCommand: () => void
  onResetDateRange: () => void
}

export function StaffPageNavigation({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  quickActions,
  tabs,
  onOpenCommand,
  onResetDateRange,
}: StaffPageNavigationProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(event) => onSearchChange?.(event.target.value)}
              aria-label="Search staff content"
            />
          </InputGroup>

          {quickActions && quickActions.length > 0 ? (
            <ButtonGroup aria-label="Actions">
              {quickActions.slice(0, 2).map((action) => {
                const Icon = action.icon
                return (
                  <Button key={action.id} asChild variant="outline" className="justify-start gap-2">
                    <a href={action.href}>
                      {Icon ? <Icon className="size-4" /> : null}
                      {action.label}
                    </a>
                  </Button>
                )
              })}
            </ButtonGroup>
          ) : null}
        </div>

        {tabs && tabs.length > 0 ? (
          <ScrollArea className="w-full">
            <TabsList>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
                    <span className="flex items-center gap-2">
                      {Icon ? <Icon className="size-4" /> : null}
                      <span>{tab.label}</span>
                      {tab.badge ? <Badge variant="secondary">{tab.badge}</Badge> : null}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </ScrollArea>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 max-lg:w-full lg:w-auto">
            <MoreHorizontal className="size-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onOpenCommand}>
            <CommandIcon className="mr-2 size-4" />
            Open command palette
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onResetDateRange}>
            <CalendarDays className="mr-2 size-4" />
            Reset date range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
