import { BarChart3, TrendingUp, Users, Building2 } from 'lucide-react'
import { Section, Stack } from '@/components/layout'
import { H1, Lead, P, Muted } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getPlatformSummary, getPlatformAnalytics } from './api/queries'

export async function AdminAnalytics() {
  let summary, analytics

  try {
    ;[summary, analytics] = await Promise.all([
      getPlatformSummary(),
      getPlatformAnalytics(30),
    ])
  } catch (error) {
    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load analytics'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  const latestMetrics = analytics[0]

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Platform Analytics</H1>
          <Lead>Real-time metrics and insights across all salons</Lead>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.users.toLocaleString()}</div>
              <Muted className="text-xs">All registered users</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Salons</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.salons.toLocaleString()}</div>
              <Muted className="text-xs">Active businesses</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.appointments.toLocaleString()}</div>
              <Muted className="text-xs">All-time bookings</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totals.reviews.toLocaleString()}</div>
              <Muted className="text-xs">Customer feedback</Muted>
            </CardContent>
          </Card>
        </div>

        {/* Latest Daily Metrics */}
        {latestMetrics && (
          <Card>
            <CardHeader>
              <CardTitle>Latest Daily Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <P className="text-sm font-medium">Active Salons</P>
                    <P className="text-2xl font-bold">{latestMetrics.active_salons || 0}</P>
                  </div>
                  <div>
                    <P className="text-sm font-medium">Platform Revenue</P>
                    <P className="text-2xl font-bold">${(latestMetrics.platform_revenue || 0).toFixed(2)}</P>
                  </div>
                  <div>
                    <P className="text-sm font-medium">Appointments</P>
                    <P className="text-2xl font-bold">{latestMetrics.platform_appointments || 0}</P>
                  </div>
                  <div>
                    <P className="text-sm font-medium">Utilization Rate</P>
                    <P className="text-2xl font-bold">
                      {latestMetrics.avg_utilization_rate
                        ? `${(latestMetrics.avg_utilization_rate * 100).toFixed(1)}%`
                        : 'N/A'}
                    </P>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Muted className="text-sm">Completed</Muted>
                      <P className="font-semibold">{latestMetrics.platform_completed_appointments || 0}</P>
                    </div>
                    <div>
                      <Muted className="text-sm">Cancelled</Muted>
                      <P className="font-semibold">{latestMetrics.platform_cancelled_appointments || 0}</P>
                    </div>
                    <div>
                      <Muted className="text-sm">No-shows</Muted>
                      <P className="font-semibold">{latestMetrics.platform_no_shows || 0}</P>
                    </div>
                    <div>
                      <Muted className="text-sm">New Customers</Muted>
                      <P className="font-semibold">{latestMetrics.platform_new_customers || 0}</P>
                    </div>
                    <div>
                      <Muted className="text-sm">Returning</Muted>
                      <P className="font-semibold">{latestMetrics.platform_returning_customers || 0}</P>
                    </div>
                    <div>
                      <Muted className="text-sm">Active Staff</Muted>
                      <P className="font-semibold">{latestMetrics.platform_active_staff || 0}</P>
                    </div>
                  </div>
                </div>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-base">View All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </P>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-base">View All Salons</CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Monitor salon performance and status
              </P>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-base">View Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Track platform-wide revenue metrics
              </P>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </Section>
  )
}
