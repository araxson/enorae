import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import type { StaffQuickAction, StaffTab } from './types'

interface StaffPageNavigationProps {
  searchPlaceholder: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  quickActions?: StaffQuickAction[]
  tabs?: StaffTab[]
  activeTab: string
  onTabChange: (value: string) => void
  onOpenCommand: () => void
  onResetDateRange: () => void
}

export function StaffPageNavigation({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  quickActions,
  tabs,
  activeTab,
  onTabChange,
  onOpenCommand,
  onResetDateRange,
}: StaffPageNavigationProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="pl-9"
            />
          </div>

          {quickActions && quickActions.length > 0 ? (
            <ButtonGroup className="w-full sm:w-fit">
              {quickActions.slice(0, 2).map((action) => {
                const Icon = action.icon
                return (
                  <Button key={action.id} asChild variant="outline" className="justify-start gap-2">
                    <a href={action.href}>
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {action.label}
                    </a>
                  </Button>
                )
              })}
            </ButtonGroup>
          ) : null}
        </div>

        {tabs && tabs.length > 0 ? (
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-full min-w-max justify-start bg-muted/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled} className="gap-2">
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span>{tab.label}</span>
                      {tab.badge ? <Badge variant="secondary">{tab.badge}</Badge> : null}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </ScrollArea>
          </Tabs>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 max-lg:w-full lg:w-auto">
            <MoreHorizontal className="h-4 w-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onOpenCommand}>
            <CommandIcon className="mr-2 h-4 w-4" />
            Open command palette
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onResetDateRange}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Reset date range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
