import { redirect } from 'next/navigation'
import {
  getStaffProfile,
  getTodayAppointments,
  getUpcomingAppointments,
  getStaffMetrics,
  getStaffCommission,
} from './api/queries'
import { getStaffRoleLevel } from '@/lib/auth'
import { JuniorDashboard } from './sections/junior-dashboard'
import { FullDashboard } from './sections/full-dashboard'
import { ErrorState, MissingProfileState } from './sections/error-state'

export async function StaffDashboard() {
  let staffProfile
  let roleLevel

  try {
    staffProfile = await getStaffProfile()
    roleLevel = await getStaffRoleLevel()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StaffDashboard] Error loading profile:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      redirect('/login?redirect=/staff')
    }

    return <ErrorState message="We couldn't load your staff profile. Please try refreshing the page." retryHref="/staff" />
  }

  if (!staffProfile || !staffProfile.id) {
    return <MissingProfileState />
  }

  try {
    const [todayAppointments, upcomingAppointments, metrics, commission] = await Promise.all([
      getTodayAppointments(staffProfile.id),
      getUpcomingAppointments(staffProfile.id),
      getStaffMetrics(staffProfile.id),
      roleLevel !== 'junior' ? getStaffCommission(staffProfile.id) : Promise.resolve(null),
    ])

    if (roleLevel === 'junior') {
      return (
        <JuniorDashboard
          roleLevel={roleLevel}
          metrics={metrics}
          todayAppointments={todayAppointments}
          upcomingAppointments={upcomingAppointments}
        />
      )
    }

    return (
      <FullDashboard
        roleLevel={roleLevel}
        metrics={metrics}
        todayAppointments={todayAppointments}
        upcomingAppointments={upcomingAppointments}
        commission={commission}
      />
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StaffDashboard] Error loading data:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return (
      <ErrorState
        message="We couldn't load your dashboard data. Please try refreshing the page."
        retryHref="/staff"
      />
    )
  }
}
