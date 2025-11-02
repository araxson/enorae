import {
  getPlatformMetrics,
  getRecentSalons,
  getUserStats,
  getAdminOverview,
} from '../api/queries'
import { PlatformMetrics } from './platform-metrics'
import { RecentSalons } from './recent-salons'
import { UserRoleStats } from './user-role-stats'
import { AdminOverviewTabs } from './admin-overview-tabs'
import { DashboardHeader } from './dashboard-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export async function AdminDashboardPage() {
  let platformMetrics
  let recentSalons
  let userStats
  let adminOverview

  try {
    ;[platformMetrics, recentSalons, userStats, adminOverview] = await Promise.all([
      getPlatformMetrics(),
      getRecentSalons(),
      getUserStats(),
      getAdminOverview(),
    ])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error('[AdminDashboard] Error loading data:', {
      error: errorMessage,
      errorObject: error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    if (errorMessage.includes('role required') || errorMessage.includes('Unauthorized')) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>
              Admin privileges are required to view this dashboard.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Dashboard error</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <br />
            Try refreshing the page or contact support if the problem continues.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!platformMetrics || !recentSalons || !userStats || !adminOverview) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Partial data</AlertTitle>
          <AlertDescription>
            Some dashboard data is unavailable right now. Please try again shortly.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <DashboardHeader
        totalSalons={platformMetrics.totalSalons}
        pendingVerifications={platformMetrics.pendingVerifications}
      />

      <PlatformMetrics metrics={platformMetrics} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentSalons salons={recentSalons} />
        <UserRoleStats stats={userStats} />
      </div>

      <AdminOverviewTabs
        revenue={adminOverview.revenue ?? []}
        appointments={adminOverview.appointments ?? []}
        reviews={adminOverview.reviews ?? []}
        messages={adminOverview.messages ?? []}
        staff={adminOverview.staff ?? []}
      />
    </div>
  )
}
