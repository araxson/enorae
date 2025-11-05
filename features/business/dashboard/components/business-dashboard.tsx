import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldAlert, Store } from 'lucide-react'
import { getUserRole } from '@/lib/auth'
import { getDashboardMetrics, getRecentAppointments, getUserSalon, getMultiLocationMetrics } from '../api'
import { getReviewStats } from '@/features/business/reviews/api'
import type { AppointmentWithDetails, BusinessDashboardMetrics, BusinessMultiLocationMetrics, BusinessReviewStats } from '../api/types'
import { createOperationLogger } from '@/lib/observability'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AnalyticsTab } from './analytics-tab'
import { DashboardAnalyticsSkeleton } from './skeletons/dashboard-analytics-skeleton'
import { DashboardView } from './dashboard-view'

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
              <ShieldAlert className="size-6" aria-hidden="true" />
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
            <Store className="size-6" aria-hidden="true" />
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
        <Suspense fallback={<DashboardAnalyticsSkeleton />}>
          <AnalyticsTab salonId={salon.id} />
        </Suspense>
      }
    />
  )
}

async function getMetricsSafe(salonId: string): Promise<BusinessDashboardMetrics> {
  const logger = createOperationLogger('getMetricsSafe', {})
  logger.start()

  try {
    return await getDashboardMetrics(salonId)
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return EMPTY_METRICS
  }
}

async function getReviewStatsSafe(salonId: string): Promise<BusinessReviewStats> {
  const logger = createOperationLogger('getReviewStatsSafe', {})
  logger.start()

  try {
    return await getReviewStats(salonId)
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return EMPTY_REVIEWS
  }
}

async function getRecentAppointmentsSafe(salonId: string): Promise<AppointmentWithDetails[]> {
  const logger = createOperationLogger('getRecentAppointmentsSafe', {})
  logger.start()

  try {
    return await getRecentAppointments(salonId)
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return []
  }
}

async function getMultiLocationMetricsSafe(): Promise<BusinessMultiLocationMetrics | null> {
  const logger = createOperationLogger('getMultiLocationMetricsSafe', {})
  logger.start()

  try {
    return await getMultiLocationMetrics()
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return null
  }
}
