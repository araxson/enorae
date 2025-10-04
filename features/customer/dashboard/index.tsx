import {
  getUpcomingAppointments,
  getPastAppointments,
  getFavorites,
  getCustomerMetrics,
  getVIPStatus,
} from './api/queries'
import { CustomerMetrics } from './components/customer-metrics'
import { UpcomingBookings } from './components/upcoming-bookings'
import { FavoritesList } from './components/favorites-list'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Calendar, Heart, History, Crown, TrendingUp, AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Group } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Small, Muted } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RefreshButton, LastUpdated } from '@/components/dashboard'

export async function CustomerDashboard() {
  let upcomingAppointments
  let pastAppointments
  let favorites
  let metrics
  let vipStatus

  try {
    ;[upcomingAppointments, pastAppointments, favorites, metrics, vipStatus] = await Promise.all([
      getUpcomingAppointments(),
      getPastAppointments(),
      getFavorites(),
      getCustomerMetrics(),
      getVIPStatus(),
    ])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log error for monitoring
    console.error('[CustomerDashboard] Error loading data:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    // Redirect to login if not authenticated
    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      redirect('/login?redirect=/customer')
    }

    // Show error state
    return (
      <Section size="lg">
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Dashboard"
          description="We couldn't load your dashboard data. Please try refreshing the page."
          action={
            <Button asChild variant="outline">
              <Link href="/customer">Refresh</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box className="flex items-center justify-between">
          <Box>
            <Group gap="sm" className="items-center">
              <H1>Welcome Back!</H1>
              {vipStatus?.isVIP && (
                <Badge variant="default" className="gap-1">
                  <Crown className="h-3 w-3" />
                  VIP {vipStatus.loyaltyTier?.toUpperCase()}
                </Badge>
              )}
            </Group>
            <Lead>Manage your appointments and discover new services</Lead>
          </Box>
          <Group gap="sm">
            <LastUpdated />
            <RefreshButton />
          </Group>
        </Box>

        {vipStatus?.isVIP && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                VIP Status
              </CardTitle>
              <CardDescription>Exclusive benefits and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Group gap="lg">
                <Box>
                  <Small className="text-muted-foreground">Loyalty Points</Small>
                  <div className="text-2xl font-bold">{vipStatus.loyaltyPoints?.toLocaleString() ?? 0}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Tier</Small>
                  <div className="text-2xl font-bold capitalize">{vipStatus.loyaltyTier ?? 'Standard'}</div>
                </Box>
                <Box>
                  <Small className="text-muted-foreground">Lifetime Spend</Small>
                  <div className="text-2xl font-bold">${vipStatus.lifetimeSpend?.toLocaleString() ?? 0}</div>
                </Box>
                {vipStatus.monthlySpend !== undefined && (
                  <Box>
                    <Small className="text-muted-foreground">This Month</Small>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      ${vipStatus.monthlySpend.toLocaleString()}
                    </div>
                  </Box>
                )}
              </Group>
            </CardContent>
          </Card>
        )}

        <CustomerMetrics metrics={metrics} />

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3" aria-label="Appointment sections">
            <TabsTrigger value="upcoming" aria-label="View upcoming appointments">
              <Group gap="xs">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Upcoming
              </Group>
            </TabsTrigger>
            <TabsTrigger value="favorites" aria-label="View favorite salons">
              <Group gap="xs">
                <Heart className="h-4 w-4" aria-hidden="true" />
                Favorites
              </Group>
            </TabsTrigger>
            <TabsTrigger value="history" aria-label="View appointment history">
              <Group gap="xs">
                <History className="h-4 w-4" aria-hidden="true" />
                History
              </Group>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <UpcomingBookings appointments={upcomingAppointments} />
          </TabsContent>

          <TabsContent value="favorites">
            <FavoritesList favorites={favorites} />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
                <Small>{pastAppointments?.length ?? 0} completed</Small>
              </CardHeader>
              <CardContent>
                {!pastAppointments || pastAppointments.length === 0 ? (
                  <EmptyState
                    icon={History}
                    title="No Past Appointments"
                    description="Your appointment history will appear here"
                  />
                ) : (
                  <Stack gap="sm">
                    {pastAppointments.map((appointment) => {
                      if (!appointment?.id) return null

                      const appointmentDate = appointment.start_time
                        ? new Date(appointment.start_time).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Date not available'

                      const status = appointment.status ?? 'completed'
                      const statusVariant = status === 'completed' ? 'default' :
                                          status === 'cancelled' ? 'destructive' :
                                          status === 'no_show' ? 'outline' : 'secondary'

                      return (
                        <Box
                          key={appointment.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <Stack gap="xs">
                            <Small className="font-medium">{appointmentDate}</Small>
                            <Muted className="text-xs">
                              {appointment.salon_name ?? 'Salon Unknown'}
                            </Muted>
                          </Stack>
                          <Badge variant={statusVariant} className="capitalize">
                            {status.replace('_', ' ')}
                          </Badge>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Stack>
    </Section>
  )
}
