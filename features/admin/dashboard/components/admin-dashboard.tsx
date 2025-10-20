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
import { DashboardHero } from './dashboard-hero'
import { DashboardError } from './dashboard-error'

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
        <DashboardError
          variant="destructive"
          title="Access denied"
          description="Admin privileges are required to view this dashboard."
        />
      )
    }

    return (
      <DashboardError
        variant="destructive"
        title="Dashboard error"
        description={
          <>
            {errorMessage}
            <br />
            Try refreshing the page or contact support if the problem continues.
          </>
        }
      />
    )
  }

  if (!platformMetrics || !recentSalons || !userStats || !adminOverview) {
    return (
      <DashboardError
        title="Partial data"
        description="Some dashboard data is unavailable right now. Please try again shortly."
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <DashboardHero metrics={platformMetrics} />
      <PlatformMetrics metrics={platformMetrics} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentSalons salons={recentSalons} />
        <UserRoleStats stats={userStats} />
      </div>

      <AdminOverviewTabs
        revenue={adminOverview.revenue ?? []}
        appointments={adminOverview.appointments ?? []}
        reviews={adminOverview.reviews ?? []}
        inventory={adminOverview.inventory ?? []}
        messages={adminOverview.messages ?? []}
        staff={adminOverview.staff ?? []}
      />
    </div>
  )
}
