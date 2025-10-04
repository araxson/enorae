

import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getStaffProfile,
  getTodayAppointments,
  getUpcomingAppointments,
  getPastAppointments,
} from './api/queries'
import { AppointmentsClient } from './components/appointments-client'
import { AppointmentsSkeleton } from './components/appointments-skeleton'

export async function StaffAppointments() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your appointments'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Fetch all appointment lists in parallel
  const staff = staffProfile as { id: string }
  const [todayAppts, upcomingAppts, pastAppts] = await Promise.all([
    getTodayAppointments(staff.id),
    getUpcomingAppointments(staff.id),
    getPastAppointments(staff.id, 20),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>My Appointments</H1>
          <Lead>Manage your daily bookings and track appointment status</Lead>
        </div>

        <AppointmentsClient
          todayAppts={todayAppts}
          upcomingAppts={upcomingAppts}
          pastAppts={pastAppts}
        />
      </Stack>
    </Section>
  )
}

export function StaffAppointmentsSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded animate-pulse" />
        </div>
        <AppointmentsSkeleton />
      </Stack>
    </Section>
  )
}
