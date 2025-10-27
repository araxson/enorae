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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshButton, LastUpdated } from '@/features/shared/ui-components'
import { Separator } from '@/components/ui/separator'
import { VIPStatusCard } from './vip-status-card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemHeader,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item'

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
        <Empty>
          <EmptyMedia variant="icon">
            <AlertCircle className="h-6 w-6" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Error loading dashboard</EmptyTitle>
            <EmptyDescription>
              We couldn't load your dashboard data. Please try again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href="/customer">Refresh</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <ItemGroup className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Item variant="muted" size="sm" className="flex-1">
          {vipStatus?.isVIP ? (
            <>
              <ItemMedia variant="icon">
                <Crown className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>VIP member</ItemTitle>
                <ItemDescription>
                  Tier {vipStatus.loyaltyTier?.toUpperCase() ?? 'Standard'}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-none">
                <Badge variant="default">VIP</Badge>
              </ItemActions>
            </>
          ) : (
            <ItemContent>
              <ItemTitle>Welcome back</ItemTitle>
              <ItemDescription>Pick up where you left off.</ItemDescription>
            </ItemContent>
          )}
        </Item>
        <Item variant="muted" size="sm" className="flex-1">
          <ItemContent>
            <ItemTitle>Dashboard status</ItemTitle>
            <ItemDescription>
              <LastUpdated />
            </ItemDescription>
          </ItemContent>
          <ItemActions className="flex-none items-center gap-3 text-sm text-muted-foreground">
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <RefreshButton />
          </ItemActions>
        </Item>
      </ItemGroup>

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
          <Item variant="outline" className="flex flex-col gap-4 p-6">
            <ItemHeader className="flex-col items-start gap-1 p-0">
              <ItemTitle>Past appointments</ItemTitle>
              <ItemDescription>{pastAppointments?.length ?? 0} completed</ItemDescription>
            </ItemHeader>
            <ItemContent className="p-0">
              {!pastAppointments || pastAppointments.length === 0 ? (
                <Empty>
                  <EmptyMedia variant="icon">
                    <History className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No past appointments</EmptyTitle>
                    <EmptyDescription>
                      Your appointment history will appear here
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup className="gap-3">
                  {pastAppointments.map((appointment) => {
                    if (!appointment?.['id']) return null

                    const appointmentDate = appointment['start_time']
                      ? new Date(appointment['start_time']).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : null

                    const statusLabel = (appointment['status'] ?? 'pending')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())

                    return (
                      <Item key={appointment['id']} variant="outline" size="sm">
                        <ItemContent>
                          <ItemHeader>
                            <ItemTitle>{appointment['service_names'] || 'Service'}</ItemTitle>
                            <Badge variant="secondary">{statusLabel}</Badge>
                          </ItemHeader>
                          <ItemDescription>
                            {appointment['salon_name']
                              ? `at ${appointment['salon_name']}`
                              : 'Salon not specified'}
                          </ItemDescription>
                        </ItemContent>
                        <ItemFooter className="flex-none">
                          <ItemDescription>
                            {appointmentDate ? (
                              <time dateTime={appointment['start_time'] || undefined}>
                                {appointmentDate}
                              </time>
                            ) : (
                              'Date not available'
                            )}
                          </ItemDescription>
                        </ItemFooter>
                      </Item>
                    )
                  })}
                </ItemGroup>
              )}
            </ItemContent>
          </Item>
        </TabsContent>
      </Tabs>
    </div>
  )
}
