'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, Clock, Calendar, Users } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/shared/components/types'
import { RoleBadge } from './role-badge'
import { CommissionSummary } from './commission-summary'
import { StaffMetrics } from '../components/staff-metrics'
import { TodaySchedule } from '../components/today-schedule'
import { UpcomingAppointments } from '../components/upcoming-appointments'
import { RefreshButton, LastUpdated } from '@/components/shared'
import type { AppointmentWithDetails } from '@/lib/types/app.types'
import type { StaffCommissionSummary, StaffMetricsSummary } from '../api/queries'

type Props = {
  roleLevel: string | null | undefined
  metrics: StaffMetricsSummary
  todayAppointments: AppointmentWithDetails[]
  upcomingAppointments: AppointmentWithDetails[]
  commission: StaffCommissionSummary | null
}

export function FullDashboard({
  roleLevel,
  metrics,
  todayAppointments,
  upcomingAppointments,
  commission,
}: Props) {
  const [activeTab, setActiveTab] = useState('overview')

  const summaries: StaffSummary[] = useMemo(() => {
    const upcomingCount = upcomingAppointments.length
    return [
      {
        id: 'today',
        label: "Today's appointments",
        value: metrics.todayAppointments.toString(),
        helper: 'Scheduled for today',
        tone: metrics.todayAppointments > 4 ? 'success' : 'default',
      },
      {
        id: 'week',
        label: 'This week',
        value: metrics.weekAppointments.toString(),
        helper: 'Total appointments',
        tone: metrics.weekAppointments >= 15 ? 'success' : 'info',
      },
      {
        id: 'month-complete',
        label: 'Completed this month',
        value: metrics.monthCompleted.toString(),
        helper: 'Goal: 50 appointments',
        tone: metrics.monthCompleted >= 25 ? 'success' : 'default',
      },
      {
        id: 'upcoming',
        label: 'Upcoming',
        value: upcomingCount.toString(),
        helper: 'Across the next 14 days',
        tone: upcomingCount === 0 ? 'warning' : 'info',
      },
    ]
  }, [metrics.monthCompleted, metrics.todayAppointments, metrics.weekAppointments, upcomingAppointments.length])

  const quickActions: StaffQuickAction[] = [
    { id: 'appointments', label: 'Open appointments', href: '/staff/appointments' },
    { id: 'clients', label: 'Top clients', href: '/staff/clients', icon: Users },
    { id: 'schedule', label: 'Manage schedule', href: '/staff/schedule' },
  ]

  const tabs = [
    { value: 'overview', label: 'Overview', icon: TrendingUp },
    { value: 'today', label: "Today’s agenda", icon: Clock },
    { value: 'upcoming', label: 'Upcoming', icon: Calendar },
  ]

  const roleDescription = roleLevel ? `Role: ${roleLevel.replace('_', ' ')}` : undefined

  return (
    <StaffPageShell
      title="Team performance"
      description={roleDescription}
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Dashboard' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      toolbarEnd={
        <div className="hidden items-center gap-2 sm:flex">
          <RoleBadge roleLevel={roleLevel} />
          <LastUpdated />
          <RefreshButton />
        </div>
      }
    >
      <div className="space-y-6">
        {commission ? <CommissionSummary commission={commission} /> : null}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StaffMetrics metrics={metrics} />
            <div className="grid gap-6 lg:grid-cols-2">
              <TodaySchedule appointments={todayAppointments} />
              <UpcomingAppointments appointments={upcomingAppointments} />
            </div>
          </div>
        )}

        {activeTab === 'today' && (
          <div className="space-y-6">
            <TodaySchedule appointments={todayAppointments} />
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <UpcomingAppointments appointments={upcomingAppointments} />
          </div>
        )}
      </div>
    </StaffPageShell>
  )
}

