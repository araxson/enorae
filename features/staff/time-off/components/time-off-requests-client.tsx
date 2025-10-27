'use client'

import { useState } from 'react'
import { Plus, CalendarCheck2, CalendarClock, PieChart, Users } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RequestCard } from './request-card'
import { CreateRequestDialog } from './create-request-dialog'
import type { TimeOffRequestWithStaff, TimeOffBalance, TeamTimeOffCalendar } from '@/features/staff/time-off/api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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

        {activeTab === 'balance' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Off Balance ({balance.year})</CardTitle>
                <CardDescription>Your annual time off allocation and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ItemGroup className="grid grid-cols-3 gap-4 text-center">
                    <Item variant="outline" size="sm">
                      <ItemContent>
                        <ItemTitle>{balance.total_days}</ItemTitle>
                        <ItemDescription>Total</ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item variant="outline" size="sm">
                      <ItemContent>
                        <ItemTitle>
                          <span className="text-secondary">{balance.used_days}</span>
                        </ItemTitle>
                        <ItemDescription>Used</ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item variant="outline" size="sm">
                      <ItemContent>
                        <ItemTitle>
                          <span className="text-primary">{balance.remaining_days}</span>
                        </ItemTitle>
                        <ItemDescription>Remaining</ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                  <div className="space-y-2">
                    <ItemGroup>
                      <Item>
                        <ItemContent>
                          <ItemDescription>Used: {balance.used_days} days</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <div className="text-muted-foreground text-sm font-medium">
                            {usagePercent.toFixed(0)}%
                          </div>
                        </ItemActions>
                      </Item>
                    </ItemGroup>
                    <Progress value={usagePercent} className="h-2" />
                  </div>
                  {balance.pending_days > 0 && (
                    <div className="space-y-2">
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemDescription>Pending approval: {balance.pending_days} days</ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <div className="text-muted-foreground text-sm font-medium">
                              {pendingPercent.toFixed(0)}%
                            </div>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                      <Progress value={pendingPercent} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Time Off Calendar</h3>
            {teamCalendar.length === 0 ? (
              <Card>
                <CardContent>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No upcoming time off</EmptyTitle>
                      <EmptyDescription>No upcoming team time off</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {teamCalendar.map((entry, idx) => (
                  <Card key={`${entry['staff_id']}-${idx}`}>
                    <CardContent className="space-y-3">
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemTitle>{entry['staff_name']}</ItemTitle>
                            {entry.staff_title && (
                              <ItemDescription>{entry.staff_title}</ItemDescription>
                            )}
                          </ItemContent>
                          <ItemActions>
                            <Badge variant={entry['status'] === 'approved' ? 'default' : 'secondary'}>
                              {entry['status']}
                            </Badge>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{new Date(entry.start_at).toLocaleDateString()} - {new Date(entry.end_at).toLocaleDateString()}</p>
                          <div className="capitalize">
                            <CardDescription>{entry.request_type.replace('_', ' ')}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'pending') && (
          <>
            {pendingRequests.length > 0 && activeTab === 'all' && (
              <Alert>
                <AlertTitle>{pendingRequests.length} pending request(s)</AlertTitle>
                <AlertDescription>Awaiting review</AlertDescription>
              </Alert>
            )}

            {displayedRequests.length === 0 ? (
              <Card>
                <CardContent>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No time-off requests yet</EmptyTitle>
                      <EmptyDescription>Click the New request button to submit a time-off request.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New request
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {displayedRequests.map((request) => (
                  <RequestCard key={request['id']} request={request} isStaffView />
                ))}
              </div>
            )}
          </>
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
