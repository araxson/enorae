'use client'

import { useState, useMemo, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stack } from '@/components/layout'
import type { StaffAppointment } from '../api/queries'
import { AppointmentsList } from './appointments-list'
import { AppointmentStats } from './appointment-stats'
import { AppointmentFilters } from './appointment-filters'

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

  const filteredToday = useMemo(() => filterAppointments(todayAppts), [
    todayAppts,
    filterAppointments,
  ])
  const filteredUpcoming = useMemo(() => filterAppointments(upcomingAppts), [
    upcomingAppts,
    filterAppointments,
  ])
  const filteredPast = useMemo(() => filterAppointments(pastAppts), [
    pastAppts,
    filterAppointments,
  ])

  const activeAppointments =
    activeTab === 'today'
      ? filteredToday
      : activeTab === 'upcoming'
        ? filteredUpcoming
        : filteredPast

  return (
    <Stack gap="xl">
      <AppointmentStats appointments={activeAppointments} />

      <AppointmentFilters onSearchChange={setSearchQuery} onStatusChange={setStatusFilter} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">
            Today {filteredToday.length > 0 && `(${filteredToday.length})`}
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming {filteredUpcoming.length > 0 && `(${filteredUpcoming.length})`}
          </TabsTrigger>
          <TabsTrigger value="past">
            Past {filteredPast.length > 0 && `(${filteredPast.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <AppointmentsList
            appointments={filteredToday}
            title="Today's Appointments"
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="upcoming">
          <AppointmentsList
            appointments={filteredUpcoming}
            title="Upcoming Appointments"
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="past">
          <AppointmentsList
            appointments={filteredPast}
            title="Past Appointments"
            showActions={false}
          />
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
