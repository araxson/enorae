import {
  getStaffProfile,
  getTodayAppointments,
  getUpcomingAppointments,
  getStaffMetrics,
  getStaffCommission,
} from './api/queries'
import { StaffMetrics } from './components/staff-metrics'
import { TodaySchedule } from './components/today-schedule'
import { UpcomingAppointments } from './components/upcoming-appointments'
import { Section, Stack, Box, Grid } from '@/components/layout'
import { H1, Lead, Muted } from '@/components/ui/typography'
import { Calendar, Clock, TrendingUp, DollarSign, AlertCircle, UserX } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Group } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStaffRoleLevel } from '@/lib/auth'
import type { StaffView } from '@/lib/types/app.types'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RefreshButton, LastUpdated } from '@/components/dashboard'

export async function StaffDashboard() {
  let staffProfile
  let roleLevel

  try {
    staffProfile = await getStaffProfile()
    roleLevel = await getStaffRoleLevel()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log error for monitoring
    console.error('[StaffDashboard] Error loading profile:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    // Redirect to login if not authenticated
    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      redirect('/login?redirect=/staff')
    }

    // Show error state
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Dashboard"
          description="We couldn't load your staff profile. Please try refreshing the page."
          action={
            <Button asChild variant="outline">
              <Link href="/staff">Refresh</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  if (!staffProfile || !staffProfile.id) {
    return (
      <Section size="lg">
        <EmptyState
          icon={UserX}
          title="No Staff Profile Found"
          description="You don't have a staff profile. Please contact your administrator."
          action={
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  let todayAppointments
  let upcomingAppointments
  let metrics
  let commission

  try {
    // Fetch data based on role level
    ;[todayAppointments, upcomingAppointments, metrics, commission] = await Promise.all([
      getTodayAppointments(staffProfile.id),
      getUpcomingAppointments(staffProfile.id),
      getStaffMetrics(staffProfile.id),
      // Only fetch commission for regular and senior staff
      roleLevel !== 'junior' ? getStaffCommission(staffProfile.id) : Promise.resolve(null),
    ])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log error for monitoring
    console.error('[StaffDashboard] Error loading data:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    // Show error state
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Dashboard Data"
          description="We couldn't load your dashboard data. Please try refreshing the page."
          action={
            <Button asChild variant="outline">
              <Link href="/staff">Refresh</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  // Role-based badge
  const getRoleBadge = () => {
    if (roleLevel === 'senior') return <Badge variant="default">Senior Staff</Badge>
    if (roleLevel === 'regular') return <Badge variant="secondary">Staff</Badge>
    if (roleLevel === 'junior') return <Badge variant="outline">Junior Staff</Badge>
    return null
  }

  // For junior staff: Show simplified dashboard
  if (roleLevel === 'junior') {
    return (
      <Section size="lg">
        <Stack gap="xl">
          <Box className="flex items-center justify-between">
            <Box>
              <Group gap="sm" className="items-center">
                <H1>
                  {staffProfile.first_name || ''} {staffProfile.last_name || ''}
                </H1>
                {getRoleBadge()}
              </Group>
              <Lead>My Schedule</Lead>
            </Box>
            <Group gap="sm">
              <LastUpdated />
              <RefreshButton />
            </Group>
          </Box>

          <Stack gap="lg">
            <StaffMetrics metrics={metrics} />
            <Grid cols={{ base: 1, lg: 2 }} gap="lg">
              <TodaySchedule appointments={todayAppointments} />
              <UpcomingAppointments appointments={upcomingAppointments} />
            </Grid>
          </Stack>
        </Stack>
      </Section>
    )
  }

  // For regular and senior staff: Show full dashboard with commission
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box className="flex items-center justify-between">
          <Box>
            <Group gap="sm" className="items-center">
              <H1>
                {staffProfile.first_name || ''} {staffProfile.last_name || ''}
              </H1>
              {getRoleBadge()}
            </Group>
            <Lead>Staff Dashboard</Lead>
          </Box>
          <Group gap="sm">
            <LastUpdated />
            <RefreshButton />
          </Group>
        </Box>

        {/* Commission Summary Card - Only for regular and senior staff */}
        {commission && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Commission Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={{ base: 2, md: 4 }} gap="md">
                <Box>
                  <Muted className="text-xs">Today's Revenue</Muted>
                  <div className="text-2xl font-bold">${commission.todayRevenue.toFixed(2)}</div>
                </Box>
                <Box>
                  <Muted className="text-xs">Today's Commission</Muted>
                  <div className="text-2xl font-bold text-green-600">
                    ${commission.todayCommission.toFixed(2)}
                  </div>
                </Box>
                <Box>
                  <Muted className="text-xs">Month Revenue</Muted>
                  <div className="text-2xl font-bold">${commission.monthRevenue.toFixed(2)}</div>
                </Box>
                <Box>
                  <Muted className="text-xs">Month Commission</Muted>
                  <div className="text-2xl font-bold text-green-600">
                    ${commission.monthCommission.toFixed(2)}
                  </div>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3" aria-label="Staff dashboard sections">
            <TabsTrigger value="overview" aria-label="View dashboard overview">
              <Group gap="xs">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Overview
              </Group>
            </TabsTrigger>
            <TabsTrigger value="today" aria-label="View today's schedule">
              <Group gap="xs">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Today
              </Group>
            </TabsTrigger>
            <TabsTrigger value="upcoming" aria-label="View upcoming appointments">
              <Group gap="xs">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Upcoming
              </Group>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Stack gap="lg">
              <StaffMetrics metrics={metrics} />
              <Grid cols={{ base: 1, lg: 2 }} gap="lg">
                <TodaySchedule appointments={todayAppointments} />
                <UpcomingAppointments appointments={upcomingAppointments} />
              </Grid>
            </Stack>
          </TabsContent>

          <TabsContent value="today">
            <TodaySchedule appointments={todayAppointments} />
          </TabsContent>

          <TabsContent value="upcoming">
            <UpcomingAppointments appointments={upcomingAppointments} />
          </TabsContent>
        </Tabs>
      </Stack>
    </Section>
  )
}
