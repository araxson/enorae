import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldAlert, Store } from 'lucide-react'
import { getUserRole } from '@/lib/auth'
import { getDashboardMetrics, getRecentAppointments, getUserSalon, getMultiLocationMetrics } from './api/queries'
import { getReviewStats } from '@/features/business/reviews/api/queries'
import type { AppointmentWithDetails } from './api/queries'
import type { BusinessDashboardMetrics, BusinessMultiLocationMetrics, BusinessReviewStats } from './types'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { AnalyticsTab } from './components/analytics-tab'
import { DashboardView } from './components/dashboard-view'

const EMPTY_METRICS: BusinessDashboardMetrics = {
  totalAppointments: 0,
  confirmedAppointments: 0,
  pendingAppointments: 0,
  totalStaff: 0,
  totalServices: 0,
  totalRevenue: 0,
  last30DaysRevenue: 0,
}

const EMPTY_REVIEWS: BusinessReviewStats = {
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: [],
  pendingResponses: 0,
  flaggedCount: 0,
}

export async function BusinessDashboardPage() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('Authentication required')) {
      redirect('/login?redirect=/business/dashboard')
    }
    if (message.includes('role required')) {
      return (
        <section className="py-10 w-full px-6">
          <Empty>
            <EmptyMedia variant="icon">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Access denied</EmptyTitle>
              <EmptyDescription>
                You don't have permission to access the business dashboard. Please contact your administrator.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/">Go home</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </section>
      )
    }
    throw error
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-10 w-full px-6">
        <Empty>
          <EmptyMedia variant="icon">
            <Store className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No salon found</EmptyTitle>
            <EmptyDescription>
              You need to create or be assigned to a salon to access the dashboard.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/business/settings/salon">Create Salon</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </section>
    )
  }

  const userRole = await getUserRole()
  const isTenantOwner = userRole === 'tenant_owner'

  const [metrics, reviewStats, recentAppointments, multiLocationMetrics] = await Promise.all([
    getMetricsSafe(salon.id),
    getReviewStatsSafe(salon.id),
    getRecentAppointmentsSafe(salon.id),
    isTenantOwner ? getMultiLocationMetricsSafe() : Promise.resolve<BusinessMultiLocationMetrics | null>(null),
  ])

  return (
    <DashboardView
      salon={salon}
      metrics={metrics}
      reviewStats={reviewStats}
      recentAppointments={recentAppointments}
      multiLocationMetrics={multiLocationMetrics}
      isTenantOwner={isTenantOwner}
      analyticsPanel={
        <Suspense
          fallback={
            <div className="flex flex-col gap-6 items-center justify-center py-12">
              <Spinner className="size-8" />
            </div>
          }
        >
          <AnalyticsTab salonId={salon.id} />
        </Suspense>
      }
    />
  )
}

async function getMetricsSafe(salonId: string): Promise<BusinessDashboardMetrics> {
  try {
    return await getDashboardMetrics(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading metrics:', error)
    return EMPTY_METRICS
  }
}

async function getReviewStatsSafe(salonId: string): Promise<BusinessReviewStats> {
  try {
    return await getReviewStats(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading review stats:', error)
    return EMPTY_REVIEWS
  }
}

async function getRecentAppointmentsSafe(salonId: string): Promise<AppointmentWithDetails[]> {
  try {
    return await getRecentAppointments(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading appointments:', error)
    return []
  }
}

async function getMultiLocationMetricsSafe(): Promise<BusinessMultiLocationMetrics | null> {
  try {
    return await getMultiLocationMetrics()
  } catch (error) {
    console.error('[BusinessDashboard] Error loading multi-location metrics:', error)
    return null
  }
}
