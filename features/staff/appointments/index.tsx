import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  getStaffProfile,
  getTodayAppointments,
  getUpcomingAppointments,
  getPastAppointments,
} from './api/queries'
import { AppointmentsClient } from './components/appointments-client'

export async function StaffAppointments() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Appointments unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view your appointments'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!staffProfile) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </div>
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
    <AppointmentsClient
      todayAppts={todayAppts}
      upcomingAppts={upcomingAppts}
      pastAppts={pastAppts}
    />
  )
}
