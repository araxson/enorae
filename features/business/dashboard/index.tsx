import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getDashboardMetrics, getRecentAppointments, getUserSalon, getMultiLocationMetrics, getUserSalonIds } from './api/queries'
import { MetricsCards } from './components/metrics-cards'
import { RecentBookings } from './components/recent-bookings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Section, Stack, Box, Group, Grid } from '@/components/layout'
import { H1, Lead, Small } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Calendar, TrendingUp, Store, ShieldAlert, Building2 } from 'lucide-react'
import { getUserRole } from '@/lib/auth'
import { RefreshButton, LastUpdated } from '@/components/dashboard'

export { DashboardSkeleton } from './components/dashboard-skeleton'

export async function BusinessDashboard() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Redirect to login if not authenticated
    if (errorMessage.includes('Authentication required')) {
      redirect('/login?redirect=/business/dashboard')
    }

    // Show access denied for role-based errors
    if (errorMessage.includes('role required')) {
      return (
        <Section size="lg">
          <EmptyState
            icon={ShieldAlert}
            title="Access Denied"
            description="You don't have permission to access the business dashboard. Please contact your administrator."
            action={
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
            }
          />
        </Section>
      )
    }

    // Re-throw other errors to be caught by error boundary
    throw error
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <EmptyState
          icon={Store}
          title="No Salon Found"
          description="You need to create or be assigned to a salon to access the dashboard"
          action={
            <Button asChild>
              <Link href="/business/settings/salon">Create Salon</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  // Check if user is tenant owner with multiple locations
  const userRole = await getUserRole()
  const isTenantOwner = userRole === 'tenant_owner'

  let metrics
  let multiLocationMetrics
  let salonIds: string[] = []

  try {
    if (isTenantOwner) {
      // Get multi-location data for tenant owners
      ;[multiLocationMetrics, salonIds] = await Promise.all([
        getMultiLocationMetrics(),
        getUserSalonIds(),
      ])
      // Still get single salon metrics for comparison
      metrics = await getDashboardMetrics(salon.id)
    } else {
      metrics = await getDashboardMetrics(salon.id)
    }
  } catch (error) {
    console.error('[BusinessDashboard] Error loading metrics:', error)
    // Provide default empty metrics
    metrics = {
      totalAppointments: 0,
      confirmedAppointments: 0,
      pendingAppointments: 0,
      totalStaff: 0,
      totalServices: 0,
    }
  }

  let recentAppointments
  try {
    recentAppointments = await getRecentAppointments(salon.id)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading appointments:', error)
    recentAppointments = []
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box className="flex items-center justify-between">
          <Box>
            <Group gap="sm" className="items-center">
              <H1>{salon.name || 'Business'} Dashboard</H1>
              {isTenantOwner && multiLocationMetrics && (
                <Badge variant="secondary" className="gap-1">
                  <Building2 className="h-3 w-3" />
                  {multiLocationMetrics.totalLocations} Locations
                </Badge>
              )}
            </Group>
            <Lead>Manage your salon business</Lead>
          </Box>
          <Group gap="sm">
            <LastUpdated />
            <RefreshButton />
          </Group>
        </Box>

        {isTenantOwner && multiLocationMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Chain Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={{ base: 2, md: 3, lg: 5 }} gap="lg">
                <Box>
                  <Small className="text-muted-foreground">Total Locations</Small>
                  <div className="text-2xl font-bold">{multiLocationMetrics.totalLocations}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Total Appointments</Small>
                  <div className="text-2xl font-bold">{multiLocationMetrics.totalAppointments}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Confirmed</Small>
                  <div className="text-2xl font-bold">{multiLocationMetrics.confirmedAppointments}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Total Staff</Small>
                  <div className="text-2xl font-bold">{multiLocationMetrics.totalStaff}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Total Services</Small>
                  <div className="text-2xl font-bold">{multiLocationMetrics.totalServices}</div>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3" aria-label="Dashboard sections">
            <TabsTrigger value="overview" aria-label="View overview dashboard">
              <Group gap="xs">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Overview
              </Group>
            </TabsTrigger>
            <TabsTrigger value="appointments" aria-label="View appointments list">
              <Group gap="xs">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Appointments
              </Group>
            </TabsTrigger>
            <TabsTrigger value="analytics" aria-label="View analytics dashboard">
              <Group gap="xs">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Analytics
              </Group>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Stack gap="lg">
              <MetricsCards metrics={metrics} />
              <RecentBookings appointments={recentAppointments} />
            </Stack>
          </TabsContent>

          <TabsContent value="appointments">
            <RecentBookings appointments={recentAppointments} />
          </TabsContent>

          <TabsContent value="analytics">
            <MetricsCards metrics={metrics} />
          </TabsContent>
        </Tabs>
      </Stack>
    </Section>
  )
}
