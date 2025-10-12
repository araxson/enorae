'use client'

import { useMemo, useState } from 'react'
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Muted, P } from '@/components/ui/typography'
import type { CommissionData, DailyEarnings, ServiceRevenue, CommissionRate, PayoutSchedule } from '../api/queries'
import { EarningsChart } from './earnings-chart'
import { ServiceBreakdown } from './service-breakdown'

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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${commission.todayEarnings.toFixed(2)}</div>
          <Muted className="text-xs">Revenue from completed appointments</Muted>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${commission.weekEarnings.toFixed(2)}</div>
          <Muted className="text-xs">Week-to-date earnings</Muted>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${commission.monthEarnings.toFixed(2)}</div>
          <Muted className="text-xs">Monthly revenue total</Muted>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Per Appointment</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${commission.avgPerAppointment.toFixed(2)}</div>
          <Muted className="text-xs">{commission.totalAppointments} appointments this month</Muted>
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
          <CardContent className="space-y-4">
            <P className="text-sm text-muted-foreground">
              Your commission is calculated based on completed appointments. The figures shown represent the total service revenue from appointments you&apos;ve completed.
            </P>
            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <div>
                <Muted className="text-xs uppercase">Completed appointments</Muted>
                <P className="text-lg font-semibold">{commission.totalAppointments}</P>
              </div>
              <div>
                <Muted className="text-xs uppercase">Month revenue</Muted>
                <P className="text-lg font-semibold">${commission.monthEarnings.toFixed(2)}</P>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffPageShell>
  )
}

