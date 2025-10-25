import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  getUpcomingAppointments,
  getPastAppointments,
  getFavorites,
  getCustomerMetrics,
  getVIPStatus,
} from '@/features/customer/dashboard/api/queries'
import { CustomerMetrics } from './customer-metrics'
import { UpcomingBookings } from './upcoming-bookings'
import { FavoritesList } from './favorites-list'
import {
  Calendar,
  Heart,
  History,
  Crown,
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
import { EmptyState, RefreshButton, LastUpdated } from '@/features/shared/ui-components'
import { Separator } from '@/components/ui/separator'
import { VIPStatusCard } from './vip-status-card'

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
          <div className="flex items-center gap-2">
            <Crown className="h-3.5 w-3.5" />
            <Badge variant="default">VIP {vipStatus.loyaltyTier?.toUpperCase()}</Badge>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            Welcome back
          </span>
        )}

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LastUpdated />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <RefreshButton />
        </div>
      </div>

      {vipStatus && vipStatus.isVIP ? <VIPStatusCard vipStatus={vipStatus} /> : null}

      <CustomerMetrics metrics={metrics} />

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" aria-hidden="true" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" aria-hidden="true" />
            History
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
              <CardDescription>{pastAppointments?.length ?? 0} completed</CardDescription>
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
                    if (!appointment?.['id']) return null

                    const appointmentDate = appointment['start_time']
                      ? new Date(appointment['start_time']).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Date not available'

                    return (
                      <Card key={appointment['id']}>
                        <CardHeader>
                          <CardTitle>{appointment['service_names'] || 'Service'}</CardTitle>
                          <CardDescription>
                            {appointment['salon_name']
                              ? `at ${appointment['salon_name']}`
                              : 'Salon not specified'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-muted-foreground">{appointmentDate}</span>
                            <span className="text-sm text-muted-foreground capitalize">
                              {appointment['status'] ?? 'pending'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
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
