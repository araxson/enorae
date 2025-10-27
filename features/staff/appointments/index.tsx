import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
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
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Appointments unavailable</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error ? error.message : 'Please log in to view your appointments'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!staffProfile) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Profile not found</EmptyTitle>
                <EmptyDescription>Staff profile not found</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </section>
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
