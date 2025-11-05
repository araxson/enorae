'use client'

import { useState } from 'react'
import { Plus, CalendarCheck2, CalendarClock, PieChart, Users } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/common/components'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/common'
import { Button } from '@/components/ui/button'
import { CreateRequestDialog } from './create-request-dialog'
import { BalanceTab } from './balance-tab'
import { TeamCalendarTab } from './team-calendar-tab'
import { RequestsListTab } from './requests-list-tab'
import type { TimeOffRequestWithStaff, TimeOffBalance, TeamTimeOffCalendar } from '@/features/staff/time-off/api/queries'

interface TimeOffRequestsClientProps {
  staffId: string
  allRequests: TimeOffRequestWithStaff[]
  pendingRequests: TimeOffRequestWithStaff[]
  balance: TimeOffBalance
  teamCalendar: TeamTimeOffCalendar[]
}

export function TimeOffRequestsClient({
  staffId,
  allRequests,
  pendingRequests,
  balance,
  teamCalendar,
}: TimeOffRequestsClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const summaries: StaffSummary[] = [
    {
      id: 'remaining',
      label: 'Days remaining',
      value: balance.remaining_days.toString(),
      helper: `${balance.used_days} used, ${balance.pending_days} pending`,
      tone: balance.remaining_days < 5 ? 'warning' : 'success',
    },
    {
      id: 'pending',
      label: 'Pending requests',
      value: pendingRequests.length.toString(),
      helper: 'Awaiting review',
      tone: pendingRequests.length ? 'warning' : 'success',
    },
    {
      id: 'total',
      label: 'Total requests',
      value: allRequests.length.toString(),
      helper: 'All historical requests',
      tone: 'default',
    },
  ]

  const quickActions: StaffQuickAction[] = [
    { id: 'schedule', label: 'Review schedule', href: '/staff/schedule', icon: CalendarClock },
    { id: 'support', label: 'Contact support', href: '/staff/support', icon: CalendarCheck2 },
  ]

  const mobileCreateButton = (
    <div className="flex justify-end sm:hidden">
      <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
        <Plus className="size-4" />
        New request
      </Button>
    </div>
  )

  const tabContent = {
    all: (
      <div className="space-y-6">
        {mobileCreateButton}
        <RequestsListTab
          displayedRequests={allRequests}
          pendingRequests={pendingRequests}
          showPendingAlert
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />
      </div>
    ),
    pending: (
      <div className="space-y-6">
        {mobileCreateButton}
        <RequestsListTab
          displayedRequests={pendingRequests}
          pendingRequests={pendingRequests}
          showPendingAlert={false}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />
      </div>
    ),
    balance: (
      <div className="space-y-6">
        <BalanceTab balance={balance} />
      </div>
    ),
    team: (
      <div className="space-y-6">
        <TeamCalendarTab teamCalendar={teamCalendar} />
      </div>
    ),
  }

  return (
    <StaffPageShell
      title="Time off"
      description="Submit requests, track approvals, and stay aligned with your salon coverage."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Time off' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={[
        { value: 'all', label: 'All requests', icon: CalendarCheck2, badge: allRequests.length ? allRequests.length.toString() : undefined },
        { value: 'pending', label: 'Pending', icon: CalendarClock, badge: pendingRequests.length ? pendingRequests.length.toString() : undefined },
        { value: 'balance', label: 'Balance', icon: PieChart },
        { value: 'team', label: 'Team calendar', icon: Users },
      ]}
      defaultTab="all"
      tabContent={tabContent}
      toolbarEnd={
        <Button onClick={() => setIsCreateDialogOpen(true)} className="hidden gap-2 sm:inline-flex">
          <Plus className="size-4" />
          New request
        </Button>
      }
    >
      <CreateRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        staffId={staffId}
      />
    </StaffPageShell>
  )
}
