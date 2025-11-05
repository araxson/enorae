'use client'

import { useMemo } from 'react'
import { Clock, Calendar } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/common/components'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/common'
import { StaffMetrics, TodaySchedule, UpcomingAppointments } from '@/features/staff/dashboard/components'
import { RoleBadge } from './role-badge'
import { RefreshButton, LastUpdated } from '@/features/shared/ui'
import type { AppointmentWithDetails } from '@/features/shared/appointments/api/types'
import type { StaffMetricsSummary } from '@/features/staff/dashboard/api/queries'

type Props = {
  roleLevel: string | null | undefined
  metrics: StaffMetricsSummary
  todayAppointments: AppointmentWithDetails[]
  upcomingAppointments: AppointmentWithDetails[]
}

export function JuniorDashboard({
  roleLevel,
  metrics,
  todayAppointments,
  upcomingAppointments,
}: Props) {
  const summaries: StaffSummary[] = useMemo(() => {
    const upcomingCount = upcomingAppointments.length
    return [
      {
        id: 'today',
        label: "Today's bookings",
        value: metrics.todayAppointments.toString(),
        helper: 'Scheduled for today',
        tone: metrics.todayAppointments > 3 ? 'success' : 'info',
      },
      {
        id: 'week',
        label: 'This week',
        value: metrics.weekAppointments.toString(),
        helper: 'Confirmed appointments',
        tone: metrics.weekAppointments >= 10 ? 'success' : 'default',
      },
      {
        id: 'upcoming',
        label: 'Upcoming',
        value: upcomingCount.toString(),
        helper: 'Next 7 days',
        tone: upcomingCount === 0 ? 'warning' : 'info',
      },
    ]
  }, [metrics.todayAppointments, metrics.weekAppointments, upcomingAppointments.length])

  const quickActions: StaffQuickAction[] = [
    { id: 'appointments', label: 'View schedule', href: '/staff/appointments', icon: Clock },
    { id: 'clients', label: 'Client list', href: '/staff/clients', icon: Calendar },
  ]

  const tabs = [
    { value: 'overview', label: 'Overview', icon: Clock },
    { value: 'upcoming', label: 'Upcoming', icon: Calendar },
  ]

  const tabContent = {
    overview: (
      <div className="space-y-6">
        <StaffMetrics metrics={metrics} />
        <TodaySchedule appointments={todayAppointments} />
      </div>
    ),
    upcoming: (
      <div className="space-y-6">
        <UpcomingAppointments appointments={upcomingAppointments} />
      </div>
    ),
  }

  return (
    <StaffPageShell
      title="Daily focus"
      description="Track the essentials you need to stay on schedule."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Dashboard' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={tabs}
      defaultTab="overview"
      tabContent={tabContent}
      toolbarEnd={
        <div className="hidden items-center gap-2 sm:flex">
          <RoleBadge roleLevel={roleLevel} />
          <LastUpdated />
          <RefreshButton />
        </div>
      }
    />
  )
}
