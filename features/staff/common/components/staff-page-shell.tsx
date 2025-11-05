'use client'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { StaffPageShellProps } from '../api/types'
import { StaffPageHeading } from './staff-page-heading'
import { StaffPageNavigation } from './staff-page-navigation'
import { StaffSummaryGrid } from './staff-summary-grid'
import { StaffCommandDialog } from './staff-command-dialog'

export function StaffPageShell({
  title,
  description,
  breadcrumbs,
  tabs,
  defaultTab,
  activeTab: activeTabProp,
  onTabChange,
  summaries,
  quickActions,
  filters,
  toggles,
  avatarUrl,
  avatarFallback,
  searchPlaceholder = 'Search within this view…',
  searchValue,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  tabContent,
  children,
  className,
  toolbarEnd,
}: StaffPageShellProps) {
  const [localTab, setLocalTab] = useState(defaultTab ?? tabs?.[0]?.value ?? '')
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [range, setRange] = useState<DateRange | null>(dateRange ?? null)
  const [localSearch, setLocalSearch] = useState(searchValue ?? '')

  const handleTabChange = (value: string) => {
    if (!activeTabProp) {
      setLocalTab(value)
    }
    onTabChange?.(value)
  }

  const handleDateChange = (nextRange: DateRange | null) => {
    setRange(nextRange)
    onDateRangeChange?.(nextRange)
  }

  const handleResetRange = () => {
    setRange(null)
    onDateRangeChange?.(null)
  }

  const hasTabs = Array.isArray(tabs) && tabs.length > 0
  const hasTabPanels =
    hasTabs && tabContent && Object.keys(tabContent).length > 0
  const currentTab = activeTabProp ?? localTab ?? tabs?.[0]?.value ?? ''
  const resolvedSearchValue = onSearchChange ? searchValue : localSearch

  const shellContent = (
    <div className={cn('space-y-6', className)}>
      <StaffPageHeading
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        filters={filters}
        toggles={toggles}
        avatarUrl={avatarUrl}
        avatarFallback={avatarFallback}
        dateRange={range}
        onDateRangeChange={handleDateChange}
        onOpenCommand={() => setIsCommandOpen(true)}
        toolbarEnd={toolbarEnd}
      />

      <StaffPageNavigation
        searchPlaceholder={searchPlaceholder}
        searchValue={resolvedSearchValue}
        onSearchChange={onSearchChange ?? setLocalSearch}
        quickActions={quickActions}
        tabs={tabs}
        onOpenCommand={() => setIsCommandOpen(true)}
        onResetDateRange={handleResetRange}
      />

      <StaffSummaryGrid summaries={summaries} />

      <Separator />

      {hasTabs ? (
        hasTabPanels ? (
          tabs?.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <section>{tabContent?.[tab.value] ?? null}</section>
            </TabsContent>
          ))
        ) : (
          <TabsContent value={currentTab}>
            <section>{children}</section>
          </TabsContent>
        )
      ) : (
        <section>{children}</section>
      )}

      <StaffCommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen} quickActions={quickActions} />

      {hasTabPanels ? children : null}
    </div>
  )

  if (hasTabs) {
    return (
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        {shellContent}
      </Tabs>
    )
  }

  return shellContent
}
