import Link from 'next/link'
import { redirect } from 'next/navigation'
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
import {
  Calendar,
  Heart,
  History,
  Crown,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState, RefreshButton, LastUpdated } from '@/components/shared'

export async function CustomerDashboardPage() {
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

    console.error('[CustomerDashboard] Error loading data:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      redirect('/login?redirect=/customer')
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={AlertCircle}
          title="Error loading dashboard"
          description="We couldn't load your dashboard data. Please try again."
          action={
            <Button asChild variant="outline">
              <Link href="/customer">Refresh</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {vipStatus?.isVIP ? (
          <Badge variant="default" className="flex items-center gap-1">
            <Crown className="h-3.5 w-3.5" />
            VIP {vipStatus.loyaltyTier?.toUpperCase()}
          </Badge>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            Welcome back
          </span>
        )}

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LastUpdated />
          <div className="hidden h-4 w-px bg-border sm:block" />
          <RefreshButton />
        </div>
      </div>

      {vipStatus?.isVIP && (
        <div className="rounded-xl border border-primary/10">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Crown className="h-5 w-5" />
                <CardTitle>VIP status</CardTitle>
              </div>
              <CardDescription>Exclusive benefits and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-4">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Loyalty points</small>
                  <p className="text-2xl font-bold">
                    {vipStatus.loyaltyPoints?.toLocaleString() ?? 0}
                  </p>
                </div>
                <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-4">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Tier</small>
                  <p className="text-2xl font-bold capitalize">
                    {vipStatus.loyaltyTier ?? 'Standard'}
                  </p>
                </div>
                <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-4">
                  <small className="text-sm font-medium leading-none text-muted-foreground">Lifetime spend</small>
                  <p className="text-2xl font-bold">
                    ${vipStatus.lifetimeSpend?.toLocaleString() ?? 0}
                  </p>
                </div>
                {vipStatus.monthlySpend !== undefined && (
                  <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-4">
                    <small className="text-sm font-medium leading-none text-muted-foreground">This month</small>
                    <p className="flex items-center gap-1 text-2xl font-bold">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      ${vipStatus.monthlySpend.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <CustomerMetrics metrics={metrics} />

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" aria-hidden="true" />
            <span>History</span>
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
              <CardTitle>Past appointments</CardTitle>
              <small className="text-sm font-medium leading-none">{pastAppointments?.length ?? 0} completed</small>
            </CardHeader>
            <CardContent>
              {!pastAppointments || pastAppointments.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No past appointments"
                  description="Your appointment history will appear here"
                />
              ) : (
                <div className="space-y-3">
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

                    return (
                      <div
                        key={appointment.id}
                        className="rounded-lg border border-border/60 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{appointment.service_names?.[0] ?? 'Service'}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.salon_name ? `at ${appointment.salon_name}` : 'Salon not specified'}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointmentDate}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
