'use client'

import { useState } from 'react'
import { Plus, CalendarCheck2, CalendarClock, PieChart, Users } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'
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
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'balance' | 'team'>('all')

  const usagePercent = (balance.used_days / balance.total_days) * 100
  const pendingPercent = (balance.pending_days / balance.total_days) * 100

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

  const displayedRequests = activeTab === 'pending' ? pendingRequests : allRequests

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
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as typeof activeTab)}
      toolbarEnd={
        <Button onClick={() => setIsCreateDialogOpen(true)} className="hidden gap-2 sm:inline-flex">
          <Plus className="size-4" />
          New request
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-end sm:hidden">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="size-4" />
            New request
          </Button>
        </div>

        {activeTab === 'balance' && <BalanceTab balance={balance} />}

        {activeTab === 'team' && <TeamCalendarTab teamCalendar={teamCalendar} />}

        {(activeTab === 'all' || activeTab === 'pending') && (
          <RequestsListTab
            displayedRequests={displayedRequests}
            pendingRequests={pendingRequests}
            showPendingAlert={activeTab === 'all'}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        )}
      </div>

      <CreateRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        staffId={staffId}
      />
    </StaffPageShell>
  )
}
