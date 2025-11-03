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
import { VIPStatusCard } from './vip-status-card'
import { DashboardHeader } from './dashboard-header'
import { HistoryTab } from './history-tab'
import { DashboardErrorState } from './error-state'
import { Calendar, Heart, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { logError } from '@/lib/observability'

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

    logError('Error loading customer dashboard data', { error: error instanceof Error ? error : new Error(errorMessage), operationName: 'CustomerDashboardPage' })

    if (errorMessage.includes('Authentication required') || errorMessage.includes('Unauthorized')) {
      redirect('/login?redirect=/customer')
    }

    return <DashboardErrorState />
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <DashboardHeader isVIP={vipStatus?.isVIP ?? false} loyaltyTier={vipStatus?.loyaltyTier} />

      {vipStatus && vipStatus.isVIP ? <VIPStatusCard vipStatus={vipStatus} /> : null}

      <CustomerMetrics metrics={metrics} />

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="size-4" aria-hidden="true" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="size-4" aria-hidden="true" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="size-4" aria-hidden="true" />
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
          <HistoryTab pastAppointments={pastAppointments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
