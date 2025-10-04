import { getPlatformMetrics, getRecentSalons, getUserStats, getAdminOverview } from './api/queries'
import { PlatformMetrics } from './components/platform-metrics'
import { RecentSalons } from './components/recent-salons'
import { UserRoleStats } from './components/user-role-stats'
import { AdminOverviewTabs } from './components/admin-overview-tabs'
import { Section, Stack, Box, Grid, Group } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RefreshButton, LastUpdated } from '@/components/dashboard'

export async function AdminDashboard() {
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log error for monitoring and debugging
    console.error('[AdminDashboard] Error loading data:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    // Better error messages based on error type
    if (errorMessage.includes('role required') || errorMessage.includes('Unauthorized')) {
      return (
        <Section size="lg">
          <Stack gap="md">
            <H1>Access Denied</H1>
            <Lead>Admin privileges required to access this dashboard.</Lead>
          </Stack>
        </Section>
      )
    }

    // Generic error fallback
    return (
      <Section size="lg">
        <Stack gap="md">
          <H1>Error Loading Dashboard</H1>
          <Lead>Failed to load dashboard data. Please try refreshing the page.</Lead>
        </Stack>
      </Section>
    )
  }

  // Null safety checks
  if (!platformMetrics || !recentSalons || !userStats || !adminOverview) {
    return (
      <Section size="lg">
        <Stack gap="md">
          <H1>Platform Administration</H1>
          <Lead>Unable to load dashboard data. Some data may be unavailable.</Lead>
        </Stack>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box className="flex items-center justify-between">
          <Box>
            <H1>Platform Administration</H1>
            <Lead>Monitor and manage the Enorae platform</Lead>
          </Box>
          <Group gap="sm">
            <LastUpdated />
            <RefreshButton />
            <Button asChild>
              <Link href="/admin/chains">Manage Chains</Link>
            </Button>
          </Group>
        </Box>

        <Stack gap="lg">
          <PlatformMetrics metrics={platformMetrics} />
          <Grid cols={{ base: 1, lg: 2 }} gap="lg">
            <RecentSalons salons={recentSalons} />
            <UserRoleStats stats={userStats} />
          </Grid>
          <AdminOverviewTabs
            revenue={adminOverview.revenue ?? []}
            appointments={adminOverview.appointments ?? []}
            reviews={adminOverview.reviews ?? []}
            inventory={adminOverview.inventory ?? []}
            messages={adminOverview.messages ?? []}
            staff={adminOverview.staff ?? []}
          />
        </Stack>
      </Stack>
    </Section>
  )
}
