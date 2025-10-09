'use client'

import { useState } from 'react'
import { Plus, CalendarCheck2, CalendarClock } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/shared/components/types'
import { P, Small } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { RequestCard } from './request-card'
import { CreateRequestDialog } from './create-request-dialog'
import type { TimeOffRequestWithStaff } from '../api/queries'

interface TimeOffRequestsClientProps {
  staffId: string
  allRequests: TimeOffRequestWithStaff[]
  pendingRequests: TimeOffRequestWithStaff[]
}

export function TimeOffRequestsClient({
  staffId,
  allRequests,
  pendingRequests,
}: TimeOffRequestsClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')

  const summaries: StaffSummary[] = [
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
      ]}
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as typeof activeTab)}
      toolbarEnd={
        <Button onClick={() => setIsCreateDialogOpen(true)} className="hidden gap-2 sm:inline-flex">
          <Plus className="h-4 w-4" />
          New request
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-end sm:hidden">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New request
          </Button>
        </div>

        {pendingRequests.length > 0 && (
          <div className="rounded-lg border bg-secondary/10 p-4">
            <Small className="font-semibold">
              {pendingRequests.length} pending request(s) awaiting review
            </Small>
          </div>
        )}

        {displayedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background py-12 text-center">
            <P className="text-muted-foreground">No time-off requests yet</P>
            <P className="text-sm text-muted-foreground">
              Click the New request button to submit a time-off request
            </P>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayedRequests.map((request) => (
              <RequestCard key={request.id} request={request} isStaffView />
            ))}
          </div>
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

