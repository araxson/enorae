'use client'

import { useMemo, useState } from 'react'
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CommissionData, DailyEarnings, ServiceRevenue, CommissionRate, PayoutSchedule } from '@/features/staff/commission/api/queries'
import { EarningsChart } from './earnings-chart'
import { ServiceBreakdown } from './service-breakdown'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export interface CommissionClientProps {
  staffId: string
  commission: CommissionData
  dailyEarnings: DailyEarnings[]
  serviceBreakdown: ServiceRevenue[]
  commissionRates: CommissionRate[]
  payoutSchedule: PayoutSchedule[]
}

export function CommissionClient({ commission, dailyEarnings, serviceBreakdown }: CommissionClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services'>('overview')

  const summaries: StaffSummary[] = useMemo(() => {
    return [
      {
        id: 'today',
        label: "Today's earnings",
        value: `$${commission.todayEarnings.toFixed(2)}`,
        helper: 'Completed appointments',
        tone: commission.todayEarnings > 0 ? 'success' : 'default',
      },
      {
        id: 'week',
        label: 'This week',
        value: `$${commission.weekEarnings.toFixed(2)}`,
        helper: 'Week-to-date',
        tone: commission.weekEarnings > 600 ? 'success' : 'info',
      },
      {
        id: 'month',
        label: 'This month',
        value: `$${commission.monthEarnings.toFixed(2)}`,
        helper: `${commission.totalAppointments} appointments`,
        tone: commission.monthEarnings > 2000 ? 'success' : 'default',
      },
    ]
  }, [commission.monthEarnings, commission.todayEarnings, commission.totalAppointments, commission.weekEarnings])

  const quickActions: StaffQuickAction[] = [
    { id: 'appointments', label: 'Review appointments', href: '/staff/appointments', icon: Calendar },
    { id: 'services', label: 'Optimize services', href: '/staff/services', icon: PieChart },
    { id: 'schedule', label: 'Adjust availability', href: '/staff/schedule', icon: TrendingUp },
  ]

  const metricsCards = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Today&apos;s earnings</ItemTitle>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">${commission.todayEarnings.toFixed(2)}</div>
          <CardDescription>Revenue from completed appointments</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>This week</ItemTitle>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">${commission.weekEarnings.toFixed(2)}</div>
          <CardDescription>Week-to-date earnings</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>This month</ItemTitle>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">${commission.monthEarnings.toFixed(2)}</div>
          <CardDescription>Monthly revenue total</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Average per appointment</ItemTitle>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">${commission.avgPerAppointment.toFixed(2)}</div>
          <CardDescription>{commission.totalAppointments} appointments this month</CardDescription>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <StaffPageShell
      title="Commission"
      description="Track earnings trends, service performance, and goal progress."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Commission' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={[
        { value: 'overview', label: 'Overview', icon: DollarSign },
        { value: 'services', label: 'Services', icon: PieChart, badge: serviceBreakdown.length ? serviceBreakdown.length.toString() : undefined },
      ]}
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as typeof activeTab)}
      toggles={[
        { id: 'include-tips', label: 'Include tips', helper: 'Display tip income in totals', defaultOn: true },
      ]}
    >
      <div className="space-y-6">
        {metricsCards}

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EarningsChart data={dailyEarnings} />
            <ServiceBreakdown data={serviceBreakdown} />
          </div>
        ) : (
          <ServiceBreakdown data={serviceBreakdown} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Commission summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CardDescription>
                Your commission is calculated based on completed appointments. The figures shown represent the total service revenue from appointments you&apos;ve completed.
              </CardDescription>
              <ItemGroup className="grid gap-4 pt-4 md:grid-cols-2">
                <Item variant="outline" size="sm">
                  <ItemContent>
                    <ItemTitle>{commission.totalAppointments}</ItemTitle>
                    <ItemDescription>Completed appointments</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline" size="sm">
                  <ItemContent>
                    <ItemTitle>${commission.monthEarnings.toFixed(2)}</ItemTitle>
                    <ItemDescription>Month revenue</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffPageShell>
  )
}
