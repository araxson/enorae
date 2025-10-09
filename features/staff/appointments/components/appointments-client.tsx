'use client'

import { useCallback, useMemo, useState } from 'react'
import { CalendarDays, History, Clock3 } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/shared/components/types'
import type { StaffAppointment } from '../api/queries'
import { AppointmentStats } from './appointment-stats'
import { AppointmentFilters } from './appointment-filters'
import { AppointmentsList } from './appointments-list'

type AppointmentsClientProps = {
  todayAppts: StaffAppointment[]
  upcomingAppts: StaffAppointment[]
  pastAppts: StaffAppointment[]
}

export function AppointmentsClient({
  todayAppts,
  upcomingAppts,
  pastAppts,
}: AppointmentsClientProps) {
  const [activeTab, setActiveTab] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filterAppointments = useCallback(
    (appointments: StaffAppointment[]) => {
      return appointments.filter((appt) => {
        const matchesSearch =
          !searchQuery ||
          appt.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || appt.status === statusFilter

        return matchesSearch && matchesStatus
      })
    },
    [searchQuery, statusFilter]
  )

  const filteredToday = useMemo(() => filterAppointments(todayAppts), [todayAppts, filterAppointments])
  const filteredUpcoming = useMemo(() => filterAppointments(upcomingAppts), [upcomingAppts, filterAppointments])
  const filteredPast = useMemo(() => filterAppointments(pastAppts), [pastAppts, filterAppointments])

  const activeAppointments =
    activeTab === 'today'
      ? filteredToday
      : activeTab === 'upcoming'
        ? filteredUpcoming
        : filteredPast

  const summaries: StaffSummary[] = [
    {
      id: 'today',
      label: "Today's appointments",
      value: filteredToday.length.toString(),
      helper: `${todayAppts.length} total scheduled`,
      tone: filteredToday.length > 3 ? 'success' : 'info',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      value: filteredUpcoming.length.toString(),
      helper: 'Next 14 days',
      tone: filteredUpcoming.length === 0 ? 'warning' : 'default',
    },
    {
      id: 'past',
      label: 'Past 20',
      value: filteredPast.length.toString(),
      helper: 'Recently completed',
      tone: 'default',
    },
  ]

  const quickActions: StaffQuickAction[] = [
    { id: 'schedule', label: 'Schedule view', href: '/staff/schedule', icon: CalendarDays },
    { id: 'time-off', label: 'Request time off', href: '/staff/time-off', icon: History },
    { id: 'services', label: 'Edit services', href: '/staff/services', icon: Clock3 },
  ]

  const tabs = [
    { value: 'today', label: "Today", icon: Clock3, badge: filteredToday.length ? filteredToday.length.toString() : undefined },
    { value: 'upcoming', label: 'Upcoming', icon: CalendarDays, badge: filteredUpcoming.length ? filteredUpcoming.length.toString() : undefined },
    { value: 'past', label: 'Past', icon: History, badge: filteredPast.length ? filteredPast.length.toString() : undefined },
  ]

  return (
    <StaffPageShell
      title="Appointments"
      description="Review and manage every booking across your schedule."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Appointments' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="Search by client or email…"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      filters={[
        { id: 'actionable', label: 'Only actionable', defaultChecked: statusFilter !== 'completed' && statusFilter !== 'all' },
      ]}
      toggles={[
        { id: 'auto-refresh', label: 'Auto refresh', helper: 'Reload every 2 minutes', defaultOn: true },
      ]}
    >
      <div className="space-y-6">
        <AppointmentStats appointments={activeAppointments} />

        <AppointmentFilters
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
          showSearch={false}
        />

        {activeTab === 'today' && (
          <AppointmentsList appointments={filteredToday} title="Today's Appointments" showActions />
        )}

        {activeTab === 'upcoming' && (
          <AppointmentsList appointments={filteredUpcoming} title="Upcoming Appointments" showActions />
        )}

        {activeTab === 'past' && (
          <AppointmentsList appointments={filteredPast} title="Past Appointments" showActions={false} />
        )}
      </div>
    </StaffPageShell>
  )
}

